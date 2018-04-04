(function(){ // nav pants

  $(window).scroll(function(){

    var scroll = $(window).scrollTop();
    var $nav = $('.navbar');
    var navHeight = $nav.height();

    if (scroll >= navHeight) { // user scrolls past height of nav

      $nav.addClass('is-scrolled'); // add mod class

    } else {

      $nav.removeClass('is-scrolled'); // remove mod class

    }

  });

  $('.js-nav-trigger').click(function(){ // user clicks nav trigger

    $(this).toggleClass('is-clicked'); // toggle animation/mod class

    $('nav.nav').toggleClass('is-visible'); // toggle mod class on nav

  });

})();
