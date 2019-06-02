import * as path from 'path';
import { window, workspace, Position, Range, Selection, TextEditor } from 'vscode';

export let testMdFile = path.join(__dirname, '..', '..', 'test', 'test.md');
export let defaultConfigs = {
    "picgo.configPath": "",
    "picgo.dataPath": "",
    "picgo.customUploadName": "${fileName}${extName}",
    "picgo.customOutputFormat": "![${uploadedName}](${url})",
    "picgo.picBed.current": "smms",
    "picgo.picBed.weibo.chooseCookie": true,
    "picgo.picBed.weibo.username": "",
    "picgo.picBed.weibo.quality": "large",
    "picgo.picBed.weibo.cookie": "",
    "picgo.picBed.qiniu.accessKey": "",
    "picgo.picBed.qiniu.secretKey": "",
    "picgo.picBed.qiniu.bucket": "",
    "picgo.picBed.qiniu.url": "",
    "picgo.picBed.qiniu.area": "z0",
    "picgo.picBed.qiniu.options": "",
    "picgo.picBed.qiniu.path": "",
    "picgo.picBed.upyun.bucket": "",
    "picgo.picBed.upyun.operator": "",
    "picgo.picBed.upyun.password": "",
    "picgo.picBed.upyun.options": "",
    "picgo.picBed.upyun.path": "",
    "picgo.picBed.upyun.url": "",
    "picgo.picBed.tcyun.version": "v5",
    "picgo.picBed.tcyun.secretId": "",
    "picgo.picBed.tcyun.secretKey": "",
    "picgo.picBed.tcyun.bucket": "",
    "picgo.picBed.tcyun.appId": "",
    "picgo.picBed.tcyun.area": "",
    "picgo.picBed.tcyun.path": "",
    "picgo.picBed.tcyun.customUrl": "",
    "picgo.picBed.github.repo": "",
    "picgo.picBed.github.token": "",
    "picgo.picBed.github.path": "",
    "picgo.picBed.github.customUrl": "",
    "picgo.picBed.github.branch": "",
    "picgo.picBed.aliyun.accessKeyId": "",
    "picgo.picBed.aliyun.accessKeySecret": "",
    "picgo.picBed.aliyun.bucket": "",
    "picgo.picBed.aliyun.area": "",
    "picgo.picBed.aliyun.path": "",
    "picgo.picBed.aliyun.customUrl": "",
    "picgo.picBed.imgur.clientId": "",
    "picgo.picBed.imgur.proxy": ""
};

// 💩 Promise, then, async/await ... <https://github.com/Microsoft/vscode/issues/31210>

export async function testFunction(func: Function, thisArg: any, argArray: any[], configs: any, lines: string[], selection: Selection): Promise<[string, string]> {
    let tempConfigs = Object.assign({}, defaultConfigs) as any;
    for (let key in configs) {
        if (configs.hasOwnProperty(key)) {
            tempConfigs[key] = configs[key];
        }
    }
    for (let key in tempConfigs) {
        if (tempConfigs.hasOwnProperty(key)) {
            await workspace.getConfiguration().update(key, tempConfigs[key], true);
        }
    }
    let editor = window.activeTextEditor as TextEditor;
    return editor.edit(editBuilder => {
        let fullRange = new Range(new Position(0, 0), editor.document.positionAt(editor.document.getText().length));
        editBuilder.delete(fullRange);
        editBuilder.insert(new Position(0, 0), lines.join('\n'));
    }).then(b => {
        (window.activeTextEditor as TextEditor).selection = selection;
        return func.apply(thisArg, argArray).then(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const document = (window.activeTextEditor as TextEditor).document;
                    const selection = editor.selection;
                    const range = selection.with(selection.start, selection.end);

                    let actual = document.getText();
                    const selectionStr = document.getText(range);
                    actual = actual.replace(/\r\n/g, '\n').replace(/\t/g, '    '); /* !!! */
                    resolve([actual, selectionStr]);
                }, 100);
            });
        });
    });
}
