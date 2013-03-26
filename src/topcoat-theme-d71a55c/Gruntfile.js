/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
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
            skins: {
                src: "src/skins/*.zip",
                dest: "src/skins"
            }
        },
        gruntfile: {
            src: 'Gruntfile.js'
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-topcoat');
    grunt.loadNpmTasks('grunt-zip');

    // Default task.
    grunt.registerTask('default', ['topcoat', 'unzip']);

};
