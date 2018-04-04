(function(){ // free trial pants

  var container = $('.js-trial-container');

  function closeTrial(e) {

		e.preventDefault();
    container.fadeOut(300, function(){ // fade out lightbox

      $(this).removeAttr('style').css({ // reset CSS on callback
        'display': 'none'
      });

    });

    $('html,body').css({ // reset overflow
      'overflow': ''
    });

		$('#site').off('touchmove').removeClass('is-blurred');

  }

  $('.js-trial').click(function(){ // user clicks free trial button

    container.fadeIn(300); // fade in modal
		$('#site').addClass('is-blurred');

    // Disable scrolling while trial container is open
    $('html,body')
      .css({
        'overflow': 'hidden'
      });

		$('#site').on('touchmove', function(e){
        e.preventDefault();
      });

    $(document).keydown(function(e){ // user hits key while modal open

      switch(e.which) {

        case 27: closeTrial(); // ESC: close modal
        break;

        default: return;

      }
      e.preventDefault(); // stop from scrolling or anything weird

    });

  });

  $('.js-close-trial').click(closeTrial); // User clicks X to close

  if ( isTouch() == true ) { // check for touch device

    container.swipe({ // user swipes trial container

      swipeStatus: function(event, phase, direction, distance) {

        if (direction=='down') { // user swipes down

          if (phase=='move') { // while swipe is in motion

            $(this)
              .css({
                'opacity': 1 - ((distance/2)/100), // fade as user swipes
                'top': distance/2 + '%' // slide downward with swipe
              });

          }

          if (phase=='end') { // user completes swipe

            closeTrial();

          }

          if (phase=='cancel') { // user fails or cancels swipe

            $this.removeAttr('style').css({ // reset CSS
              'display': 'flex'
            });

          }

        }

      },
      triggerOnTouchEnd: false,
      triggerOnTouchLeave: false,
      threshold: 200,
      cancelThreshold: 42

    });

  }

})();
