module.exports = function(gulp) {
  var connect = require('gulp-connect');
  var concat = require('gulp-concat');
  var wrap = require('gulp-wrap');
  var runSequence = require('run-sequence');

  require('./preprocess')(gulp);
  require('./postprocess')(gulp);

  gulp.task('build-reference', function(cb) {
    runSequence(
      'build-reference-css',
      'copy-reference-icons',
      cb
    );
  });

  gulp.task('build-reference-css', function(cb) {
    runSequence(
      [
        'reference-preprocess',
        'reference-postprocess'
      ],
      cb
    );
  });

  gulp.task('copy-reference-icons', function() {
    return gulp.src([
      'node_modules/spectrum-icons/font/**/*',
      '!**/*.json',
      '!**/*.css',
      '!**/*.styl',
      '!**/*.html'
    ])
      .pipe(gulp.dest('dist/reference/docs/css/vendor/icons/'))
  });

  gulp.task('dev', ['build'], function() {
    connect.server({
      root: 'dist',
      livereload: true
    });

    gulp.watch([
      'abstract/**/*.styl',
      'reference/**/*.styl'
    ], ['reload-reference-css']);

  });

  gulp.task('reload-reference-css', ['build-reference-css'], function() {
    gulp.src('').pipe(connect.reload());
  });
};
