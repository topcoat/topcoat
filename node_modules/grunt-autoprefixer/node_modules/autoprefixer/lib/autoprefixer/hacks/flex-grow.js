(function() {
  var Flex, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  Flex = (function(_super) {
    __extends(Flex, _super);

    function Flex() {
      _ref = Flex.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Flex.names = ['flex-grow'];

    Flex.prototype.prefixProp = function(prefix) {
      var spec;
      spec = this.flexSpec(prefix);
      if (spec.v2009) {
        this.insertBefore(prefix + 'box-flex', this.value);
      }
      if (spec.v2012) {
        this.insertBefore(prefix + 'flex', this.value);
      }
      if (spec.final) {
        return Flex.__super__.prefixProp.apply(this, arguments);
      }
    };

    return Flex;

  })(FlexDeclaration);

  module.exports = Flex;

}).call(this);
