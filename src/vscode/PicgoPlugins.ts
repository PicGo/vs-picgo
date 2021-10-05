import { IPicGo, IImgInfo, ILifecyclePlugins } from 'picgo'
import { PicgoAPI } from './PicgoAPI'
import path from 'path'
import { Editor } from './Editor'
import { handleUrlEncode } from '../utils'

export interface IUploadName {
  date: string
  dateTime: string
  fileName: string
  extName: string
  mdFileName: string
  editorSelectionText: string
  imgIdx: string
}

export interface IOutputUrl {
  uploadedName: string
  url: string
}

export class PicgoPlugins {
  static picgoPlugins = new PicgoPlugins()
  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  get editorSelectionText() {
    let selectedString =
      Editor.editor?.document.getText(Editor.editor.selection) ?? ''
    const nameReg = /[:/?$]+/g // limitations of name
    selectedString = selectedString?.replace(nameReg, () => '')
    return selectedString
  }

  get mdFilePath() {
    return Editor.editor?.document.fileName ?? ''
  }

  get mdFileName() {
    return path.basename(this.mdFilePath, path.extname(this.mdFilePath))
  }

  formatParam(
    file: string,
    editorSelectionText: string,
    mdFileName: string,
    imgIdx: string
  ): IUploadName {
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
      editorSelectionText,
      mdFileName,
      imgIdx
    }
  }

  formatString(tplString: string, data: IUploadName | IOutputUrl): string {
    const keys = Object.keys(data) as Array<keyof typeof data>
    const values = keys.map((k) => data[k])
    // eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
    return new Function(keys.join(','), 'return `' + tplString + '`').apply(
      null,
      values
    )
  }

  beforeUploadPlugin(): Parameters<ILifecyclePlugins['register']> {
    return [
      'VspicgoBeforeUploadPlugin',
      {
        handle: (ctx: IPicGo) => {
          const customUploadNameTemplate = PicgoAPI.picgoAPI.getConfig(
            'settings.vsPicgo.customUploadName'
          )
          ctx.output.forEach((imgInfo: IImgInfo, index: number, imgs) => {
            imgInfo.fileName = this.formatString(
              customUploadNameTemplate,
              this.formatParam(
                imgInfo.fileName ?? '',
                this.editorSelectionText,
                this.mdFileName,
                imgs.length > 1 ? String(index) : ''
              )
            )
          })
        }
      }
    ]
  }

  /**
   * Return uploaded name according to `imgInfo.fileName`,
   * extname will be removed for the sake of simplicity when used as alt.
   * @param imgInfo
   */
  getUploadedName(imgInfo: IImgInfo): string {
    const fullName = imgInfo.fileName ?? ''
    const basename = path.basename(fullName, path.extname(fullName))
    return basename
  }

  outputToString(output: IImgInfo[]) {
    const customOutputFormatTemplate = PicgoAPI.picgoAPI.getConfig(
      'settings.vsPicgo.customOutputFormat'
    )
    return output
      .map((imgInfo) =>
        this.formatString(customOutputFormatTemplate, {
          uploadedName: this.getUploadedName(imgInfo),
          url: handleUrlEncode(imgInfo.imgUrl ?? '')
        })
      )
      .join('\n')
  }
}
