
/**
 * Expose compiler.
 */

module.exports = Compiler;

/**
 * Initialize a new `Compiler`.
 */

function Compiler(options) {
  options = options || {};
  this.indentation = options.indent;
}

/**
 * Compile `node`.
 */

Compiler.prototype.compile = function(node){
  return this.stylesheet(node);
};

/**
 * Visit `node`.
 */

Compiler.prototype.visit = function(node){
  return this[node.type](node);
};

/**
 * Visit stylesheet node.
 */

Compiler.prototype.stylesheet = function(node){
  return node.stylesheet
    .rules.map(this.visit, this)
    .join('\n\n');
};

/**
 * Visit comment node.
 */

Compiler.prototype.comment = function(node){
  return this.indent() + '/*' + node.comment + '*/';
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
    + ' {\n'
    + this.indent(1)
    + node.rules.map(this.visit, this).join('\n\n')
    + this.indent(-1)
    + '\n}';
};

/**
 * Visit document node.
 */

Compiler.prototype.document = function(node){
  var doc = '@' + (node.vendor || '') + 'document ' + node.document;

  return doc + ' '
    + ' {\n'
    + this.indent(1)
    + node.rules.map(this.visit, this).join('\n\n')
    + this.indent(-1)
    + '\n}';
};

/**
 * Visit charset node.
 */

Compiler.prototype.charset = function(node){
  return '@charset ' + node.charset + ';\n';
};

/**
 * Visit namespace node.
 */

Compiler.prototype.namespace = function(node){
  return '@namespace ' + node.namespace + ';\n';
};

/**
 * Visit supports node.
 */

Compiler.prototype.supports = function(node){
  return '@supports '
    + node.supports
    + ' {\n'
    + this.indent(1)
    + node.rules.map(this.visit, this).join('\n\n')
    + this.indent(-1)
    + '\n}';
};

/**
 * Visit keyframes node.
 */

Compiler.prototype.keyframes = function(node){
  return '@'
    + (node.vendor || '')
    + 'keyframes '
    + node.name
    + ' {\n'
    + this.indent(1)
    + node.keyframes.map(this.visit, this).join('\n')
    + this.indent(-1)
    + '}';
};

/**
 * Visit keyframe node.
 */

Compiler.prototype.keyframe = function(node){
  var decls = node.declarations;

  return this.indent()
    + node.values.join(', ')
    + ' {\n'
    + this.indent(1)
    + decls.map(this.visit, this).join('\n')
    + this.indent(-1)
    + '\n' + this.indent() + '}\n';
};

/**
 * Visit page node.
 */

Compiler.prototype.page = function(node){
  var sel = node.selectors.length
    ? node.selectors.join(', ') + ' '
    : '';

  return '@page ' + sel
    + '{\n'
    + this.indent(1)
    + node.declarations.map(this.visit, this).join('\n')
    + this.indent(-1)
    + '\n}';
};

/**
 * Visit rule node.
 */

Compiler.prototype.rule = function(node){
  var indent = this.indent();
  var decls = node.declarations;
  if (!decls.length) return '';

  return node.selectors.map(function(s){ return indent + s }).join(',\n')
    + ' {\n'
    + this.indent(1)
    + decls.map(this.visit, this).join('\n')
    + this.indent(-1)
    + '\n' + this.indent() + '}';
};

/**
 * Visit declaration node.
 */

Compiler.prototype.declaration = function(node){
  return this.indent() + node.property + ': ' + node.value + ';';
};

/**
 * Increase, decrease or return current indentation.
 */

Compiler.prototype.indent = function(level) {
  this.level = this.level || 1;

  if (null != level) {
    this.level += level;
    return '';
  }

  return Array(this.level).join(this.indentation || '  ');
};
