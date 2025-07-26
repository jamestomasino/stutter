const path = require('path')

const options = {
  extensions: ['js'],
  context: '/src-content',
  exclude: [
    '/node_modules/',
  ],
}

module.exports = {
  mode: 'development',
  entry: './src-content/index',
  output: {
    path: path.resolve(__dirname, './dist-content'),
    filename: 'index.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /src-content\/.*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test: /src-content\/.*\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      markjs: 'mark.js/dist/mark.es6.min.js'
    }
  }
}
