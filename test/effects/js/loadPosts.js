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
