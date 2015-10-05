'use strict';

var gulp = require('gulp');
var webpackProdConfig = require('../webpack/prod-config');
var webpackProdBuild = require('../webpack/prod-build');

gulp.task('build-webpack-prod', function(callback) {
  webpackProdBuild(webpackProdConfig, callback);
});
