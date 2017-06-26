var gulp = require('gulp');
var express = require('express');

var server = express();
server.use(express.static('./dist'));

/**
  Start a static server
*/
gulp.task('server', function() {
  server.listen(9000);
});

/**
  Watch for changes, and build accordingly.
  Does not build immediately so you can watch if the project is in a broken state.
*/
gulp.task('watch', ['server'], function() {
  gulp.watch([
    'src/**/*.css',
    'docs/**/*.yml'
  ], ['build:lite']);
});
