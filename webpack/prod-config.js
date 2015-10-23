'use strict';

var path = require('path');
var webpack = require('webpack');
var writeStats = require('./stats-helper').writeStats;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var assetsPath = path.join(__dirname, '../public/assets');

module.exports = {
  progress: true,
  devtool: 'source-map',
  entry: {
    'main': './src/webapp/app/index.js'
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        loader: 'url-loader?limit=100000',
        test: /\.(gif|jpe?g|png|woff|woff2|eot|ttf|otf|svg)$/
      },
      {
        exclude: /node_modules/,
        loaders:
          [
            'babel-loader'
          ],
        test: /\.js$/
      },
      {
        loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass'),
        test: /\.(scss|sass)$/
      }
    ]
  },
  plugins: [
    // Prevent inline css require in entry chunk
    new ExtractTextPlugin('[name]-[hash].css'),
    // Ignore dev configuration
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    // Global Vars Definition
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true)
      }
    }),
    // Optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    function() {
      this.plugin('done', writeStats);
    }
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.es6', '.babel'],
    modulesDirectories: ['node_modules', 'src']
  }
};
