var gulp = require('gulp');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var merge = require('merge-stream');
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
      'build-css:individual-component-colorstops',
      'build-css:all-components'
    ],
    cb
  )
});

/**
  Builds individual components (dimensions only)
*/
gulp.task('build-css:individual-components', function() {
  return gulp.src('src/*/index.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/components/'));
});

/**
  Builds all skin files individually against each colorstop for each component
*/
gulp.task('build-css:individual-component-colorstops', function() {
  return merge(
    gulp.src('src/*/skin.css')
    .pipe(insert.prepend("@import '../../dist/vars/spectrum-dark.css';"))
    .pipe(postcss(processors))
    .pipe(insert.prepend('.spectrum--dark {\n'))
    .pipe(insert.append('}\n'))
    .pipe(rename(function(path) {
      path.basename = 'dark';
    }))
    .pipe(gulp.dest('dist/components/')),

    gulp.src('src/*/skin.css')
      .pipe(insert.prepend("@import '../../dist/vars/spectrum-light.css';"))
      .pipe(postcss(processors))
      .pipe(insert.prepend('.spectrum--light {\n'))
      .pipe(insert.append('}\n'))
      .pipe(rename(function(path) {
        path.basename = 'light';
      }))
      .pipe(gulp.dest('dist/components/')),

    gulp.src('src/*/skin.css')
      .pipe(insert.prepend("@import '../../dist/vars/spectrum-lightest.css';"))
      .pipe(postcss(processors))
      .pipe(insert.prepend('.spectrum--lightest {\n'))
      .pipe(insert.append('}\n'))
      .pipe(rename(function(path) {
        path.basename = 'lightest';
      }))
      .pipe(gulp.dest('dist/components/')),

    gulp.src('src/*/skin.css')
      .pipe(insert.prepend("@import '../../dist/vars/spectrum-darkest.css';"))
      .pipe(postcss(processors))
      .pipe(insert.prepend('.spectrum--darkest {\n'))
      .pipe(insert.append('}\n'))
      .pipe(rename(function(path) {
        path.basename = 'darkest';
      }))
      .pipe(gulp.dest('dist/components/'))
  );
});

/**
  Builds all components and all color stops for all components
*/
gulp.task('build-css:all-components', function() {
  return gulp.src('src/spectrum*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/'));
});
