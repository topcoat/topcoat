window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

var toggle = document.querySelector('#show');
var menu = document.querySelector('.menucontent');
var container = document.querySelector('.container');
var body = document.querySelector('body');

toggle.addEventListener('click', function(e){
	
	body.classList.toggle('freeze');

	if(Modernizr.csstransforms3d) {
		if(container.classList.contains('translateright')) {
			container.classList.add('restore');
			container.classList.remove('translateright');
			setTimeout(function(){
				var sillyLittleFix = body.offsetWidth;
				body.offsetWidth = sillyLittleFix;
			}, 0);
		}
		else {
			container.classList.add('translateright');
			container.classList.remove('restore');
		}
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