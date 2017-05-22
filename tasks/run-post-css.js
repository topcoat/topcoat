#!/usr/bin/env node

/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2016 Adobe Systems Incorporated
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

/*eslint-env es6*/

'use strict';

var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var fsx = require('fs-promise');
var log = require('@spectrum/kulcon').init('run-post-css');

var targetBrowsers = [
  'IE >= 10',
  'last 2 Chrome versions',
  'last 2 Firefox versions',
  'last 2 Safari versions',
  'last 2 iOS versions'
];

var cleaner  = postcss([ autoprefixer({ add: false, browsers: [] }) ]);
var prefixer = postcss([ autoprefixer({ browsers: targetBrowsers }) ]);


function cleanCss(cssString) {
  return cleaner.process(cssString)
    .catch(handleCleanError);
}

function autoprefix(cleaned) {
  return prefixer.process(cleaned.css)
    .catch(handleAutoprefixError);
}

function writeCSSOutput(cssString, colorStop) {
  var cssWriteDest = 'dist/css/spectrum-' + colorStop + '.css';
  log.info('Writing', cssWriteDest);
  return fsx.outputFile(cssWriteDest, cssString)
    .catch(handleWriteError);
}


function handleCleanError(error) {
  handleError(error, 'Error cleaning css with autoprefixer!');
}

function handleAutoprefixError(error) {
  handleError(error, 'Error running autoprefixer!');
}

function handleWriteError(error) {
  handleError(error, 'Error writing css to file!');
}

function handleError(error, warning) {
  log.warn(warning);
  log.error(error);
  process.exit(-1);
}

module.exports = function(cssString, colorStop) {
  var colorStop = colorStop || 'light';
  log.info('PostCSS for ', colorStop);
  return cleanCss(cssString)
    .then(autoprefix)
    .then(function (output) {
      writeCSSOutput(output, colorStop);
    })
    .catch(function(error) {
      handleError(error, 'Unhanded error during post-process!');
    });
};
