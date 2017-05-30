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
const fetchSingleVariant = require('./fetchSingleVariant');
const path = require('path');
const Utils = require('./utils');
const Constants = require('./constants');

module.exports = function(srcRoot = path.resolve(__dirname, '..'), elementKey, targetVariants = [],  type = Constants.DEFAULT_DOM_TYPE, format = Constants.NODE_LIST_OUTPUT, whitelist, logInstance) {

  let log = logInstance || require('@spectrum/kulcon').init('fetch-variants');

  log.info(`Fetching all ${elementKey} variants...`);

  var variants = Promise.filter(Utils.fetchVariantNames(srcRoot, elementKey, type), (variant) => {
    return whitelist ? targetVariants.includes(variant) : !targetVariants.includes(variant);
  });


  return variants.map(variant => {
    return fetchSingleVariant(srcRoot, elementKey, variant, type, format, log)
      .then(data => {
        data['variant'] = variant;
        return Promise.resolve(data);
      });
  });
};
