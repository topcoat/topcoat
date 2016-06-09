module.exports = function(gulp) {
  var stylus = require('gulp-stylus');
  var rename = require('gulp-rename');
  var svgstylus = require('svg-stylus');

  var stylusConfig = {
    use: [
      svgstylus()
    ]
  };

  gulp.task('preprocess', function() {
    return gulp.src('coral/index.styl')
      .pipe(stylus(stylusConfig))
      .pipe(rename('coral.css'))
      .pipe(gulp.dest('dist/coral/'));
  });
};
