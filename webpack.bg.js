var path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

const options = {
  'extensions': [`js`],
  'context': '/src-bg',
  'exclude': [
    `/node_modules/`,
  ],
}

module.exports = {
  'mode': 'development',
  'entry': './src-bg/index',
  'output': {
    'path': path.resolve(__dirname, './dist-bg'),
    'filename': 'index.js'
  },
  'devtool': 'source-map',
  'plugins': [new ESLintPlugin(options)],
  'module': {
    'rules': [
      {
        'test': /src-bg\/.*\.js$/,
        'exclude': /node_modules/,
        'use': {
          'loader': 'babel-loader',
          'options': {
            'presets': ['@babel/preset-env'],
          }
        }
      },
      {
        'test': /src-bg\/.*\.scss$/,
        'use': [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
