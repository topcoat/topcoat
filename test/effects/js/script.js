window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

var toggle = document.querySelector('#show');
var menu = document.querySelector('.sidemenu');
var container = document.querySelector('.container');
var body = document.querySelector('body');

toggle.addEventListener('click', function(e){
	body.classList.add('ie');
	if(Modernizr.csstransforms3d) {
		container.classList.toggle('translateright');
	} else {
		if(container.classList.contains('stayright')) {
			container.classList.remove('stayright');
			container.classList.remove('translateright');
			container.classList.add('restore');
			setTimeout(function(){
				container.classList.remove('restore');
				body.classList.remove('ie');
			}, 250);
		} else {
			container.classList.add('translateright');
			setTimeout(function(){
				container.classList.add('stayright');
			}, 250);
		}
	}
});