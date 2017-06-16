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
var preprocess = require('./pre-build-copy.js');
var compile = require('./compile-stylus.js');
var postprocess = require('./run-post-css.js');
var log = require('@spectrum/kulcon').init('start-build');

log.info('Starting...');

// holds the color stop names (should be fetched via config) ( in balthazar ?)
var colorStopNames = ['darkest', 'dark', 'light', 'lightest'];
//var colorStopNames = ['light'];

preprocess()
 .then(buildAllColorStops)
 .then(done)
 .catch(handleError);



function buildAllColorStops() {
  return Promise.each(colorStopNames, function(colorStop) {
    return compile(colorStop)
      .then(function(cssString) {
        postprocess(cssString, colorStop)
      })
  })
}

function done(result) {
  log.info('Done!');
  if (result) {
    // console.log('Result:', result);
  }
}
function handleError(error) {
  log.error(error);
  process.exit(-1);
}


