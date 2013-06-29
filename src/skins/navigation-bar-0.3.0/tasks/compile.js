var path = require('path'),
    debug = require('debug')('build');

module.exports = function(grunt) {

    grunt.registerMultiTask('compile', 'Generates dynamic config and compiles css', function() {

        var options = this.options(),
            files   = this.files;

        var getPathData = function() {
                var controlsPath = grunt.file.expand('tmp/src/controls/**/src/mixins'),
                    utilsPath = 'tmp/src/utils/utils/src/mixins',
                    themePath = 'tmp/src/theme/src',
                    variablesPath = 'test/fixtures/variables',
                    mixinsPath = 'src/mixins';

                pathData = [variablesPath].concat(controlsPath, utilsPath, themePath, mixinsPath);

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
}
