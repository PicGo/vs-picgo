/**
 * Utils that can work in both webview and vscode
 */

export interface IMessageToShow {
  type: 'warning' | 'error' | 'info'
  message: string
}
