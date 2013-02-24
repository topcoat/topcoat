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
					'release/css/topcoat.css': ['src/style/copyright.styl', 'src/style/topcoat.styl']
				}
			},
			minify: {
				options: {
					compress: true
				},
				files: {
					'release/css/topcoat-min.css': ['src/style/copyright.styl', 'src/style/topcoat.styl']
				}
			}
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					flatten: true,
					src: 'src/font/**',
					dest: 'release/font/'
				}, {
					expand: true,
					flatten: true,
					src: 'src/img/**',
					dest: 'release/img/'
				}]
		},

		/* telemetry task, added here because grunt.js file in subfolder can't load Npm tasks */
		telemetry: {
			files: [{
				src: ['test/perf/telemetry/perf/**'],
				dest: path.join(chromiumSrc, 'tools/perf/')
			} /*{src: ['test/telemetry/telemetry/**'], dest:'/tmp/perf/'} */ ]
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
			files: {
				"test/perf/telemetry/perf/page_sets/topcoat/topcoat_buttons.html": ["test/perf/telemetry/page_sets_src/topcoat_buttons.jade"]
			}
		}
	},

	clean: {
		telemetry: ["test/perf/telemetry/perf/page_sets/topcoat/topcoat_buttons.html"]
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
grunt.loadNpmTasks('grunt-contrib-mincss');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-jade');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-contrib-watch');

// Default task.
grunt.registerTask('default', ['stylus', 'copy:dist', 'manifest']); /* the manifest for component.json is used by Bower */

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
	if(!chromiumSrc) {
		grunt.fail.warn("Please set the CHROMIUM_SRC env var to the root of your chromium sources (ends in /src)");
	} else {
		grunt.log.writeln("CHROMIUM_SRC points to " + chromiumSrc.cyan);
	}
});

grunt.registerTask('telemetry', ['check_chromium_src', 'jade:telemetry', 'copy:telemetry']);
grunt.registerTask('telemetry-submit', 'Submit telemetry test results', function() {

	var exec = require("child_process").exec
	,	commandToBeExecuted = 'git log --pretty=format:"%H %ai" | head -n 1'
	,	done = this.async();

	exec(commandToBeExecuted, function (error, stdout, stderr) {
		if (error) {
			grunt.log.error('Error');
			console.log(error);
			done();
		} else {
			var submitData	= require('./test/perf/telemetry/lib/submitData');
			
			submitData(stdout, '/tmp/smoothness.txt');
		}
	});

});
};
