'use strict';

var path = require('path');
var webpack = require('webpack');
var writeStats = require('./stats-helper').writeStats;
var notifyStats = require('./stats-helper').notifyStats;

var assetsPath = path.resolve(__dirname, '../public/assets');

var WEBPACK_HOST = 'localhost';
var WEBPACK_PORT = parseInt(process.env.PORT, 10) + 1 || 3001;

module.exports = {
  progress: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'main': [
      'webpack-dev-server/client?http://' + WEBPACK_HOST + ':' + WEBPACK_PORT,
      'webpack/hot/only-dev-server',
      './src/webapp/app/index.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: 'http://' + WEBPACK_HOST + ':' + WEBPACK_PORT + '/assets/'
  },
  module: {
    loaders: [
      {
        loader: 'url-loader?limit=100000',
        test: /\.(gif|jpe?g|png|woff|woff2|eot|ttf|svg)$/
      },
      {
        exclude: /node_modules/,
        loaders: ['react-hot-loader', 'babel-loader'],
        test: /\.js$/
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      },
      {
        loaders: ['style-loader', 'css-loader', 'autoprefixer-loader', 'sass-loader'],
        test: /\.(scss|sass)$/
      }
    ]
  },
  plugins: [
    // Hot Reload Plugin
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),
    function() {
      this.plugin('done', notifyStats);
    },
    function() {
      this.plugin('done', writeStats);
    }
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.es6', '.babel'],
    modulesDirectories: ['node_modules', 'src']
  }
};
