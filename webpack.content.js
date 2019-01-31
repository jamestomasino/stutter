var path = require('path')

module.exports = {
  'mode': 'development',
  'entry': './src-content/index',
  'output': {
    'path': path.resolve(__dirname, './dist-content'),
    'filename': 'index.js'
  },
  'devtool': 'source-map',
  'module': {
    'rules': [
      {
        'enforce': 'pre',
        'test': /src-content\/.*\.js$/,
        'exclude': /node_modules/,
        'use': 'eslint-loader'
      },
      {
        'test': /src-content\/.*\.js$/,
        'exclude': /node_modules/,
        'use': {
          'loader': 'babel-loader',
          'options': {
            'presets': [
              'env'
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        'test': /src-content\/.*\.scss$/,
        'use': [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
