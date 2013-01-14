/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

var toggle = document.querySelector('#show');
var menu = document.querySelector('.sidemenu');
var header = document.querySelector('header');
var container = document.querySelector('.container');
var body = document.querySelector('body');
var oldie = document.querySelector('html').classList.contains('no-csstransforms3d') ? true : false;

var slide = function(e) {
	container.classList.toggle('translateright');
	if(oldie) {
		if(!container.classList.contains('translateright')) {
			container.classList.remove('stayright');
			container.classList.add('restore');
		} else {
			container.classList.remove('restore');
			setTimeout(function(){
				container.classList.add('stayright');
			}, 250);
		}
	}
};

toggle.addEventListener('click', slide, false);