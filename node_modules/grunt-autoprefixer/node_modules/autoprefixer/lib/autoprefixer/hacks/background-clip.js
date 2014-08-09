(function() {
  var BackgroundClip, Declaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = require('../declaration');

  BackgroundClip = (function(_super) {
    __extends(BackgroundClip, _super);

    BackgroundClip.names = ['background-clip'];

    function BackgroundClip() {
      BackgroundClip.__super__.constructor.apply(this, arguments);
      if (this.value.indexOf('text') !== -1) {
        this.unprefixed = this.prop = '-nonstandard-background-clip';
      }
    }

    return BackgroundClip;

  })(Declaration);

  module.exports = BackgroundClip;

}).call(this);
