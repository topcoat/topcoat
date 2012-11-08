function sendBenchmark(benchtest, title) {
	var device = "";
	for(var i in ua.device) // if there is any, usually works on mobile
		if(ua.device[i]) device += ua.device[i];
	$.post("http://topcoat.jit.su/benchmark", { // used $.post since xhr doesn't work on android 2.2 from what I've seen
		benchmark_result: benchtest,
		os: ua.os.name,
		version: ua.browser.version,
		browser: ua.browser.name,
		device: device,
		test: title
	});
}