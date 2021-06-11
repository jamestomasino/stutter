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
              '@babel/preset-env'
            ],
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
  },
  resolve: {
    alias: {
      'markjs': 'mark.js/dist/mark.es6.min.js'
    }
  }
}
