$(window).scroll(function(){

  var dist = $(window).scrollTop(),
      win = $(window).height(),
      doc = $(document).height(),
      $btn = $('.back-to-top'),
      $bar = $('.back-to-top--bar');

  if (dist > win) { // if user scrolls one full page length

    $btn.addClass('is-visible')
        .click(function(){ // user clicks button
          $('html, body')
            .stop(true, false)
            .animate({scrollTop: 0}, 1000); // scroll to top
          return false;
        });

    $bar.addClass('is-visible');

  } else { // user scrolls back up

    $btn.removeClass('is-visible');
    $bar.removeClass('is-visible');

  }

});
