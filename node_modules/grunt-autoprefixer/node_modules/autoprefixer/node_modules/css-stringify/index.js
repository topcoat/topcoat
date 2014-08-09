
/**
 * Module dependencies.
 */

var Compressed = require('./lib/compress');
var Identity = require('./lib/identity');

/**
 * Stringfy the given AST `node`.
 *
 * @param {Object} node
 * @param {Object} [options]
 * @return {String}
 * @api public
 */

module.exports = function(node, options){
  options = options || {};

  var compiler = options.compress
    ? new Compressed(options)
    : new Identity(options);

  return compiler.compile(node);
};

