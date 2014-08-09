(function() {
  var Declaration, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  FlexDeclaration = (function(_super) {
    __extends(FlexDeclaration, _super);

    function FlexDeclaration() {
      _ref = FlexDeclaration.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexDeclaration.prototype.flexSpec = function(prefix) {
      return {
        v2009: prefix === '-webkit-' || prefix === '-moz-',
        v2012: prefix === '-ms-',
        final: prefix === '-webkit-'
      };
    };

    return FlexDeclaration;

  })(Declaration);

  module.exports = FlexDeclaration;

}).call(this);
