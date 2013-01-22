/*!
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

/*global module:false*/

var bower = {
    name: 'topcoat',
    version: '0.1.0',
    main: []
},
    component = {
        repo: 'adobe/topcoat',
        description: 'An experimental CSS library.',
        styles: ['release/css/topcoat-min.css'],
        files: []
    },
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    base = path.join(__dirname, 'release');


    module.exports = function (grunt) {

        grunt.loadNpmTasks('grunt-contrib-stylus');
        grunt.loadNpmTasks('grunt-contrib-mincss');
        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.initConfig({
            stylus: {
                compile: {
                    options: {
                        // paths: ['path/to/import', 'another/to/import'],
                        // urlfunc: 'embedurl',
                        // use embedurl('test.png') in our code to trigger Data URI embedding
                        // use: [
                            // require('nib')
                        // ]
                    },
                    files: {
                        'release/css/topcoat.css': 'src/style/topcoat.styl'
                    }
                }
            },

            copy: {
                dist: {
                    files: {
                        'release/font/': 'src/font/**',
                        'release/img/': 'src/img/**'
                    }
                }
            },

            mincss: {
                css: {
                    src: 'release/css/topcoat.css',
                    dest: 'release/css/topcoat-min.css'
                }
            },

            watch: {
                files: ['src/style/*.styl'],
                tasks: ['stylus', 'mincss']
            }
        });

        /* the manifest for component.json is used by Bower */
        grunt.registerTask('manifest', 'Generates component.json file.', function() {
            fs.readdirSync(base).forEach(function(dir) {
                var srcDir = path.join(base, dir);
                fs.readdirSync(srcDir).forEach(function(srcFile) {
                    var srcFilePath = path.join('release', dir, srcFile);
                    // I do not understand why Bower requires a manifest if it relies on git solely. But whatever.
                    bower.main.push(srcFilePath);
                    // now adding fonts and images for Component
                    if(dir != 'css') component.files.push(srcFilePath);
                });
            });
            var c = JSON.stringify(_.extend(bower, component), null, 4);
            fs.writeFileSync(path.join(__dirname, 'component.json'), c, 'utf8');
        });

        // fin
        grunt.registerTask('default', 'stylus copy mincss manifest');
    };
