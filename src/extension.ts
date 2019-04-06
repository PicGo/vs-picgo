'use strict';
import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import PicGo from 'picgo/dist/core/PicGo';
import { ImgInfo } from 'picgo/dist/utils/interfaces';
type PicGoType = import('picgo/dist/index');
const _ = require('lodash');
const _db = require('lodash-id');
_.mixin(_db);

const writeFileP = promisify(fs.writeFile);
const readFileP = promisify(fs.readFile);

export interface INotice {
  title: string;
  body: string;
}

export interface IPicGoCtx {
  output: Array<ImgInfo>;
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

function upload(editor: vscode.TextEditor, input?: any[]): void {
  const imageName = getImageName(editor);
  const picgoConfigPath = vscode.workspace.getConfiguration('picgo').get<string>('configPath');
  let picgo: PicGoType;
  if (picgoConfigPath) {
    picgo = new PicGo(picgoConfigPath);
  } else {
    picgo = new PicGo();
    const picBed = vscode.workspace.getConfiguration('picgo.picBed');
    picgo.setConfig({ picBed });
  }
  // change image fileName to selection text
  if (imageName) {
    picgo.helper.beforeUploadPlugins.register('changeFileNameToSelection', {
      handle(ctx: PicGo) {
        if (ctx.output.length === 1) {
          ctx.output[0].fileName = imageName;
        } else {
          ctx.output = ctx.output.map((item: ImgInfo, index: number) => {
            item.fileName = `${imageName}_${index}`;
            return item;
          });
        }
      }
    });
  }
  picgo.upload(input); // Since picgo-core v1.1.5 will upload image from clipboard without input.
  picgo.on('finished', async (ctx: IPicGoCtx) => {
    let urlText = '';
    const logPath = getLogPath();
    try {
      urlText = ctx.output.reduce((acc: string, cur: ImgInfo): string => {
        return `${acc}![${cur.fileName}](${cur.imgUrl})\n`;
      }, '');
      await updateLog(ctx.output, logPath);
    } catch (err) {
      if (err instanceof SyntaxError) {
        vscode.window.showErrorMessage(
          `The log file ${logPath} has syntax error, ` +
            `please fix the error by yourself or delete the log file and vs-picgo will recreate for you.`
        );
      } else {
        vscode.window.showErrorMessage(
          `Failed to read from log file ${logPath}: ${err || ''}`
        );
      }
      return;
    }
    editor.edit(textEditor => {
      textEditor.replace(editor.selection, urlText);
      vscode.window.showInformationMessage('Upload successfully');
    });
  });

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
          // Waiting for https://github.com/PicGo/PicGo-Core/pull/9 to be published.
          vscode.window.showErrorMessage(notice.title + (notice.body || ''));
          reject();
        });
      });
    }
  );
}

function getLogPath() {
  const picgoConfig = vscode.workspace.getConfiguration('picgo');
  return picgoConfig.logPath || path.resolve(os.homedir(), 'vs-picgo-log.json');
}

async function updateLog(picInfos: Array<ImgInfo>, logPath: string) {
  // debugger;
  if (!fs.existsSync(logPath)) {
    await initLogFile(getLogPath());
    vscode.window.showInformationMessage(`Log file created at ${logPath}.`);
  }
  const data = await readFileP(logPath, 'utf8');
  const log = JSON.parse(data);
  if (!log.uploaded) {
    log.uploaded = [];
  }
  picInfos.forEach(picInfo => {
    _.insert(log['uploaded'], picInfo);
  });
  await writeFileP(logPath, JSON.stringify(log, null, 2), 'utf8');
}

async function initLogFile(logPath: string) {
  if (!fs.existsSync(logPath)) {
    await writeFileP(
      logPath,
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

  await initLogFile(getLogPath());
}

export function deactivate() {}
