function displayDetailedPerfData() {
	if (!!performance.getEntries || !!performance.webkitGetEntries) {
		var d = loadResTimData();
		document.querySelector('#perf').innerHTML = "" + d + "<br>" + "<br>";
	}
}
 
function loadResTimData() {
	var e = performance.hasOwnProperty('getEntries') ? performance.getEntries() : performance.webkitGetEntries(),
		perf_data = "<table class='table table-striped' id='table_perf_data'><thead><tr><td>Resource</td><td>Network (ms)</td><td>Request (ms)</td><td>Response (ms)</td></tr></thead>\n<tbody>\n",
		t = [];
	for (var i in e) {
		if(!isNaN(e[i].responseStart)) {
			if (e[i].name == "document") {
				// for the document refer to window.performance.timing instead,
				// we skip it for this example
				continue;
			}
			perf_data = perf_data+"<tr><td>"+e[i].name+"</td>";
			if (e[i].requestStart === 0) {
					// resource is cached, some entries are zero, 
					// we default to fetchStart instead
					perf_data = perf_data+"<td>"+Math.round(e[i].fetchStart-e[i].startTime)+"</td>";
				} else {
					perf_data = perf_data+"<td>"+Math.round(e[i].requestStart-e[i].startTime)+"</td>";
				}
				perf_data = perf_data+"<td>"+Math.round(e[i].responseStart-e[i].requestStart)+"</td>";
				perf_data = perf_data+"<td>"+Math.round(e[i].responseEnd-e[i].responseStart)+"</td>";
				perf_data = perf_data + "</tr>\n";
			}
		}
		perf_data = perf_data + "</tbody>\n</table>\n";
	return perf_data;
}

function getPerfStats() {
	var timing = window.performance.timing;
	return {
		dns: timing.domainLookupEnd - timing.domainLookupStart,
		connect: timing.connectEnd - timing.connectStart,
		ttfb: timing.responseStart - timing.connectEnd,
		basePage: timing.responseEnd - timing.responseStart,
		frontEnd: timing.loadEventStart - timing.responseEnd
	};
}

displayDetailedPerfData();