/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var Balthazar = require('@spectrum/balthazar');

var dnaVars = require('@spectrum/spectrum-dna/dist/vars/json/dna-vars.json');

gulp.task('dna:generate', function() {
  var outputPath = path.resolve('dist', 'vars');
  const outType = Balthazar.getOutputTypes().css;

  return Promise.all(Object.keys(dnaVars).map(varsType => {
    const destFile = `spectrum-${varsType}.css`;
    return Balthazar.convertVars(outputPath, destFile, outType, dnaVars[varsType]);
  }))
    .then(files => {
      gutil.log('load-dna: All output has been generated!');
      files.forEach(fileName => {
        gutil.log('  created:', fileName);
      });
    });
});

gulp.task('dna:postprocess-metadata', function() {
  return gulp.src('dist/vars/spectrum-light.css')
    // replace anything that is not a metadata key
    // like measurements... the old regex was a little too greedy
    // and was finding 'transparent' and thinking that away a measurement suffix
    // so this is a little more explicit
    .pipe(replace(/.*?: [\d.]+(em|px|pt|deg|%)*;\n/g, ''))
    // also replace any text or color things that use a word
    .pipe(replace(/.*?(rgb\(|rgba\(|transparent|italic|uppercase|inherit).*?\n/g, ''))
    .pipe(rename('spectrum-metadata.css'))
    .pipe(gulp.dest('dist/vars/'));
});

gulp.task('dna:postprocess-dimensions', function() {
  return gulp.src('dist/vars/spectrum-light.css')
    // Strip all colors
    // note that dna only uses 'inherit' for color definitions
    .pipe(replace(/.*?(rgb\(|rgba\(|transparent|inherit).*?\n/g, ''))
    .pipe(replace(/.*?(-name:|-description:|-comment|-createdVersion|-updatedVersion:|-status:).*?\n/g, ''))
    .pipe(rename('spectrum-dimensions.css'))
    .pipe(gulp.dest('dist/vars/'));
});

gulp.task('dna:postprocess-colorstops', function() {
  return gulp.src([
    'dist/vars/spectrum-*.css',
    '!dist/vars/spectrum-dimensions.css',
    '!dist/vars/spectrum-metadata.css'
  ])
    // bye bye metadeets
    .pipe(replace(/.*?(-name:|-description:|-comment|-createdVersion|-updatedVersion:|-status:).*?\n/g, ''))
    // replace measurement values since those are for layout
    .pipe(replace(/.*?: [\d.]+(em|px|pt|deg|%);\n/g, ''))
    // these things are considered dimensions... or at least not color related
    .pipe(replace(/.*?(italic|uppercase|inherit).*?\n/g, ''))
    // replace anything with a value of 'transparent' with an actual transparent color
    // we could swap this to '0' and set an opacity property
    // but that's getting pretty crazy
    .pipe(replace(/(.*?:) transparent;\n/g, (match, p1) => {
      const result = `${p1} rgba(0, 0, 0, 0);\n`;
      return result;
    }))
    .pipe(gulp.dest('dist/vars/'));
});

gulp.task('load-dna',
  gulp.series(
    'dna:generate',
    'dna:postprocess-metadata',
    'dna:postprocess-dimensions',
    'dna:postprocess-colorstops'
  )
);
