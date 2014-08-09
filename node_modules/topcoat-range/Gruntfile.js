/**
 *
 * Copyright 2012 Adobe Systems Inc.;
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/*global module:false*/

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        clean: {
            release: ['css'],
        },

        stylus: {
            options: {
                paths: grunt.file.expand('node_modules/topcoat-*/src'),
                compress: false
            },

            mobilelight: {
                options: {
                  import: ['theme-topcoat-mobile-light']
                },
                files: [{
                    src: 'src/topcoat-range.styl',
                    dest: 'css/topcoat-range-mobile-light.css'
                }]
            },

            mobiledark: {
                options: {
                  import: ['theme-topcoat-mobile-dark']
                },
                files: [{
                    src: 'src/topcoat-range.styl',
                    dest: 'css/topcoat-range-mobile-dark.css'
                }]
            },

            desktoplight: {
                options: {
                  import: ['theme-topcoat-desktop-light']
                },
                files: [{
                    src: 'src/topcoat-range.styl',
                    dest: 'css/topcoat-range-desktop-light.css'
                }]
            },

            desktopdark: {
                options: {
                  import: ['theme-topcoat-desktop-dark']
                },
                files: [{
                    src: 'src/topcoat-range.styl',
                    dest: 'css/topcoat-range-desktop-dark.css'
                }]
            }
        },

        topdoc: {
            usageguides: {
                options: {
                    source: 'css',
                    destination: "demo",
                    template: "node_modules/topdoc-theme/",
                    templateData: {
                      "title": "Topcoat",
                      "subtitle": "CSS for clean and fast web apps",
                      "homeURL": "http://topcoat.io"
                    }
                }
            }
        },

        autoprefixer: {
            dist: {
                options: {
                    /*
                     * Add target browsers here
                     * https://github.com/ai/autoprefixer#browsers
                     * browsers: ['android 4']
                     */
                },
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css'
                }]
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

        simplemocha: {
            all: {
                src: ['test/*.test.js']
            }
        },

        watch: {
            files: 'src/**/*.styl',
            tasks: ['build', 'test']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-topdoc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // Default task.
    grunt.registerTask('default', ['clean', 'build', 'test', 'release']);
    grunt.registerTask('build', ['stylus', 'autoprefixer']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('release', ['topdoc', 'cssmin']);

};
