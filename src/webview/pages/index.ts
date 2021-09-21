import Channel from '@luozhu/vscode-channel'
import { W2V_GET_WEBVIEW_URI } from '../message-method'
export const channel = new Channel()

export const getWebviewUri = async (url: string) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (await channel.call<string, string>(W2V_GET_WEBVIEW_URI, url)).payload
