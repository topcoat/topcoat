var gulp = require('gulp');
var eslint = require('gulp-eslint');
 
gulp.task('lint', function() {
  return gulp.src(['gulpfile.js','tasks/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
