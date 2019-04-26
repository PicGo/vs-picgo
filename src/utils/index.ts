import * as path from 'path';
import { IUploadName, IOutputUrl } from '../vs-picgo';
import { window } from 'vscode';

export function formatParam(file: string, mdFileName: string): IUploadName {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  const h = dt.getHours();
  const mm = dt.getMinutes();
  const s = dt.getSeconds();

  const date = `${y}-${m}-${d}`;
  var extName = path.extname(file);

  return {
    date,
    dateTime: `${date}-${h}-${mm}-${s}`,
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

const nls = require('../../package.nls.json');

function addPeriod(messgae: string) {
  if (!messgae.endsWith('.') && !messgae.endsWith('!') ) {
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
