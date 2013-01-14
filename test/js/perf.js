function displayDetailedPerfData() {
	if (!!performance.getEntries || !!performance.webkitGetEntries) {
		var d = loadResTimData();
		document.querySelector('#perf').innerHTML = "" + d + "<br>" + "<br>";
	}
}
 
function loadResTimData() {
	var e = performance.hasOwnProperty('getEntries') ? performance.getEntries() : performance.webkitGetEntries(),
		perf_data = "<table class='table table-striped' id='table_perf_data'><thead><tr><th>Resource</th><th>Network (ms)</th><th>Request (waiting) (ms)</th><th>Response (receiving) (ms)</th>",
		perf_data = perf_data + "<th>Total (ms)</th></tr></thead>\n<tbody>\n",
		t = []
	for (var i in e) {
		if(!isNaN(e[i].responseStart)) {
			perf_data = perf_data+"<tr><td>"+e[i].name+"</td>";
			if (e[i].requestStart === 0) {
					console.log('0');
					// resource is cached, some entries are zero, 
					// we default to fetchStart instead
					perf_data = perf_data+"<td>"+Math.round(e[i].fetchStart-e[i].startTime)+"</td>";
				} else {
					perf_data = perf_data+"<td>"+Math.round(e[i].requestStart-e[i].startTime)+"</td>";
				}
				perf_data = perf_data+"<td>"+Math.round(e[i].responseStart-e[i].requestStart)+"</td>";
				perf_data = perf_data+"<td>"+Math.round(e[i].responseEnd-e[i].responseStart)+"</td>";
				perf_data += '<td>' + Math.round(e[i].responseEnd - e[i].fetchStart) + '</td>';
				perf_data = perf_data + "</tr>\n";
			}
		}
		perf_data = perf_data + "</tbody>\n</table>\n";
	return perf_data;
}

window.onload = function(){
  setTimeout(function(){
    var t = performance.timing;
    var table = document.querySelector('table');
    var tr = '<tr><td>Page load time (after being received from the server)</td><td colspan=4>'+(t.loadEventEnd - t.responseEnd)+' ms</td></tr>';
    table.innerHTML += tr;
  }, 0);
};

displayDetailedPerfData();