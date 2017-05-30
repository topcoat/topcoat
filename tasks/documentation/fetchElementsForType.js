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
const fetchVariantsForElement = require('./fetchVariantsForElement.js');
const Constants = require('./constants');
const path = require('path');
const Utils = require('./utils');


module.exports = function(srcRoot, targetElements = [], targetVariants = [], type = Constants.DEFAULT_DOM_TYPE, format = Constants.NODE_LIST_OUTPUT,  whitelist, logInstance) {

  let log = logInstance || require('@spectrum/kulcon').init('fetch-elements');

  log.info(`Starting to fetch ${type} elements in ${format} format...`);

  let allElements = Utils.listElementsForType(type, srcRoot);

  let elements = Promise.filter(allElements, elementKey => {
    return whitelist ? targetElements.includes(elementKey) : !targetElements.includes(elementKey);
  });

  // log.verbose(`Looping through elements...`);
  // TODO: add this back when verbose is available
  return elements.reduce((elementData, elementKey) => {
    return fetchVariantsForElement(srcRoot, elementKey, targetVariants, type, format, whitelist, log)
      .then(variants => {
        // log.verbose(`Found ${variants.length} variants for ${elementKey}`);
        // TODO: add this back when verbose is available
        let allVariantsData = {};
        variants.forEach(variantData => {
          allVariantsData[variantData.variant] = variantData;
        });
        elementData[elementKey] = allVariantsData;
        return Promise.resolve(elementData);
      });
  }, {})
  .catch(error => {
    log.error('Fetching elements caused an error;', error);
    // console.error(error);
  });
};

