var gulp = require('gulp');

gulp.task('dev', ['build'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });

  gulp.watch([
    'src/**/*.css'
  ], ['reload-css']);

  gulp.watch([
    'reference/**/docs/**/*.yml'
  ], ['reload-docs']);
});

gulp.task('reload-docs', ['build-docs'], function() {
  gulp.src('').pipe(connect.reload());
});

gulp.task('reload-css', ['build-css'], function() {
  gulp.src('').pipe(connect.reload());
});
