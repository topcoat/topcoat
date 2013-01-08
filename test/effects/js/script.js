window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

var toggle = document.querySelector('#show');
var menu = document.querySelector('.sidemenu');
var header = document.querySelector('header');
var container = document.querySelector('.container');
var body = document.querySelector('body');


var slide = function(e) {
	body.classList.add('ie');
	container.classList.toggle('translateright');
	//header.classList.toggle('translateright');
};

toggle.addEventListener('click', slide, false);