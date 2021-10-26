import vscode from 'vscode'
import pupa from 'pupa'
import templateHtml from 'inline:./template.html'
import logo from '../images/squareLogo.png'
import Channel from '@luozhu/vscode-channel'
import path from 'path'
import { PageId, pageMap } from '../utils/page'
import { getChannel } from './utils/channel'

/**
 * Type of variables that will be passed to the html template
 */
export interface IHtmlConfig {
  pageId: PageId
  jsSrc: string
  cssHref: string
}

/**
 * Manage all webview pages in one panel manager
 */
export class PanelManager {
  static panelManager: PanelManager
  static bindContext(context: vscode.ExtensionContext) {
    this.panelManager = new PanelManager(context)
  }

  context: vscode.ExtensionContext
  pageId2WebviewPanel: Map<string, [vscode.WebviewPanel, Channel]>
  static WEBVIEW_FOLDER = 'dist/webview'
  static DIST_FOLDER = 'dist'
  private constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.pageId2WebviewPanel = new Map()
  }

  /**
   *
   * @param webview The webview container
   * @param pageId The id of the page respect to in webview/pages/pageId.tsx
   * @returns Html constructed for this page
   */
  getPageHtml(webview: vscode.Webview, pageId: PageId) {
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
      cssHref: getUriStr('css')
    }
    return pupa(templateHtml, htmlConfig)
  }

  getViewType(pageId: PageId) {
    return `vs-picgo:${pageId}`
  }

  getTitle(pageId: PageId) {
    return pageMap[pageId]
  }

  createOrShowWebviewPanel(pageId: PageId) {
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
      this.getTitle(pageId),
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

    this.pageId2WebviewPanel.set(pageId, [
      panel,
      // Each Webview has a associated channel
      getChannel(this.context, panel)
    ])
  }
}
