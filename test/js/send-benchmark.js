/*!
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, softwareT
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var parser = new UAParser();
var ua = parser.getResult(); // object containing device/os/browser info

var device = ['iPhone Apple Mobile', ''];

function sendBenchmark(benchtest, title, version) {
	
	var device = "";
	for(var i in ua.device) // if there is any, usually works on mobile
		if(ua.device[i]) device += ua.device[i] + ' ';
	device = device.trim();
	$.post("http://topcoat.herokuapp.com/benchmark", { // used $.post since xhr doesn't work on android 2.2 from what I've seen
	// $.post("http://localhost:3000/benchmark", { // used $.post since xhr doesn't work on android 2.2 from what I've seen
		benchmark_result: benchtest,
		version: version,
		device: device[parseInt(Math.random()*10%device.length,10)],
		commit: commit,
        date: date,
		test: title,
		ua: navigator.appVersion
	}).success(function(data){
		console.log(data);
	});
}