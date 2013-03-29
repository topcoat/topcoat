module.exports = function(grunt) {

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
                    var submitData = require('./test / perf / telemetry / lib / submitData ');
                    submitData(stdout, path, {
                        device: device,
                        test: test
                    });
                }
            }
        });

    });
}
