module.exports = function(gulp) {
  var stylus = require('gulp-stylus');
  var rename = require('gulp-rename');
  var svgstylus = require('svg-stylus');

  var stylusConfig = {
    'resolve url': true,
    use: [
      svgstylus()
    ],
    paths: [
      'dist/'
    ]
  };

  gulp.task('reference-preprocess', function() {
    return gulp.src('reference/index.styl')
      .pipe(stylus(stylusConfig))
      .pipe(rename('spectrum.css'))
      .pipe(gulp.dest('dist/reference/'));
  });
};
