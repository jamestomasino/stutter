const path = require('path')

const options = {
  extensions: ['js'],
  context: '/src-bg',
  exclude: [
    '/node_modules/',
  ],
}

module.exports = {
  mode: 'development',
  entry: {
    index: './src-bg/index',
  },
  output: {
    path: path.resolve(__dirname, './dist-bg'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /src-bg\/.*\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test: /src-bg\/.*\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
