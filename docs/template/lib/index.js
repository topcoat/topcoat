'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultTemplate;

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
/* eslint-disable no-console */
function defaultTemplate(topDocument) {
  var pugFile = void 0;
  if (topDocument.pugFile) {
    pugFile = _path2.default.resolve(topDocument.pugFile);
  } else {
    pugFile = _path2.default.resolve(__dirname, 'template.pug');
  }
  try {
    topDocument.files.forEach(function (file) {
      file.filename = _replaceExt(file.filename, '.html');
    });
    var content = _pug2.default.renderFile(pugFile, { document: topDocument, pretty: true });
    _fsExtra2.default.mkdirsSync(_path2.default.resolve(topDocument.destination, 'css'));
    var cssDestination = _path2.default.resolve(topDocument.destination, 'css', 'vendor', topDocument.filename);
    _fsExtra2.default.copySync(topDocument.source, cssDestination);
    var newFileName = topDocument.first ? 'index.html' : _replaceExt(topDocument.filename, '.html');
    _fsExtra2.default.writeFileSync(_path2.default.resolve(topDocument.destination, newFileName), content);
    console.log(_path2.default.relative(process.cwd(), _path2.default.resolve(topDocument.destination, newFileName)));
  } catch (err) {
    console.log(err);
  }
}
module.exports = exports['default'];