'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import VSPicgo from './vs-picgo';

function uploadImageFromClipboard(vspicgo: VSPicgo): void {
  return vspicgo.upload();
}

async function uploadImageFromExplorer(vspicgo: VSPicgo): Promise<any> {
  const result = await vscode.window.showOpenDialog({
    filters: {
      Images: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico'],
    },
    canSelectMany: true,
  });

  if (result) {
    const input = result.map(item => item.fsPath);
    return vspicgo.upload(input);
  }
}

async function uploadImageFromInputBox(vspicgo: VSPicgo): Promise<any> {
  let result = await vscode.window.showInputBox({
    placeHolder: 'Please input an image location path',
  });
  // check if `result` is a path of image file
  const imageReg = /\.(png|jpg|jpeg|webp|gif|bmp|tiff|ico)$/;
  if (result && imageReg.test(result)) {
    result = path.isAbsolute(result) ? result : path.join(vspicgo.editor.document.uri.fsPath, '../', result);
    if (fs.existsSync(result)) {
      return vspicgo.upload([result]);
    } else {
      vscode.window.showErrorMessage('No such image.');
    }
  } else {
    vscode.window.showErrorMessage('No such image.');
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const vspicgo = new VSPicgo();
  const disposable = [
    vscode.commands.registerCommand('picgo.uploadImageFromClipboard', () => uploadImageFromClipboard(vspicgo)),
    vscode.commands.registerCommand('picgo.uploadImageFromExplorer', () => uploadImageFromExplorer(vspicgo)),
    vscode.commands.registerCommand('picgo.uploadImageFromInputBox', () => uploadImageFromInputBox(vspicgo)),
  ];
  context.subscriptions.push(...disposable);
}

export function deactivate() {}
