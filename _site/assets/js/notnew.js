function isTouch() { // check to see if touch screen
  try {
    document.createEvent("TouchEvent");
    return true;
  }
  catch(e) {
    return false;
  }
}
var shoppingCart = {
	items:[],
	total:0,
},
checkCart = function(item) {
	var exists = false;
	console.log('Checking for item...');
	$.each(shoppingCart.items, function(i) {
		if (shoppingCart.items[i].sku === item.sku) {
			exists = true;
			console.log('Item exists: ', shoppingCart.items[i]);
			return exists;
		}
	});
	if (exists) {
		return true
	} else {
		return false;
	}
},
checkStorage = function(key) {
	// localStorage only supports strings so check for valid value
	if (typeof localStorage[key] === 'string') {
		// restore state of shopping cart
		shoppingCart = JSON.parse(localStorage[key]);
		// log what's in storage
		console.log('Cached result:', shoppingCart);
		shoppingCart.updateCart = updateCart;
		return shoppingCart;
	} else {
		console.log('Nothing for "' + key + '" DAWG' );
		return false;
	}
},
updateStorage = function() {
	localStorage.shoppingCart = JSON.stringify(shoppingCart);
},
updateCart = function(){
	var total = 0;
	$.each(shoppingCart.items, function(i){
		total += Number(shoppingCart.items[i].price) * shoppingCart.items[i].quantity;
	});
	shoppingCart.total = total;
	console.log('Updated cart:', shoppingCart);
};

if (checkStorage('shoppingCart')){
	$.each(shoppingCart.items, function(i) {
		shoppingCart.items[i] = new Product(shoppingCart.items[i].title, shoppingCart.items[i].desc, shoppingCart.items[i].img, shoppingCart.items[i].price, shoppingCart.items[i].sku, shoppingCart.items[i].quantity);
		shoppingCart.items[i]._displayCart('#cart-contents');
	});
}

// loop through products, add to page, and log to console
for(var i = 0; i < allProducts.length; i++) {
	// construct new Product on each loop
	// read properties from each index in shoppingCart and apply as parameters to Product constructor
	allProducts[i] = new Product(allProducts[i].title, allProducts[i].desc, allProducts[i].img, allProducts[i].price, allProducts[i].sku, 1);
  allProducts[i]._display('#products');
}

/* Product Prototype */
function Product(title, desc, img, price, sku, quantity) {
	// set object properties
	this.title = title;
	this.desc = desc;
	this.img = img;
	this.price = price;
	this.sku = sku;
	this.quantity = quantity;
	// create DOM nodes
	product = $('<div></div>');
	image = $('<img>');
	button = $('<a></a>');
	var $this=this;
	// methods
	this._addToCart = function() {
		if (checkCart(this)) {
			$.each(shoppingCart.items, function(i) {
				if (shoppingCart.items[i].sku === sku) {
					shoppingCart.items[i].quantity += 1;
				}
			});
		} else {
			shoppingCart.items.push(this);
		}
		updateCart();
		updateStorage();
	}
	this._removeFromCart = function() {
		$.each(shoppingCart.items, function(i) {
			if (shoppingCart.items[i].sku === sku) {
				if (shoppingCart.items[i].quantity < 2) {
					console.log('All ' + shoppingCart.items[i].title + ' removed from cart');
					$('.product[data-sku="' + sku + '"]').remove();
					shoppingCart.items.splice(i, 1);
					return;
				} else {
					shoppingCart.items[i].quantity -= 1;
					$('.cartItem[data-sku="' + sku + '"]').find('.cartItem-quantity').html(shoppingCart.items[i].quantity);
					return;
				}
			}
		});
		console.log('Removed from cart:', this);
		updateCart();
		updateStorage();
	}
	this._display = function(target) {
		image.attr({
			'src': img,
		});
		product.attr({
			'class': 'j-col j-col-4 product',
			'data-sku': sku
		})
		.html(
			'<img style="display: block; width: 100%;" src="' + img + '" alt="' + title + '">' +
			'<h2>' + title + '</h2>' +
			'<p>' + desc + '</p>' +
			'<p>' + price + '</p>'
		);
		button
		.attr({
			'href': 'javascript:void(0)',
			'class': 'button',
		})
		.text('Add to Cart')
		.appendTo(product)
		.click($.proxy(this._addToCart, this));
		product.appendTo(target);
	};
	this._displayCart = function(target) {
		image.attr({
			'src': img,
		});
		product.attr({
			'class': 'j-row vertical-center-row space-between product cartItem',
			'data-sku': sku
		})
		.html(
			'<img class="j-col j-col-2 cartItem-img" src="' + img + '" alt="' + title + '">' +
			'<div class="j-col j-col-5"><span class="cartItem-title">' + title + '</span></div>' +
			'<div class="j-col j-col-2"><span class="cartItem-price">' + price + '</span></div>' +
			'<div class="j-col j-col-2"><span class="cartItem-quantity">' + quantity + '</div>'
		);
		button
		.attr({
			'href': 'javascript:void(0)',
			'class': 'button',
		})
		.text('Remove')
		.appendTo(product)
		.click($.proxy(this._removeFromCart, this));
		product.appendTo(target);
	};
	this._log = function(n) {
    console.log(
    	'Logged product #' + (n + 1) + '!\n' +
      title + '\n' +
      desc + '\n' +
      img + '\n' +
      price +'\n' +
			sku
    );
  };
}

