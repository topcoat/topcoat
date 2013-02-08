/*!
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function displayDetailedPerfData() {
	if (!!performance.getEntries || !!performance.webkitGetEntries) {
		var d = loadResTimData();
		document.querySelector('#perf').innerHTML = "" + d + "<br>" + "<br>";
	}
}
 
function loadResTimData() {
	var e = performance.hasOwnProperty('getEntries') ? performance.getEntries() : performance.webkitGetEntries(),
		perfRes = "<table class='table table-striped' id='table_perfRes'><thead><tr><th>Resource</th><th>Network (ms)</th><th>Request (waiting) (ms)</th><th>Response (receiving) (ms)</th>",
		perfRes = perfRes + "<th>Total (ms)</th></tr></thead>\n<tbody>\n",
		t = []
	for (var i in e) {
		if(!isNaN(e[i].responseStart)) {
			perfRes = perfRes+"<tr><td>"+e[i].name+"</td>";
			if (e[i].requestStart === 0) {
					perfRes = perfRes+"<td>"+Math.round(e[i].fetchStart-e[i].startTime)+"</td>";
				} else {
					perfRes = perfRes+"<td>"+Math.round(e[i].requestStart-e[i].startTime)+"</td>";
				}
				perfRes = perfRes+"<td>"+Math.round(e[i].responseStart-e[i].requestStart)+"</td>";
				perfRes = perfRes+"<td>"+Math.round(e[i].responseEnd-e[i].responseStart)+"</td>";
				perfRes += '<td>' + Math.round(e[i].responseEnd - e[i].fetchStart) + '</td>';
				perfRes = perfRes + "</tr>\n";
			}
		}
		perfRes = perfRes + "</tbody>\n</table>\n";
	return perfRes;
}

window.onload = function(){
  setTimeout(function(){
    var t = performance.timing;
    var table = document.querySelector('table');
    var tr = '<tr><td>Page load time (after downloading)</td><td colspan=4>'+(t.loadEventEnd - t.responseEnd)+' ms</td></tr>';
    tr += '<tr><td><button id="page-load-time" class="button cta large quiet" disabled> Submit load time </button></td></tr>';
    table.innerHTML += tr;
    
    document.querySelector('#page-load-time').addEventListener('click', function(){
		console.log('sending load time');
		sendBenchmark((t.loadEventEnd - t.responseEnd), 'topcoat-load-time');
    }, false);

  }, 0);
};



displayDetailedPerfData();