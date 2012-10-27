var TARGET_WINDOW_WIDTH = 800;
var TARGET_WINDOW_HEIGHT = 600;

var tests = {
	1: 'window/window.html',
	2: 'window/window_bootstrap.html'
};

var popup = null;

var output = document.querySelector('#output');

function appendOutput(content) {
	output.innerHTML += content + '<br>';
}

function launchTest(test) {
	window.setTimeout(bind(function() {
		this.benchmarkWindow_ = window.open(test, 'thinskin',
		'left=' + 400 + ',top=' + 200 +
		',width='+ TARGET_WINDOW_WIDTH + ',height=' + TARGET_WINDOW_HEIGHT);
	}, this), 1000);
}

launchTest(tests[1]);

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