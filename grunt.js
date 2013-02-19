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

/*global module:false*/

var bower = {
    name: 'topcoat',
    version: '0.1.0',
    main: []
},
    component = {
        repo: 'topcoat/topcoat',
        description: 'An experimental CSS library.',
        styles: ['release/css/topcoat-min.css'],
        files: []
    },
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    base = path.join(__dirname, 'release'),
    chromiumSrc = process.env.CHROMIUM_SRC;


    module.exports = function (grunt) {

        grunt.loadNpmTasks('grunt-contrib-stylus');
        grunt.loadNpmTasks('grunt-contrib-mincss');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-jade');
        grunt.loadNpmTasks('grunt-contrib-clean');

        grunt.initConfig({
            pkg: '<json:package.json>',
            stylus: {
                compile: {
                    files: {
                        'release/css/topcoat.css': ['src/style/copyright.styl','src/style/topcoat.styl']
                    }
                }
            },

            copy: {
                dist: {
                    files: {
                        'release/font/': 'src/font/**',
                        'release/img/': 'src/img/**'
                    }
                },

				/* telemetry task, added here because grunt.js file in subfolder can't load Npm tasks */
				telemetry: {
					files: [
						{src: ['test/telemetry/perf/**'], dest: path.join(chromiumSrc, 'tools/perf/')}
						/*{src: ['test/telemetry/telemetry/**'], dest:'/tmp/perf/'}	*/
					]
				}

            },

            mincss: {
                css: {
                    src: ['src/style/copyright.styl','release/css/topcoat.css'],
                    dest: 'release/css/topcoat-min.css'
                }
            },

            watch: {
                files: ['src/style/*.styl'],
                tasks: ['stylus', 'mincss']
            }, 
            
            jade: {
              telemetry: {
                options: {
                  data: {
                    debug: false,
                    pretty: true 
                  }
                },
                files: {
                  "test/telemetry/perf/page_sets/topcoat/topcoat_buttons.html": ["test/telemetry/page_sets_src/topcoat_buttons.jade"]
                }
              }
            }, 
            
            clean: {
              telemetry: ["test/telemetry/perf/page_sets/topcoat/topcoat_buttons.html"]
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
        
        grunt.registerTask('check_chromium_src', "Internal task to store CHROMIUM_SRC env var into chromiumSrc", function() {
            if (!chromiumSrc) {
                grunt.fail.warn("Please set the CHROMIUM_SRC env var to the root of your chromium sources (ends in /src)");
            } else {
                grunt.log.writeln("CHROMIUM_SRC points to " + chromiumSrc.cyan);                
            }
        });

        // fin
        grunt.registerTask('default', 'stylus copy:dist mincss manifest');
		grunt.registerTask('telemetry', 'check_chromium_src jade:telemetry copy:telemetry');
    };
