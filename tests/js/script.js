var TARGET_WINDOW_WIDTH = 800;
var TARGET_WINDOW_HEIGHT = 600;
var popup = null;
var tests = [];

document.querySelector('#run').addEventListener('click', function(){
	var inputs = document.querySelectorAll('input[type=checkbox]:checked');
	
	tests = [].map.call(inputs, function(test){
		return 'window/window_' + test.id + '.html';
	});

	launchTest();

}, false);

function appendOutput(content, selector) {
	var el = document.querySelector(selector);
	el.parentNode.innerHTML += '<span> ' + content + '</span>';
}

function launchTest(test) {
	test = test || tests.shift();
	if(test)
		window.setTimeout(bind(function() {
			this.benchmarkWindow_ = window.open(test + '?'+ Math.random(), 'thinskin',
			'left=' + 400 + ',top=' + 200 +
			',width='+ TARGET_WINDOW_WIDTH + ',height=' + TARGET_WINDOW_HEIGHT);
		}, this), 1000);
	else {
		popup.close();
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