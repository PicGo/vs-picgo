'use strict';
import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import * as  path from 'path';
import * as fs from 'fs';

const PicGo = require('picgo');

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.picgo', () => start());
    context.subscriptions.push(disposable);
}

export function deactivate() {
}

function start(): void {
    const editor = vscode.window.activeTextEditor;
    // 当前是否有active编辑器
    // 插件只支持markdown文法
    if (editor && editor.document.languageId === 'markdown') {
        const imageDir = path.join(editor.document.uri.fsPath, '../.imgs');
        try {
            fs.accessSync(imageDir);
        } catch (err) {
            fs.mkdirSync(imageDir);
        }
        const imageName = getImageName(editor);
        getImagePath(saveImageFromClipboard(`${imageDir}/${imageName}.png`))
            .then(path => {

                if (path === 'no image') {
                    vscode.window.showErrorMessage('copy image first');
                } else {
                    const picgoConfig = vscode.workspace.getConfiguration('picgo');
                    const picgo = new PicGo(picgoConfig.path || '');
                    picgo.upload([path]);
                    picgo.on('finished', (ctx: any) => {
                        editor.edit(textEditor => {
                            textEditor.replace(editor.selection, `![image ${imageName}](${ctx.output[0].imgUrl})`);
                            vscode.window.showInformationMessage('upload successfully');
                        });
                    });
                    picgo.on('notification', (notice: any) => {
                        vscode.window.showErrorMessage(notice.title);
                    });
                }
            })
            .catch(() => {
            });
    } else {
        vscode.window.showErrorMessage('No Active Editor!');
    }
}

function getImageName(editor: vscode.TextEditor): string {
    const selectedString = editor.document.getText(editor.selection);
    const nameReg = /[^:.\/\?\$]+$/;  // 补充完全命名限制
    return (selectedString && nameReg.test(selectedString)) ? selectedString : `${new Date().getTime()}`;
}


function saveImageFromClipboard(imagePath: string): ChildProcess {
    const platform: string = process.platform;
    const platformMaps: {
        [index: string]: {
            script: string,
            path: string
        }
    } = {
        'darwin': {
            script: 'osascript',
            path: '../lib/mac.applescript'
        },
        'win32': {
            script: 'powershell',
            path: '../lib/windows.ps1'
        },
        'linux': {
            script: 'sh',
            path: '../lib/linux.sh'
        }
    };
    const args = platform === 'win32' ? [
        '-noprofile',
        '-noninteractive',
        '-nologo',
        '-sta',
        '-executionpolicy', 'unrestricted',
        '-windowstyle', 'hidden',
        '-file'] : [];

    args.push(path.join(__dirname, platformMaps[platform].path), imagePath);
    return spawn(platformMaps[platform].script, args);
}

function getImagePath(execution: ChildProcess): Promise<string> {
    return new Promise((resolve, reject) => {
        execution.stdout.on('data', (data: string) => {
            if (process.platform === 'linux' && data.toString().trim() === 'no xclip') {
                vscode.window.showErrorMessage('Please install xclip before run picgo!');
            } else {
                resolve(data.toString().trim());
            }
        });
        execution.stderr.on('data', (err: any) => {
            reject(err);
        });
    });
}




