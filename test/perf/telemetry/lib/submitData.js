var file = function (path) {
	return path.split('/').pop().split('.')[0];
};

var submitData = function (stdout, path, args) {
	var querystring = require('querystring');
	var http        = require('http');
	var fs          = require('fs');
	var parse       = require('./csvToJSON');
	var postOptions = require('./settings');

	var post_data = {};
	
	parse(path, function (j) {
		post_data = {
			resultName : j
		};

		var version = stdout.split(' ');

		post_data.commit = version[0];
		post_data.date   = version[1];
		post_data.test   = args.test || file(path);
		post_data.device = args.device || 'device?';

		post_data = querystring.stringify({data : JSON.stringify(post_data)});

		post_options = postOptions(post_data.length);

		// Set up the request
		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log(chunk);
			});
		});

		// post the data
		post_req.write(post_data);
		post_req.end();
		
	});

};

module.exports = submitData;