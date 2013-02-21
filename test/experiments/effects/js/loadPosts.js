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

var data = [
	{
		title: 'Hello World',
		content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
	},
	{
		title: 'Hello World',
		content: '<img src="img/cat2.png" width="300px" height="300px">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
	},
	{
		title: 'Hello World',
		content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
	}
];

var docFragment = document.createDocumentFragment();
var footer = document.querySelector('#footer h2');
var loading = 0;

function createPost (data) {

	var article = document.createElement('article');
	var title = document.createElement('h2');
		title.innerText = data.title;
	var p = document.createElement('p');
		p.innerHTML = data.content;

	article.appendChild(title);
	article.appendChild(p);

	docFragment.appendChild(article);

}

footer.addEventListener('webkitTransitionEnd', function(){
	var l = data.length;
	console.log('animation end');
	data.forEach(function(post){
		createPost(post);
		if(--l === 0) {
			console.log('inserting');
			document.querySelector('.content').appendChild(docFragment);
			docFragment = document.createDocumentFragment();
			footer.classList.remove('loading');
			setTimeout(function(){
				loading = 0;
			}, 1000);
		}
	});
}, false);

footer.addEventListener('click', function(e) {
	if(loading) {
		e.stopPropagation();
		return;
	} else {
		footer.classList.add('loading');
		loading = 1;
    }
}, false);
