(function () {
// quick example to see if swipe can be done natively
var mainContainer = document.querySelector('.main-container');
var slideContainer = document.querySelector('.slide-container');
var slides = mainContainer.querySelectorAll('.slide');

var totalWidth = 0;

var marginDiff = mainContainer.offsetWidth - mainContainer.clientWidth;

var _slWidth = 0;

var idx = 0;

[].forEach.call(slides, function(s){

	_slWidth = s.offsetWidth;
	totalWidth += s.offsetWidth;

});

slideContainer.style.width = (totalWidth + marginDiff) + 'px';

var showRight = function () {
	var amount;
	if(Math.abs(idx) < slides.length-1) {
		idx--;
		amount = _slWidth * idx;
		slideContainer.style.webkitTransform = 'translateX('+amount+'px)';
	} else {
		amount = _slWidth * (idx-1) + _slWidth*0.75;
		slideContainer.style.webkitTransform = 'translateX('+amount+'px)';
		setTimeout(function(){
			slideContainer.style.webkitTransform = 'translateX('+(_slWidth * idx)+'px)';
		}, 50);
	}
};

var showLeft = function () {
	if(idx < 0) {
		idx++;
		var amount = _slWidth * idx;
		slideContainer.style.webkitTransform = 'translateX('+amount+'px)';
	} else {
		amount = _slWidth * (idx+1) - _slWidth*0.75;
		slideContainer.style.webkitTransform = 'translateX('+amount+'px)';
		setTimeout(function(){
			slideContainer.style.webkitTransform = 'translateX('+(_slWidth * idx)+'px)';
		}, 50);
	}
};

var _startX, _diff;

var touchStart = function (e) {
	_startX = e.pageX || e.touches[0].pageX;
};

var touchMove = function (e) {
	
	_diff = _startX - (e.pageX || e.touches[0].pageX);
	if(Math.abs(_diff) > 0 && Math.abs(_diff) < 50)
		_diff = 1;
};

var touchEnd = function (e) {
	if(_diff === 1) return;
	if(_diff > 0)
		showRight();
	else
		showLeft();
};

mainContainer.addEventListener('touchstart', touchStart, false);
mainContainer.addEventListener('touchmove', touchMove, false);
mainContainer.addEventListener('touchend', touchEnd, false);
})();