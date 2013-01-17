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