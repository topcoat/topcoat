var gulp = require('gulp');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

var processors = [
  require('postcss-import'),
  require('postcss-nested'),
  require('postcss-custom-properties'),
  require('postcss-calc'),
  require('postcss-pxtorem'),
  require('autoprefixer')({
    'browsers': [
      'IE >= 10',
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    ]
  })
];

gulp.task('build-css', ['balthazar'], function(cb) {
  runSequence(
    [
      'build-css:individual-components',
      'build-css:all-components'
    ],
    cb
  )
});

gulp.task('build-css:individual-components', function() {
  return gulp.src('src/*/index.css')
    .pipe(postcss(processors))
    .pipe(rename(function(path) {
      path.basename = path.dirname;
      path.dirname = '';
    }))
    .pipe(gulp.dest('dist/components/'));
});

gulp.task('build-css:all-components', function() {
  return gulp.src('src/spectrum*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/'));
});
