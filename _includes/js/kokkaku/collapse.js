$('.collapsible-title').click(function(){

	$(this).toggleClass('is-expanded')
		.parent().find('.collapsible-section--content')
			.toggleClass('is-expanded')
			.slideToggle();

});
