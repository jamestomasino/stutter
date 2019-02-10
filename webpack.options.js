var path = require('path')

module.exports = {
  'mode': 'development',
  'entry': './src-options/index',
  'output': {
    'path': path.resolve(__dirname, './dist-options'),
    'filename': 'index.js'
  },
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
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
