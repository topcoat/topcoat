(function() {
  var Gradient, OldValue, Value, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = require('../old-value');

  Value = require('../value');

  utils = require('../utils');

  Gradient = (function(_super) {
    var i, _i, _len, _ref;

    __extends(Gradient, _super);

    Gradient.names = ['linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient'];

    Gradient.regexps = {};

    _ref = Gradient.names;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      Gradient.regexps[i] = new RegExp('(^|\\s|,)' + i + '\\(([^)]+)\\)', 'gi');
    }

    function Gradient(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes;
      this.regexp = Gradient.regexps[this.name];
    }

    Gradient.prototype.addPrefix = function(prefix, string) {
      var _this = this;
      return string.replace(this.regexp, function(all, before, params) {
        params = params.trim().split(/\s*,\s*/);
        if (params.length > 0) {
          if (params[0].slice(0, 3) === 'to ') {
            params[0] = _this.fixDirection(params[0]);
          } else if (params[0].indexOf('deg') !== -1) {
            params[0] = _this.fixAngle(params[0]);
          }
        }
        return before + prefix + _this.name + '(' + params.join(', ') + ')';
      });
    };

    Gradient.prototype.directions = {
      top: 'bottom',
      left: 'right',
      bottom: 'top',
      right: 'left'
    };

    Gradient.prototype.fixDirection = function(param) {
      var value;
      param = param.split(' ');
      param.splice(0, 1);
      param = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = param.length; _j < _len1; _j++) {
          value = param[_j];
          _results.push(this.directions[value.toLowerCase()] || value);
        }
        return _results;
      }).call(this);
      return param.join(' ');
    };

    Gradient.prototype.roundFloat = function(float, digits) {
      return parseFloat(float.toFixed(digits));
    };

    Gradient.prototype.fixAngle = function(param) {
      param = parseFloat(param);
      param = Math.abs(450 - param) % 360;
      param = this.roundFloat(param, 3);
      return "" + param + "deg";
    };

    Gradient.prototype.old = function(prefix) {
      var regexp, string, type;
      if (prefix === '-webkit-') {
        type = this.name === 'linear-gradient' ? 'linear' : 'radial';
        string = '-gradient';
        regexp = utils.regexp("-webkit-(" + type + "-gradient|gradient\\(\\s*" + type + ")", false);
        return new OldValue(prefix + this.name, string, regexp);
      } else {
        return new OldValue(prefix + this.name);
      }
    };

    return Gradient;

  })(Value);

  module.exports = Gradient;

}).call(this);
