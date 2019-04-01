'use strict';
import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
const PicGo = require('picgo');
const _ = require('lodash');
const _db = require('lodash-id');
_.mixin(_db);

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
			Images: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico'],
		},
		canSelectMany: true,
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
		placeHolder: 'Please input an image location path',
	});
	// check if `result` is a path of image file
	const imageReg = /\.(png|jpg|jpeg|webp|gif|bmp|tiff|ico)$/;
	if (result && imageReg.test(result)) {
		result = path.isAbsolute(result) ? result : path.join(editor.document.uri.fsPath, '../', result);
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
	const nameReg = /[:\/\?\$]+/; // limations of name
	selectedString = selectedString.replace(nameReg, () => '');
	return selectedString;
}

function getUserSettingFile() {
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
	const picgoConfig = vscode.workspace.getConfiguration('picgo');
	// using the vscode setting file will be a better choice
	const picgo = new PicGo(picgoConfig.path || getUserSettingFile());
	// change image fileName to selection text
	if (imageName) {
		picgo.helper.beforeUploadPlugins.register('changeFileNameToSelection', {
			handle(ctx: any) {
				if (ctx.output.length === 1) {
					ctx.output[0].fileName = imageName;
				} else {
					ctx.output = ctx.output.map((item: any, index: number) => {
						item.fileName = `${imageName}_${index}`;
						return item;
					});
				}
			},
		});
	}
	picgo.upload(input); // Since picgo-core v1.1.5 will upload image from clipboard without input.
	picgo.on('finished', (ctx: any) => {
		editor.edit(textEditor => {
			let urlText = '';
			ctx.output.forEach((item: any) => {
				urlText += `![${item.fileName}](${item.imgUrl})\n`;
				updateLog(item);
			});
			textEditor.replace(editor.selection, urlText);
			vscode.window.showInformationMessage('Upload successfully');
		});
	});

	// uploading progress
	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Image Uploading...',
			cancellable: false,
		},
		progress => {
			return new Promise((resolve, reject) => {
				picgo.on('uploadProgress', (p: number) => {
					progress.report({ increment: p });
					if (p === 100) {
						resolve();
					}
				});
				picgo.on('notification', (notice: any) => {
					vscode.window.showErrorMessage(notice.title);
					reject();
				});
			});
		},
	);
}

function getCurrentPicBed() {
	const picBed = vscode.workspace.getConfiguration('picBed');
	return picBed.current;
}

function getLogPath() {
	const picgoConfig = vscode.workspace.getConfiguration('picgo');
	return picgoConfig.logPath || path.resolve(os.homedir(), 'vs-picgo-log.json');
}

function updateLog(picInfo: Object) {
	const logPath = getLogPath();
	try {
		let data = fs.readFileSync(logPath, 'utf8');
		let log = JSON.parse(data); //now it an object
		if (!log) {
			vscode.window.showErrorMessage(
				`The log file ${logPath} is dirty, ` +
				`please delete it and vs-picgo will recreate for you.`
			);
			return;
		}
		const currentPicBed = getCurrentPicBed();
		if (!log[currentPicBed]) {
			log[currentPicBed] = [];
		}
		// log[currentPicBed].push({picInfo}); //add some data
		_.insert(log[currentPicBed], picInfo);
		let json = JSON.stringify(log, null, 2); //convert it back to json
		writeJsonToLog(json);
	} catch (err) {
		// We have initialized log files when extension activated.
		// If get ENOENT error, there must be a user deletion of the log file.
		if (err.message.includes('ENOENT: no such file or directory')) {
			initLogFile();
			vscode.window.showInformationMessage(
				`Log file recreated at ${logPath}.`
			);
			updateLog(picInfo);
		}
		// Syntax error
		else if (err instanceof SyntaxError) {
			vscode.window.showErrorMessage(
				`The log file ${logPath} has syntax error, ` + 
				`please fix the error by yourself or delete the log file and vs-picgo will recreate for you.`
			);
		} else {
			vscode.window.showErrorMessage(
				`Failed to read from log file ${logPath}: ${err || ''}`
			);
			console.log(err.name);
		}
	}
}

function initLogFile() {
	const logPath = getLogPath();
	if (!fs.existsSync(logPath)) {
		writeJsonToLog(JSON.stringify({}));
	}
}

function writeJsonToLog(json: string) {
	const logPath = getLogPath();
	try {
		fs.writeFileSync(logPath, json, 'utf8');	
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to write to log file ${logPath}: ${err || ''}`);
	}
}

export function activate(context: vscode.ExtensionContext) {
	let disposable = [
		vscode.commands.registerCommand('picgo.uploadImageFromClipboard', () => uploadImageFromClipboard()),
		vscode.commands.registerCommand('picgo.uploadImageFromExplorer', () => uploadImageFromExplorer()),
		vscode.commands.registerCommand('picgo.uploadImageFromInputBox', () => uploadImageFromInputBox()),
	];
	context.subscriptions.push(...disposable);

	initLogFile();
}

export function deactivate() {}
