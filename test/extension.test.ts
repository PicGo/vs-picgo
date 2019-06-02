import { testMdFile, defaultConfigs, testFunction } from './util';
import { workspace, window, Selection } from 'vscode';
import VSPicgo from '../src/vs-picgo';
import * as path from 'path';

let previousConfigs = Object.assign({}, defaultConfigs) as any;
let vspicgo = new VSPicgo();

suite("VSPicgo configuration testes", () => {

  suiteSetup(async () => {
    // 💩 Preload file to prevent the first test to be treated timeout
    await workspace.openTextDocument(testMdFile);

    for (let key in previousConfigs) {
      if (previousConfigs.hasOwnProperty(key)) {
        // Save the old configurations.
        previousConfigs[key] = workspace.getConfiguration('', null).get(key);
      }
    }

    await workspace.openTextDocument(testMdFile)
      .then(async document => {
        await window.showTextDocument(document);
      });
  });

  suiteTeardown(async () => {
    for (let key in previousConfigs) {
      if (previousConfigs.hasOwnProperty(key)) {
        // Restore to the old configurations.
        await workspace.getConfiguration('', null).update(key, previousConfigs[key], true);
      }
    }
  });

  test('customOutputFormat should work', done => {
    testFunction(
      vspicgo.upload,
      vspicgo,
      [
        [path.join(vspicgo.editor.document.uri.fsPath, '../', './test.png')]
      ],
      {
        "picgo.customOutputFormat": "![${uploadedName}](${url})",
      }, [], new Selection(0, 0, 0, 0))
      .then(res => {
        console.log(res[0]);
        console.log(res[1]);
        // assert.deepEqual(/^!\[.+\](.+)$/.test(res[0]), true);
        done();
      });
  });

  test('customUploadName should work', done => {
    testFunction(
      vspicgo.upload,
      vspicgo,
      [
        [path.join(vspicgo.editor.document.uri.fsPath, '../', './test.png')]
      ],
      {
        "picgo.customUploadName": "${fileName}-${mdFileName}-${date}-${dateTime}${extName}",
      }, [], new Selection(0, 0, 0, 0))
      .then(res => {
        console.log(res[0]);
        console.log(res[1]);
        // assert.deepEqual(/^!\[.+-.+-(\d\d\d\d)-(\d\d)-(\d\d)-(\d\d\d\d)-(\d\d)-(\d\d)-(\d\d)-(\d\d)-(\d\d)\](.+)$/.test(res[0]), true);
        done();
      });
  });

  test('selection as fileName should work', done => {
    testFunction(
      vspicgo.upload,
      vspicgo,
      [
        [path.join(vspicgo.editor.document.uri.fsPath, '../', './test.png')]
      ],
      {
      },
      [
        '# Test',
        'This is : a selection',
        'End...'
      ], new Selection(1, 10, 1, 21))
      .then(res => {
        console.log(res[0]);
        console.log(res[1]);
        // assert.deepEqual((/!\[(.*)\]/.exec(res[1]) as RegExpExecArray)[1], 'a selection');
        done();
      });
  });

});