var path = require('path')

module.exports = {
  'mode': 'development',
  'entry': './src-bg/index',
  'output': {
    'path': path.resolve(__dirname, './dist-bg'),
    'filename': 'index.js'
  },
  'devtool': 'source-map',
  'module': {
    'rules': [
      {
        'enforce': 'pre',
        'test': /src-bg\/.*\.js$/,
        'exclude': /node_modules/,
        'use': 'eslint-loader'
      },
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
