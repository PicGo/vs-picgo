import * as path from 'path';
import { Selection } from 'vscode';

import VSPicgo from '../../src/vs-picgo';

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

export interface IVSPicgoUploadStarterOptions {
  vspicgo: VSPicgo;
  args4uploader: string[]; // arguments sent to func,
  configuration: Partial<IVSPicgoConfiguration>;
  editor: {
    content: string;
    selection: Selection;
  };
}

export interface ICoverageCollectorOptions {
  enabled: boolean;
  ignorePatterns: string[];
  sourceRoot: string;
  includePid: boolean;
  output: string;
  reports: string[];
  verbose: boolean;
}

export const TEST_MD_FILE_PATH = path.join(__dirname, '../../../assets/test.md');
export const TEST_PICTURE_PATH = path.join(__dirname, '../../../assets/test.png');

export const COVERAGE_COLLECTOR_CONFIG_FILE_PATH = path.join(__dirname, '../../../coverage.json');
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

export const DEFAULT_COVERAGE_CONFIGURATION: ICoverageCollectorOptions = {
  enabled: true,
  sourceRoot: './out/src',
  output: './coverage',
  ignorePatterns: ['**/node_modules/**'],
  includePid: false,
  reports: ['html', 'lcov', 'text-summary'],
  verbose: false,
};
