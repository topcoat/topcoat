var slideR = document.querySelector('#slide-right'),
	slideL = document.querySelector('#slide-left'),
	container = document.querySelector('.container'),
	nav = document.querySelector('#menu'),
	chat = document.querySelector('#chat'),
	oldie = document.querySelector('html').classList.contains('no-csstransforms3d') ? true : false
	messages = document.querySelector('#messages');

if(oldie) {
	nav.style.display = 'none';
	chat.style.display = 'none';
}

slideR.addEventListener('click', function (e) {

	if(document.body.classList.contains('chat-visible')) {
			document.body.classList.toggle('chat-visible');
			if (oldie)
				chat.style.display = 'none';
	}

	document.body.classList.toggle('menu-visible');
	chat.classList.toggle('hidden');
	nav.style.display = 'block';

	if (oldie) {
		if (!document.body.classList.contains('menu-visible')) {
			setTimeout(function () {
				nav.style.display = 'none';
			}, 250);
		} else {
			nav.style.display = 'block';
		}
	}

}, false);

slideL.addEventListener('click', function (e) {

	if(document.body.classList.contains('menu-visible')) {
		document.body.classList.toggle('menu-visible');
		chat.classList.toggle('hidden');

		if (oldie) {
			nav.style.display = 'none';
		}
	}

	document.body.classList.toggle('chat-visible');

	if (oldie) {
		if (!document.body.classList.contains('chat-visible')) {
			setTimeout(function () {
				chat.style.display = 'none';
			}, 250);
		} else {
			chat.style.display = 'block';
		}
	}

}, false);


function slider(el) {
	console.log('?');
	var startX,
		_prevdif,
		delta,
		slideContainer = el.querySelector('.scrollable');

	var touchStart = function (e) {
		startX = e.touches[0].pageY;
		_prevdif = delta = 1;
		e.preventDefault();
	};

	var touchMove = function (e) {
		e.preventDefault();
		delta = startX - e.touches[0].pageY;

		if(Math.abs(_prevdif - delta) < 5)
			return;
		else
			_prevdif = delta;

		var pos = slideContainer.style.webkitTransform || 0;
		if(pos) pos = parseInt(pos.slice(11, pos.length-3));
		
		startX = e.touches[0].pageY;
		slideContainer.style.webkitTransform = 'translateY('+(pos - delta)+'px)';
	};

	var touchEnd = function (e) {
		var pos = slideContainer.style.webkitTransform || 0;
		if(pos) pos = parseInt(pos.slice(11, pos.length-3));

		if (pos > 10) {
			slideContainer.style.webkitTransitionDuration = '.3s';
			slideContainer.style.webkitTransform = 'translateY(20px)';
			setTimeout(function () {
				slideContainer.style.webkitTransitionDuration = '0s';
			}, 300);
		} else {
			var height = el.offsetHeight;
			if (Math.abs(pos) > 0.6 * height) {
				slideContainer.style.webkitTransitionDuration = '.3s';
				slideContainer.style.webkitTransform = 'translateY('+(-height/2)+'px)';
				setTimeout(function () {
					slideContainer.style.webkitTransitionDuration = '0s';
				}, 300);
			}
		}

	};

	el.addEventListener('touchstart', touchStart, false);
	el.addEventListener('touchmove', touchMove, false);
	el.addEventListener('touchend', touchEnd, false);

	return el;

}

// start the sliders
if(oldie) {
	chat = new slider(chat);
	nav  = new slider(nav);
}