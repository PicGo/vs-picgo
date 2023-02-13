import Channel from '@luozhu/vscode-channel'
import { IMessageToShow } from '../../utils'
import { W2VMessage } from '../../utils/message-method'
import { IImgInfo } from 'picgo'
import type { IUploaderConfig, PicgoAPI } from '../../vscode/PicgoAPI'
import type { IPicGoSettings } from '../../vscode/settings'

export const channel = new Channel()

/**
 * Convert a path in dist folder to vscode webview uri, webview in vscode can only load webview uri paths
 * Simply pass string imported from file loader will not work because local assets in vscode's webview must use vscode's Uri scheme
 * So we use an extra getWebviewUri call to get the Uri path
 */
export const getWebviewUri = async (url: string) =>
  await channel.call<string, string>(W2VMessage.GET_WEBVIEW_URI, url)

/**
 * Show an message in VSCode bottom-down area
 */
export const showMessage = async (messageToShow: IMessageToShow) =>
  await channel.call<IMessageToShow>(W2VMessage.SHOW_MESSAGE, messageToShow)

export const uploadFiles = async (files: string[]) =>
  await channel.call<string[], IImgInfo[]>(W2VMessage.UPLOAD_FILES, files)

/** Execute extension commands */
export const executeCommand = async (command: string) =>
  await channel.call(W2VMessage.EXECUTE_COMMAND, command)

/** Get all picgo uploaders */
export const getAllUploaders = async () =>
  await channel.call<unknown, string[]>(W2VMessage.GET_ALL_UPLOADERS)

/** Get all picgo uploaders' config */
export const getAllUploaderConfigs = async () =>
  await channel.call<unknown, IUploaderConfig[]>(
    W2VMessage.GET_ALL_UPLOADER_CONFIGS
  )

/** Set picgo config */
export const setConfig = async (...args: Parameters<PicgoAPI['setConfig']>) =>
  await channel.call(W2VMessage.SET_CONFIG, args)

/**
 * Reveal a file in system file explorer
 */
export const revealFileInOS = async (path: string) => {
  return await channel.call(W2VMessage.REVEAL_FILE_IN_OS, path)
}

/** Get picgo configurations and settings */
export const getPicGoSettings = () =>
  channel.call<unknown, IPicGoSettings>(W2VMessage.GET_PICGO_SETTINGS)
