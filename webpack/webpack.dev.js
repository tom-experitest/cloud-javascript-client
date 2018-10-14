const webpack = require("webpack");
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    mocha: path.join(__dirname, '../src/test/browser/mocha.setup.ts'),
    test: path.join(__dirname, '../src/test/browser/test.ts'),
  },
  output: {
    path: path.join(__dirname, '../web-test'),
    filename: 'js/[name].js'
  },
  devServer: {
    port: 5000    
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              outputPath: 'css/'
              // name is configured in MiniCssExtrcatPlugin under plugins.
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              // publicPath: '../css/'
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  mode: 'development',
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      filename: 'test/run.html',
      chunks: ['mocha', 'test'],
      template: 'src/test/browser/run.html'
    })
  ]
};
