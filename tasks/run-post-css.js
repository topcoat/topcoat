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

const postcss = require('postcss');
const path = require('path');
const autoprefixer = require('autoprefixer');
const jecter = require('./jecter');
const fsx = require('fs-extra');
const log = require('@spectrum/kulcon').init('run-post-css');
const domRef = require('./documentation/index.js');
const Promise = require('bluebird');



function cleanCss(cssData) {
  return postcss()
    .use(autoprefixer({ add: false, browsers: [] }))
    .process(cssData)
    .catch(handleCleanError);
}

function autoprefix(cssData) {
  let targetBrowsers = [
    'IE >= 10',
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 iOS versions'
  ];
  return postcss()
    .use(autoprefixer({ browsers: targetBrowsers }))
    .process(cssData.css)
    .catch(handleAutoprefixError);
}

function writeCSSOutput(cssString, colorStop) {
  var cssWriteDest = 'dist/css/spectrum-' + colorStop + '.css';
  log.info('Writing', cssWriteDest);
  return fsx.outputFile(cssWriteDest, cssString)
    .catch(handleWriteError);
}

function tokenReplaceDocs(cssData) {
  const targetElements = [];
  const targetVariants = [];
  const whitelist = false;
  const srcRoot = process.cwd();

  console.log('sending src root', srcRoot);

  return domRef.fetchElementsForType(srcRoot, targetElements, targetVariants, 'html', 'topdoc', false)
    .then(elements => {
      log.info(`Topdoc token replace running for elements`);
      return postcss()
        .use(jecter({ data:elements }))
        .process(cssData)
        .catch(handleDocsError);
    })
    .catch(error => {
      console.log('rejection loading documentation source');
      console.error(error);
    });
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

function handleDocsError(error) {
  handleError(error, 'Error updating css documentation');
}

function handleError(error, warning) {
  log.warn(warning);
  log.error(error);
  process.exit(-1);
}

module.exports = function(cssData, colorStop) {
  var colorStop = colorStop || 'light';
  log.info('PostCSS for ', colorStop);
  return cleanCss(cssData)
    .then(autoprefix)
    .then(tokenReplaceDocs)
    .then(function (output) {
      writeCSSOutput(output, colorStop);
    })
    .catch(function(error) {
      handleError(error, 'Unhanded error during post-process!');
    });
};
