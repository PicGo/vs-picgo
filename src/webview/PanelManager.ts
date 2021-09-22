import vscode from 'vscode'
import path from 'path'
import pupa from 'pupa'
import templateHtml from 'inline:./template.html'
import logo from './images/squareLogo.png'
import Channel from '@luozhu/vscode-channel'
import { W2V_GET_WEBVIEW_URI, W2V_SHOW_MESSAGE } from './message-method'
import { showMessage } from '../vs-picgo/utils'
import { IMessageToShow } from '../utils'

/**
 * Type of variables that will be passed to the html template
 */
export interface IHtmlConfig {
  pageId: string
  jsSrc: string
  cssHref: string
  vscodeEnv: string
}

/**
 * Manage all webview pages in one panel manager
 */
export class PanelManager {
  context: vscode.ExtensionContext
  pageId2WebviewPanel: Map<string, [vscode.WebviewPanel, Channel]>
  static WEBVIEW_FOLDER = 'dist/webview'
  static DIST_FOLDER = 'dist'
  constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.pageId2WebviewPanel = new Map()
  }

  /**
   *
   * @param webview The webview container
   * @param pageId The id of the page respect to in webview/pages/pageId.tsx
   * @returns Html constructed for this page
   */
  getPageHtml(webview: vscode.Webview, pageId: string) {
    const webviewIndex = path.join(
      this.context.extensionPath,
      PanelManager.WEBVIEW_FOLDER,
      'index'
    )
    const getUriStr = (type: string) =>
      webview
        .asWebviewUri(vscode.Uri.file(`${webviewIndex}.${type}`))
        .toString()
    const htmlConfig: IHtmlConfig = {
      pageId: pageId,
      jsSrc: getUriStr('js'),
      cssHref: getUriStr('css'),
      vscodeEnv: JSON.stringify(vscode.env)
    }
    return pupa(templateHtml, htmlConfig)
  }

  getViewType(pageId: string) {
    return `vs-picgo:${pageId}`
  }

  createOrShowWebviewPanel(pageId: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    // If we already have a panel, show it.
    if (this.pageId2WebviewPanel.has(pageId)) {
      this.pageId2WebviewPanel.get(pageId)?.[0].reveal(column)
      return
    }
    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      this.getViewType(pageId),
      pageId,
      column ?? vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `dist` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(
            this.context.extensionUri,
            PanelManager.DIST_FOLDER
          )
        ],
        retainContextWhenHidden: true
      }
    )
    panel.iconPath = vscode.Uri.parse(logo)
    panel.webview.html = this.getPageHtml(panel.webview, pageId)
    panel.onDidDispose(
      () => {
        this.pageId2WebviewPanel.delete(pageId)
      },
      null,
      this.context.subscriptions
    )

    const channel = new Channel(this.context, panel)
    channel.bind<string, string>(W2V_GET_WEBVIEW_URI, async (message) => {
      return panel.webview
        .asWebviewUri(
          vscode.Uri.file(
            path.join(
              this.context.extensionPath,
              PanelManager.WEBVIEW_FOLDER,
              message.params
            )
          )
        )
        .toString()
    })
    channel.bind<IMessageToShow>(W2V_SHOW_MESSAGE, (message) =>
      showMessage(message.params)
    )

    this.pageId2WebviewPanel.set(pageId, [panel, channel])
  }
}
