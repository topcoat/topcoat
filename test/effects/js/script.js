window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

var toggle = document.querySelector('#show');
var menu = document.querySelector('.sidemenu');
var container = document.querySelector('.container');
var body = document.querySelector('body');

if(!Modernizr.csstransforms3d) {
	container.style.position = 'absolute';
}

toggle.addEventListener('click', function(e){
	
	//body.classList.toggle('freeze');
	menu.style.zIndex = 0;
	if(Modernizr.csstransforms3d) {
		container.classList.toggle('translateright');
	} else {
		if(container.classList.contains('stayright')) {
			container.classList.remove('stayright');
			container.classList.remove('translateright');
			container.classList.add('restore');
			setTimeout(function(){
				container.classList.toggle('restore');
			}, 250);
		} else {
			container.classList.add('translateright');
			setTimeout(function(){
				container.classList.toggle('stayright');
			}, 250);
		}
	}

});