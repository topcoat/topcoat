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
    os = require('os'),
    chromiumSrc = process.env.CHROMIUM_SRC || "";


module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        stylus: {
            options: {
                paths: grunt.file.expand(__dirname + '/node_modules/topcoat-*/src/')
                        /*
                         * FIXME: We need to refactor all components to
                         * remove mixins directory *See button & button-base
                         */
                         .concat(grunt.file.expand('node_modules/topcoat-*/src/mixins')),
            },

            mobilelight: {
                options: {
                    import: ['theme-topcoat-mobile-light', 'nib'],
                    compress: false
                },

                files: [{
                    src: 'node_modules/topcoat-*/src/**/*.styl',
                    dest: 'css/topcoat-mobile-light.css'
                }]
            },

            mobiledark: {
                options: {
                    import: ['theme-topcoat-mobile-dark', 'nib'],
                    compress: false
                },

                files: [{
                    src: 'node_modules/topcoat-*/src/**/*.styl',
                    dest: 'css/topcoat-mobile-dark.css'
                }]
            },

            desktoplight: {
                options: {
                    import: ['theme-topcoat-desktop-light', 'nib'],
                    compress: false
                },
                files: [{
                    src: 'node_modules/topcoat-*/src/**/*.styl',
                    dest: 'css/topcoat-desktop-light.css'
                }]
            },

            desktopdark: {
                options: {
                    import: ['theme-topcoat-desktop-dark', 'nib'],
                    compress: false
                },

                files: [{
                    src: 'node_modules/topcoat-*/src/**/*.styl',
                    dest: 'css/topcoat-desktop-dark.css'
                }]
            }
        },

        topdoc: {
            usageguides: {
                options: {
                    source: 'css',
                    destination: './',
                    template: '<%= pkg.topdoc.template %>',
                    templateData: '<%= pkg.topdoc.templateData %>'
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'css',
                src: ['*.css', '!*.min.css'],
                dest: 'css',
                ext: '.min.css'
            }
        },

        htmlmin: {
            telemetry: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    src: ['dev/test/**/topcoat/*.html'],
                    dest: '',
                    ext: '.test.html',
                }],
            },
        },

        clean: {
            release: ['css']
        },

        copy: {
            release: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'node_modules/topcoat-theme/font/**',
                    dest: 'font'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'node_modules/topcoat-theme/img/*',
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
                    expand: true,
                    flatten: true,
                    src: 'node_modules/topcoat-theme/font/**',
                    dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/release/font')
                }, {
                    expand: true,
                    flatten: true,
                    src: 'node_modules/topcoat-theme/img/*',
                    dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/release/img')
                }, {
                    src: ['css/**'],
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
            files: ['src/**/*.styl'],
            tasks: ['compile']
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-topdoc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    //Load local tasks
    grunt.loadTasks('dev/tasks');

    // Default task.
    grunt.registerTask('default', ['clean', 'stylus', 'cssmin', 'topdoc', 'copy:release']);
    grunt.registerTask('release', ['default', 'clean:src']);
    grunt.registerTask('compile', ['topcoat:compile', 'topdoc', 'copy:release']);

    grunt.registerTask('telemetry', '', function(platform, theme) {
        if (chromiumSrc === "") grunt.fail.warn("Set CHROMIUM_SRC to point to the correct location\n");
        grunt.task.run('check_chromium_src', 'perf:'.concat(platform || 'mobile').concat(':').concat(theme || 'light'), 'htmlmin:telemetry', 'copy:telemetry');
    });
};
