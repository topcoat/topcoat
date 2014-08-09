(function() {
  var __slice = [].slice;

  module.exports = function(updater) {
    var prefix, prefixes,
      _this = this;
    prefixes = {};
    prefix = function() {
      var data, name, names, _i, _j, _len, _results;
      names = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), data = arguments[_i++];
      _results = [];
      for (_j = 0, _len = names.length; _j < _len; _j++) {
        name = names[_j];
        _results.push(prefixes[name] = data);
      }
      return _results;
    };
    this.feature('border-radius.json', function(browsers) {
      prefix('border-radius', {
        browsers: browsers,
        transition: true
      });
      prefix('border-top-left-radius', {
        browsers: browsers,
        transition: true
      });
      prefix('border-top-right-radius', {
        browsers: browsers,
        transition: true
      });
      prefix('border-bottom-right-radius', {
        browsers: browsers,
        transition: true
      });
      return prefix('border-bottom-left-radius', {
        browsers: browsers,
        transition: true
      });
    });
    this.feature('css-boxshadow.json', function(browsers) {
      return prefix('box-shadow', {
        browsers: browsers,
        transition: true
      });
    });
    this.feature('css-animation.json', function(browsers) {
      return prefix('animation', 'animation-name', 'animation-duration', 'animation-delay', 'animation-direction', 'animation-fill-mode', 'animation-iteration-count', 'animation-play-state', 'animation-timing-function', '@keyframes', {
        browsers: browsers
      });
    });
    this.feature('css-transitions.json', function(browsers) {
      return prefix('transition', 'transition-property', 'transition-duration', 'transition-delay', 'transition-timing-function', {
        browsers: browsers
      });
    });
    this.feature('transforms2d.json', function(browsers) {
      prefix('transform', 'transform-origin', 'perspective', 'perspective-origin', {
        browsers: browsers,
        transition: true
      });
      return prefix('transform-style', 'backface-visibility', {
        browsers: browsers
      });
    });
    this.feature('css-gradients.json', function(browsers) {
      return prefix('linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient', {
        props: ['background', 'background-image', 'border-image'],
        browsers: browsers
      });
    });
    this.feature('css3-boxsizing.json', function(browsers) {
      return prefix('box-sizing', {
        browsers: browsers
      });
    });
    this.feature('css-filters.json', function(browsers) {
      return prefix('filter', {
        browsers: browsers,
        transition: true
      });
    });
    this.feature('multicolumn.json', function(browsers) {
      prefix('columns', 'column-width', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-width', {
        browsers: browsers,
        transition: true
      });
      return prefix('column-count', 'column-rule-style', 'column-span', 'column-fill', 'break-before', 'break-after', 'break-inside', {
        browsers: browsers
      });
    });
    this.feature('user-select-none.json', function(browsers) {
      return prefix('user-select', {
        browsers: browsers
      });
    });
    this.feature('flexbox.json', function(browsers) {
      prefix('display-flex', {
        browsers: browsers
      });
      prefix('flex', 'flex-grow', 'flex-shrink', 'flex-basis', {
        transition: true,
        browsers: browsers
      });
      return prefix('flex-direction', 'flex-wrap', 'flex-flow', 'justify-content', 'order', 'align-items', 'align-self', 'align-content', {
        browsers: browsers
      });
    });
    this.feature('calc.json', function(browsers) {
      return prefix('calc', {
        props: ['*'],
        browsers: browsers
      });
    });
    this.feature('background-img-opts.json', function(browsers) {
      return prefix('background-clip', 'background-origin', 'background-size', {
        browsers: browsers
      });
    });
    this.feature('font-feature.json', function(browsers) {
      return prefix('font-feature-settings', 'font-variant-ligatures', 'font-language-override', 'font-kerning', {
        browsers: browsers
      });
    });
    this.feature('border-image.json', function(browsers) {
      return prefix('border-image', {
        browsers: browsers
      });
    });
    this.feature('css-selection.json', function(browsers) {
      return prefix('::selection', {
        selector: true,
        browsers: browsers
      });
    });
    this.feature('css-placeholder.json', function(browsers) {
      return prefix('::placeholder', {
        selector: true,
        browsers: browsers
      });
    });
    this.feature('css-hyphens.json', function(browsers) {
      return prefix('hyphens', {
        browsers: browsers
      });
    });
    this.feature('fullscreen.json', function(browsers) {
      return prefix(':fullscreen', {
        selector: true,
        browsers: browsers
      });
    });
    this.feature('css3-tabsize.json', function(browsers) {
      return prefix('tab-size', {
        browsers: browsers
      });
    });
    return this.done(function() {
      return _this.save('prefixes', prefixes);
    });
  };

}).call(this);
