import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as vscode from 'vscode';

import PicGo from 'picgo/dist/core/PicGo';
import { ImgInfo, Plugin } from 'picgo/dist/utils/interfaces';

import { promisify } from 'util';

import { formatParam, formatString } from '../utils';

const _ = require('lodash');
const _db = require('lodash-id');
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

export default class VSPicgo {
  private dataPath: string;
  private editor: vscode.TextEditor;
  private picgo: PicGo;

  constructor(editor: vscode.TextEditor) {
    const picgoConfigPath = vscode.workspace.getConfiguration('picgo').get<string>('configPath');
    if (picgoConfigPath) {
      this.picgo = new PicGo(picgoConfigPath);
    } else {
      this.picgo = new PicGo();
      const picBed = vscode.workspace.getConfiguration('picgo.picBed');
      this.picgo.setConfig({ picBed });
    }
    this.editor = editor;
    this.dataPath = this.getDataPath();
    // Before upload, we change names of the images.
    this.registerRenamePlugin();
    // After upload, we use the custom output format.
    this.addGenerateOutputListener();
  }

  addGenerateOutputListener() {
    this.picgo.on('finished', async (ctx: PicGo) => {
      let urlText = '';
      const outputFormatTemplate =
        vscode.workspace.getConfiguration('picgo').get<string>('customOutputFormat') || '![${uploadedName}](${url})';
      try {
        urlText = ctx.output.reduce((acc: string, cur: ImgInfo): string => {
          return `${acc}${formatString(outputFormatTemplate, {
            uploadedName: cur.fileName || '',
            url: cur.imgUrl,
          })}\n`;
        }, '');
        urlText = urlText.trim();
        await this.updateLog(ctx.output);
      } catch (err) {
        if (err instanceof SyntaxError) {
          vscode.window.showErrorMessage(
            `The data file ${this.dataPath} has syntax error, ` +
              `please fix the error by yourself or delete the data file and vs-picgo will recreate for you.`,
          );
        } else {
          vscode.window.showErrorMessage(`Failed to read from data file ${this.dataPath}: ${err || ''}`);
        }
        return;
      }
      this.editor.edit(textEditor => {
        textEditor.replace(this.editor.selection, urlText);
        vscode.window.showInformationMessage('Upload successfully');
      });
    });
  }

  registerRenamePlugin() {
    let beforeUploadPlugin: Plugin = {
      handle: (ctx: PicGo) => {
        const userDefineName = this.getImageName();
        const uploadNameTemplate =
          vscode.workspace.getConfiguration('picgo').get<string>('customUploadName') || '${fileName}';
        if (ctx.output.length === 1) {
          ctx.output[0].fileName = this.changeFilename(
            userDefineName || ctx.output[0].fileName || '',
            uploadNameTemplate,
          );
        } else {
          ctx.output.forEach((imgInfo: ImgInfo, index: number) => {
            imgInfo.fileName = this.changeFilename(
              userDefineName ? `${userDefineName}${index}` : imgInfo.fileName || '',
              uploadNameTemplate,
            );
          });
        }
      },
    };
    this.picgo.helper.beforeUploadPlugins.register('vsPicgoRenamePlugin', beforeUploadPlugin);
  }

  /**
   * Returns the modified file name as per `customUploadName` setting
   * @param original The filename of the original image file.
   * @param template The template string.
   */
  changeFilename(original: string, template: string) {
    const mdFilePath = this.editor.document.fileName;
    const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath));
    let uploadNameData = formatParam(original, mdFileName);
    return formatString(template, uploadNameData);
  }

  getDataPath() {
    const picgoConfig = vscode.workspace.getConfiguration('picgo');
    return picgoConfig.dataPath || path.resolve(os.homedir(), 'vs-picgo-data.json');
  }
  getImageName() {
    let selectedString = this.editor.document.getText(this.editor.selection);
    const nameReg = /[:\/\?\$]+/g; // limitations of name
    selectedString = selectedString.replace(nameReg, () => '');
    return selectedString;
  }

  async initLogFile(dataPath: string) {
    if (!fs.existsSync(dataPath)) {
      await writeFileP(dataPath, JSON.stringify({ uploaded: [] }, null, 2), 'utf8');
    }
  }

  upload(input?: string[]) {
    this.picgo.upload(input);
    // uploading progress
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Image Uploading...',
        cancellable: false,
      },
      progress => {
        return new Promise((resolve, reject) => {
          this.picgo.on('uploadProgress', (p: number) => {
            progress.report({ increment: p });
            if (p === 100) {
              resolve();
            }
          });
          this.picgo.on('notification', (notice: INotice) => {
            vscode.window.showErrorMessage(
              `${notice.title}! ${notice.body || ''}${notice.text ? `, ${notice.text}.` : '.'}`,
            );
            reject();
          });
          this.picgo.on('failed', error => {
            vscode.window.showErrorMessage(error.message);
            reject();
          });
        });
      },
    );
  }

  async updateLog(picInfos: Array<ImgInfo>) {
    if (!fs.existsSync(this.dataPath)) {
      await this.initLogFile(this.dataPath);
      vscode.window.showInformationMessage(`Data file created at ${this.dataPath}.`);
    }
    const data = await readFileP(this.dataPath, 'utf8');
    const log = JSON.parse(data);
    if (!log.uploaded) {
      log.uploaded = [];
    }
    picInfos.forEach(picInfo => {
      _.insert(log['uploaded'], picInfo);
    });
    await writeFileP(this.dataPath, JSON.stringify(log, null, 2), 'utf8');
  }
}
