var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

require('./tasks/reference')(gulp);
require('@spectrum/spectrum-gulp-gh-pages')(gulp);
require('@spectrum/spectrum-gulp-release')(gulp);

gulp.task('clean', function() {
  return del('dist/**');
});

gulp.task('copy-abstract', function() {
  return gulp.src('abstract/**/*')
    .pipe(gulp.dest('dist/abstract/'))
});

gulp.task('copy-palette', function() {
  return gulp.src('node_modules/spectrum-palette/**/*')
    .pipe(gulp.dest('dist/palette/'))
});

gulp.task('copy-icons', function() {
  return gulp.src([
    'node_modules/spectrum-icons/font/**/*'
  ])
    .pipe(gulp.dest('dist/icons/'))
});

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    [
      'copy-abstract',
      'copy-palette',
      'copy-icons',
    ],
    [
      'build-reference'
    ],
    cb
  );
});

gulp.task('default', ['build']);
