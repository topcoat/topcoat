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
    chromiumSrc = process.env.CHROMIUM_SRC;

module.exports = function (grunt) {
    'use strict';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        topcoat: {
            download: {
                options: {
                    srcPath: "src/",
                    repos: "<%= pkg.topcoat %>"
                }
            }
        },

        unzip: {
            controls: {
                src: "src/controls/*.zip",
                dest: "src/controls"
            },
            utils: {
                src: "src/utils/*.zip",
                dest: "src/utils"
            },
            theme: {
                src: "src/*.zip",
                dest: "src/"
            },
            skins: {
                src: "src/skins/*.zip",
                dest: "src/skins"
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'release/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'release/css/',
                ext: '.min.css'
            }
        },

        clean: {
            src: ['src'],
            release: ['release'],
            docs: ['docs'],
            zip: ['src/*.zip', 'src/controls/*.zip', 'src/skins/*.zip', 'src/utils/*.zip']
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'src/**/font/**',
                    dest: 'release/font/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/**/img/*',
                    dest: 'release/img'
                }]
            },
            docs: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'src/**/font/**',
                    dest: 'docs/font/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/**/img/*',
                    dest: 'docs/img'
                }]
            }
        },

        /* telemetry task, added here because grunt.js file in subfolder can't load Npm tasks */
        telemetry: {
            files: [{
                expand: true,
                cwd: 'test/perf/telemetry/perf/',
                src: ['**'],
                dest: path.join(chromiumSrc, 'tools/perf/')
            }, {
                src: ['release/**'],
                dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/')
            }, {
                expand: true,
                cwd: 'components/topcoat-button/',
                src: ['release/**'],
                dest: path.join(chromiumSrc, 'tools/perf/page_sets/topcoat/')
            }]
        },


        jade: {
            telemetry: {
                options: {
                    data: {
                        debug: false,
                        pretty: true
                    }
                },
                files: [{ //todo see if expandMapping can be used instead of listing them all - https://github.com/gruntjs/grunt-contrib/issues/95
                    dest: path.join(chromiumSrc, "tools/perf/page_sets/topcoat/topcoat_buttons.html"),
                    src: "test/perf/telemetry/perf/page_sets/topcoat/topcoat_buttons.jade"
                }, {
                    dest: path.join(chromiumSrc, "tools/perf/page_sets/topcoat/topcoat_buttons_no_theme.html"),
                    src: "test/perf/telemetry/perf/page_sets/topcoat/topcoat_buttons_no_theme.jade"
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
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },

        watch: {
            files: ['src/style/*.styl'],
            tasks: ['stylus']
        },

        styleguide: {
            docs: {
                files: {
                    'docs/styleguide': ['release/css/*.css', '!release/css/*.min.css']
                },
                options : {
                    include : ['build/styleguide.js', 'build/styleguide.css']
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-topcoat');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-styleguide');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //Load local tasks
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', ['clean', 'topcoat', 'compile', 'cssmin', 'copy:dist', 'styleguide', 'copy:docs']);
    grunt.registerTask('release', ['compile', 'cssmin', 'copy:dist', 'styleguide', 'copy:docs', 'clean:src']);
    grunt.registerTask('docs', ['clean:docs', 'compile', 'styleguide', 'copy:docs']);
    grunt.registerTask('telemetry', ['check_chromium_src', 'jade:telemetry', 'copy:telemetry']);

};
