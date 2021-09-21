import React, { useState } from 'react'
import Logo from './logo.svg'
import { renderApp } from '../render'
import { getWebviewUri } from '.'
import { useAsync } from 'react-use'

import './Demo.less'

export const Welcome = () => {
  const [count, setCount] = useState(0)

  // Simply pass `Logo` string imported from file loader will not work because local assets in vscode's webview must use vscode's Uri schema
  // So we use an extra getWebviewUri call to get the Uri path
  const [logo, setLogo] = useState<string>('')
  useAsync(async () => {
    setLogo(await getWebviewUri(Logo))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {logo ? <img alt="logo" className="App-logo" src={logo} /> : null}
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

renderApp(Welcome)
