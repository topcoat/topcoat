var gulp = require('gulp');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var plumb = require('./lib/plumb.js');
var runSequence = require('run-sequence');

var colorStops = [
  'darkest',
  'dark',
  'light',
  'lightest'
];

var processors = [
  require('postcss-import'),
  require('postcss-nested'),
  require('postcss-inherit'),
  require('postcss-custom-properties'),
  require('postcss-calc'),
  require('postcss-svg'),
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

gulp.task('build-css', function(cb) {
  runSequence(
    [
      'build-css:individual-components',
      'build-css:individual-components-multistops',
      'build-css:individual-components-colorstops',
      'build-css:page-component-colorstops',
      'build-css:all-components-multistops'
    ],
    [
      'build-css:concat-standalone',
      'build-css:build-multistops'
    ],
    cb
  );
});

/**
  Builds individual components (dimensions only)
*/
gulp.task('build-css:individual-components', function() {
  return gulp.src('src/*/index.css')
    .pipe(plumb())
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/components/'));
});

/**
  Builds all skin files individually against each colorstop for each component with outer descendant selectors
  This enables the use of multiple colorstops on the same page
*/
gulp.task('build-css:individual-components-multistops', function() {
  function buildSkinFiles(colorStop) {
    return gulp.src([
      'src/*/skin.css',
      '!src/commons/skin.css'
    ])
      .pipe(plumb())
      .pipe(insert.prepend("@import '../../dist/vars/spectrum-dimensions.css';\n@import '../colorStops/spectrum-" + colorStop + ".css';\n.spectrum--" + colorStop + " {\n"))
      .pipe(insert.append('}\n'))
      .pipe(postcss(processors))
      .pipe(rename(function(path) {
        path.dirname += '/multiStops';
        path.basename = colorStop;
      }))
      .pipe(gulp.dest('dist/components/'));
  }

  return merge.apply(this, colorStops.map(buildSkinFiles));
});

function buildSkinFiles(colorStop, globs, prependString, appendString, dest) {
  prependString = prependString || '';
  appendString = appendString || '';
  dest = dest || 'dist/components/';

  return gulp.src(globs)
    .pipe(plumb())
    .pipe(insert.prepend("@import '../../dist/vars/spectrum-dimensions.css';\n@import '../colorStops/spectrum-" + colorStop + ".css';" + prependString))
    .pipe(insert.append(appendString))
    .pipe(postcss(processors))
    .pipe(replace(/^&/gm, '.spectrum')) // Any stray & in colorstops should just apply to .spectrum
    .pipe(rename(function(path) {
      path.dirname += '/colorStops';
      path.basename = colorStop;
    }))
    .pipe(gulp.dest(dest));
}

/**
  Builds all skin files individually against each colorstop for each component
  This increases performance, but does not allow multiple colorstops on the same page
*/
gulp.task('build-css:individual-components-colorstops', function() {
  function buildComponentSkinFiles(colorStop) {
    return buildSkinFiles(colorStop, [
      'src/*/skin.css',
      '!src/page/skin.css' // Process separately
    ]);
  }
  return merge.apply(this, colorStops.map(buildComponentSkinFiles));
});

/**
  Build page skin files separately
*/
gulp.task('build-css:page-component-colorstops', function(){
  function buildPageSkinFiles(colorStop) {
    return buildSkinFiles(colorStop, 'src/page/skin.css', '.spectrum {\n', '\n}', 'dist/components/page/');
  }
  return merge.apply(this, colorStops.map(buildPageSkinFiles));
});

/**
  Builds all components and all color stops for all components
  This task results in unresolved multistop files that require build-css:build-multistops to be ready-to-use
*/
gulp.task('build-css:all-components-multistops', function() {
  return gulp.src('src/spectrum-*.css')
    .pipe(plumb())
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/'));
});

/**
  Builds standalone multistop CSS files
*/
gulp.task('build-css:build-multistops', function(){
  function buildMultistops(colorStop) {
    return gulp.src('dist/spectrum-' + colorStop + '.css')
      .pipe(plumb())
      // Simply wrap the file in the colorstop
      // This is a workaround for the fact that postcss-import and postcss-nested can't play together
      .pipe(insert.prepend(".spectrum--" + colorStop + " {\n"))
      .pipe(insert.append('}\n'))
      .pipe(postcss([require('postcss-nested')]))
      .pipe(gulp.dest('dist/'));
  }

  return merge.apply(this, colorStops.map(buildMultistops));
});

/**
  Builds standalone single colorstop CSS files
*/
gulp.task('build-css:concat-standalone', function(){
  function concatStandalone(colorStop) {
    return gulp.src([
      'dist/spectrum-core.css',
      'dist/spectrum-' + colorStop + '.css'
    ])
      .pipe(concat('spectrum-' + colorStop + '.css'))
      // Replace instances of & that refer to the colorstop selector with .secptrum
      .pipe(replace(/^&/gm, '.spectrum'))
      .pipe(gulp.dest('dist/standalone'));
  }

  return merge.apply(this, colorStops.map(concatStandalone))
});
