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

// messages.addEventListener('click', function () {
// 	document.querySelector('#inbox').classList.toggle('hidden');
// }, false);

slideR.addEventListener('click', function (e) {

	if(document.body.classList.contains('chat-visible')) {
			document.body.classList.toggle('chat-visible');
			if (oldie)
				chat.style.display = 'none';
	}

	document.body.classList.toggle('menu-visible');
	chat.classList.toggle('hidden');

	if (oldie) {
		if (!document.body.classList.contains('menu-visible')) {
			setTimeout(function () {
				nav.style.display = 'none';
			}, 250);
			setTimeout(function () {
				container.classList.remove('stop-scrolling');
				container.style.height = 'auto';
			}, 250);
		} else {
			nav.style.display = 'block';
			setTimeout(function () {
				container.classList.add('stop-scrolling');
				container.style.height = nav.querySelector('li').offsetHeight * nav.querySelectorAll('li').length + 60 + 'px';
			}, 250);
		}
	}

}, false);

slideL.addEventListener('click', function (e) {

	if(document.body.classList.contains('menu-visible')) {
		document.body.classList.toggle('menu-visible');
		chat.classList.toggle('hidden');

		if (oldie) {
			nav.style.display = 'none';
			container.classList.remove('stop-scrolling');
			container.style.height = 'auto';
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

var startX,
	_prevdif,
	delta,
	slideContainer = document.querySelector('.scrollable');

var touchStart = function (e) {
	startX = e.touches[0].pageY;
	_prevdif = delta = 1;

	console.log('start', startX);

	e.preventDefault();
};

var touchMove = function (e) {
	e.preventDefault();

	delta = startX - e.touches[0].pageY;

	if(Math.abs(_prevdif) > Math.abs(delta)) { // direction change
		startX = e.touches[0].pageY;
	}

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
		var height = chat.querySelector('li').offsetHeight * chat.querySelectorAll('li').length;
		if (Math.abs(pos) > 0.6 * height) {
			slideContainer.style.webkitTransitionDuration = '.3s';
			slideContainer.style.webkitTransform = 'translateY('+(-height/2)+'px)';
			setTimeout(function () {
				slideContainer.style.webkitTransitionDuration = '0s';
			}, 300);
		}
	}

};


if(oldie) {
	chat.addEventListener('touchstart', touchStart, false);
	chat.addEventListener('touchmove', touchMove, false);
	chat.addEventListener('touchend', touchEnd, false);
}