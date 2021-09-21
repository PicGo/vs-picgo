import React from 'react'
import ReactDOM from 'react-dom'

import './index.less'

export const renderApp = (App: React.ComponentType) => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
