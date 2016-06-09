module.exports = function(gulp) {
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');

  var processors = [
    autoprefixer({
      'browsers': [
        'IE >= 10',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 iOS versions'
      ]
    })
  ];

  gulp.task('postprocess', function() {
    return gulp.src('dist/coral.css')
      .pipe(postcss(processors))
      .pipe(gulp.dest('dist/'));
  });
};
