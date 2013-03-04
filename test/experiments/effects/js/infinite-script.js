var content = document.querySelector('.content');
var loading = document.querySelector('.loading');

var url = 'http://www.behance.net/v2/wips?q=menu&api_key=G3MhC2vngtUtyqElPighmE9kt9o3aBQc&page=';
	var data;
	var page = 1;
	var count = 0;
	var fetching = 0;
	var stop = 0;

	var totalH = document.body.clientHeight;

var jsonp = {
	callbackCounter: 0,

	fetch: function(url, callback) {
		var fn = 'JSONPCallback_' + this.callbackCounter++;
		window[fn] = this.evalJSONP(callback);
		url = url.replace('=JSONPCallback', '=' + fn);

		var scriptTag = document.createElement('SCRIPT');
		scriptTag.src = url;
		document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
	},

	evalJSONP: function(callback) {
		return function(data) {
			var validJSON = false;
		if (typeof data == "string") {
			try {validJSON = JSON.parse(data);} catch (e) {
				/*invalid JSON*/}
		} else {
			validJSON = JSON.parse(JSON.stringify(data));
				window.console && console.warn(
				'response data was not a JSON string');
			}
			if (validJSON) {
				callback(validJSON);
			} else {
				throw("JSONP call returned invalid or empty JSON");
			}
		}
	}
};


function createListWithImages (json) {

	var loading = document.querySelector('.loading');
	var frag = document.createDocumentFragment();
	console.log('inserting ' + json.length + ' items');
	for(var i = 0; i < json.length; ++i) {
		var el = json[i];

		var li = document.createElement('li');
		li.className += 'with-images';

		var first;
		for(first in el.revisions) break;

		img = document.createElement('img');
		img.src = el.revisions[first].images.thumbnail_sm.url;
		img.width = 110;
		img.height = 110;
		li.appendChild(img);

		html = '<h5>' + el.title + count + '</h5>';
		html += '<p>by: ' + el.owner.first_name + '</p>';
		html += '<p class="stats"> '+ el.stats.views +' views <em>' + el.revisions[first].description + '</em></p>';
		li.innerHTML += html;
		count++;
		frag.appendChild(li);
	}

	content.insertBefore(frag, loading);
}
	var getJSONP = url + page + "&callback=JSONPCallback";
	jsonp.fetch(getJSONP, function(d) {
		data = d.wips;
		console.log(data.length);
		createListWithImages(data);
	});

	content.addEventListener('scroll', function(){

		if(stop || fetching) return;
		var pageHeight = document.documentElement.clientHeight;
		var scrollPosition = this.scrollTop;


		if (pageHeight + scrollPosition > totalH) {
			
			fetching = 1;
			var getJSONP = url + page + "&callback=JSONPCallback";
			jsonp.fetch(getJSONP, function(d) {
				data = d.wips;
				if(!d.wips.length) {
					loading.innerHTML = 'That was the last result';
					stop = 1;
				} else {
					createListWithImages(d.wips);
					page++;
					fetching = 0;
				}
				totalH += 110 * data.length;
			});
		}
	}, false);

