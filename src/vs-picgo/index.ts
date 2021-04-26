import { EventEmitter } from 'events'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as vscode from 'vscode'

import { promisify } from 'util'

import {
  formatParam,
  formatString,
  showInfo,
  showError,
  getUploadedName,
  asyncWrapper
} from '../utils'
import { IImgInfo, IPlugin, IPicGo, IConfig } from 'picgo/dist/src/types'

import _ from '../utils/lodash-mixins'
import PicGoCore from 'picgo'

import nls = require('../../package.nls.json')
// https://github.com/PicGo/PicGo-Core/issues/71
// eslint-disable-next-line
const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require
const PicGo = requireFunc('picgo') as typeof PicGoCore

const writeFileP = promisify(fs.writeFile)
const readFileP = promisify(fs.readFile)

export interface INotice {
  body: string
  text: string
  title: string
}

export interface IUploadName {
  date: string
  dateTime: string
  fileName: string
  extName: string
  mdFileName: string
  [key: string]: string
}

export interface IOutputUrl {
  uploadedName: string
  url: string
  [key: string]: string
}

export enum EVSPicgoHooks {
  updated = 'updated'
}

export default class VSPicgo extends EventEmitter {
  private static readonly picgo: IPicGo = new PicGo()

  constructor() {
    super()
    this.configPicgo()
    // Before upload, we change names of the images.
    this.registerRenamePlugin()
    // After upload, we use the custom output format.
    this.addGenerateOutputListener()
  }

  configPicgo() {
    const picgoConfigPath = vscode.workspace
      .getConfiguration('picgo')
      .get<string>('configPath')
    let config: Partial<IConfig>
    if (picgoConfigPath) {
      config = JSON.parse(
        fs.readFileSync(picgoConfigPath, {
          encoding: 'utf-8'
        })
      )
    } else {
      const picBed = (vscode.workspace.getConfiguration(
        'picgo.picBed'
      ) as any) as IConfig['picBed']
      config = { picBed }
    }

    // `PICGO_ENV` is used only by Electron version, should be disabled here,
    // see https://github.com/PicGo/vs-picgo/issues/75 for more detail
    ;(config as any).PICGO_ENV = 'CLI'
    VSPicgo.picgo.setConfig(config)
  }

  addGenerateOutputListener() {
    VSPicgo.picgo.on(
      'finished',
      asyncWrapper(async (ctx: PicGoCore) => {
        let urlText = ''
        const outputFormatTemplate =
          vscode.workspace
            .getConfiguration('picgo')
            // eslint-disable-next-line no-template-curly-in-string
            .get<string>('customOutputFormat') ?? '![${uploadedName}](${url})'
        try {
          urlText = ctx.output.reduce(
            (acc: string, imgInfo: IImgInfo): string => {
              return `${acc}${formatString(outputFormatTemplate, {
                uploadedName: getUploadedName(imgInfo),
                url: imgInfo.imgUrl
              })}\n`
            },
            ''
          )
          urlText = urlText.trim()
          await this.updateData(ctx.output)
        } catch (err) {
          if (err instanceof SyntaxError) {
            await showError(
              `the data file ${this.dataPath} has syntax error, ` +
                `please fix the error by yourself or delete the data file and vs-picgo will recreate for you.`
            )
          } else {
            await showError(
              `failed to read from data file ${this.dataPath}: ${String(
                err ?? ''
              )}`
            )
          }
          return
        }
        const editor = this.editor
        await editor?.edit(
          asyncWrapper(async (textEditor) => {
            textEditor.replace(editor.selection, urlText)
            this.emit(EVSPicgoHooks.updated, urlText)
            await showInfo(`image uploaded successfully.`)
          })
        )
      })
    )
  }

