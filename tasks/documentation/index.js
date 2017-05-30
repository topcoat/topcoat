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

var api = module.exports;
api.listElementsForType = require('./utils').listElementsForType;
api.fetchElementsForType = require('./fetchElementsForType');
api.fetchVariantsForElement = require('./fetchVariantsForElement');
api.fetchSingleVariant = require('./fetchSingleVariant');


