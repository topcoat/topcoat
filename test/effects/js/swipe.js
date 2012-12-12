// quick example to see if swipe can be done natively
var mainContainer = document.querySelector('.main-container')
	, slideContainer = document.querySelector('.slide-container')
	, slides = mainContainer.querySelectorAll('.slide');

var totalWidth = 0
	, marginDiff = mainContainer.offsetWidth - mainContainer.clientWidth
	, _slWidth = 0
	, idx = 0
	, _startX
	, _diff;

[].forEach.call(slides, function(s){
	_slWidth = s.offsetWidth;
	totalWidth += s.offsetWidth;
});

slideContainer.style.width = (totalWidth + marginDiff) + 'px';

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
	}
};

var touchStart = function (e) {
	_startX = e.pageX || e.touches[0].pageX;
	_diff = 1;
};

var touchMove = function (e) {

	_diff = _startX - (e.pageX || e.touches[0].pageX);
	_diff /= 4;
	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));

	if(_diff > 0) {
		pos -= _diff;
		slideContainer.style.webkitTransform = 'translateX('+pos+'px)';
	} else {
		pos	-= _diff;
		slideContainer.style.webkitTransform = 'translateX('+pos+'px)';
	}
};

var touchEnd = function (e) {
	if(_diff == 1) return;
	if(Math.abs(_diff) > 0 && Math.abs(_diff) < 20) {
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