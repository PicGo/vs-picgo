/**
 * message method from webview to vscode
 */
export enum W2VMessage {
  GET_WEBVIEW_URI = 'GET_WEBVIEW_URI',
  SHOW_MESSAGE = 'SHOW_MESSAGE',
  UPLOAD_FILES = 'UPLOAD_FILES',
  EXECUTE_COMMAND = 'EXECUTE_COMMAND'
}

/**
 * message method from vscode to webview
 */
export enum V2WMessage {}
