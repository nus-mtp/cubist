'use strict';

var gulp = require('gulp');
var gulpScssLint = require('gulp-scss-lint');

gulp.task('scsslint', function() {
  return gulp.src([
      'src/webapp/app/styles/**/*.scss'
    ])
    .pipe(gulpScssLint({'config': '.scss-lint.yml'}))
    .pipe(gulpScssLint.failReporter())
});
