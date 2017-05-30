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
const path = require('path');
const fsx = require('fs-extra');
const Promise = require('any-promise');
const Constants = require('./constants');

var utils = module.exports;

utils.resolveFileName = (elementKey, variant) => {
  return `${elementKey}-${variant}.yml`;
};

utils.parseElementVariant = (elementFile) => {
  const AFTER_LAST_DASH = /[^-]*$/;
  const name = path.parse(elementFile).name;
  return name.match(AFTER_LAST_DASH)[0];
};

utils.notAdditional = (elementFile) => {
  return !(path.parse(elementFile).name.indexOf('additional') > -1);
};

utils.fetchVariantNames = (srcRoot, elementKey, type) => {
  const srcDir = path.resolve(srcRoot, 'src', 'elements', type, elementKey);
  return Promise.map(Promise.filter(fsx.readdir(srcDir), utils.notAdditional), utils.parseElementVariant);
};

utils.listElementsForType = (type = 'html', srcRoot) => {
  const srcPath = path.resolve(srcRoot, 'src', 'elements', type);
  return fsx.readdir(srcPath)
    .then(readResults => {
      return Promise.filter(readResults, fsNode => {
        return fsx.statSync(path.resolve(srcPath, fsNode)).isDirectory();
      });
    });
};


utils.readFromSrcFile = (srcRoot = path.resolve(__dirname, '../../'), elementKey, elementVariant = Constants.DEFAULT_ELEMENT_VARIANT, type = Constants.DEFAULT_DOM_TYPE) => {
  const fileName = utils.resolveFileName(elementKey, elementVariant);
  // TODO: add this back when we have verbose option
  // let log = logInstance || require('@spectrum/kulcon').init('read-source-file');
  // log.verbose(`Read raw data for ${fileName}`);
  const srcPath = path.resolve(srcRoot, 'src', 'elements', type, elementKey, fileName);
  return fsx.readFile(srcPath).then(result => {
    return result.toString('utf-8');
  });
};

