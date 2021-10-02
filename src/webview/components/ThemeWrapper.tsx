import React, { useEffect, useState } from 'react'
import { DefaultTheme } from '@mui/system'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const calculateTheme = () => {
  const body = document.body
  const computedStyle = window.getComputedStyle(body)
  const getPropertyValue = (property: string) =>
    computedStyle.getPropertyValue(property).trim()
  const getPropertyValueFormList = (propertyList: string[]) => {
    for (const property of propertyList) {
      const value = getPropertyValue(property)
      if (value) return value
    }
    return ''
  }
  const fontFamily = getPropertyValueFormList([
    '--vscode-font-family',
    '--vscode-editor-font-family'
  ])
  const fontSize = parseFloat(
    getPropertyValueFormList([
      '--vscode-font-size',
      '--vscode-editor-font-size'
    ])
  )
  const fontWeight = getPropertyValueFormList([
    '--vscode-font-weight',
    '--vscode-editor-font-weight'
  ]) as React.CSSProperties['fontWeight']

  const background = getPropertyValue('--vscode-editor-background')

  return createTheme({
    // See docs at https://mui.com/customization/typography/
    typography: {
      fontFamily,
      fontSize,
      fontWeightRegular: fontWeight
    },
    palette: {
      background: {
        default: background,
        paper: background
      },
      mode: [...document.body.classList].includes('vscode-dark')
        ? 'dark'
        : 'light',
      primary: {
        // `light` & `dark` will auto calculated according to `main`
        main: '#409EFF'
      },
      secondary: {
        main: '#67C23A'
      },
      error: {
        main: getPropertyValue('--vscode-terminal-ansiRed')
      },
      warning: {
        main: getPropertyValue('--vscode-terminal-ansiYellow')
      },
      info: {
        main: getPropertyValue('--vscode-terminal-ansiBlue')
      },
      success: {
        main: getPropertyValue('--vscode-terminal-ansiGreen')
      },
      common: {
        white: getPropertyValue('--vscode-terminal-ansiWhite'),
        black: getPropertyValue('--vscode-terminal-ansiBlack')
      }
    }
  })
}

export const ThemeWrapper: React.FunctionComponent = (props) => {
  const [theme, setTheme] = useState<DefaultTheme | undefined>()

  useEffect(() => {
    const onVSCodeColorThemeChanged = () => {
      const theme = calculateTheme()
      console.log('new theme', theme)
      setTheme(theme)
    }
    const observer = new MutationObserver(onVSCodeColorThemeChanged)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })
    onVSCodeColorThemeChanged()
  }, [])

  return theme ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  ) : null
}
