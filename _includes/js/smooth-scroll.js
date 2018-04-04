(function(){ // smooth scrolling pants

  $('a[href*="#"]') // Select all links with hashes
    // Remove links that I don't want scrolling the page
    .not('.tertiary-nav-item a') // tertitary nav links
    .not('[href="#"]')
    .not('[href="#0"]') // placeholder links
    .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      if (target.length) {// Does a scroll target exist?

        event.preventDefault();

        $('html, body').animate({
          scrollTop: target.offset().top-68

        }, 1000, function() { // Must change focus!

          var $target = $(target);

          $target.focus();

          if ($target.is(":focus")) { // Checking if the target was focused

            return false;

          } else {

            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again

          };
        });
      }
    }
  });

})();
