'use strict';
import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as  path from 'path';
import * as fs from 'fs';

const PicGo = require('picgo');

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.picgo', () => {
        start();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}

function start(): void {
    const editor = vscode.window.activeTextEditor;
    // 当前是否有active编辑器
    if (editor) {
        // 插件只支持markdown文法
        if (editor.document.languageId === 'markdown') {
            const imageDir = path.join(editor.document.uri.fsPath, '../.imgs/');
            try {
                fs.accessSync(imageDir);
            } catch (err) {
                fs.mkdirSync(imageDir);
            }
            const imageName = getImageName(editor);
            saveImageFromClipboardandGetPath(`${imageDir}/${imageName}.png`)
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
        }
    } else {
        vscode.window.showErrorMessage('No Active Editor!');
    }
}

function getImageName(editor: vscode.TextEditor): String {
    const selectedString = editor.document.getText(editor.selection);
    // 补充完全命名限制
    if (selectedString && /[^:.\/\?\$]+$/.test(selectedString)) {
        return `${selectedString}`;
    }
    return `${new Date().getTime()}`;
}


function saveImageFromClipboardandGetPath(imagePath: string): Promise<String> {
    return new Promise((resolve, reject) => {
        let platform: string = process.platform;
        let execution = null;
        const platformPaths: {
            [index: string]: string
        } = {
            'darwin': '../lib/mac.applescript',
            'win32': '../lib/windows.ps1',
            'linux': '../lib/linux.sh'
        };
        const scriptPath = path.join(__dirname, platformPaths[platform]);
        if (platform === 'darwin') {
            execution = spawn('osascript', [scriptPath, imagePath]);

        } else if (platform === 'win32') {
            execution = spawn('powershell', [
                '-noprofile',
                '-noninteractive',
                '-nologo',
                '-sta',
                '-executionpolicy', 'unrestricted',
                '-windowstyle', 'hidden',
                '-file', scriptPath,
                imagePath
            ]);
        } else {
            execution = spawn('sh', [scriptPath, imagePath]);
        }

        execution.stdout.on('data', (data: Buffer) => {
            if (platform === 'linux') {
                if (data.toString().trim() === 'no xclip') {
                    vscode.window.showErrorMessage('Please install xclip before run picgo!');
                } else {
                    resolve(data.toString().trim());
                }
            } else {
                resolve(data.toString().trim());
            }
        });
        execution.stderr.on('data', (err: any) => {
            reject(err);
        });
    });
}



