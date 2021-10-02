import React, { useEffect } from 'react'
import logo from '../../../images/roundLogo.png'
import { showMessage } from '../../utils/channel'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { RootState, store, Dispatch } from './store'

import './index.less'

function Counter() {
  const common = useSelector((state: RootState) => state.common)
  const dispatch = useDispatch<Dispatch>()

  return (
    <div>
      <div>{common.count}</div>
      <button onClick={() => dispatch.common.countUp()}>Add</button>
      <button onClick={() => dispatch.common.countDown()}>Minus</button>
    </div>
  )
}

export const Demo = () => {
  useEffect(() => {
    showMessage({
      type: 'info',
      message: 'Hello from webview Demo page'
    })
  }, [])

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img alt="logo" className="App-logo" src={logo} />
          <p>Hello esbuild + React!</p>
          <Counter />
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
    </Provider>
  )
}
