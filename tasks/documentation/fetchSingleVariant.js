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
const Promise = require('any-promise');
const Constants = require('./constants.js');
const parser = require('js-yaml');
const path = require('path');
const readFromSrcFile = require('./utils').readFromSrcFile;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = function(srcRoot = path.resolve(__dirname, '../'), elementKey, elementVariant = Constants.DEFAULT_ELEMENT_VARIANT, type = Constants.DEFAULT_DOM_TYPE, format = Constants.NODE_LIST_OUTPUT, logInstance) {

  let log = logInstance || require('@spectrum/kulcon').init('fetch-variant');

  return readFromSrcFile(srcRoot, elementKey, elementVariant, type)
    .then(content => {
      let result = content;
      switch(format) {
      case Constants.NODE_LIST_OUTPUT:
        result = parseToDOM(content);
        break;
      case Constants.TOPDOC_OUTPUT:
        result = parseToDOM(content)
          .then(metadata => {
            delete metadata[Constants.FRAGMENTS_NODE_NAME];
            metadata.topdoc = parser.safeDump(metadata);
            return Promise.resolve(metadata);
          });
        break;
      case Constants.RAW_OUTPUT:
      default:
        result = Promise.resolve(content);
      }
      log.info(`Processed for ${type}/${elementKey}-${elementVariant} as ${format}`);
      // log.info('returning', result);
      // TODO: maybe when we have verbose add this back
      return result;
    })
    .catch(function(error) {
      log.error('Problem parsing data', error);
      console.error('error', error);
    });
};

function parseToDOM(content) {
  let metadata = parser.safeLoad(content);
  let elementDOM = JSDOM.fragment(metadata.markup);
  metadata[Constants.FRAGMENTS_NODE_NAME] = elementDOM.childNodes;
  return Promise.resolve(metadata);
}
