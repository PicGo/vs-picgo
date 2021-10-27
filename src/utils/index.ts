/**
 * Utils that can work in both webview and vscode
 */

export interface IMessageToShow {
  type: 'warning' | 'error' | 'info'
  message: string
}

export const isUrlEncode = (url: string): boolean => {
  url = url || ''
  try {
    return url !== decodeURI(url)
  } catch (e) {
    // if some error caught, try to let it go
    return true
  }
}

export const handleUrlEncode = (url: string): string => {
  if (!isUrlEncode(url)) {
    url = encodeURI(url)
  }
  return url
}
