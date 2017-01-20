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
var path = require('path');
var log = require('@spectrum/kulcon').init('pre-build-copy');
var fsx = require('fs-promise');

var excludeExtensions = [
  '.json',
  '.css',
  '.styl',
  '.html'
];

var abstractSource = 'node_modules/@spectrum/spectrum-abstract-stylus/dist/';
var abstractDest = 'temp/abstract/';
var iconSource = 'node_modules/spectrum-icons/font/';
var iconFontDest = 'dist/docs/css/vendor/icons';
var iconStylusDest = 'dist/icons';

function iconCopyFontFilter(file) {
  var include = true;
  if (excludeExtensions.includes(path.extname(file))) {
    include = false;
  }
  // log.info((include) ? "including": "excluding", file);
  return include;
}


function copyAbstractSource() {
  return asyncCopy('abstract source', abstractSource, abstractDest);
}

function copyIconStylus() {
  return asyncCopy('icon stylus files', iconSource, iconStylusDest);
}

function copyIconFont() {
  return asyncCopy('icon font', iconSource, iconFontDest,
    { clobber: true, filter: iconCopyFontFilter});
}

function asyncCopy(what, source, destination, options) {
  log.info('Copying', what);
  return fsx.copy(source, destination, options)
    .catch(function(error) {
      log.warn('Problem copying', what);
      log.error(error);
      process.exit(-1);
    });
}

module.exports = function() {
  log.info('Starting pre-processing');
  return Promise.all([
    copyAbstractSource(),
    copyIconFont(),
    copyIconStylus()
  ]);
};
