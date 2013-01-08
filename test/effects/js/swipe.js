// !function () {
// quick example to see if swipe can be done natively
var mainContainer = document.querySelector('.main-container')
	, slideContainer = document.querySelector('.slide-container')
	, slides = mainContainer.querySelectorAll('.slide');

[].forEach.call(slides, function(s){
	s.style.width = mainContainer.offsetWidth + 'px';
});

var _slWidth = slides[0].offsetWidth
	, startX
    , totalWidth = _slWidth * slides.length
	, delta
	, _prevdif;

slideContainer.style.width = (_slWidth * slides.length) + 'px';

var round = function (n) {
	var max = Math.ceil(n);
	var min = Math.floor(n);
	if(Math.abs(max - n) < Math.abs(n - min)) {
		return max;
	} else {
		return min;
	}
};

var showPanel = function () {
	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));
	id = round(pos/_slWidth);
	id %= slides.length;
	slideContainer.style.webkitTransform = 'translateX('+(_slWidth * id)+'px)';
};

var orientationChange = function (e) {
	setTimeout(function(){ // did i just do this ?!
		[].forEach.call(slides, function(s){
			s.style.width = mainContainer.offsetWidth + 'px';
		});
		_slWidth = slides[0].offsetWidth;
		slideContainer.style.width = (_slWidth * slides.length) + 'px';
		totalWidth = _slWidth * slides.length
		showPanel();
	}, 50);
};

var touchStart = function (e) {
	e.preventDefault();
	startX = e.touches[0].pageX;
	_prevdif = delta = 1;
};

var touchMove = function (e) {
	e.preventDefault();

	delta = startX - e.touches[0].pageX;

	if(Math.abs(_prevdif) > Math.abs(delta)) { // direction change
		startX = e.touches[0].pageX;
	}

	if(Math.abs(_prevdif - delta) < 5)
		return;
	else
		_prevdif = delta;

	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));
	
	if(pos - delta > 0 || Math.abs(pos - delta) > totalWidth - _slWidth) { // reached the edges
		return;
	}
	startX = e.touches[0].pageX;
	slideContainer.style.webkitTransform = 'translateX('+(pos - delta)+'px)';
};

var touchEnd = function (e) {
	showPanel();
};

window.addEventListener('orientationchange', orientationChange, false);
mainContainer.addEventListener('touchstart', touchStart, false);
mainContainer.addEventListener('touchmove', touchMove, false);
mainContainer.addEventListener('touchend', touchEnd, false);
// }();