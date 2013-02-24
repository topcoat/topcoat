function settings (contentLength) {
	var post_options = {
		host: 'topcoat.herokuapp.com',
		port: '80',
		path: '/v2/benchmark',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': contentLength
		}
	};

	return post_options;
}

module.exports = settings;