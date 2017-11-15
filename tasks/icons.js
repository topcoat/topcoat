var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var download = require('gulp-download-stream');
var unzip = require('gulp-unzip');
var runSequence = require('run-sequence');
var svgmin = require('gulp-svgmin');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var replace = require('gulp-replace');
var del = require('del');

function stripDir(file) {
  file.dirname = '';
  cleanIconFilename(file);
}

function cleanIconFilename(file) {
  file.basename = file.basename.replace(/_.*/, '');
}

var baseUrl = 'http://icons.corp.adobe.com:4502/content/athena/clients/spectrum/collections/spectrum_css.zip';

gulp.task('update-icons', function(cb) {
  runSequence(
    'clean-iconfiles',
    'download-icons',
    'unzip-icons',
    'extract-icons',
    'clean-icons',
    cb
  );
});

gulp.task('icons', function(cb) {
  runSequence(
    'generate-svgsprite',
    cb
  );
});

gulp.task('clean-iconfiles', function() {
  return del([
    'temp',
    'icons'
  ]);
});

gulp.task('download-icons', function() {
  return download(baseUrl)
    .pipe(gulp.dest('temp/'));
});

gulp.task('unzip-icons', function() {
  return gulp.src('temp/*.zip')
    .pipe(unzip())
    .pipe(gulp.dest('temp/'));
});

gulp.task('extract-icons', function() {
  return gulp.src('temp/icons/*/*.svg')
    .pipe(rename(stripDir))
    .pipe(gulp.dest('icons/'))
});

gulp.task('clean-icons', function() {
  return gulp.src('icons/*.svg')
    .pipe(svgmin())
    .pipe(replace(/<defs>.*?<\/defs>/, ''))
    .pipe(replace(/<title>.*?<\/title>/, ''))
    .pipe(replace(/ data-name=".*?"/, ''))
    .pipe(replace(/ id=".*?"/, ''))
    .pipe(replace(/ class="fill"/g, ''))
    .pipe(gulp.dest('icons/'))
});


gulp.task('generate-svgsprite', function () {
  return gulp.src('icons/*.svg')
    .pipe(rename(function (path) {
      path.basename = 'spectrum-css-icon-'+path.basename;
    }))
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('spectrum-css-icons.svg'))
    .pipe(gulp.dest('dist/icons/'));
});
