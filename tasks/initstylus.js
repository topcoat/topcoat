var debug = require('debug')('build');

module.exports = function(grunt) {

    grunt.registerTask('initStylus', 'Re-initializes task data for after assets are loaded', function() {

        var getCompileData = function() {
                var compileData = {},
                    themeFiles = grunt.file.expand('src/**/src/theme-*.styl'),
                    stylusPathData = getStylusPathData();

                grunt.util._.forEach(themeFiles, function(theme) {
                    compileData[theme] = {
                        options: {
                            paths: stylusPathData,
                            import: getStylusImportData(theme),
                            compress: false
                        },
                        files: getStylusFilesData(theme)
                    }
                });

                debug('COMPILE:', compileData);

                return compileData;
            };

        var getStylusPathData = function() {
                var mixinPath = grunt.file.expand('src/controls/**/src/mixins');

                debug("PATH:", mixinPath);

                return mixinPath;
            };

        var getStylusImportData = function(theme) {
                var mixinFiles = grunt.file.expand('src/controls/**/src/mixins/*.styl'),
                    importData = mixinFiles.concat([theme]);

                debug("IMPORT:", importData);

                return importData;
            };

        var getStylusFilesData = function(theme) {
                var fileData = {},
                    releasePath = 'release/css',
                    skinsPath = 'src/**/skins/**/src/*.styl';

                var releaseFile = releasePath + theme.split('/')[3].split('.styl').join('.css'),
                    files = [skinsPath, theme];

                fileData['release/css/' + theme.split('/')[3].split('.styl').join('.css')] = files;

                return fileData;
            };

        debug('INIT STYLUS:', getCompileData());
        grunt.config('stylus', getCompileData());
    });
}
