if (!document.querySelector('override')) {
	var head  = document.querySelector('head');
	var link  = document.createElement('link');
	link.id   = 'override';
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = '../../release/css/' + location.href.split('/').pop().split('.')[0] + '.css';
	link.media = 'all';
	head.appendChild(link);
}