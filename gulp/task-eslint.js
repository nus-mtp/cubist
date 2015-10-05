'use strict';

var gulp = require('gulp');
var gulpEslint = require('gulp-eslint');

gulp.task('eslint', function() {
  return gulp.src([
      'src/**/*.js'
    ])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError());
});
