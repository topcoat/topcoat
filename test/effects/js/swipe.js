// quick example to see if swipe can be done natively
var mainContainer = document.querySelector('.main-container')
	, slideContainer = document.querySelector('.slide-container')
	, slides = mainContainer.querySelectorAll('.slide');


var _slWidth = slides[0].offsetWidth
	, totalWidth = _slWidth * slides.length
	, _startX
	, _diff
	, idx=0
	, _prevdif;

slideContainer.style.width = totalWidth + 'px';

var showPanel = function (id) {
	var amount;
	if(id > 0) {
		return;
	}
	if(Math.abs(id) > slides.length-1) {
		return;
	}
	if(id < slides.length-1 || id > 0) {
		amount = _slWidth * id;
		slideContainer.style.webkitTransform = 'translateX('+amount+'px)';

		var c = mainContainer.querySelector('.current');
		if(c) c.classList.remove('current');
		slides[Math.abs(id)].classList.add('current');
	}
};

var touchStart = function (e) {
	_startX = e.pageX || e.touches[0].pageX;
	_diff = 1;
	prevdif = 0;
};

var touchMove = function (e) {

	_diff = _startX - (e.pageX || e.touches[0].pageX);

	if(Math.abs(_prevdif - _diff) < 10)
		return;
	else
		_prevdif = _diff;

	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));

	if(pos - _diff > 0 || Math.abs(pos - _diff) > totalWidth - _slWidth) {
		return;
	}

	if(_diff > 0) {
		slideContainer.style.webkitTransform = 'translateX('+(pos - _diff)+'px)';
	} else {
		slideContainer.style.webkitTransform = 'translateX('+(pos - _diff)+'px)';
	}

	e.preventDefault();
};

var touchEnd = function (e) {
	if(_diff == 1) return;

	if(Math.abs(_diff) > 0 && Math.abs(_diff) < 10) {
		showPanel(idx);
		return;
	}
	if(_diff > 0)
		showPanel(--idx);
	else
		showPanel(++idx);
};

mainContainer.addEventListener('touchstart', touchStart, false);
mainContainer.addEventListener('touchmove', touchMove, false);
mainContainer.addEventListener('touchend', touchEnd, false);