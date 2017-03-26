'use strict';

var path = require('path');
var webpack = require('webpack');
var writeStats = require('./stats-helper').writeStats;
var notifyStats = require('./stats-helper').notifyStats;

var assetsPath = path.resolve(__dirname, '../public/assets');

var WEBPACK_HOST = 'localhost';
var WEBPACK_PORT = parseInt(process.env.PORT, 10) + 1 || 3001;

module.exports = {
  //progress: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      'webpack-dev-server/client?http://' + WEBPACK_HOST + ':' + WEBPACK_PORT,
      'webpack/hot/only-dev-server',
      './src/webapp/index.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: 'http://' + WEBPACK_HOST + ':' + WEBPACK_PORT + '/assets/'
  },
  module: {
    rules:[
      {
        test: /\.(gif|jpe?g|png|woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'url-loader?limit=100000'
          },
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'react-hot-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['es2015', 'stage-0', 'react'],
              plugins: ['add-module-exports'],
            }
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'autoprefixer-loader',
          },
          {
            loader: 'sass-loader',
          }
        ]
      }
    ]
  },
  plugins: [
    // Hot Reload Plugin
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // Define variables
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),

    // Stats Control
    function () {
      this.plugin('done', notifyStats);
    },
    function () {
      this.plugin('done', writeStats);
    }
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.es6', '.babel'],
    modules: ['node_modules', 'src']
  }
};
