'use strict';

var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

module.exports = function(webpackConfig, callback) {
  var WEBPACK_HOST = process.env.HOST || 'localhost';
  var WEBPACK_PORT = parseInt(process.env.PORT, 10) + 1 || 3001;

  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: 'http://' + WEBPACK_HOST + ':' + WEBPACK_PORT,
    quiet: true,
    noInfo: true,
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }).listen(WEBPACK_PORT, WEBPACK_HOST, function(err) {
    if (err) {
      console.error(err);
    }
    callback();
  });
};
