module.exports = function(grunt) {

    grunt.registerTask('telemetry-submit', 'Submit telemetry test results', function(gitCWD) {

        var exec = require("child_process").exec,
            commandToBeExecuted = 'git log --pretty=format:"%H %ci" | head -n 1',
            done = this.async();

        exec(commandToBeExecuted, {cwd:gitCWD}, function(error, stdout, stderr) {
            if (error) {
                grunt.log.error('Error');
                console.log(error);
                done();

            } else {

                var path = grunt.option('path')
                ,   device = grunt.option('device')
                ,   test = grunt.option('test')
                ,   host = process.env.TOPCOAT_BENCHMARK_SERVER
                ,   port = process.env.TOPCOAT_BENCHMARK_PORT
                ,   type = grunt.option('type')
                ,   date = grunt.option('date')
                ,   snapshot
                ;

                if (type && type.match(/snapshot/))
                    snapshot = true; // we're dealing with a snapshot

                if (!path || !type || (snapshot && !date)) {
                    if (!path) console.log('No path file specified.');
                    if (!type) console.log('Type not specified. Use --type=SHA or --type=snapshot');
                    if (snapshot && !date) {
                      console.log('You can use: date -u +"%Y-%m-%dT%H:%M:%SZ"');
                      console.log('No date specified. Use --date=<date> in ISO standard with type snapshot');
                    }
                    grunt.fail.warn('Usage: grunt telemetry-submit --path=path_to_output_file --type=SHA|snapshot [--test= Test name ] [--device= Device type ]');
                } else {
                    var submitData = require('../test/perf/telemetry/lib/submitData');
                    if (snapshot)
                        stdout = 'snapshot ' + date;

                    submitData(stdout, path, {
                        device: device,
                        test: test
                    }, {
                        host : host,
                        port : port
                    });
                }
            }
        });

    });
};
