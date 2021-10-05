import * as vscode from 'vscode'
import { CommandManager } from './vscode/CommandManager'
import { PanelManager } from './vscode/PanelManager'

export async function activate(context: vscode.ExtensionContext) {
  PanelManager.bindContext(context)
  const panelManager = PanelManager.panelManager

  const disposable = [
    vscode.commands.registerCommand(
      'picgo.uploadImageFromClipboard',
      async () => await CommandManager.commandManager.uploadImageFromClipboard()
    ),
    vscode.commands.registerCommand(
      'picgo.uploadImageFromExplorer',
      async () => await CommandManager.commandManager.uploadImageFromExplorer()
    ),
    vscode.commands.registerCommand(
      'picgo.uploadImageFromInputBox',
      async () => await CommandManager.commandManager.uploadImageFromInputBox()
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

  return context
}

export function deactivate() {}
