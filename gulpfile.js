var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var del = require('del');
var runSequence = require('run-sequence');

require('./tasks/release')(gulp);
require('./tasks/preprocess')(gulp);
require('./tasks/postprocess')(gulp);

gulp.task('clean', function() {
  return del('dist/**');
});

gulp.task('build-examples', function() {
  return gulp.src('coral/**/examples/*.html')
    .pipe(concat('index.html'))
    .pipe(wrap({
      src: 'coral/index.html'
    }))
    .pipe(gulp.dest('dist/coral/'))
});

gulp.task('build-css', function(cb) {
  runSequence(
    [
      'preprocess',
      'postprocess'
    ],
    cb
  );
});

gulp.task('copy-icons', function() {
  return gulp.src([
    'node_modules/spectrum-icons/font/**/*',
    '!**/*.json',
    '!**/*.css',
    '!**/*.styl',
    '!**/*.html'
  ])
    .pipe(gulp.dest('dist/coral/icons/'))
});

gulp.task('dev', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });

  gulp.watch([
    'base/**/*.styl',
    'coral/**/*.styl'
  ], ['reload-css']);

  gulp.watch([
    'coral/**/*.html'
  ], ['reload-examples']);
});

gulp.task('reload-examples', ['build-examples'], function() {
  gulp.src('').pipe(connect.reload());
})

gulp.task('reload-css', ['build-css'], function() {
  gulp.src('').pipe(connect.reload());
});

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    [
      'build-css',
      'copy-icons',
      'build-examples'
    ],
    cb
  );
});

gulp.task('default', ['build']);
