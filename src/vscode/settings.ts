/* eslint-disable no-template-curly-in-string */
import { PartialDeep } from 'type-fest'
import { IConfig, LogLevel } from 'picgo'
/**
 * All this settings are configurable in the settings page of the picgo control panel
 */
export interface IPicGoSettings extends IConfig {
  settings: {
    vsPicgo: {
      customUploadName: string
      customOutputFormat: string
    }
    logLevel: LogLevel | LogLevel[]
    logPath: string
  }
  picBed: {
    current: string
    uploader: string
  }
}

// TODO: add a select in settings page for user to select this presets
export const outputFormats = {
  Markdown: '![${uploadedName}](${url})',
  HTML: '<img src="${url}" alt="${uploadedName}">',
  UBB: '[IMG]${url}[/IMG]',
  URL: '${url}'
}

export const uploadName = {
  SelectionOrOriginalName:
    '${editorSelectionText ? `${editorSelectionText}${imgIdx}` : fileName}${extName}',
  Date: '${date}${extName}'
}

export const defaultSettings: PartialDeep<IPicGoSettings> = {
  settings: {
    vsPicgo: {
      customOutputFormat: outputFormats.Markdown,
      customUploadName: uploadName.SelectionOrOriginalName
    }
  }
}

const editorSelectionText = 'editorSelectionText'
const imgIdx = 0
const fileName = 'fileName'
const extName = '.png'

// eslint-disable-next-line prettier/prettier
export const customUploadNameTest1 = `${editorSelectionText ? `${editorSelectionText}${imgIdx}` : fileName}${extName}`
