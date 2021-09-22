import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import { showMessage } from './channel'

import './Demo.less'

export const Demo = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    showMessage({
      type: 'info',
      message: 'Hello from webview Demo page'
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img alt="logo" className="App-logo" src={logo} />
        <p>Hello esbuild + React!</p>
        <p>
          <button onClick={() => setCount((count) => count + 1)} type="button">
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test browser-sync updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            rel="noopener noreferrer"
            target="_blank">
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://github.com/upupming/esbuild-react-less"
            rel="noopener noreferrer"
            target="_blank">
            esbuild-react-less
          </a>
        </p>
      </header>
    </div>
  )
}
