'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pug = require('pug');

var _pug2 = _interopRequireDefault(_pug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Private: replaces the extension of a file path string with a new one.
 *
 *  * `npath` {String} path to file.
 *  * `ext` {String} new extension to replace the old one.
 *
 *  Returns {String} with replaced extension
 */
function _replaceExt(npath, ext) {
  if (typeof npath !== 'string') {
    return npath;
  }
  if (npath.length === 0) {
    return npath;
  }
  var nFileName = _path2.default.basename(npath, _path2.default.extname(npath)) + ext;
  return _path2.default.join(_path2.default.dirname(npath), nFileName);
}

/**
 *  Private: copies documentation dependency files to a directory.
 *   Assumes *.pug should not get copied.
 *
 *  * `destPath` {String} path to copy files to.
 *  *  TODO:` exclude` {Array} Array of globbing patterns to not copy.
 *
 *  Returns {String} with replaced extension
 */
/* eslint-disable no-console */
function _copyDependencies(templateDir, destPath) {
  var filter = /^(?!(.*index\.js|.*\.pug))/; // todo: could pass regex in options?
  _fsExtra2.default.copySync(templateDir, destPath, filter, function (err) {
    console.log('[topdoc] Copy failed;', err);
  });
}

/**
 *  Public: creates docs using topDocument data with a pug template.
 *
 *  * `topDocument` {TopDocument} result from topdoc parsing.
 *
 *  ## Examples
 *
 *  ```js
 *  var template = require('default-template');
 *  postcss([topdoc({ fileData: opt })]).process(content, { from: filepath })
 *    .then((result) => {
 *      template(result);
 *    });
 *  ```
 */
function defaultTemplate(topDocument) {
  try {
    topDocument.files.forEach(function (file) {
      file.filename = _replaceExt(file.filename, '.html');
    });
    var content = _pug2.default.renderFile(_path2.default.resolve(__dirname, 'template.pug'), { document: topDocument });
    _fsExtra2.default.mkdirsSync(_path2.default.resolve(topDocument.destination, 'css'));
    var cssDestination = _path2.default.resolve(topDocument.destination, 'css', topDocument.filename);
    _fsExtra2.default.copySync(topDocument.source, cssDestination);
    var newFileName = topDocument.first ? 'index.html' : _replaceExt(topDocument.filename, '.html');
    _fsExtra2.default.writeFileSync(_path2.default.resolve(topDocument.destination, newFileName), content);
    console.log('[topdoc] template generated', _path2.default.relative(process.cwd(), _path2.default.resolve(topDocument.destination, newFileName)));
  } catch (err) {
    console.log(err);
  }
}

/**
 *  Public: function to run before generating the docs. In this case it deletes
 *  the destination directory first before regenerating it.
 *
 *  * `options` {Object} the options hash.
 *
 *  ## Examples
 *
 *  ```js
 *  var template = require('default-template');
 *  if (template.before) {
 *    template.before(options);
 *  }
 *  ```
 */
defaultTemplate.before = function (options) {
  if (options.clobber && options.destination) {
    console.log('[topdoc template.before] because you said so, clobbering', options.destination);
    _fsExtra2.default.removeSync(options.destination, function (err) {
      console.log('[topdoc template.before] cowardly gave up trying to rm', options.destination);
      console.log('[topdoc template.before] Error:', err);
    });
  }
};

/**
 *  Public: function to run after generating the docs. In this case it copies other
 *  docs html dependencies to the destination
 *
 *  * `options` {Object} hash of current options.
 *
 *  ## Examples
 *
 *  ```js
 *  var template = require('default-template');
 *  if (template.after) {
 *    template.after(options);
 *  }
 *  ```
 */
defaultTemplate.after = function (options) {
  var destPath = _path2.default.resolve(options.destination);
  var templateDir = _path2.default.dirname(options.template);
  console.log('[topdoc template.after] trying to copy dependencies');
  console.log('[topdoc template.after] something like cp -r', templateDir);
  console.log('[topdoc template.after] copying mostly everything to', destPath);
  _fsExtra2.default.ensureDirSync(destPath);
  _copyDependencies(templateDir, destPath);
};

exports.default = defaultTemplate;
module.exports = exports['default'];
