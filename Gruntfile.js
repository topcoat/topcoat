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
                    source: '<%= topcoat.compile.options.releasePath %>/',
                    destination: './',
                    template: 'https://github.com/topcoat/usage-guide-theme',
                    templateData: '<%= pkg.topdoc.templateData %>'
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
                src: '<%= topcoat.options.themePath %>/*.zip',
                dest: '<%= topcoat.options.themePath %>/'
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

        htmlmin: {
            telemetry: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files:[{
                    expand: true,
                    src: ['dev/test/**/topcoat/*.html'],
                    dest: '',
                    ext: '.test.html',
                }],
            },
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
            },
            telemetry: {
                files: [{
                    expand: true,
                    cwd: 'dev/test/perf/telemetry/perf/',
                    src: ['**'],
                    dest: path.join(chromiumSrc, 'tools/perf/')
                }, {
                    src: ['<%= topcoat.compile.options.releasePath %>/**'],
                    dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/release/')
                }]
            }
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
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    //Load local tasks
    grunt.loadTasks('dev/tasks');

    // Default task.
    grunt.registerTask('default', ['clean', 'topcoat', 'cssmin', 'topdoc', 'copy:release']);
    grunt.registerTask('release', ['default', 'clean:src']);
    grunt.registerTask('compile', ['topcoat:compile', 'topdoc', 'copy:release']);

    grunt.registerTask('telemetry', '', function(platform, theme) {
        if (chromiumSrc === "") grunt.fail.warn("Set CHROMIUM_SRC to point to the correct location\n");
        grunt.task.run('check_chromium_src', 'perf:'.concat(platform || 'mobile').concat(':').concat(theme || 'light'), 'htmlmin:telemetry', 'copy:telemetry');
    });
};
