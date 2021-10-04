/**
 * Utils that can only work in vscode
 */

import * as path from 'path'
import { IUploadName, IOutputUrl } from '..'
import { window } from 'vscode'
import { IImgInfo } from 'picgo'
import { IMessageToShow } from '../../utils'
import { getNLSText } from '../../utils/meta'

export function formatParam(file: string, mdFileName: string): IUploadName {
  const dt = new Date()
  const y = dt.getFullYear()
  const m = dt.getMonth() + 1
  const d = dt.getDate()
  const h = dt.getHours()
  const mm = dt.getMinutes()
  const s = dt.getSeconds()

  const pad = function (x: number) {
    return `00${x}`.slice(-2)
  }

  const date = `${y}-${pad(m)}-${pad(d)}`
  const extName = path.extname(file)

  return {
    date,
    dateTime: `${date}-${pad(h)}-${pad(mm)}-${pad(s)}`,
    fileName: path.basename(file, extName),
    extName,
    mdFileName
  }
}

export function formatString(
  tplString: string,
  data: IUploadName | IOutputUrl
): string {
  const keys = Object.keys(data) as Array<keyof typeof data>
  const values = keys.map((k) => data[k])
  // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
  return new Function(keys.join(','), 'return `' + tplString + '`').apply(
    null,
    values
  )
}

function addPeriod(message: string) {
  if (!message.endsWith('.') && !message.endsWith('!')) {
    message = message + '.'
  }
  return message
}

function decorateMessage(message: string): string {
  message = addPeriod(message)
  return `${getNLSText('ext.displayName')}: ${message}`
}

export const showWarning = async (message: string) => {
  message = decorateMessage(message)
  console.warn(message)
  return await window.showWarningMessage(message)
}

export const showError = async (message: string) => {
  message = decorateMessage(message)
  console.warn(message)
  return await window.showErrorMessage(message)
}

export const showInfo = async (message: string) => {
  message = decorateMessage(message)
  console.warn(message)
  return await window.showInformationMessage(message)
}

export const showMessage = (messageToShow: IMessageToShow) => {
  switch (messageToShow.type) {
    case 'warning':
      showWarning(messageToShow.message)
      break
    case 'error':
      showError(messageToShow.message)
      break
    case 'info':
      showInfo(messageToShow.message)
      break
    default:
  }
}

/**
 * Return uploaded name accrding to `imgInfo.fileName`,
 * extname will be removed for the sake of simplicity when used as alt.
 * @param imgInfo
 */
export function getUploadedName(imgInfo: IImgInfo): string {
  let fullName
  if (!imgInfo.fileName) {
    fullName = ''
  } else {
    fullName = imgInfo.fileName
  }
  const basename = path.basename(fullName, path.extname(fullName))
  return basename
}
