'use strict';
import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';
const PicGo = require('picgo');

function uploadImageFromClipboard (): void {
    return upload();
}

async function uploadImageFromExplorer (): Promise<any> {
    const result = await vscode.window.showOpenDialog({
        filters: {
            'Images': ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico']
        },
        canSelectMany: true
    });

    if (result) {
        const input = result.map(item => item.fsPath);
        return upload(input);
    }
}

async function uploadImageFromInputBox (): Promise<any> {
    const result = await vscode.window.showInputBox({
        placeHolder: 'Please input an image location path'
    });
    if (result) {
        if (fs.existsSync(result)) {
            return upload([result]);
        } else {
            vscode.window.showErrorMessage('No such image or path.');
        }
    }
}

function getImageName(editor: vscode.TextEditor): string {
    const selectedString = editor.document.getText(editor.selection);
    const nameReg = /[^:.\/\?\$]+$/;  // 补充完全命名限制
    return (selectedString && nameReg.test(selectedString)) ? selectedString : '';
}

function getUserSettingFile () {
    // https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations
    const home = process.env.APPDATA ? process.env.APPDATA : os.homedir();
    switch (os.platform()) {
        case 'win32':
            return `${home}\\Code\\User\\settings.json`;
        case 'darwin':
            return `${home}/Library/Application Support/Code/User/settings.json`;
        default:
            return `${home}/.config/Code/User/settings.json`;
    }
}

function upload (input?: any[]): void {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'markdown') {
        const imageName = getImageName(editor);
        const picgoConfig = vscode.workspace.getConfiguration('picgo');
        // using the vscode setting file will be a better choice
        const picgo = new PicGo(picgoConfig.path || getUserSettingFile());
        // change image fileName to selection text
        if (imageName) {
            picgo.helper.beforeUploadPlugins.register('changeFileNameToSelection',{
                handle (ctx: any) {
                    if (ctx.output.length === 1) {
                        ctx.output[0].fileName = imageName;
                    } else {
                        ctx.output = ctx.output.map((item: any, index: number) => {
                            item.fileName = `${imageName}_${index}`;
                            return item;
                        });
                    }
                }
            });
        }
        picgo.upload(input); // Since picgo-core v1.1.5 will upload image from clipboard without input.
        picgo.on('finished', (ctx: any) => {
            editor.edit(textEditor => {
                let urlText = '';
                ctx.output.forEach((item: any) => {
                    urlText += `![${item.fileName}](${item.imgUrl})\n`;
                });
                textEditor.replace(editor.selection, urlText);
                vscode.window.showInformationMessage('upload successfully');
            });
        });
        picgo.on('notification', (notice: any) => {
            vscode.window.showErrorMessage(notice.title);
        });
    } else {
        vscode.window.showErrorMessage('No Active Editor!');
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = [
        vscode.commands.registerCommand('picgo.uploadImageFromClipboard', () => uploadImageFromClipboard()),
        vscode.commands.registerCommand('picgo.uploadImageFromExplorer', () => uploadImageFromExplorer()),
        vscode.commands.registerCommand('picgo.uploadImageFromInputBox', () => uploadImageFromInputBox()),
    ];
    context.subscriptions.push(...disposable);
}

export function deactivate() {
}
