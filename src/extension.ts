'use strict';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import PicGo from 'picgo/dist/core/PicGo';
import { ImgInfo } from 'picgo/dist/utils/interfaces';
import { promisify } from 'util';
import * as vscode from 'vscode';

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

function uploadImageFromClipboard(): void {
  const editor = getActiveMarkDownEditor();
  return editor ? upload(editor) : (() => {})();
}

async function uploadImageFromExplorer(): Promise<any> {
  const editor = getActiveMarkDownEditor();
  if (!editor) {
    return Promise.resolve();
  }
  const result = await vscode.window.showOpenDialog({
    filters: {
      Images: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico']
    },
    canSelectMany: true
  });

  if (result) {
    const input = result.map(item => item.fsPath);
    return upload(editor, input);
  }
}

async function uploadImageFromInputBox(): Promise<any> {
  const editor = getActiveMarkDownEditor();
  if (!editor) {
    return Promise.resolve();
  }

  let result = await vscode.window.showInputBox({
    placeHolder: 'Please input an image location path'
  });
  // check if `result` is a path of image file
  const imageReg = /\.(png|jpg|jpeg|webp|gif|bmp|tiff|ico)$/;
  if (result && imageReg.test(result)) {
    result = path.isAbsolute(result)
      ? result
      : path.join(editor.document.uri.fsPath, '../', result);
    if (fs.existsSync(result)) {
      return upload(editor, [result]);
    } else {
      vscode.window.showErrorMessage('No such image.');
    }
  } else {
    vscode.window.showErrorMessage('No such image.');
  }
}

function getImageName(editor: vscode.TextEditor): string {
  let selectedString = editor.document.getText(editor.selection);
  const nameReg = /[:\/\?\$]+/g; // limitations of name
  selectedString = selectedString.replace(nameReg, () => '');
  return selectedString;
}

/*
 *  get active markdown editor
 */
function getActiveMarkDownEditor(): vscode.TextEditor | undefined {
  const editor = vscode.window.activeTextEditor;
  const hasActiveMDEditor = editor && editor.document.languageId === 'markdown';
  if (!hasActiveMDEditor) {
    vscode.window.showErrorMessage('No active markdown editor!');
    return;
  }
  return hasActiveMDEditor ? editor : undefined;
}

function formatParam(file: string, mdFileName: string): IUploadName {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  const h = dt.getHours();
  const mm = dt.getMinutes();
  const s = dt.getSeconds();

  const date = `${y}-${m}-${d}`;
  var extName = path.extname(file);

  return {
    date,
    dateTime: `${date}-${h}-${mm}-${s}`,
    fileName: path.basename(file, extName),
    extName,
    mdFileName
  };
}

function formatString(tplString: string, data: IUploadName | IOutputUrl) {
  const keys = Object.keys(data);
  const values = keys.map(k => data[k]);
  return new Function(keys.join(','), 'return `' + tplString + '`').apply(
    null,
    values
  );
}

/**
 * Returns the modified file name as per `customUploadName` setting
 * @param original The filename of the original image file.
 * @param template The template string.
 */
function changeFilename(
  original: string,
  template: string,
  editor: vscode.TextEditor
): string {
  const mdFilePath = editor.document.fileName;
  const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath));
  let uploadNameData = formatParam(original, mdFileName);
  return formatString(template, uploadNameData);
}

function addRenameListener(picgo: PicGo, editor: vscode.TextEditor) {
  picgo.on('beforeUpload', (ctx: PicGo) => {
    const userDefineName = getImageName(editor);
    const uploadNameTemplate =
      vscode.workspace
        .getConfiguration('picgo')
        .get<string>('customUploadName') || '${fileName}';
    if (ctx.output.length === 1) {
      ctx.output[0].fileName = changeFilename(
        userDefineName || ctx.output[0].fileName || '',
        uploadNameTemplate,
        editor
      );
    } else {
      ctx.output.forEach((imgInfo: ImgInfo, index: number) => {
        imgInfo.fileName = changeFilename(
          userDefineName ? `${userDefineName}${index}` : imgInfo.fileName || '',
          uploadNameTemplate,
          editor
        );
      });
    }
  });
}

