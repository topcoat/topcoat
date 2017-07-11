var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var path = require('path');

gulp.task('balthazar', function(cb) {
  runSequence(
    'balthazar:generate',
    'balthazar:postprocess-dimensions',
    'balthazar:postprocess-colorstops',
    cb
  );
});

gulp.task('balthazar:generate', function(cb) {
  var exePath = path.resolve('node_modules', '.bin', 'balthazar');
  var balthazarArgs = ' -t css -o node_modules/@spectrum/spectrum-origins/src -d dist/vars/ -c balthazar-config.json';
  exec(exePath + balthazarArgs, function (err, stdout, stderr) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    cb(err);
  });
});

gulp.task('balthazar:postprocess-dimensions', function() {
  gulp.src(['dist/vars/spectrum-light.css'])
    // Strip all colors
    .pipe(replace(/.*?(rgb\(|rgba\().*?\n/g, ''))
    .pipe(rename('spectrum-dimensions.css'))
    .pipe(gulp.dest('dist/vars/'));
});

gulp.task('balthazar:postprocess-colorstops', function() {
  gulp.src([
    'dist/vars/spectrum-*.css',
    '!dist/vars/spectrum-dimensions.css'
  ])
    // replace anything that is a number or float with optional unit
    .pipe(replace(/.*?: [\d.]+[^\)]*;\n/g, ''))
    .pipe(gulp.dest('dist/vars/'));
});
