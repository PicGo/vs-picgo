/* eslint-disable no-template-curly-in-string */
export interface IPicgoSettings {
  settings: {
    vsPicgo: {
      customUploadName: string
      customOutputFormat: string
    }
  }
}

export const outputFormats = {
  Markdown: '![${uploadedName}](${url})',
  HTML: '<img src="${url}" alt="${uploadedName}">',
  UBB: '[IMG]${url}[/IMG]',
  URL: '${url}'
}

export const uploadName = {
  auto:
    '${editorSelectionText ? `${editorSelectionText}${imgIdx}` : fileName}${extName}',
  dateExt: '${date}${extName}'
}

export const defaultSettings: IPicgoSettings = {
  settings: {
    vsPicgo: {
      customOutputFormat: outputFormats.Markdown,
      customUploadName:
        '${editorSelectionText ? `${editorSelectionText}${imgIdx}` : fileName}${extName}'
    }
  }
}

const editorSelectionText = 'editorSelectionText'
const imgIdx = 0
const fileName = 'fileName'
const extName = '.png'

// eslint-disable-next-line prettier/prettier
export const customUploadNameTest1 = `${editorSelectionText ? `${editorSelectionText}${imgIdx}` : fileName}${extName}`
