const path = require('path')
const express = require('express')

module.exports = (env, argv) => {
  const isProduction = argv && argv['mode'] === 'production'

  return {
    entry: './src/index.ts',
    devtool: isProduction ? 'cheap-module-source-map' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          },
          include: path.resolve(__dirname, 'src')
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: 'file-loader' }]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build')
    },
    devServer: {
      compress: true,
      port: 8080,
      contentBase: path.resolve('build'),
      before(app) {
        app.use('/common', express.static('common'))
      }
    }
  }
}