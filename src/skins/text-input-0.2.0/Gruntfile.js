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
            controls: {
                src: 'tmp/src/controls/*.zip',
                dest: 'tmp/src/controls'
            },
            utils: {
                src: 'tmp/src/utils/*.zip',
                dest: 'tmp/src/utils'
            }
        },

        clean: {
            tmp: ['tmp'],
            zip: ['tmp/src/*.zip', 'tmp/src/controls/*.zip', 'tmp/src/skins/*.zip', 'tmp/src/utils/*.zip']
        },

        compile: {
            stylus: {
                options: {
                    import: ['input-mixin', 'utils', 'variables'],
                    compress: false
                },
                files: {
                    'release/css/topcoat-text-input.css': ['src/copyright.styl', 'src/topcoat-text-input.styl', 'test/fixtures/icon.styl']
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
