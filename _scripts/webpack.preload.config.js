const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'
const whiteListedModules = []

const config = {
  name: 'preload',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? '#cheap-module-eval-source-map' : false,
  entry: {
    preload: path.join(__dirname, '../src/renderer/preload/index.js'),
    fakeBiliBridge: path.join(__dirname, '../src/renderer/preload/fakeBiliBridge.js'),
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  externals: externals.filter(d => !whiteListedModules.includes(d)),
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  node: {
    __dirname: isDevMode,
    __filename: isDevMode,
  },
  plugins: [],
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/')
    },
    extensions: ['.ts', '.js', '.json'],
  },
  target: 'electron-renderer',
}

/**
 * Adjust rendererConfig for production settings
 */
// if (isDevMode) {
//   // any dev only config
//   config.plugins.push(
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.DefinePlugin({
//       __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
//     })
//   )
// } else {
//   config.plugins.push(
//     new CopyWebpackPlugin([
//       {
//         from: path.join(__dirname, '../static'),
//         to: path.join(__dirname, '../dist/static'),
//         ignore: ['.*'],
//       },
//     ]),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true,
//     })
//   )
// }

module.exports = config
