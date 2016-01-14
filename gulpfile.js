'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var spawn = require('child_process').spawn;
require('./gulp/task-build-webpack-dev');
require('./gulp/task-build-webpack-prod');

/**
 * Run Web Application Rendering Server in development environement
 * Static files will be bundled and served by Webpack development server to enable hot reload
 */
gulp.task('webapp-dev', ['build-webpack-dev'], function () {
  var developmentEnv = _.cloneDeep(process.env);
  developmentEnv.NODE_ENV = 'development';
  developmentEnv.BROWSER = false;
  spawn('nodemon', ['-w', 'src/common', '-w', 'src/webapp', 'webapp-server.js'], {
    env: developmentEnv,
    stdio: 'inherit'
  });
});

/**
 * Run Web Application Rendering Server in production environment
 * Static files will be bundled by Webpack and served by the rendering server
 */
gulp.task('webapp-prod', ['build-webpack-prod'], function () {
  var productionEnv = _.cloneDeep(process.env);
  productionEnv.NODE_ENV = 'production';
  productionEnv.BROWSER = false;
  spawn('node', ['webapp-server.js'], {
    env: productionEnv,
    stdio: 'inherit'
  });
});

/**
 * Run API Server in development environment
 */
gulp.task('api-dev', function () {
  var developmentEnv = _.cloneDeep(process.env);
  developmentEnv.NODE_ENV = 'development';
  spawn('nodemon', ['-w', 'src/common', '-w', 'src/api', 'api-server.js'], {
    env: developmentEnv,
    stdio: 'inherit'
  });
});

/**
 * Run API Server in production environment
 */
gulp.task('api-prod', function () {
  var productionEnv = _.cloneDeep(process.env);
  productionEnv.NODE_ENV = 'production';
  spawn('node', ['api-server.js'], {
    env: productionEnv,
    stdio: 'inherit'
  });
});

/**
 * Run PM2 to run both server for deployed environment
 */
gulp.task('pm2', ['build-webpack-prod'], function () {
  spawn('pm2', ['start', 'processes.json'], {
    stdio: 'inherit'
  });
});

/**
 * Bundle and build static web application files
 */
gulp.task('build', ['build-webpack-prod']);

/**
 * Default task
 */
gulp.task('default', ['build']);
