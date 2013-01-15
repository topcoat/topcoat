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