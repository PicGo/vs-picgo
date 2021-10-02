import vscode from 'vscode'
import { W2VMessage } from '../utils/message-method'
import { IMessageToShow } from '../utils'
import { showMessage } from './utils'
import Channel from '@luozhu/vscode-channel'
import path from 'path'
import { PanelManager } from './PanelManager'
import VSPicgo from '.'

/**
 * Each Webview has a different channel connected to vscode, so we should call `getChannel` to create a channel for one webview
 */
export const getChannel = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel
) => {
  const channel = new Channel(context, panel)

  channel.bind<string, string>(W2VMessage.GET_WEBVIEW_URI, async (message) => {
    return panel.webview
      .asWebviewUri(
        vscode.Uri.file(
          path.join(
            context.extensionPath,
            PanelManager.WEBVIEW_FOLDER,
            message.params
          )
        )
      )
      .toString()
  })

  channel.bind<IMessageToShow>(W2VMessage.SHOW_MESSAGE, (message) =>
    showMessage(message.params)
  )

  channel.bind<string[], any>(W2VMessage.UPLOAD_FILES, async (message) => {
    const files = message.params
    return await VSPicgo.vspicgo.upload(files)
  })

  return channel
}
