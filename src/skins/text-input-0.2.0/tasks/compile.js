var path = require('path'),
    debug = require('debug')('build');

module.exports = function(grunt) {

    grunt.registerMultiTask('compile', 'Generates dynamic config and compiles css', function() {

        var options = this.options(),
            files   = this.files;

        var getPathData = function() {
                var controlsPath = grunt.file.expand('tmp/src/controls/**/src/mixins'),
                    utilsPath = grunt.file.expand('tmp/src/utils/**/src/mixins'),
                    variablesPath = 'test/fixtures',
                    pathData = [variablesPath].concat(controlsPath, utilsPath);

                debug("PATH DATA:", pathData);
                return pathData;
            };

        var getCompileData = function() {
                var data = {};
                options['paths'] = getPathData();
                data['compile'] = {
                        options: options,
                        files: files
                    };

                debug('COMPILE DATA:', data);
                return data;
            };

        grunt.config('stylus', getCompileData());
        grunt.task.run('stylus');
    });
};