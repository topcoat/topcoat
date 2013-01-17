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

var popup = null;
var tests = [];
var suite = new Benchmark.Suite();
var submitResults = false;

document.querySelector('#run').addEventListener('click', function(){

	submitResults = document.querySelector('#submit-results').checked;
	var inputs = document.querySelectorAll('.test-window:checked');
	
	tests = [].map.call(inputs, function(test) {
		return 'window/window_' + test.id + '.html';
	});
	
	launchTest();

}, false);

function appendOutput(content, selector, test) {
	var node = document.querySelector(selector);
	el = node.parentElement.parentElement.querySelector('.output');
	el.innerHTML += '<span class="label label-important"> ' + content + '</span>';
	if (submitResults) sendBenchmark(content, test);
}

function launchTest(test) {
	test = test || tests.shift();
	if(test)
		window.setTimeout(bind(function() {
			this.benchmarkWindow_ = window.open(test + '?'+ Math.random(), 'thinskin',
			'left=' + 400 + ',top=' + 200 +
			',width='+ 800 + ',height=' + 600);
		}, this), 1000);
	else {
		popup.close();
		var fastest = suite.filter('fastest').pluck('name');
		var output = document.querySelectorAll('.output');
		[].forEach.call(output, function(el){
			if(el.innerHTML.match(fastest))
				el.parentElement.classList.add('success');
		});
	}
}

function bind(fn, opt_scope, var_args) {
	var scope = opt_scope || window;
	var len = arguments.length;
	var args = [];
	for (var i = 2; i < len; i++) {
		args.push(arguments[i]);
	}
	return function(arguments) {
		var a = args.slice();
		a.push.call(a, arguments);
		fn.apply(scope, a);
	};
}