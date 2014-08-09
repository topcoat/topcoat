/*
 * grunt-contrib-stylus
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('stylus', 'Compile Stylus files into CSS', function() {
    var done = this.async();
    var path = require('path');

    var options = this.options({
      banner: '',
      compress: true
    });

    var banner = grunt.template.process(options.banner);

    if (options.basePath || options.flatten) {
      grunt.fail.warn('Experimental destination wildcards are no longer supported. please refer to README.');
    }

    grunt.verbose.writeflags(options, 'Options');

    grunt.util.async.forEachSeries(this.files, function(f, n) {
      var destFile = path.normalize(f.dest);
      var srcFiles = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      if (srcFiles.length === 0) {
        // No src files, goto next target. Warn would have been issued above.
        n();
      }

      var compiled = [];
      grunt.util.async.concatSeries(srcFiles, function(file, next) {
        compileStylus(file, options, function(css, err) {
          if (!err) {
            compiled.push(css);
            next(null);
          } else {
            n(false);
          }
        });
      }, function() {
        if (compiled.length < 1) {
          grunt.log.warn('Destination not written because compiled files were empty.');
        } else {
          grunt.file.write(destFile, banner + compiled.join(grunt.util.normalizelf(grunt.util.linefeed)));
          grunt.log.writeln('File ' + destFile.cyan + ' created.');
        }
        n();
      });
    }, done);
  });

  var compileStylus = function(srcFile, options, callback) {
    options = grunt.util._.extend({filename: srcFile}, options);

    // Never compress output in debug mode
    if (grunt.option('debug')) {
      options.compress = false;
    }

    var srcCode = grunt.file.read(srcFile);
    var stylus = require('stylus');
    var s = stylus(srcCode);

    grunt.util._.each(options, function(value, key) {
      if (key === 'urlfunc') {
        // Custom name of function for embedding images as Data URI
        s.define(value, stylus.url());
      } else if (key === 'use') {
        value.forEach(function(func) {
          if (typeof func === 'function') {
            s.use(func());
          }
        });
      } else if (key === 'define') {
        for (var defineName in value) {
          s.define(defineName, value[defineName]);
        }
      } else if (key === 'import') {
        value.forEach(function(stylusModule) {
          s.import(stylusModule);
        });
      } else {
        s.set(key, value);
      }
    });

    // Load Nib if available
    try {
      s.use(require('nib')());
    } catch (e) {}

    s.render(function(err, css) {
      if (err) {
        grunt.log.error(err);
        grunt.fail.warn('Stylus failed to compile.');

        callback(css, true);
      } else {
        callback(css, null);
      }
    });
  };
};
