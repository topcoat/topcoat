var gulp = require('gulp');
var requireDir = require('require-dir');

// Include all tasks
requireDir('./tasks/');

gulp.task('default', ['build']);
