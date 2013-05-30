var path = require('path'),
    debug = require('debug')('build');

module.exports = function(grunt) {

    grunt.registerTask('compile', 'Generates dynamic config and compiles css', function() {

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
                var mixinPath = grunt.file.expand('src/controls/**/src/mixins'),
                    utilsPath = grunt.file.expand('src/utils/**/src/mixins'),
                    pathData = mixinPath.concat(utilsPath);

                debug("PATH:", pathData);

                return pathData;
            };

        var getStylusImportData = function(theme) {
                var mixinFiles = grunt.file.expand('src/controls/**/src/mixins/*.styl'),
                    utilFiles = grunt.file.expand('src/utils/**/src/mixins/*.styl'),
                    importData = mixinFiles.concat([theme, 'nib']);

                debug("IMPORT:", importData);

                return importData;
            };

        var getStylusFilesData = function(theme) {
                var fileData = [],
                    releasePath = 'release/css/',
                    skinsPath = 'src/skins/**/src/*.styl',
                    includes = 'src/**/src/includes/*.styl',
                    fileName = path.basename(theme).split('.styl').join('.css');

                var releaseFile = releasePath + fileName,
                    files = includes.concat(skinsPath);

                fileData.push({
                    src:[includes, skinsPath],
                    dest: releasePath + fileName.replace('theme-', "")
                });

                return fileData;
            };

        console.log(">>>>>>>>> ", JSON.stringify(getCompileData(), null, 2));
        debug('CONFIG DATA:', getCompileData());
        grunt.config('stylus', getCompileData());
        grunt.task.run('stylus');
    });
}
