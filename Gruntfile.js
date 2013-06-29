/*
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*global module:false, require:false, process:false*/

var path = require('path'),
    debug = require('debug')('build'),
    os = require('os'),
    chromiumSrc = process.env.CHROMIUM_SRC || "";

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        topcoat: {
            options: {
                repos: '<%= pkg.topcoat %>',
                src: 'src',
                controlsPath: '<%= topcoat.options.src %>/controls',
                skinsPath: '<%= topcoat.options.src %>/skins',
                themePath: '<%= topcoat.options.src %>/theme',
                utilsPath: '<%= topcoat.options.src %>/utils',
            },
            download: {
                options: {
                    hostname: 'https://github.com/',
                    proxy: '',
                    download: true,
                    compile: false
                }
            },
            compile: {
                options: {
                    themePrefix: 'theme',
                    download: false,
                    compile: true,
                    releasePath: 'css'
                }
            }
        },

        topdoc: {
            usageguides: {
                options: {
                    source: '<%= topcoat.compile.releasePath %>',
                    destination: '.',
                    template: 'http://github.com/topcoat/usage-guide-theme',
                    templateData: '<%= pkg.topdoc %>'
                }
            }
        },

        unzip: {
            controls: {
                src: '<%= topcoat.options.controlsPath %>/*.zip',
                dest: '<%= topcoat.options.controlsPath %>'
            },
            utils: {
                src: '<%= topcoat.options.utilsPath %>/*.zip',
                dest: '<%= topcoat.options.utilsPath %>'
            },
            theme: {
                src: '<%= topcoat.options.src %>/*.zip',
                dest: '<%= topcoat.options.src %>/'
            },
            skins: {
                src: '<%= topcoat.options.skinsPath %>/*.zip',
                dest: '<%= topcoat.options.skinsPath %>/'
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= topcoat.compile.options.releasePath %>/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= topcoat.compile.options.releasePath %>/',
                ext: '.min.css'
            }
        },

        clean: {
            src: ['<%= topcoat.options.src %>/'],
            release: ['<%= topcoat.compile.options.releasePath %>/'],
            zip: ['<%= topcoat.options.src %>/**/*.zip']
        },

        copy: {
            release: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: '<%= topcoat.options.themePath %>/**/font/**',
                    dest: 'font'
                }, {
                    expand: true,
                    flatten: true,
                    src: '<%= topcoat.options.themePath %>/**/img/*',
                    dest: 'img'
                }]
            }
        },

        /* telemetry task, added here because grunt.js file in subfolder can't load Npm tasks */
        telemetry: {
            files: [{
                expand: true,
                cwd: 'dev/test/perf/telemetry/perf/',
                src: ['**'],
                dest: path.join(chromiumSrc, 'tools/perf/')
            }, {
                src: ['<%= topcoat.compile.options.releasePath %>/**'],
                dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/')
            }, {
                expand: true,
                flatten: true,
                src: ['<%= topcoat.compile.options.controlsPath %>/**/release/**/*.css'],
                dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/releaseBase/')
            }]
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['dev/lib/**/*.js', 'dev/test/**/*.js']
            }
        },

        watch: {
            files: ['<%= topcoat.options.srcPath %>/**/*.styl'],
            tasks: ['compile']
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-topcoat');
    grunt.loadNpmTasks('grunt-topdoc');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //Load local tasks
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', ['clean', 'topcoat', 'compile', 'cssmin', 'topdoc', 'copy']);
    grunt.registerTask('release', ['compile', 'cssmin', 'topdoc', 'copy', 'clean:src']);
    grunt.registerTask('compile', ['compile', 'topdoc', 'copy']);

    grunt.registerTask('telemetry', '', function(platform, theme) {
        if (chromiumSrc === "") grunt.fail.warn("Set CHROMIUM_SRC to point to the correct location\n");
        grunt.task.run('check_chromium_src', 'perf:'.concat(platform || 'mobile').concat(':').concat(theme || 'light'), 'copy:telemetry');
    });
};
