'use strict'
import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import VSPicgo from './vs-picgo'
import { PanelManager } from './vs-picgo/PanelManager'

async function uploadImageFromClipboard(vspicgo: VSPicgo) {
  return await vspicgo.upload()
}

async function uploadImageFromExplorer(vspicgo: VSPicgo) {
  const result = await vscode.window.showOpenDialog({
    filters: {
      Images: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg']
    },
    canSelectMany: true
  })

  if (result != null) {
    const input = result.map((item) => item.fsPath)
    return vspicgo.upload(input)
  }
}

async function uploadImageFromInputBox(vspicgo: VSPicgo) {
  let result = await vscode.window.showInputBox({
    placeHolder: 'Please input an image location path'
  })
  // check if `result` is a path of image file
  const imageReg = /\.(png|jpg|jpeg|webp|gif|bmp|tiff|ico|svg)$/
  if (result && imageReg.test(result)) {
    result = path.isAbsolute(result)
      ? result
      : path.join(vspicgo.editor?.document.uri.fsPath ?? '', '../', result)
    if (fs.existsSync(result)) {
      return await vspicgo.upload([result])
    } else {
      await vscode.window.showErrorMessage('No such image.')
    }
  } else {
    await vscode.window.showErrorMessage('No such image.')
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const vspicgo = VSPicgo.vspicgo
  PanelManager.bindContext(context)
  const panelManager = PanelManager.panelManager
  const disposable = [
    vscode.commands.registerCommand(
      'picgo.uploadImageFromClipboard',
      async () => await uploadImageFromClipboard(vspicgo)
    ),
    vscode.commands.registerCommand(
      'picgo.uploadImageFromExplorer',
      async () => await uploadImageFromExplorer(vspicgo)
    ),
    vscode.commands.registerCommand(
      'picgo.uploadImageFromInputBox',
      async () => await uploadImageFromInputBox(vspicgo)
    ),

    vscode.commands.registerCommand('picgo.webviewDemo', () =>
      panelManager.createOrShowWebviewPanel('Demo')
    ),
    vscode.commands.registerCommand('picgo.webviewPicGoControlPanel', () =>
      panelManager.createOrShowWebviewPanel('PicGoControlPanel')
    )
  ]
  context.subscriptions.push(...disposable)

  if (process.env.NODE_ENV === 'development') {
    panelManager.createOrShowWebviewPanel('PicGoControlPanel')
  }
}

export function deactivate() {}
