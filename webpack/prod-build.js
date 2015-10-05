'use strict';

var webpack = require('webpack');

module.exports = function(webpackConfig, callback) {
  webpack(webpackConfig, function(fatalError, stats) {
    var jsonStats = stats.toJson();
    var buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0];

    if (buildError) {
      console.error(buildError);
    }

    console.log(stats.toString({
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }));

    callback();
  });
};
