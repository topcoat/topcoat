var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(cb) {
  runSequence(
    'lint',
    'clean',
    [
      'build-css'
    ],
    'build-docs',
    cb
  );
});