jQuery(document).ready(function($) { // DOM ready pants

  // Slider
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


// Tertiary
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


// Nav
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


// Free Trial
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


// Back to Top
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


// Collapsible Section
$('.collapsible-title').click(function(){

	$(this).toggleClass('is-expanded')
		.parent().find('.collapsible-section--content')
			.toggleClass('is-expanded')
			.slideToggle();

});


// Forms
(function(){
	var
	form = $('form.form'),
	country = form.find('.country').find('select');

	// Dropdown arrow
	$('.selectWrap').click(function() {

		$(this).toggleClass('is-open');

	});

	// Dependent state field
	country.change(function() {

		var
		selection = $(this).val(),
		hasState = new RegExp(/^(United States|Canada)$/),
		state = $(this).closest('.form').find('.state');

		if (selection.match(hasState)) {
			state.fadeIn().find('select').attr('required', '');
		} else {
			state.fadeOut().find('select').removeAttr('required');
		}

	});

	// Success Window
	form.submit(function(e){ // on form submission

    var
		$this = $(this),
		email = $this.find('input[type="email"]').val(), // get user's email address
    form_id = $this.attr('id'), // return ID of form user submitted
		name = $this.find('.first-name').val(),
		freeESPs = ['gmail.com', 'yahoo.com', 'msn.com', 'aol.com', 'juno.com', 'hotmail.com', 'live.com', 'comcast.net'],
		captcha = $('#g-recaptcha-response');

		$.each(freeESPs, function(i) { // loop through free ESP list

			var esp = new RegExp(freeESPs[i], 'g');

			if (email.match(esp)) { // if email is from free ESP
				// alert and stop form submission
				alert('Sorry, no ' + freeESPs[i] + ' addresses allowed! Please use your corporate email address.');
				e.preventDefault();
				return false;

			} else {

				if ($this.data('mql')) {

					if (captcha) {

						if (captcha.val() === "") {
							e.preventDefault();
							alert('Please verify your humanity!');
							return false;
						} else {
							window.open("/confirmation/" + form_id + "/#" + name, 'success_window', 'width=1024,height=640');
						}

					} else {

						window.open("/confirmation/" + form_id + "/#" + name, 'success_window', 'width=1024,height=640');

					}

				} else {

					window.open("/confirmation/" + form_id + "/#" + email, 'success_window', 'width=1024,height=640'); // open a new window with correct confirmation message email passed as URL hash

				}

			}

		});

  });

})();



  (function($) {

  /*!
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

  $.fn.visible = function(partial) {

      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };

})(jQuery);

$(window).scroll(function(event) {

  $('.js-scroll').each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass('is-scrolled');
    }
  });

});


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


  /*!
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler ○ gmail • com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.3
 */
;(function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});


});
