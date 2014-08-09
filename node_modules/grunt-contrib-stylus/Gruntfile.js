/*
 * grunt-contrib-stylus
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  function testPlugin() {
    return function(style){
      style.define('test-plugin', 'yep');
    };
  }

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    // Configuration to be run (and then tested).
    stylus: {
      compile: {
        files: {
          'tmp/stylus.css': ['test/fixtures/stylus.styl'],
          'tmp/concat.css': ['test/fixtures/stylus.styl', 'test/fixtures/stylus2.styl']
        },
        options: {
          paths: ['test/fixtures/include'],
          compress: true
        }
      },
      nib: {
        files: {
          'tmp/nib_.css': 'test/fixtures/nib_/nib_.styl'
        },
        options: {
          paths: ['test/fixtures/include']
        }
      },
      autocompress: {
        files: {
          'tmp/autocompress.css': 'test/fixtures/stylus.styl'
        },
        options: {
          paths: ['test/fixtures/include']
        }
      },
      plugin: {
        files: {
          'tmp/plugin.css': 'test/fixtures/plugin/plugin.styl'
        },
        options: {
          use: [
            testPlugin
          ]
        }
      },
      embedurl: {
        files: {
          'tmp/embedurl.css': 'test/fixtures/embedurl/embedurl.styl'
        },
        options: {
          urlfunc: 'embedurl'
        }
      },
      relative: {
        files: {
          'tmp/relative.css': 'test/fixtures/relative/relative.styl'
        }
      },
      define: {
        files: {
          'tmp/define.css': 'test/fixtures/define/define.styl'
        },
        options: {
          define: {
            var1: 42,
            var2: 'Helvetica'
          }
        }
      },
      import: {
        files: {
        'tmp/import.css': 'test/fixtures/import/import.styl'
        },
        options: {
          paths: ['test/fixtures/'],
          import: [
           'include/variables',
           'nib'
          ]
        }
      },
      banner: {
        files: {
          'tmp/banner.css': 'test/fixtures/banner/banner.styl'
        },
        options: {
          paths: ['test/fixtures/'],
          banner: '/* test css banner */\n'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'stylus', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);

};
