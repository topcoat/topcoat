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

var commit
,   date
;

$('.topcoat-version').on('keyup', function () {
	var val = $(this).val().trim().split(' ');
	commit  = val.shift();
	date	= val.join(' ');
	if(commit.length == 40 && date.length) {
			if(Date.parse(date)) {
				$('input[type=checkbox]')
					.attr('disabled', false)
					.attr('checked', 'true');
				$('#submit')
					.attr('disabled', false);
				$('#page-load-time')
					.attr('disabled', false);
			}
			else
				alert('Invalid Date');
	}
});

$('#submit').on('click', function () {
	console.log('Submit stress css results');

	// the extra field is where I send the top 3 CSS class selectors from the stress CSS results
	var extra = {};
	extra.field = 'selector';
	extra.value = results.selector;

	sendBenchmark(results.baselineTime, 'stressCSS', extra);
});