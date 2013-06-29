/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        gruntfile: {
            src: 'Gruntfile.js'
        },

        topcoat: {
            download: {
                options: {
                    srcPath: 'tmp/src/',
                    repos: '<%= pkg.topcoat %>'
                }
            }
        },

        unzip: {
            utils: {
                src: 'tmp/src/utils/*.zip',
                dest: 'tmp/src/utils'
            },
            controls: {
                src: 'tmp/src/controls/*.zip',
                dest: 'tmp/src/controls'
            }
        },

        clean: {
            tmp: ['tmp'],
            zip: ['tmp/src/utils/*.zip', 'tmp/src/controls/*.zip']
        },

        compile: {
            stylus: {
                options: {
                    import: ['navigation-bar-mixin', 'utils', 'variables'],
                    compress: false
                },
                files: {
                    'release/css/topcoat-navigation-bar.css': ['src/copyright.styl', 'test/fixtures/layout.styl', 'test/fixtures/position.styl', 'test/fixtures/reset.styl', 'test/fixtures/icon-button.styl', 'test/fixtures/icons.styl', 'src/topcoat-navigation-bar.styl']
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

        jade: {
            compile: {
                expand: true,
                cwd: 'test/perf',
                src: ['*.jade'],
                dest: 'test/perf/',
                ext: '.test.html'
            }
        },
        nodeunit: {
            tests: ['test/*.test.js']
        },
        watch: {
            files: 'src/*.styl',
            tasks: ['build']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-topcoat');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', ['clean', 'topcoat', 'build']);
    grunt.registerTask('build', ['compile', 'cssmin', 'jade', 'nodeunit']);

};
