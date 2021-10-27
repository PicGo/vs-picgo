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
import { HashRouter, Switch } from 'react-router-dom'

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

  const App = pages[pageId]
  ReactDOM.unmountComponentAtNode(root)
  ReactDOM.render(
    <React.StrictMode>
      <HashRouter>
        <Switch>
          <ThemeWrapper>
            <App />
          </ThemeWrapper>
        </Switch>
      </HashRouter>
    </React.StrictMode>,
    root
  )
}
