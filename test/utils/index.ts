import * as path from 'path';
import { window, workspace, Position, Range, Selection } from 'vscode';

import VSPicgo, { EVSPicgoHooks } from '../../src/vs-picgo';

export interface IVSPicgoConfiguration {
  'picgo.configPath': string | undefined;
  'picgo.dataPath': string | undefined;
  'picgo.customUploadName': string | undefined;
  'picgo.customOutputFormat': string | undefined;
  'picgo.picBed.current': string | undefined;

  // aliyun picBed
  'picgo.picBed.aliyun.accessKeyId': string | undefined;
  'picgo.picBed.aliyun.accessKeySecret': string | undefined;
  'picgo.picBed.aliyun.bucket': string | undefined;
  'picgo.picBed.aliyun.area': string | undefined;
  'picgo.picBed.aliyun.path': string | undefined;
  'picgo.picBed.aliyun.customUrl': string | undefined;

  // github picBed
  'picgo.picBed.github.repo': string | undefined;
  'picgo.picBed.github.token': string | undefined;
  'picgo.picBed.github.path': string | undefined;
  'picgo.picBed.github.customUrl': string | undefined;
  'picgo.picBed.github.branch': string | undefined;

  // imgur picBed
  'picgo.picBed.imgur.clientId': string | undefined;
  'picgo.picBed.imgur.proxy': string | undefined;

  // qiniu picBed
  'picgo.picBed.qiniu.accessKey': string | undefined;
  'picgo.picBed.qiniu.secretKey': string | undefined;
  'picgo.picBed.qiniu.bucket': string | undefined;
  'picgo.picBed.qiniu.url': string | undefined;
  'picgo.picBed.qiniu.area': string | undefined;
  'picgo.picBed.qiniu.options': string | undefined;
  'picgo.picBed.qiniu.path': string | undefined;

  // sm.ms picBed
  'picgo.picBed.smms.token': string | undefined;

  // tcyun picBed
  'picgo.picBed.tcyun.version': string | undefined;
  'picgo.picBed.tcyun.secretId': string | undefined;
  'picgo.picBed.tcyun.secretKey': string | undefined;
  'picgo.picBed.tcyun.bucket': string | undefined;
  'picgo.picBed.tcyun.appId': string | undefined;
  'picgo.picBed.tcyun.area': string | undefined;
  'picgo.picBed.tcyun.path': string | undefined;
  'picgo.picBed.tcyun.customUrl': string | undefined;

  // upyun picBed
  'picgo.picBed.upyun.bucket': string | undefined;
  'picgo.picBed.upyun.operator': string | undefined;
  'picgo.picBed.upyun.password': string | undefined;
  'picgo.picBed.upyun.options': string | undefined;
  'picgo.picBed.upyun.path': string | undefined;
  'picgo.picBed.upyun.url': string | undefined;

  // weibo picBed
  'picgo.picBed.weibo.chooseCookie': boolean | undefined;
  'picgo.picBed.weibo.username': string | undefined;
  'picgo.picBed.weibo.quality': string | undefined;
  'picgo.picBed.weibo.cookie': string | undefined;
}

export type IVSPicgoConfigurationKeys = keyof IVSPicgoConfiguration;

interface IVSPicgoUploaderStarterOptions {
  vspicgo: VSPicgo;
  args4uploader: string[]; // arguments sent to func,
  configuration: Partial<IVSPicgoConfiguration>;
  editor: {
    content: string;
    selection: Selection;
  };
}

export const TEST_MD_FILE_PATH = path.join(__dirname, '../../../assets/test.md');
export const TEST_PICTURE_PATH = path.join(__dirname, '../../../assets/test.png');
export const DEFAULT_CONFIGS: IVSPicgoConfiguration = {
  'picgo.configPath': '',
  'picgo.dataPath': '',
  'picgo.customUploadName': '${fileName}${extName}',
  'picgo.customOutputFormat': '![${uploadedName}](${url})',
  'picgo.picBed.current': 'smms',
  // 'picgo.picBed.current': 'github',

  // aliyun picBed
  'picgo.picBed.aliyun.accessKeyId': '',
  'picgo.picBed.aliyun.accessKeySecret': '',
  'picgo.picBed.aliyun.bucket': '',
  'picgo.picBed.aliyun.area': '',
  'picgo.picBed.aliyun.path': '',
  'picgo.picBed.aliyun.customUrl': '',

  // github picBed
  'picgo.picBed.github.repo': '',
  'picgo.picBed.github.token': '',
  'picgo.picBed.github.path': '',
  'picgo.picBed.github.customUrl': '',
  'picgo.picBed.github.branch': '',

  // imgur picBed
  'picgo.picBed.imgur.clientId': '',
  'picgo.picBed.imgur.proxy': '',

  // qiniu picBed
  'picgo.picBed.qiniu.accessKey': '',
  'picgo.picBed.qiniu.secretKey': '',
  'picgo.picBed.qiniu.bucket': '',
  'picgo.picBed.qiniu.url': '',
  'picgo.picBed.qiniu.area': 'z0',
  'picgo.picBed.qiniu.options': '',
  'picgo.picBed.qiniu.path': '',

  // sm.ms picBed
  'picgo.picBed.smms.token': 'JxUI4p3alQ8QviKAd4wmQByitBufRqJS', // only for test

  // tcyun picBed
  'picgo.picBed.tcyun.version': 'v5',
  'picgo.picBed.tcyun.secretId': '',
  'picgo.picBed.tcyun.secretKey': '',
  'picgo.picBed.tcyun.bucket': '',
  'picgo.picBed.tcyun.appId': '',
  'picgo.picBed.tcyun.area': '',
  'picgo.picBed.tcyun.path': '',
  'picgo.picBed.tcyun.customUrl': '',

  // upyun picBed
  'picgo.picBed.upyun.bucket': '',
  'picgo.picBed.upyun.operator': '',
  'picgo.picBed.upyun.password': '',
  'picgo.picBed.upyun.options': '',
  'picgo.picBed.upyun.path': '',
  'picgo.picBed.upyun.url': '',

  // weibo picBed
  'picgo.picBed.weibo.chooseCookie': true,
  'picgo.picBed.weibo.username': '',
  'picgo.picBed.weibo.quality': 'large',
  'picgo.picBed.weibo.cookie': '',
};

export async function VSPicgoUploadStarter(options: IVSPicgoUploaderStarterOptions): Promise<string> {
  // load custom configuration
  const mergedConfig = Object.assign({}, DEFAULT_CONFIGS, options.configuration);

  // update configuration
  for (const section of Object.keys(mergedConfig)) {
    await workspace
      .getConfiguration('', null)
      .update(section, mergedConfig[section as IVSPicgoConfigurationKeys], true);
  }

  const editor = window.activeTextEditor;

  if (!editor) {
    throw new Error('No activeTextEditor.');
  }

  await editor.edit(editorBuilder => {
    // clean up content in test.md, insert custom content
    const fullRange = new Range(new Position(0, 0), editor.document.positionAt(editor.document.getText().length));
    editorBuilder.replace(fullRange, options.editor.content);
  });

  editor.selection = options.editor.selection;

  await options.vspicgo.upload(options.args4uploader);

  return new Promise((resolve, reject) => {
    options.vspicgo.on(EVSPicgoHooks.updated, async (res: string) => {
      console.log('updated' + res);
      const { document } = editor;
      await document.save();
      resolve(document.getText());
    });
  });
}
