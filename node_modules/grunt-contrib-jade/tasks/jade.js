/*
 * grunt-contrib-jade
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('jade', 'Compile Jade templates into HTML.', function() {
    var options = this.options({
      data: {}
    });

    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function(f) {
      var output = f.src.map(function(file) {
        return compileJade(file, options, options.data);
      }).join(grunt.util.normalizelf(grunt.util.linefeed));

      if (output.length < 1) {
        grunt.log.warn('Destination not written because compiled files were empty.');
      } else {
        grunt.file.write(f.dest, output);
        grunt.log.writeln('File ' + f.dest.cyan + ' created.');
      }
    });
  });

  var compileJade = function(srcFile, options, data) {
    options = grunt.util._.extend({filename: srcFile}, options);
    delete options.data;

    var srcCode = grunt.file.read(srcFile);

    try {
      return require('jade').compile(srcCode, options)(data);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('Jade failed to compile.');
    }
  };
};
