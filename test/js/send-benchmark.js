function sendBenchmark(benchtest, title) {
	
	var device = "";
	for(var i in ua.device) // if there is any, usually works on mobile
		if(ua.device[i]) device += ua.device[i] + ' ';
	device = device.trim();
	$.post("http://topcoat.jit.su/benchmark", { // used $.post since xhr doesn't work on android 2.2 from what I've seen
		benchmark_result: benchtest,
		device: device,
		test: title,
		ua: navigator.appVersion
	}).success(function(data){
		console.log(data);
	});
}