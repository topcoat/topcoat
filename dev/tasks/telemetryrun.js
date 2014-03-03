module.exports = function(grunt) {
	grunt.registerMultiTask('telemetry-run', 'Runs Telemetry tests using browser-perf', function() {
		var browserPerf = require('browser-perf'),
			SauceTunnel = require('sauce-tunnel'),
			path = require('path');

		var done = this.async(),
			options = this.options(),
			files = this.filesSrc,
			errors = [],
			results = [],
			tunnel = null,
			tunnelIdentifier = 'browser-perf';

		options.browsers.forEach(function(browser) {
			browser['tunnel-identifier'] = tunnelIdentifier;
		})

		grunt.verbose.writeln('Starting tests');
		var tunnel = new SauceTunnel(options.selenium.user, options.selenium.pwd, tunnelIdentifier, options.tunneled);
		configureLogEvents(tunnel);
		tunnel.start(function(status) {
			grunt.verbose.writeln('Started Sauce tunnel ' + status);
			(function testPage(i) {
				if (i < files.length) {
					var webPage = path.relative(options.base, files[i]);
					grunt.verbose.writeln('[%s/%s] Testing %s', i, files.length - 1, webPage);
					browserPerf('http://localhost:9000/' + webPage, function(err, res) {
						grunt.log.ok('[%s/%s] Run complete for %s', i, files.length - 1, webPage);
						errors[webPage] = err;
						results[webPage] = res;
						testPage(i + 1);
					}, {
						selenium: options.selenium,
						browser: options.browsers
					});
				} else {
					onResults(errors, results);
				}
			}(0))
		});

		function onResults(errors, results) {
			grunt.verbose.writeln('Stopping tunnel');
			tunnel.stop(function(status) {
				grunt.verbose.writeln('Sauce Tunnel Shutdown ' + status);

				// TODO submitResults(errors, results);
				console.log(errors, results);
				done();
			});
		}

		function configureLogEvents(tunnel) {
			var methods = ['write', 'writeln', 'error', 'ok', 'debug'];
			methods.forEach(function(method) {
				tunnel.on('log:' + method, function(text) {
					grunt.log[method](text);
				});
				tunnel.on('verbose:' + method, function(text) {
					grunt.verbose[method](text);
				});
			});
		}
	});
}