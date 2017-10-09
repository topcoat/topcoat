var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var path = require('path');

var balthazar = require('@spectrum/balthazar').generateToFile;

gulp.task('balthazar', function(cb) {
  runSequence(
    'balthazar:generate',
    'balthazar:postprocess-dimensions',
    'balthazar:postprocess-colorstops',
    cb
  );
});

gulp.task('balthazar:generate', function() {

  var originsPath = path.resolve('node_modules', '@spectrum', 'spectrum-origins', 'src');
  var outputPath = path.resolve('dist', 'vars');

  var opts = {
    'origin': originsPath,
    'destination': outputPath,
    'colorStops': 'all',
    'type': 'css'
  };

  return balthazar(opts);
});

gulp.task('balthazar:postprocess-dimensions', function() {
  return gulp.src('dist/vars/spectrum-light.css')
    // Strip all colors
    .pipe(replace(/.*?(rgb\(|rgba\().*?\n/g, ''))
    .pipe(rename('spectrum-dimensions.css'))
    .pipe(gulp.dest('dist/vars/'));
});

gulp.task('balthazar:postprocess-colorstops', function() {
  return gulp.src([
    'dist/vars/spectrum-*.css',
    '!dist/vars/spectrum-dimensions.css'
  ])
    // replace anything that is a number or float with optional unit
    .pipe(replace(/.*?: [\d.]+[^\)]*;\n/g, ''))
    .pipe(gulp.dest('dist/vars/'));
});
