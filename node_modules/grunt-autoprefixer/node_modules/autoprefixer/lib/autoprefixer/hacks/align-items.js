(function() {
  var AlignItems, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = require('./flex-declaration');

  AlignItems = (function(_super) {
    __extends(AlignItems, _super);

    AlignItems.names = ['align-items', 'flex-align', 'box-align'];

    AlignItems.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start'
    };

    function AlignItems() {
      AlignItems.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'align-items';
      this.prop = this.prefix + this.unprefixed;
    }

    AlignItems.prototype.prefixProp = function(prefix) {
      var oldValue, spec;
      spec = this.flexSpec(prefix);
      oldValue = AlignItems.oldValues[this.value] || this.value;
      if (spec.v2009) {
        this.insertBefore(prefix + 'box-align', oldValue);
      }
      if (spec.v2012) {
        this.insertBefore(prefix + 'flex-align', oldValue);
      }
      if (spec.final) {
        return AlignItems.__super__.prefixProp.apply(this, arguments);
      }
    };

    return AlignItems;

  })(FlexDeclaration);

  module.exports = AlignItems;

}).call(this);
