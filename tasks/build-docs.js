var gulp = require('gulp');
var exec = require('child_process').exec;
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var fs = require('fs');
var path = require('path');

gulp.task('topdoc', function(cb) {
  exec('node_modules/.bin/topdoc', function (err, stdout, stderr) {
    process.stdout.write('[topdoc] '+stdout);
    process.stderr.write(stderr);
    cb(err);
  });
});

gulp.task('replace-topdoc', function(){
  gulp.src([
    'dist/**/*.css',
    '!dist/vars/*'
  ])
    .pipe(replace(/\{\{\s*(.*?)\s*\}}/g, function(match, p1) {
      filePath = path.resolve('docs', p1);
      return fs.readFileSync(filePath);
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-docs', function(cb) {
  runSequence(
    'replace-topdoc',
    'topdoc',
    cb
  );
});

