/**
 * This script will be loaded by the template html used in webview, see PanelManager.getPageHtml
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { showMessage } from '../utils/channel'
import { Demo } from './Demo'
import { PicGoControlPanel } from './PicGoControlPanel'
import { PageId } from '../../utils/page'
import { ThemeWrapper } from '../components/ThemeWrapper'

import './index.less'

const pages = {
  Demo,
  PicGoControlPanel
}

export const renderApp = (pageId: PageId) => {
  const root = document.getElementById('root')
  if (!root) {
    showMessage({
      type: 'error',
      message:
        '#root element not found in Webview html template, cannot mount React App!'
    })
    return
  }

  ReactDOM.unmountComponentAtNode(root)
  ReactDOM.render(
    <React.StrictMode>
      <ThemeWrapper App={pages[pageId]} />
    </React.StrictMode>,
    root
  )
}
