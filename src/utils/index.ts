import * as path from 'path'
import { IUploadName, IOutputUrl } from '../vs-picgo'
import { window } from 'vscode'
import { IImgInfo } from 'picgo/dist/src/utils/interfaces'

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
  const keys = Object.keys(data)
  const values = keys.map((k) => data[k])
  // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
  return new Function(keys.join(','), 'return `' + tplString + '`').apply(
    null,
    values
  )
}

import nls = require('../../package.nls.json')

function addPeriod(message: string) {
  if (!message.endsWith('.') && !message.endsWith('!')) {
    message = message + '.'
  }
  return message
}

function decorateMessage(message: string): string {
  message = addPeriod(message)
  return `${nls['ext.displayName']}: ${message}`
}

export const showWarning = asyncWrapper(async (message: string) => {
  message = decorateMessage(message)
  console.warn(message)
  return await window.showWarningMessage(message)
})

export const showError = asyncWrapper(async (message: string) => {
  message = decorateMessage(message)
  console.warn(message)
  return await window.showErrorMessage(message)
})

export const showInfo = asyncWrapper(async (message: string) => {
  message = decorateMessage(message)
  console.warn(message)
  return await window.showInformationMessage(message)
})

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

// Turn an async function to an ordinary function to avoid ESLint complaints
export function asyncWrapper<Args extends any[], T>(
  fn: (...args: Args) => Promise<T>
) {
  return (...args: Parameters<typeof fn>): void => {
    ;(async () => {
      // return T here
      return await fn(...args)
    })().catch(async (e) => {
      await showError(`Unexpected error: ${String(e)}`)
    })
    // return void here
  }
}