function addGenerateOutputListener(picgo: PicGo, editor: vscode.TextEditor) {
  picgo.on('finished', async (ctx: PicGo) => {
    let urlText = '';
    const dataPath = getdataPath();
    const outputFormatTemplate =
      vscode.workspace
        .getConfiguration('picgo')
        .get<string>('customOutputFormat') || '![${uploadedName}](${url})';
    try {
      urlText = ctx.output.reduce((acc: string, cur: ImgInfo): string => {
        // return `${acc}![${cur.fileName}](${cur.imgUrl})\n`;
        return `${acc}${formatString(outputFormatTemplate, {
          uploadedName: cur.fileName || '',
          url: cur.imgUrl
        })}\n`;
      }, '');
      urlText = urlText.trim();
      await updateLog(ctx.output, dataPath);
    } catch (err) {
      if (err instanceof SyntaxError) {
        vscode.window.showErrorMessage(
          `The log file ${dataPath} has syntax error, ` +
            `please fix the error by yourself or delete the log file and vs-picgo will recreate for you.`
        );
      } else {
        vscode.window.showErrorMessage(
          `Failed to read from log file ${dataPath}: ${err || ''}`
        );
      }
      return;
    }
    editor.edit(textEditor => {
      textEditor.replace(editor.selection, urlText);
      vscode.window.showInformationMessage('Upload successfully');
    });
  });
}

function getPicgo(editor: vscode.TextEditor): PicGo {
  const picgoConfigPath = vscode.workspace
    .getConfiguration('picgo')
    .get<string>('configPath');
  let picgo: PicGo;
  if (picgoConfigPath) {
    picgo = new PicGo(picgoConfigPath);
  } else {
    picgo = new PicGo();
    const picBed = vscode.workspace.getConfiguration('picgo.picBed');
    picgo.setConfig({ picBed });
  }
  // Before upload, we change names of the images.
  addRenameListener(picgo, editor);
  // After upload, we use the custom output format.
  addGenerateOutputListener(picgo, editor);
  return picgo;
}

function upload(editor: vscode.TextEditor, input?: any[]): void {
  const picgo = getPicgo(editor);
  picgo.upload(input); // Since picgo-core v1.1.5 will upload image from clipboard without input.
  // uploading progress
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Image Uploading...',
      cancellable: false
    },
    progress => {
      return new Promise((resolve, reject) => {
        picgo.on('uploadProgress', (p: number) => {
          progress.report({ increment: p });
          if (p === 100) {
            resolve();
          }
        });
        picgo.on('notification', (notice: INotice) => {
          vscode.window.showErrorMessage(
            `${notice.title}! ${notice.body || ''}${
              notice.text ? `, ${notice.text}` : '.'
            }`
          );
          reject();
        });
        picgo.on('failed', error => {
          vscode.window.showErrorMessage(error.message);
          reject();
        });
      });
    }
  );
}

function getdataPath() {
  let dataPath: string = '';
  return (() => {
    if (dataPath !== '') {
      return dataPath;
    }
    const picgoConfig = vscode.workspace.getConfiguration('picgo');
    return (
      picgoConfig.dataPath || path.resolve(os.homedir(), 'vs-picgo-data.json')
    );
  })();
}

async function updateLog(picInfos: Array<ImgInfo>, dataPath: string) {
  if (!fs.existsSync(dataPath)) {
    await initLogFile(getdataPath());
    vscode.window.showInformationMessage(`Log file created at ${dataPath}.`);
  }
  const data = await readFileP(dataPath, 'utf8');
  const log = JSON.parse(data);
  if (!log.uploaded) {
    log.uploaded = [];
  }
  picInfos.forEach(picInfo => {
    _.insert(log['uploaded'], picInfo);
  });
  await writeFileP(dataPath, JSON.stringify(log, null, 2), 'utf8');
}

async function initLogFile(dataPath: string) {
  if (!fs.existsSync(dataPath)) {
    await writeFileP(
      dataPath,
      JSON.stringify({ uploaded: [] }, null, 2),
      'utf8'
    );
  }
}

export async function activate(context: vscode.ExtensionContext) {
  let disposable = [
    vscode.commands.registerCommand('picgo.uploadImageFromClipboard', () =>
      uploadImageFromClipboard()
    ),
    vscode.commands.registerCommand('picgo.uploadImageFromExplorer', () =>
      uploadImageFromExplorer()
    ),
    vscode.commands.registerCommand('picgo.uploadImageFromInputBox', () =>
      uploadImageFromInputBox()
    )
  ];
  context.subscriptions.push(...disposable);

  await initLogFile(getdataPath());
}

export function deactivate() {}
