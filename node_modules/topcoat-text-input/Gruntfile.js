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
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            release: ['css'],
        },

        stylus: {
            mobilelight: {
                options: {
                    paths: ['node_modules/topcoat-input-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-mobile-light', 'nib'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-text-input.styl',
                    dest: 'css/topcoat-text-input-mobile-light.css'
                }]
            },
            mobiledark: {
                options: {
                    paths: ['node_modules/topcoat-input-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-mobile-dark', 'nib'],
                    compress: false
                },
                files: [{
                    src: 'src/topcoat-text-input.styl',
                    dest: 'css/topcoat-text-input-mobile-dark.css'
                }]
            },

            desktoplight: {
                options: {
                    paths: ['node_modules/topcoat-input-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-desktop-light', 'nib'],
                    compress: false
                },
                files: [{
                    src: 'src/topcoat-text-input.styl',
                    dest: 'css/topcoat-text-input-desktop-light.css'
                }]
            },

            desktopdark: {
                options: {
                    paths: ['node_modules/topcoat-input-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-desktop-dark', 'nib'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-text-input.styl',
                    dest: 'css/topcoat-text-input-desktop-dark.css'
                }]
            }
        },

        topdoc: {
            usageguides: {
                options: {
                    source: 'css',
                    destination: 'demo',
                    template: 'node_modules/topdoc-theme/',
                    templateData: {
                      "title": "Topcoat",
                      "subtitle": "CSS for clean and fast web apps",
                      "homeURL": "http://topcoat.io"
                    }
                }
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-topdoc');

    grunt.registerTask('default', ['clean', 'build', 'test','release']);
    grunt.registerTask('build', ['stylus']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('release', ['cssmin', 'topdoc']);
};
