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
$(window).load(function() {
	figureContainer();
});
$(window).resize(function() {
	figureContainer();
});


// Set container height for slideshow
function figureContainer() {
	$('figure').each(	function(index) {
		var figureWidth = $('img',this).width();
		$(this).css('width', figureWidth);
	})
}