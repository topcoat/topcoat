var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('dev', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });

  gulp.watch([
    'src/**/*.css'
  ], ['reload']);

  gulp.watch([
    'docs/**/*.yml'
  ], ['reload']);

  gulp.watch([
    'icons/*.svg'
  ], ['icons']);
});

gulp.task('reload', ['build:lite'], function() {
  gulp.src('').pipe(connect.reload());
});
