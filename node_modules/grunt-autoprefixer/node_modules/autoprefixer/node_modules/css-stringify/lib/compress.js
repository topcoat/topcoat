
/**
 * Expose compiler.
 */

module.exports = Compiler;

/**
 * Initialize a new `Compiler`.
 */

function Compiler(options) {
  options = options || {};
}

/**
 * Compile `node`.
 */

Compiler.prototype.compile = function(node){
  return node.stylesheet
    .rules.map(this.visit, this)
    .join('');
};

/**
 * Visit `node`.
 */

Compiler.prototype.visit = function(node){
  return this[node.type](node);
};

/**
 * Visit comment node.
 */

Compiler.prototype.comment = function(node){
  return '';
};

/**
 * Visit import node.
 */

Compiler.prototype.import = function(node){
  return '@import ' + node.import + ';';
};

/**
 * Visit media node.
 */

Compiler.prototype.media = function(node){
  return '@media '
    + node.media
    + '{'
    + node.rules.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit document node.
 */

Compiler.prototype.document = function(node){
  var doc = '@' + (node.vendor || '') + 'document ' + node.document;

  return doc
    + '{'
    + node.rules.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit charset node.
 */

Compiler.prototype.charset = function(node){
  return '@charset ' + node.charset + ';';
};

/**
 * Visit namespace node.
 */

Compiler.prototype.namespace = function(node){
  return '@namespace ' + node.namespace + ';';
};

/**
 * Visit supports node.
 */

Compiler.prototype.supports = function(node){
  return '@supports '
    + node.supports
    + '{'
    + node.rules.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit keyframes node.
 */

Compiler.prototype.keyframes = function(node){
  return '@'
    + (node.vendor || '')
    + 'keyframes '
    + node.name
    + '{'
    + node.keyframes.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit keyframe node.
 */

Compiler.prototype.keyframe = function(node){
  var decls = node.declarations;

  return node.values.join(',')
    + '{'
    + decls.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit page node.
 */

Compiler.prototype.page = function(node){
  var sel = node.selectors.length
    ? node.selectors.join(', ')
    : '';

  return '@page ' + sel
    + '{'
    + node.declarations.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit rule node.
 */

Compiler.prototype.rule = function(node){
  var decls = node.declarations;
  if (!decls.length) return '';

  return node.selectors.join(',')
    + '{'
    + decls.map(this.visit, this).join('')
    + '}';
};

/**
 * Visit declaration node.
 */

Compiler.prototype.declaration = function(node){
  return node.property + ':' + node.value + ';';
};