  registerRenamePlugin() {
    const beforeUploadPlugin: IPlugin = {
      handle: (ctx: IPicGo) => {
        const uploadNameTemplate =
          vscode.workspace
            .getConfiguration('picgo')
            // eslint-disable-next-line no-template-curly-in-string
            .get<string>('customUploadName') ?? '${fileName}'
        if (ctx.output.length === 1) {
          ctx.output[0].fileName = this.changeFilename(
            ctx.output[0].fileName ?? '',
            uploadNameTemplate,
            undefined
          )
        } else {
          ctx.output.forEach((imgInfo: IImgInfo, index: number) => {
            imgInfo.fileName = this.changeFilename(
              imgInfo.fileName ?? '',
              uploadNameTemplate,
              index
            )
          })
        }
      }
    }
    VSPicgo.picgo.helper.beforeUploadPlugins.register(
      'vsPicgoRenamePlugin',
      beforeUploadPlugin
    )
  }

  /**
   * Returns the modified file name as per `customUploadName` setting
   * @param original The filename of the original image file.
   * @param template The template string.
   */
  changeFilename(
    original: string,
    template: string,
    index: number | undefined
  ) {
    if (this.userDefineName) {
      original = `${this.userDefineName}${index ?? ''}${path.extname(original)}`
    }
    const mdFilePath = this.editor?.document.fileName
    if (!mdFilePath) return
    const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath))
    const uploadNameData = formatParam(original, mdFileName)
    return formatString(template, uploadNameData)
  }

  get editor() {
    const editor = vscode.window.activeTextEditor
    if (editor == null) {
      asyncWrapper(async () => {
        await showError('no active markdown editor!')
      })()
      return null
    }
    return editor
  }

  get dataPath(): string {
    const picgoConfig = vscode.workspace.getConfiguration('picgo')
    return (
      picgoConfig.dataPath || path.resolve(os.homedir(), 'vs-picgo-data.json')
    )
  }

  get userDefineName() {
    let selectedString = this.editor?.document.getText(this.editor.selection)
    const nameReg = /[:/?$]+/g // limitations of name
    selectedString = selectedString?.replace(nameReg, () => '')
    return selectedString
  }

  async initDataFile(dataPath: string) {
    if (!fs.existsSync(dataPath)) {
      await writeFileP(
        dataPath,
        JSON.stringify({ uploaded: [] }, null, 2),
        'utf8'
      )
    }
  }

  async upload(input?: string[]) {
    // This is necessary, because user may have changed settings
    this.configPicgo()

    return await Promise.allSettled([
      // Error has been handled in on 'failed'
      // uploading progress, must be parallel with `picgo.upload` to catch events
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `${nls['ext.displayName']}: image uploading...`,
          cancellable: false
        },
        async (progress) => {
          return await new Promise<void>((resolve, reject) => {
            const onUploadProgress = (p: number) => {
              progress.report({ increment: p })
              if (p === 100) {
                cancelListeners()
                resolve()
              }
            }
            const onFailed = asyncWrapper(async (error: Error) => {
              const errorReason = error.message || 'Unknown error'
              cancelListeners()
              reject(errorReason)
              await showError(errorReason)
            })
            const onNotification = asyncWrapper(async (notice: INotice) => {
              const errorReason = `${notice.title}! ${notice.body || ''}${
                notice.text || ''
              }`
              cancelListeners()
              reject(errorReason)
              await showError(errorReason)
            })
            VSPicgo.picgo.on('uploadProgress', onUploadProgress)
            VSPicgo.picgo.on('failed', onFailed)
            VSPicgo.picgo.on('notification', onNotification)
            function cancelListeners() {
              VSPicgo.picgo.off('uploadProgress', onUploadProgress)
              VSPicgo.picgo.off('failed', onFailed)
              VSPicgo.picgo.off('notification', onNotification)
            }
          })
        }
      ),
      VSPicgo.picgo.upload(input)
    ]).catch(() => {})
  }

  async updateData(picInfos: IImgInfo[]) {
    const dataPath = this.dataPath
    if (!fs.existsSync(dataPath)) {
      await this.initDataFile(dataPath)
      await showInfo(`data file created at ${dataPath}.`)
    }
    const dataRaw = await readFileP(dataPath, 'utf8')
    const data = JSON.parse(dataRaw)
    if (!data.uploaded) {
      data.uploaded = []
    }
    picInfos.forEach((picInfo) => {
      _.insert(data.uploaded, picInfo)
    })
    await writeFileP(dataPath, JSON.stringify(data, null, 2), 'utf8')
  }
}
