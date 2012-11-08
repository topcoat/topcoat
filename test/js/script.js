var popup = null;
var tests = [];
var suite = new Benchmark.Suite();
var submitResults = false;

document.querySelector('#run').addEventListener('click', function(){

	submitResults = document.querySelector('#submit-results').checked;
	var inputs = document.querySelectorAll('.test-window');
	
	tests = [].map.call(inputs, function(test) {
		if(test.checked) return 'window/window_' + test.id + '.html';
	});

	launchTest();

}, false);

function appendOutput(content, selector) {
	var node = document.querySelector(selector);
	el = node.parentElement.parentElement.querySelector('.output');
	el.innerHTML += '<span class="label label-important"> ' + content + '</span>';
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