(function(){ // safety pants

  $('.tertiary-nav-item a').click(function(event){ // user clicks on tertiary nav item
    event.preventDefault(); // stop from scrolling/jumping

    var $this = $(this);
    var contentID = $this.attr('href');

    $this.closest('ul').children() // localize
      .removeClass('is-selected'); // remove mod class from all

    $this.parent().toggleClass('is-selected'); // toggle mod class on clicked item

    $this.closest('.tertiary')
      .find('.tertiary-nav-content') // select tertiary content
      .removeClass('is-visible') // remove mod class
      .hide(); // hide all

    $('.tertiary-nav-content' + contentID) // find content that matches clicked element
      .show() // show it
      .addClass('is-visible'); // add mod class

    $this.closest('ul') // select parent ul element
      .scrollTo('.is-selected', 600); // scroll to clicked element, animated 600ms

  });

  $(window).load(function(){ // scroll to anchor pants

    var hash = $.trim( window.location.hash ); // get hash value from URL

    if (hash) { // if hash in the URL

      $('.tertiary-nav-item a[href$="'+hash+'"]').click(); // find tertiary link that matches hash and click it on page load
      $('html, body')
        .animate({scrollTop:$('.tertiary-nav-content' + hash) // scroll to anchor
          .offset().top - 288 }, 1000); // offset by 288px

    }

  });

})(); // end safety pants
