(function() {
  var FlexDeclaration, JustifyContent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  JustifyContent = (function(_super) {
    __extends(JustifyContent, _super);

    JustifyContent.names = ['justify-content', 'flex-pack', 'box-pack'];

    JustifyContent.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute'
    };

    function JustifyContent() {
      JustifyContent.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'justify-content';
      this.prop = this.prefix + this.unprefixed;
    }

    JustifyContent.prototype.prefixProp = function(prefix) {
      var oldValue, spec;
      spec = this.flexSpec(prefix);
      oldValue = JustifyContent.oldValues[this.value] || this.value;
      if (spec.v2009) {
        if (this.value !== 'space-around') {
          this.insertBefore(prefix + 'box-pack', oldValue);
        }
      }
      if (spec.v2012) {
        this.insertBefore(prefix + 'flex-pack', oldValue);
      }
      if (spec.final) {
        return JustifyContent.__super__.prefixProp.apply(this, arguments);
      }
    };

    return JustifyContent;

  })(FlexDeclaration);

  module.exports = JustifyContent;

}).call(this);
