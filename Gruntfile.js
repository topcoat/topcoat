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

var
component = { /* see https://github.com/component/component/wiki/Spec for a description of what this should contain */
    name: 'topcoat',
    repo: 'topcoat/topcoat',
    version: '0.2.0',
    description: 'An Open Source UI Library for creating beautiful and responsive applications using web standards',
    main: [],
    styles: [],
    images: [],
    fonts: [],
    files: [],
},
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    chromiumSrc = process.env.CHROMIUM_SRC;

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        stylus: {
            compile: {
                options: {
                    compress: false
                },
                files: {
                    'release/css/topcoat-desktop.css': ['src/style/copyright.styl', 'src/style/topcoat-desktop.styl']
                }
            },
            minify: {
                options: {
                    compress: true
                },
                files: {
                    'release/css/topcoat-desktop-min.css': ['src/style/copyright.styl', 'src/style/topcoat-desktop.styl']
                }
            }
        },

        clean: ["release"],

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/font/',
                    src: '**',
                    dest: 'release/font/'
                }, {
                    expand: true,
                    flatten: true,
                    src: 'src/img/*',
                    dest: 'release/img'
                }]
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
            }

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
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['clean',  'stylus', 'copy:dist', 'manifest']);

    /* the manifest for component.json is used by Bower */
    grunt.registerTask('manifest', 'Generates component.json file.', function() {
        var base = path.join(__dirname, 'release');

        function addFilesToCollection(collection, basePath, localPath) {
            fs.readdirSync(path.join(basePath, localPath)).forEach(function(file) {
                if (fs.statSync(path.join(basePath, localPath, file)).isDirectory()) {
                    addFilesToCollection(collection, basePath, path.join(localPath, file));
                } else {
                    collection.push(path.join("release", localPath, file));
                }
            });
        }

        fs.readdirSync(base).forEach(function(dir) {
            switch (dir) {
            case "css":
                {
                    addFilesToCollection(component.styles, base, dir);
                    break;
                }
            case "font":
                {
                    addFilesToCollection(component.fonts, base, dir);
                    break;
                }
            case "img":
                {
                    addFilesToCollection(component.images, base, dir);
                    break;
                }
            default:
                {
                    addFilesToCollection(component.images, base, dir);
                    break;
                }
            }

            /* bower needs everything to be pushed in main */
            addFilesToCollection(component.main, base, dir);
        });

        var c = JSON.stringify(component, null, 4);
        fs.writeFileSync(path.join(__dirname, 'component.json'), c, 'utf8');
    });

    grunt.registerTask('check_chromium_src', "Internal task to store CHROMIUM_SRC env var into chromiumSrc", function() {
        if (!chromiumSrc) {
            grunt.fail.warn("Please set the CHROMIUM_SRC env var to the root of your chromium sources (ends in /src)");
        } else {
            grunt.log.writeln("CHROMIUM_SRC points to " + chromiumSrc.cyan);
        }
    });

    grunt.registerTask('telemetry', ['check_chromium_src', 'jade:telemetry', 'copy:telemetry']);
    grunt.registerTask('telemetry-submit', 'Submit telemetry test results', function() {

        var exec = require("child_process").exec,
            commandToBeExecuted = 'git log --pretty=format:"%H %ai" | head -n 1',
            done = this.async();

        exec(commandToBeExecuted, function(error, stdout, stderr) {
            if (error) {
                grunt.log.error('Error');
                console.log(error);
                done();
            } else {

                var path = grunt.option('path'),
                    device = grunt.option('device'),
                    test = grunt.option('test');

                if (!path) {
                    console.log('No path file specified');
                    console.log('Usage: grunt telemetry-submit --path=path_to_output_file [--test= Test name ] [--device= Device type ]');
                } else {
                    var submitData = require('./test/perf/telemetry/lib/submitData');
                    submitData(stdout, path, {
                        device: device,
                        test: test
                    });
                }
            }
        });

    });
};
