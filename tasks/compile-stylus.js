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
require('any-promise/register/bluebird');
var Promise = require('bluebird');
var stylus = Promise.promisifyAll(require('stylus'));
var svgstylus = require('svg-stylus');
var fsx = require('fs-promise');
var log = require('@spectrum/kulcon').init('compile-stylus');

var options = {
  compress: false,
  use: [
    svgstylus()
  ],
  paths: [
    'reference/',
    'dist/',
    'temp/'
  ]
};

function readStylusIndex(stylusIndex) {
  stylusIndex = stylusIndex || 'reference/index.styl';
  log.info('Reading stylus code from', stylusIndex);
  return fsx.readFile(stylusIndex).catch(handleReadError);
}

function compileStylus(stylusBuffer) {
  log.info('Rendering stylus input to css');
  return stylus.renderAsync(stylusBuffer.toString(), options)
    .catch(handleCompileError);
}

function handleReadError(error) {
  handleError(error, 'Error reading stylus source file!');
}

function handleCompileError(error) {
  handleError(error, 'Error during stylusString compile!');
}

function handleError(error, warning) {
  log.warn(warning);
  log.error(error);
  process.exit(-1);
}

module.exports = function() {
  log.info('Starting css compile');
  return readStylusIndex()
    .then(compileStylus)
    .catch(handleError);
};
