/*global module:false*/
module.exports = function(grunt) {


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            release: ['css']
        },

        stylus: {
            mobilelight: {
                options: {
                    paths: ['node_modules/topcoat-notification-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-mobile-light'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-notification.styl',
                    dest: 'css/topcoat-notification-mobile-light.css'
                }]
            },

            mobiledark: {
                options: {
                    paths: ['node_modules/topcoat-notification-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-mobile-dark'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-notification.styl',
                    dest: 'css/topcoat-notification-mobile-dark.css'
                }]
            },

            desktoplight: {
                options: {
                    paths: ['node_modules/topcoat-notification-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-desktop-light'],
                    compress: false
                },
                files: [{
                    src: 'src/topcoat-notification.styl',
                    dest: 'css/topcoat-notification-desktop-light.css'
                }]
            },

            desktopdark: {
                options: {
                    paths: ['node_modules/topcoat-notification-base/src', 'node_modules/topcoat-utils/src/mixins', 'node_modules/topcoat-theme/src'],
                    import: ['theme-topcoat-desktop-dark'],
                    compress: false
                },

                files: [{
                    src: 'src/topcoat-notification.styl',
                    dest: 'css/topcoat-notification-desktop-dark.css'
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
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-topdoc');

    // Default task.
    grunt.registerTask('default', ['clean', 'build', 'test', 'release']);
    grunt.registerTask('build', ['stylus']);
    grunt.registerTask('test', ['simplemocha']);
    grunt.registerTask('release', ['cssmin', 'topdoc']);

};
