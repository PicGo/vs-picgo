import React from 'react'
import ReactDOM from 'react-dom'
import { showMessage } from './channel'
import { Demo } from './Demo'

import './index.less'

const pages = {
  Demo
}

export const renderApp = (pageId: keyof typeof pages) => {
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
  const App = pages[pageId]
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  )
}
