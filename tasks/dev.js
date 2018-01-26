var gulp = require('gulp');

var browserSync = require('browser-sync');
var server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    port: 8080,
    ui: {
      port: 3000,
      weinre: {
        port: 3001
      }
    },
    startPath: 'docs/index.html',
    server: {
      baseDir: [
        './dist/'
      ],
      directory: true
    }
  });
  done();
}

function watch() {
  gulp.watch('src/**/*.css', gulp.series('reload-css'));

  gulp.watch('docs/**/*.yml', gulp.series('reload-docs'));

  gulp.watch('icons/*.svg', gulp.series('reload-icons'));
}

gulp.task('reload-css', gulp.series('build-css', reload));
gulp.task('reload-docs', gulp.series('build-lite', reload));
gulp.task('reload-icons', gulp.series('icons', reload));

gulp.task('dev', gulp.series('build', serve, watch));
