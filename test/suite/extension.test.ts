/* eslint-disable no-useless-escape */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-undef */
import * as assert from 'assert'
import { workspace, window, Selection } from 'vscode'
import { PicgoAPI } from '../../src/vscode/PicgoAPI'
import { uploadName } from '../../src/vscode/settings'

import {
  TEST_MD_FILE_PATH,
  TEST_PICTURE_PATH,
  VSPicgoUploadStarter
} from '../utils'

const REG4CUSTOM_OUTPUT_FORMAT = /^\!\[.+\]\(.+\)$/
const REG4CUSTOM_FILE_FORMAT = /^\!\[\d{4}\-\d{2}\-\d{2}]\(.+\)$/

before(async () => {
  const document = await workspace.openTextDocument(TEST_MD_FILE_PATH)
  await window.showTextDocument(document)
})

describe('VSPicgo', async function () {
  it('customOutputFormat should work', async function () {
    this.timeout(1e10)
    PicgoAPI.picgoAPI.setConfig(
      'settings.vsPicgo.customUploadName',
      uploadName.SelectionOrOriginalName
    )
    const res = await VSPicgoUploadStarter({
      args4uploader: [TEST_PICTURE_PATH],
      editor: {
        content: '',
        selection: new Selection(0, 0, 0, 0)
      }
    })
    console.log('customOutputFormat result: ', res)
    assert.equal(REG4CUSTOM_OUTPUT_FORMAT.test(res), true)
  })

  it('customUploadName should work', async function () {
    this.timeout(1e10)
    PicgoAPI.picgoAPI.setConfig(
      'settings.vsPicgo.customUploadName',
      uploadName.Date
    )
    const res = await VSPicgoUploadStarter({
      args4uploader: [TEST_PICTURE_PATH],
      editor: {
        content: '',
        selection: new Selection(0, 0, 0, 0)
      }
    })
    console.log('customUploadName result: ', res)
    assert.equal(REG4CUSTOM_FILE_FORMAT.test(res), true)
  })

  it('selection as fileName should work', async function () {
    this.timeout(1e10)
    PicgoAPI.picgoAPI.setConfig(
      'settings.vsPicgo.customUploadName',
      uploadName.SelectionOrOriginalName
    )
    const res = await VSPicgoUploadStarter({
      args4uploader: [TEST_PICTURE_PATH],
      editor: {
        content: 'TEST',
        selection: new Selection(0, 0, 0, 4)
      }
    })
    console.log('selection as fileName result: ', res)
    assert.equal(res.indexOf('TEST'), 2)
  })
})
