// quick example to see if swipe can be done natively
var mainContainer = document.querySelector('.main-container')
	, slideContainer = document.querySelector('.slide-container')
	, slides = mainContainer.querySelectorAll('.slide');


var _slWidth = slides[0].offsetWidth
	, totalWidth = _slWidth * slides.length
	, _startX
	, _diff
	, _prevdif;

slideContainer.style.width = totalWidth + 'px';

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

	slideContainer.style.webkitTransform = 'translateX('+(_slWidth * id)+'px)';
};

var touchStart = function (e) {
	e.preventDefault();

	_startX = e.touches[0].pageX;
	_prevdif = _diff = 1;
};

var touchMove = function (e) {
	e.preventDefault();

	_diff = _startX - e.touches[0].pageX;

	if(Math.abs(_prevdif) > Math.abs(_diff)) { // direction change
		_startX = e.touches[0].pageX;
	}

	if(Math.abs(_prevdif - _diff) < 20)
		return;
	else
		_prevdif = _diff;

	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));

	if(pos - _diff > 0 || Math.abs(pos - _diff) > totalWidth - _slWidth) { // reached the edges
		return;
	}

	slideContainer.style.webkitTransform = 'translateX('+(pos - _diff)+'px)';
};

var touchEnd = function (e) {
	direction = [];
	if(Math.abs(_diff) > 0 && Math.abs(_diff) < 30)
		showPanel();
	else
		if(_diff > 0)
			showPanel();
		else
			showPanel();
};

mainContainer.addEventListener('touchstart', touchStart, false);
mainContainer.addEventListener('touchmove', touchMove, false);
mainContainer.addEventListener('touchend', touchEnd, false);