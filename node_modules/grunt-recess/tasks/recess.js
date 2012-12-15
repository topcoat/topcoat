module.exports = function( grunt ) {
	'use strict';

	grunt.registerMultiTask('recess', 'Lint and minify CSS and LESS', function() {
		var recess = require('recess');
		var lf = grunt.utils.linefeed;
		var cb = this.async();
		var files = grunt.file.expandFiles( this.file.src );
		var dest = this.file.dest;
		var options = this.data.options || {};
		var compress = options.compress;
		var separator = compress ? '' : lf + lf;

		if ( !files.length ) {
			grunt.log.writeln('No existing files in this target.');
			return cb();
		}

		recess( files, options, function( err, data ) {
			var min = [];
			var max = [];

			// RECESS returns an object when passed a single file,
			// and a array of objects when passed multiple files.
			// ^ Bug: https://github.com/twitter/recess/issues/44
			//
			// .reverse() the array because of bug:
			// https://github.com/twitter/recess/issues/42
			data = Array.isArray( data ) ? data.reverse() : [ data ];

			data.forEach(function( item ) {
				if ( item.options.compile ) {
					min.push( item.output );
					max.push( item.data );
				// Extract status and check
				} else if ( item.output[1] && item.output[1].indexOf('Perfect!') !== -1 ) {
					grunt.log.writeln( item.output.join( lf ) );
				} else {
					grunt.fail.warn( item.output.join( lf ) );
				}
			});

			if ( min.length ) {
				if ( dest ) {
					// Concat files
					grunt.file.write( dest, min.join( separator ) );
					grunt.log.writeln( 'File "' + dest + '" created.' );

					if ( compress ) {
						grunt.helper( 'min_max_info', min.join( separator ), max.join( separator ) );
					}
				} else {
					grunt.fail.fatal('No destination specified. Required when options.compile is enabled.');
				}
			}

			cb();
		});
	});
};
