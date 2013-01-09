var toggle = document.querySelector('#show');
var menu = document.querySelector('.sidemenu');
var header = document.querySelector('header');
var container = document.querySelector('.container');
var body = document.querySelector('body');
var oldie = document.querySelector('html').classList.contains('no-csstransforms3d') ? true : false;

var slide = function(e) {
	container.classList.toggle('translateright');
	if(oldie) {
		if(!container.classList.contains('translateright')) {
			container.classList.remove('stayright');
			container.classList.add('restore');
		} else {
			container.classList.remove('restore');
			setTimeout(function(){
				container.classList.add('stayright');
			}, 250);
		}
	}
};

toggle.addEventListener('click', slide, false);