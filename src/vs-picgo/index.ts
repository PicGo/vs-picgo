import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as vscode from 'vscode';

import PicGo from 'picgo/dist/src/core/PicGo';
import { IImgInfo, IPlugin, IConfig as IPicGoConfig } from 'picgo/dist/src/utils/interfaces';

import { promisify } from 'util';

import { formatParam, formatString, showInfo, showError, getUploadedName } from '../utils';

const _ = require('lodash');
const _db = require('lodash-id');
import nls = require('../../package.nls.json');
_.mixin(_db);

const writeFileP = promisify(fs.writeFile);
const readFileP = promisify(fs.readFile);

export interface INotice {
  body: string;
  text: string;
  title: string;
}

export interface IUploadName {
  date: string;
  dateTime: string;
  fileName: string;
  extName: string;
  mdFileName: string;
  [key: string]: string;
}

export interface IOutputUrl {
  uploadedName: string;
  url: string;
  [key: string]: string;
}

export enum EVSPicgoHooks {
  updated = 'updated',
}

export default class VSPicgo extends EventEmitter {
  private static picgo: PicGo = new PicGo();

  constructor() {
    super();
    this.configPicgo();
    // Before upload, we change names of the images.
    this.registerRenamePlugin();
    // After upload, we use the custom output format.
    this.addGenerateOutputListener();
  }

  configPicgo() {
    const picgoConfigPath = vscode.workspace.getConfiguration('picgo').get<string>('configPath');
    let config: Partial<IPicGoConfig>;
    if (picgoConfigPath) {
      config = JSON.parse(
        fs.readFileSync(picgoConfigPath, {
          encoding: 'utf-8',
        }),
      );
    } else {
      const picBed = (vscode.workspace.getConfiguration('picgo.picBed') as any) as IPicGoConfig['picBed'];
      config = { picBed };
    }

    // `PICGO_ENV` is used only by Electron version, should be disabled here,
    // see https://github.com/PicGo/vs-picgo/issues/75 for more detail
    (config as any)['PICGO_ENV'] = 'CLI';
    VSPicgo.picgo.setConfig(config);
  }

  addGenerateOutputListener() {
    VSPicgo.picgo.on('finished', async (ctx: PicGo) => {
      let urlText = '';
      const outputFormatTemplate =
        vscode.workspace.getConfiguration('picgo').get<string>('customOutputFormat') || '![${uploadedName}](${url})';
      try {
        urlText = ctx.output.reduce((acc: string, imgInfo: IImgInfo): string => {
          return `${acc}${formatString(outputFormatTemplate, {
            uploadedName: getUploadedName(imgInfo),
            url: imgInfo.imgUrl,
          })}\n`;
        }, '');
        urlText = urlText.trim();
        await this.updateData(ctx.output);
      } catch (err) {
        if (err instanceof SyntaxError) {
          showError(
            `the data file ${this.dataPath} has syntax error, ` +
              `please fix the error by yourself or delete the data file and vs-picgo will recreate for you.`,
          );
        } else {
          showError(`failed to read from data file ${this.dataPath}: ${err || ''}`);
        }
        return;
      }
      this.editor.edit(textEditor => {
        textEditor.replace(this.editor.selection, urlText);
        showInfo(`image uploaded successfully.`);
        this.emit(EVSPicgoHooks.updated, urlText);
      });
    });
  }

  registerRenamePlugin() {
    let beforeUploadPlugin: IPlugin = {
      handle: (ctx: PicGo) => {
        const uploadNameTemplate =
          vscode.workspace.getConfiguration('picgo').get<string>('customUploadName') || '${fileName}';
        if (ctx.output.length === 1) {
          ctx.output[0].fileName = this.changeFilename(ctx.output[0].fileName || '', uploadNameTemplate, undefined);
        } else {
          ctx.output.forEach((imgInfo: IImgInfo, index: number) => {
            imgInfo.fileName = this.changeFilename(imgInfo.fileName || '', uploadNameTemplate, index);
          });
        }
      },
    };
    VSPicgo.picgo.helper.beforeUploadPlugins.register('vsPicgoRenamePlugin', beforeUploadPlugin);
  }

  /**
   * Returns the modified file name as per `customUploadName` setting
   * @param original The filename of the original image file.
   * @param template The template string.
   */
  changeFilename(original: string, template: string, index: number | undefined) {
    if (this.userDefineName) {
      original = this.userDefineName + (index || '') + path.extname(original);
    }
    const mdFilePath = this.editor.document.fileName;
    const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath));
    let uploadNameData = formatParam(original, mdFileName);
    return formatString(template, uploadNameData);
  }

  get editor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      showError('no active markdown editor!');
    }
    return editor as vscode.TextEditor;
  }
  get dataPath(): string {
    const picgoConfig = vscode.workspace.getConfiguration('picgo');
    return picgoConfig.dataPath || path.resolve(os.homedir(), 'vs-picgo-data.json');
  }
  get userDefineName(): string {
    let selectedString = this.editor.document.getText(this.editor.selection);
    const nameReg = /[:\/\?\$]+/g; // limitations of name
    selectedString = selectedString.replace(nameReg, () => '');
    return selectedString;
  }

  async initDataFile(dataPath: string) {
    if (!fs.existsSync(dataPath)) {
      await writeFileP(dataPath, JSON.stringify({ uploaded: [] }, null, 2), 'utf8');
    }
  }

  async upload(input?: string[]) {
    // This is necessary, because user may have changed settings
    this.configPicgo();

    // uploading progress
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `${nls['ext.displayName']}: image uploading...`,
        cancellable: false,
      },
      progress => {
        return new Promise<void>((resolve, reject) => {
          VSPicgo.picgo.on('uploadProgress', (p: number) => {
            progress.report({ increment: p });
            if (p === 100) {
              resolve();
            }
          });
          VSPicgo.picgo.on('failed', (error: Error) => {
            showError(error.message || 'Unknown error');
            reject();
          });
          VSPicgo.picgo.on('notification', (notice: INotice) => {
            showError(`${notice.title}! ${notice.body || ''}${notice.text || ''}`);
            reject();
          });
        });
      },
    );

    // Error has been handled in on 'failed'
    return VSPicgo.picgo.upload(input).catch(() => {});
  }

  async updateData(picInfos: Array<IImgInfo>) {
    const dataPath = this.dataPath;
    if (!fs.existsSync(dataPath)) {
      await this.initDataFile(dataPath);
      showInfo('data file created at ${dataPath}.');
    }
    const dataRaw = await readFileP(dataPath, 'utf8');
    const data = JSON.parse(dataRaw);
    if (!data.uploaded) {
      data.uploaded = [];
    }
    picInfos.forEach(picInfo => {
      _.insert(data['uploaded'], picInfo);
    });
    await writeFileP(dataPath, JSON.stringify(data, null, 2), 'utf8');
  }
}
