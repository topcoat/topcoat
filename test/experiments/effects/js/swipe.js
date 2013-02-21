/*!
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// !function () {
// quick example to see if swipe can be done to look like natively
var mainContainer = document.querySelector('.main-container')
	, slideContainer = document.querySelector('.slide-container')
	, slides = mainContainer.querySelectorAll('.slide')
	;

[].forEach.call(slides, function(s){
	s.style.width = mainContainer.offsetWidth + 'px';
});

var _slWidth = slides[0].offsetWidth
	, startX
    , totalWidth = _slWidth * slides.length
	, delta
	, _prevdif
	, prevWidth = mainContainer.offsetWidth
	, id
	;

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

var showPanel = function (idx) {
	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));
	id = idx || round(pos/_slWidth);
	slideContainer.style.webkitTransform = 'translateX('+(_slWidth * id)+'px)';
};

var orientationChange = function (e) {
	prevWidth = mainContainer.offsetWidth;
	setTimeout(function(){ // did i just do this ?!
		[].forEach.call(slides, function(s){
			s.style.width = mainContainer.offsetWidth + 'px';
		});
		_slWidth = slides[0].offsetWidth;
		slideContainer.style.webkitTransitionDuration = ".6s";
		slideContainer.style.width = (_slWidth * slides.length) + 'px';
		setTimeout(function(){
			slideContainer.style.webkitTransitionDuration = ".1s";
		}, 600);
		totalWidth = _slWidth * slides.length;
		showPanel(id);
	}, 50);
};

var touchStart = function (e) {

	if(prevWidth != mainContainer.offsetWidth) {
		orientationChange();
		prevWidth = mainContainer.offsetWidth;
	}

	e.preventDefault();
	startX = e.touches[0].pageX;
	_prevdif = delta = 1;
	slideContainer.style.webkitTransitionDuration = 0;
};

var touchMove = function (e) {
	e.preventDefault();

	delta = startX - e.touches[0].pageX;

	if(Math.abs(_prevdif - delta) < 5)
		return;
	else
		_prevdif = delta;

	var pos = slideContainer.style.webkitTransform || 0;
	if(pos) pos = parseInt(pos.slice(11, pos.length-3));
	
	if(pos - delta > _slWidth/2 || Math.abs(pos - delta) > totalWidth - _slWidth / 2) { // reached the edges
		return;
	}

	startX = e.touches[0].pageX;
	slideContainer.style.webkitTransform = 'translateX('+(pos - delta)+'px)';
};

var touchEnd = function (e) {
	slideContainer.style.webkitTransitionDuration = '.075s';
	showPanel();
};


window.addEventListener('orientationchange', orientationChange, false);

mainContainer.addEventListener('touchstart', touchStart, false);
mainContainer.addEventListener('touchmove', touchMove, false);
mainContainer.addEventListener('touchend', touchEnd, false);
// }();