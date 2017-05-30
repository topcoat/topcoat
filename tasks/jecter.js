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

const postcss = require('postcss');

module.exports = postcss.plugin('jecter', function (opts) {
    const data = opts.data;
    const flatData = flatten(opts.data);
    // console.log('flat:', flatData)

    return function (css, something) {
      css.walkComments(comment => {
        // a token is {{ some.data.keys }}
        let replaceables = comment.text.match(/{{.*}}/g);
        if (replaceables && replaceables.length > 0) {
          replaceables.forEach(token => {
            var key = token.substring(2, token.length-2).trim();
            let dataText = flatData[key] ? flatData[key] : `{{ error: ${key} not found }} `;
            comment.text = comment.text.replace(token, dataText);
          });
        }
      });
    };
});

function flatten(object, separator = '-') {
  return Object.assign({}, ...function _flatten(child, path = []) {
    return [].concat(...Object.keys(child).map(key => typeof child[key] === 'object'
      ? _flatten(child[key], path.concat([key]))
      : ({ [path.concat([key]).join(separator)] : child[key] })
    ));
  }(object));
}
