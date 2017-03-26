'use strict';

var path = require('path');
var webpack = require('webpack');
var writeStats = require('./stats-helper').writeStats;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var assetsPath = path.join(__dirname, '../public/assets');

module.exports = {
  //progress: true,
  devtool: 'source-map',
  entry: {
    main: './src/webapp/index.js'
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.(gif|jpe?g|png|woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          {
            loader: 'url-loader?limit=100000',
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-0', 'react'],
              plugins: ['add-module-exports'],
            },
          },
		    ],
      },
      {
         test: /\.(css|scss|sass)$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            loader: ['css-loader', 'autoprefixer-loader', 'sass-loader']
            }),
      }
    ]
  },
  plugins: [
    // Prevent inline css require in entry chunk
    new ExtractTextPlugin('[name]-[hash].css'),

    // Ignore dev configuration
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // Define variables
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true)
      }
    }),

    // Stats Control
    function () {
      this.plugin('done', writeStats);
    }
  ],
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.es6', '.babel'],
    modules: ['node_modules', 'src']
  },
	stats: {
	errorDetails: true
	}
};
