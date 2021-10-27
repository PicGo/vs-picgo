import vscode from 'vscode'
import { W2VMessage } from '../../utils/message-method'
import { IMessageToShow } from '../../utils'
import { showMessage } from '.'
import Channel from '@luozhu/vscode-channel'
import path from 'path'
import { PanelManager } from '../PanelManager'
import { CommandManager } from '../CommandManager'
import { PicgoAPI } from '../PicgoAPI'

/**
 * Each Webview has a different channel connected to vscode, so we should call `getChannel` to create a channel for one webview
 */
export const getChannel = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel
) => {
  const channel = new Channel(context, panel)

  channel.bind<string, string>(W2VMessage.GET_WEBVIEW_URI, async (filename) => {
    return panel.webview
      .asWebviewUri(
        vscode.Uri.file(
          path.join(
            context.extensionPath,
            PanelManager.WEBVIEW_FOLDER,
            filename
          )
        )
      )
      .toString()
  })

  channel.bind<IMessageToShow>(W2VMessage.SHOW_MESSAGE, (msg) =>
    showMessage(msg)
  )

  channel.bind<string[], any>(W2VMessage.UPLOAD_FILES, async (files) => {
    return await CommandManager.commandManager.uploadCommand(files)
  })

  channel.bind<string, any>(W2VMessage.EXECUTE_COMMAND, async (command) => {
    return await vscode.commands.executeCommand(command)
  })

  channel.bind(W2VMessage.GET_ALL_UPLOADERS, () => {
    return PicgoAPI.picgoAPI.getAllUploaders()
  })
  channel.bind(W2VMessage.GET_ALL_UPLOADER_CONFIGS, () => {
    return PicgoAPI.picgoAPI.getAllUploaderConfigs()
  })

  channel.bind<Parameters<PicgoAPI['setConfig']>>(
    W2VMessage.SET_CONFIG,
    (request) => {
      return PicgoAPI.picgoAPI.setConfig(...request)
    }
  )

  return channel
}
