/* eslint-disable no-useless-escape */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-undef */
import * as assert from 'assert'
import { workspace, window, Selection } from 'vscode'

import VSPicgo from '../../src/vs-picgo'

import {
  DEFAULT_CONFIGS,
  IVSPicgoConfiguration,
  IVSPicgoConfigurationKeys,
  TEST_MD_FILE_PATH,
  TEST_PICTURE_PATH,
  VSPicgoUploadStarter
} from '../utils'

const vspicgo = new VSPicgo()
const previousConfigs: IVSPicgoConfiguration = Object.assign(
  {},
  DEFAULT_CONFIGS
)

const configKeys = Object.keys(previousConfigs)

const REG4CUSTOM_OUTPUT_FORMAT = /^\!\[.+\]\(.+\)$/
const REG4CUSTOM_FILE_FORMAT = /^\!\[\d{4}\-\d{2}\-\d{2}]\(.+\)$/

before(async () => {
  const document = await workspace.openTextDocument(TEST_MD_FILE_PATH)
  await window.showTextDocument(document)
})

describe('VSPicgo', async function () {
  beforeEach(() => {
    // save old configuration info
    for (const section of configKeys) {
      previousConfigs[
        section as IVSPicgoConfigurationKeys
      ] = workspace.getConfiguration('', null).get(section)
    }
  })

  afterEach(async function () {
    for (const section of configKeys) {
      await workspace
        .getConfiguration('', null)
        .update(
          section,
          previousConfigs[section as IVSPicgoConfigurationKeys],
          true
        )
    }
  })

  it('customOutputFormat should work', async function () {
    this.timeout(30000)
    const res = await VSPicgoUploadStarter({
      args4uploader: [TEST_PICTURE_PATH],
      configuration: {
        'picgo.customOutputFormat': '![${uploadedName}](${url})'
      },
      editor: {
        content: '',
        selection: new Selection(0, 0, 0, 0)
      },
      vspicgo
    })
    console.log('customOutputFormat result: ' + res)
    assert.equal(REG4CUSTOM_OUTPUT_FORMAT.test(res), true)
  })

  it('customUploadName should work', async function () {
    this.timeout(30000)
    const res = await VSPicgoUploadStarter({
      args4uploader: [TEST_PICTURE_PATH],
      configuration: {
        'picgo.customUploadName': '${date}${extName}'
      },
      editor: {
        content: '',
        selection: new Selection(0, 0, 0, 0)
      },
      vspicgo
    })
    console.log('customUploadName result: ' + res)
    assert.equal(REG4CUSTOM_FILE_FORMAT.test(res), true)
  })

  it('selection as fileName should work', async function () {
    this.timeout(30000)
    const res = await VSPicgoUploadStarter({
      args4uploader: [TEST_PICTURE_PATH],
      configuration: {},
      editor: {
        content: 'TEST',
        selection: new Selection(0, 0, 0, 4)
      },
      vspicgo
    })
    console.log('selection as fileName result: ' + res)
    assert.equal(res.indexOf('TEST'), 2)
  })
})
