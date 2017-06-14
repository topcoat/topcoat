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
var stylus = require('stylus');
var svgstylus = require('svg-stylus');
var checkvars = require('./check-vars.js');
var fsx = require('fs-extra');
var log = require('@spectrum/kulcon').init('compile-stylus');
const path = require('path');

function readStylusIndex(stylusIndex) {
  log.info('Reading stylus code from', stylusIndex);
  return fsx.readFile(stylusIndex).catch(handleReadError);
}

function compileStylus(stylusIndex) {
  return function(stylusBuffer) {
    log.info('Rendering stylus input to css');

    var promise = new Promise(function(resolve, reject) {
      stylus(stylusBuffer.toString())
        .set('paths', [
          // Set the path to the directory containing the file we're importing
          path.dirname(stylusIndex),

          // Add the node_modules folder so we can import deps
          'node_modules/'
        ])
        .set('compress', true)
        .use(svgstylus())
        .render(function(err, css) {
          if (err) {
            reject(err);
          }
          else {
            resolve(css);
          }
        });
    });

    return promise.catch(handleCompileError);
  };
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

module.exports = function(colorStop) {
  var colorStop = colorStop || 'light';
  const stylusIndex = path.resolve('src', 'elements', 'css', `spectrum-${colorStop}.styl`);

  log.info('Starting css compile for ', colorStop);
  return readStylusIndex(stylusIndex)
    .then(compileStylus(stylusIndex))
    .then(checkvars)
    .catch(handleError);
};
