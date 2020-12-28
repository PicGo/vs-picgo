import * as path from 'path';
import { IUploadName, IOutputUrl } from '../vs-picgo';
import { window } from 'vscode';
import { IImgInfo } from 'picgo/dist/src/utils/interfaces';

export function formatParam(file: string, mdFileName: string): IUploadName {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  const h = dt.getHours();
  const mm = dt.getMinutes();
  const s = dt.getSeconds();

  let pad = function(x: number) {
    return ('00' + x).slice(-2);
  };

  const date = `${y}-${pad(m)}-${pad(d)}`;
  var extName = path.extname(file);

  return {
    date,
    dateTime: `${date}-${pad(h)}-${pad(mm)}-${pad(s)}`,
    fileName: path.basename(file, extName),
    extName,
    mdFileName,
  };
}

export function formatString(tplString: string, data: IUploadName | IOutputUrl) {
  const keys = Object.keys(data);
  const values = keys.map(k => data[k]);
  return new Function(keys.join(','), 'return `' + tplString + '`').apply(null, values);
}

import nls = require('../../package.nls.json');

function addPeriod(messgae: string) {
  if (!messgae.endsWith('.') && !messgae.endsWith('!')) {
    messgae = messgae + '.';
  }
  return messgae;
}

export function showWarning(messgae: string) {
  messgae = addPeriod(messgae);
  window.showWarningMessage(`${nls['ext.displayName']}: ${messgae}`);
}

export function showError(messgae: string) {
  messgae = addPeriod(messgae);
  window.showErrorMessage(`${nls['ext.displayName']}: ${messgae}`);
}

export function showInfo(messgae: string) {
  messgae = addPeriod(messgae);
  window.showInformationMessage(`${nls['ext.displayName']}: ${messgae}`);
}

/**
 * Return uploaded name accrding to `imgInfo.fileName`,
 * extname will be removed for the sake of simplicity when used as alt.
 * @param imgInfo
 */
export function getUploadedName(imgInfo: IImgInfo): string {
  let fullName;
  if (!imgInfo.fileName) {
    fullName = '';
  } else {
    fullName = imgInfo.fileName as string;
  }
  let basename = path.basename(fullName, path.extname(fullName));
  return basename;
}
