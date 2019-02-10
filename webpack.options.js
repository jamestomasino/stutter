var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  'mode': 'development',
  'entry': './src-options/index',
  'output': {
    'path': path.resolve(__dirname, './dist-options'),
    'filename': 'index.js'
  },
  'plugins': [
    new HtmlWebpackPlugin({
      title: 'Stutter options',
      template: './src-options/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  'devtool': 'source-map',
  'module': {
    'rules': [
      {
        'enforce': 'pre',
        'test': /src-options\/.*\.js$/,
        'exclude': /node_modules/,
        'use': 'eslint-loader'
      },
      {
        'test': /src-options\/.*\.js$/,
        'exclude': /node_modules/,
        'use': {
          'loader': 'babel-loader',
          'options': {
            'presets': [
              '@babel/preset-env'
            ],
          }
        }
      },
      {
        'test': /src-options\/.*\.scss$/,
        'use': [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
