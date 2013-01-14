/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
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