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

function sendBenchmark(benchtest, title, optional) {
	
	var device = "";
	for(var i in ua.device) // if there is any, usually works on mobile
		if(ua.device[i]) device += ua.device[i] + ' ';
	device = device.trim();

	var postData = {
		benchmark_result: benchtest,
		date: date,
		device: device,
		commit: commit,
		test: title,
		ua: navigator.appVersion
	};

	if(optional)
		postData[optional.field] =  optional.value;
	console.log(postData);

	// $.post("http://localhost:3000/benchmark", postData)
	$.post("http://topcoat.herokuapp.com/benchmark", postData)
	.success(function(data){
		console.log(data);
	});
}