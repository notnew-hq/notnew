(function(){ // slider pants

	var $slide 			= $('.slide'),
			$firstSlide = $('.slide:first-child'),
			$lastSlide  = $('.slide:last-child');

	$('.slider-dot').click(function(){ // user clicks on nav dots on slider

		var dotID = $(this).attr('id');

		$(this).closest('.slider') // localize
			.find('.slider-dot')
			.removeClass('is-selected'); // remove mod class

		$(this).addClass('is-selected'); // add mod class

		$(this).closest('.slider') // localize
			.find('.slide')
			.removeClass('is-visible') // remove mod class from all slides
			.hide(); // bye!

		$('.slide#' + dotID) // target slide with same ID as clicked dot
			.addClass('is-visible') // add mod class
			.show(); // hi!
	});
	// Previous slide ----------
	function prevSlide() {
		var prevID = $(this).parent('.slide').prev('.slide').attr('id');

		$(this).closest('.slider') // localize
			.find('.slide')
			.removeClass('is-visible next prev') // remove mod class
			.hide(); // hide all slides

		$(this).parent('.slide') // localize
			.prev() // find previous slide
			.addClass('is-visible prev') // add mod class to previous
			.show(); // show previous

		$(this).closest('.slider').find('.slider-dot') // localize and find dots
			.removeClass('is-selected'); // remove mod class from all dots
		$('.slider-dot#' + prevID) // target dot with same ID as current slide
			.addClass('is-selected'); // add mod class
	}
	// Next slide ----------
	function nextSlide() {
		var nextID = $(this).parent('.slide').next('.slide').attr('id');

		$(this).closest('.slider') // same functionality as previous, just backwards, duh
			.find('.slide')
			.removeClass('is-visible next prev')
			.hide();

		 $(this).parent('.slide')
			.next()
			.addClass('is-visible next')
			.show();

		 $(this).closest('.slider').find('.slider-dot')
			.removeClass('is-selected');

		 $('.slider-dot#' + nextID)
			.addClass('is-selected');
	}
	// Cycle to last slide ----------
	function firstSlide() {
		$(this).parent() // localize
			.removeClass('is-visible next prev') // remove mod classes
			.hide(); // bye!

		$(this).closest('.slider').find('.slide:last-child') // find last slide in parent
			.show() // hi!
			.addClass('is-visible prev'); // add mod class

		$(this).closest('.slider') // localize
			.find('.slider-dot') // select slider dots
			.removeClass('is-selected') // remove modd class from all
			.siblings(':last-child') // find last slider dot
			.addClass('is-selected'); // add mod class
	}
	// Cycle to first slide ----------
	function lastSlide() {
		$(this).parent() // localize
			.removeClass('is-visible next prev') // remove mod classes
			.hide(); // bye!

		$(this).closest('.slider').find('.slide:first-child') // find first slide in parent
			.show() // hi!
			.addClass('is-visible next'); // add mod classes

		$(this).closest('.slider') // localize
			.find('.slider-dot') // select slider dots
			.removeClass('is-selected') // remove mod class from all
			.siblings(':first-child') // find first slider dot
			.addClass('is-selected'); // add mod class
	}

	$('.slider-arrow.prev').click(prevSlide); // clicking prev arrow triggers previous slide

	$('.slider-arrow.next').click(nextSlide); // clicking next arrow triggers next slide

	$firstSlide.children('.slider-arrow.prev').click(firstSlide); // clicking previous on first slide cycles to end

	$lastSlide.children('.slider-arrow.next').click(lastSlide); // clicking next on last slide cycles to beginning
	if ( isTouch() == true ) {

		$slide.swipe({ // user swipes on slide

			swipeRight:function() { // user swipes right <3
				if ( $(this).is(':first-child') ) { // if first slide
					$(this).children('.slider-arrow.prev')
						.each(firstSlide); // cycle around to last slide
				} else {
					$(this).children('.slider-arrow.prev')
						.each(prevSlide); // else trigger previous slide
				}
			},

			swipeLeft:function() { // user swipes left </3
				if ( $(this).is(':last-child') ) { // if last slide
					$(this).children('.slider-arrow.next')
						.each(lastSlide); // cycle around to first slide
				} else {
					$(this).children('.slider-arrow.next')
						.each(nextSlide); // else trigger next slide
				}
			},

			threshold:178 // swipe length of 178px or more

		});

	}

})(); // end safety pants
