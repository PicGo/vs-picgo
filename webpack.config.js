// @ts-check
'use strict'

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

/** @type {import('webpack').Configuration} */
const config = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  node: {
    // See https://webpack.js.org/configuration/node/#node__dirname
    __dirname: 'mock'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'node_modules/picgo/dist/utils/clipboard/*',
        to: 'clipboard',
        flatten: true
      }
    ])
  ]
}

module.exports = config
