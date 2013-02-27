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

function sendBenchmark(benchtest, commit, date, title, device, ua) {

	var postData = {
		resultName  : benchtest.resultHeader,
		resultValue : benchtest.resultData,
		date		: date,
		device		: device,
		commit		: commit,
		test		: title,
		ua			: ua
	};

	console.log(postData);

	// $.post("http://localhost:3000/v2/benchmark", postData)
	$.post("http://topcoat.herokuapp.com/v2/benchmark", postData)
	.success(function(data){
		console.log(data);
	});
}