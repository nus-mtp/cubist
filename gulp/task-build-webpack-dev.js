'use strict';

var gulp = require('gulp');
var webpackDevConfig = require('../webpack/dev-config');
var webpackDevServer = require('../webpack/dev-server');

gulp.task('build-webpack-dev', function(callback) {
  webpackDevServer(webpackDevConfig, callback);
});
