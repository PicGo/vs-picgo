import Channel from '@luozhu/vscode-channel'
import { IMessageToShow } from '../../utils'
import {
  W2V_GET_WEBVIEW_URI,
  W2V_SHOW_MESSAGE
} from '../../utils/message-method'
import { asyncWrapper } from '.'
export const channel = new Channel()

/**
 * Convert a path in dist folder to vscode webview uri, webview in vscode can only load webview uri paths
 * Simply pass string imported from file loader will not work because local assets in vscode's webview must use vscode's Uri scheme
 * So we use an extra getWebviewUri call to get the Uri path
 */
export const getWebviewUri = async (url: string) =>
  (await channel.call<string, string>(W2V_GET_WEBVIEW_URI, url)).payload

/**
 * Show an message in VSCode bottom-down area
 */
export const showMessage = asyncWrapper(
  async (messageToShow: IMessageToShow) =>
    await channel.call<IMessageToShow>(W2V_SHOW_MESSAGE, messageToShow)
)
