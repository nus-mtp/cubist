'use strict';

var gulp = require('gulp');
var gulpSassLint = require('gulp-sass-lint');

gulp.task('sasslint', function() {
  return gulp.src('src/webapp/app/styles/**/*.s+(a|c)ss')
    .pipe(gulpSassLint())
    .pipe(gulpSassLint.format())
    .pipe(gulpSassLint.failOnError());
});
