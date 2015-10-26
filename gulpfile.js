'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var spawn = require('child_process').spawn;
require('./gulp/task-eslint');
require('./gulp/task-sasslint');
require('./gulp/task-build-webpack-dev');
require('./gulp/task-build-webpack-prod');

gulp.task('webapp-dev', ['build-webpack-dev'], function() {
  var developmentEnv = _.cloneDeep(process.env);
  developmentEnv.NODE_ENV = 'development';
  developmentEnv.BROWSER = false;
  spawn('nodemon', ['webapp-server.js'], {
    env: developmentEnv,
    stdio: 'inherit'
  });
});

gulp.task('webapp-prod', ['build-webpack-prod'], function() {
  var productionEnv = _.cloneDeep(process.env);
  productionEnv.NODE_ENV = 'production';
  productionEnv.BROWSER = false;
  spawn('node', ['webapp-server.js'], {
    env: productionEnv,
    stdio: 'inherit'
  });
});

gulp.task('api-dev', function() {
  var developmentEnv = _.cloneDeep(process.env);
  developmentEnv.NODE_ENV = 'development';
  spawn('nodemon', ['api-server.js'], {
    env: developmentEnv,
    stdio: 'inherit'
  });
});

gulp.task('api-prod', function() {
  var productionEnv = _.cloneDeep(process.env);
  productionEnv.NODE_ENV = 'production';
  spawn('node', ['api-server.js'], {
    env: productionEnv,
    stdio: 'inherit'
  });
});

gulp.task('pm2', ['build-webpack-prod'], function() {
  spawn('pm2', ['start', 'processes.json'], {
    stdio: 'inherit'
  });
});

gulp.task('build', ['build-webpack-prod']);
gulp.task('default', ['build']);
