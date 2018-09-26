'use strict';
import * as vscode from 'vscode';
import * as os from 'os';
const PicGo = require('picgo');

function start(): void {
    const editor = vscode.window.activeTextEditor;
    // 当前是否有active编辑器
    // 插件只支持markdown文法
    if (editor && editor.document.languageId === 'markdown') {
        const imageName = getImageName(editor);
        const picgoConfig = vscode.workspace.getConfiguration('picgo');
        // using the vscode setting file will be a better choice
        const picgo = new PicGo(picgoConfig.path || getUserSettingFile());
        // change image fileName to selection text
        if (imageName) {
            picgo.helper.beforeUploadPlugins.register('changeFileNameToSelection',{
                handle (ctx: any) {
                    if (ctx.output.length > 0) {
                        ctx.output[0].fileName = imageName;
                    }
                }
            });
        }
        picgo.upload(); // Since picgo-core v1.1.5 will upload image from clipboard without input.
        picgo.on('finished', (ctx: any) => {
            editor.edit(textEditor => {
                textEditor.replace(editor.selection, `![image ${ctx.output[0].fileName}](${ctx.output[0].imgUrl})`);
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

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('picgo.uploadClipboardImage', () => start());
    context.subscriptions.push(disposable);
}

export function deactivate() {
}
