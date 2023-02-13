import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { Editor } from './Editor'
import { PicgoAPI } from './PicgoAPI'
import { PicgoAddon } from './PicgoAddon'
import { showError } from './utils'

export class CommandManager {
  static commandManager: CommandManager = new CommandManager()

  async uploadCommand(input?: string[]) {
    const pluginName = 'vspicgo'
    PicgoAPI.picgoAPI.setCurrentPluginName(pluginName)
    const [id, plugin] = PicgoAddon.picgoAddon.beforeUploadPlugin()
    PicgoAPI.picgoAPI.picgo.helper.beforeUploadPlugins.register(id, plugin)

    const output = await PicgoAPI.picgoAPI.upload(input)
    PicgoAPI.picgoAPI.picgo.helper.beforeUploadPlugins.unregister(pluginName)

    // error has been handled in picgoAPI.upload
    if (!output) return

    const outputString = PicgoAddon.picgoAddon.outputToString(output)

    vscode.env.clipboard.writeText(outputString)
    await Editor.writeToEditor(outputString)
    return outputString
  }

  async uploadImageFromClipboard() {
    this.uploadCommand()
  }

  async uploadImageFromExplorer() {
    const result = await vscode.window.showOpenDialog({
      filters: {
        Images: [
          'png',
          'jpg',
          'jpeg',
          'webp',
          'gif',
          'bmp',
          'tiff',
          'ico',
          'svg'
        ]
      },
      canSelectMany: true
    })

    if (result != null) {
      const input = result.map((item) => item.fsPath)
      this.uploadCommand(input)
    }
  }

  async uploadImageFromInputBox() {
    let result = await vscode.window.showInputBox({
      placeHolder: 'Please input an image location path'
    })
    // check if `result` is a path of image file
    const imageReg = /\.(png|jpg|jpeg|webp|gif|bmp|tiff|ico|svg)$/
    if (result && imageReg.test(result)) {
      result = path.isAbsolute(result)
        ? result
        : path.join(Editor.editor?.document.uri.fsPath ?? '', '../', result)
      if (fs.existsSync(result)) {
        return await this.uploadCommand([result])
      } else {
        showError('No such image.')
      }
    } else {
      showError('No such image.')
    }
  }
}
