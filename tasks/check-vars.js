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
var log = require('@spectrum/kulcon').init('check-vars');
var fsx = require('fs-extra');

function checkVars(stylusCSS) {
  var lines = stylusCSS.split('\n');
  log.info('Checking ' + lines.length + ' lines of CSS...');
  var unresolvedVariableCount = 0;
  lines.forEach(function(cssLine, index) {
    // if there's a $, check that it's not part of $=
    var unresolvedVariableIndex = cssLine.search(/\$(?!\=)/);
    if (unresolvedVariableIndex > -1) {
      var suspectString = cssLine.slice(unresolvedVariableIndex);
      // break the result string on ' ' or ';' to pass back only the var name
      suspectString = suspectString.substring(0, suspectString.search('[\\s;]'));
      log.warn('Stylus Output Warning!');
      log.warn('  Found what might be an unresolved Stylus variable ', suspectString);
      log.warn('  Located in line:', index + 1);
      unresolvedVariableCount += 1;
     }
  }); // end for each line

  if (unresolvedVariableCount == 0) {
    log.info('CSS output free of unresolved variables');
    return Promise.resolve(stylusCSS);
  } else {
    return Promise.reject({message:'Warning. ' + unresolvedVariableCount + ' unresolved variables found.'});
  }
}

module.exports = function(stylusCSS) {
  log.info('Starting var checking');
  return checkVars(stylusCSS);
};

