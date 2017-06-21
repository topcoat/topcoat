var gulp = require('gulp');
var postcss = require('gulp-postcss');
var exec = require('child_process').exec;

var processors = [
  require('postcss-nested'),
  require('postcss-import'),
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

gulp.task('balthazar', function(cb) {
  exec('node_modules/.bin/balthazar -t css -o node_modules/@spectrum/spectrum-origins/src -d dist/vars/ -c balthazar-config.json', function (err, stdout, stderr) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    cb(err);
  });
});

gulp.task('build-css', ['balthazar'], function() {
  return gulp.src('src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/'));
});
