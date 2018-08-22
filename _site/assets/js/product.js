var allProducts = [
	{
		title: 'White T-Shirt',
		desc: 'White t-shirt with front and back black print.',
		images: [
			'/assets/img/not-new-white-t-5.jpg',
			'/assets/img/not-new-white-t-10.jpg',
			'/assets/img/not-new-white-t-14.jpg',
			'/assets/img/not-new-white-t-1.jpg',
		],
		price: '21',
		sku: 'NNH007'
	},
	{
		title: 'Pink Sweatshirt',
		desc: 'Pink sweatshirt with white print. (Pink L and XL on backorder.)',
		images: [
			'/assets/img/not-new-pink-hoody-w-1.JPG',
			'/assets/img/not-new-pink-hoody-w-2.JPG',
			'/assets/img/not-new-pink-hoody-w-3.JPG',
			'/assets/img/not-new-pink-hoody-w-4.JPG',
		],
		price: '40',
		sku: 'NNH006'
	},
	{
		title: 'Sand Sweatshirt',
		desc: 'Sand sweatshirt with white print. (Sand L on backorder.)',
		images: [
			'/assets/img/not-new-sand-hoody-w-landscape.JPG',
			'/assets/img/not-new-sand-hoody-w-2.JPG',
			'/assets/img/not-new-sand-hoody-w-3.JPG',
			'/assets/img/not-new-sand-hoody-w-4.JPG',
		],
		price: '40',
    sku: 'NNH001'
	},
	{
		title: 'White Sweatshirt',
		desc: 'White sweatshirt with black print.',
		images: [
			'/assets/img/not-new-white-hoody-m-3.JPG',
			'/assets/img/not-new-white-hoody-m-1.JPG',
			'/assets/img/not-new-white-hoody-w-1.JPG',
			'/assets/img/not-new-white-hoody-w-2.JPG',
		],
		price: '40',
    sku: 'NNH002'
	},
	{
		title: 'Red Sweatshirt',
		desc: 'Red sweatshirt with white print. (Red L on backorder)',
		images: [
			'/assets/img/not-new-red-hoody-m-1.JPG',
			'/assets/img/not-new-red-hoody-m-2.JPG',
			'/assets/img/not-new-red-hoody-w-1.JPG',
			'/assets/img/not-new-red-hoody-w-2.JPG',
		],
		price: '40',
		sku: 'NNH003'
	},

	{
		title: 'Yellow Sweatshirt',
		desc: 'Yellow sweatshirt with white print.',
		images: [
			'/assets/img/not-new-sweatshirt-yellow-1.JPG',
			'/assets/img/not-new-sweatshirt-yellow-3.JPG',
			'/assets/img/not-new-sweatshirt-yellow-2.JPG',
			'/assets/img/not-new-sweatshirt-yellow-4.JPG',
		],
		price: '40',
		sku: 'NNH005'
	},
]

var checkParams = function(p) {

  var
  pageURL = window.location.search.substring(1),
  urlParams = pageURL.split('&');

  if ( urlParams.length > 0 ) {

    for (var i = 0; i < urlParams.length; i++) {

      var param = urlParams[i].split('=');
      if (param[0] == p) {
        return param[1];
      }
      console.log('Found URL parameter ' + param[0] + ': ' + param[1]);

    } // end loop

  }

},
productId = checkParams('productId');

if (productId) {
  $.each(allProducts, function(i) {
    var
    currentProduct = allProducts[i],
    images = currentProduct.images;
    if (currentProduct.sku === productId) {
      // $('#product-img').attr({
      //   'src': allProducts[i]['images'][0]
      // });
      $.each(images, function(n) {
        var
        currentImg = images[n],
        imgWrap = $('.product-image-' + (n + 1)),
        productImg = imgWrap.find('img');

        productImg.attr({
          src: currentImg
        }).addClass('populated');
      });
      $('#product-title').text(currentProduct.title);
      $('#product-desc').text(currentProduct.desc);
      $('#product-price').text(currentProduct.price);
    }
  });
}
$('.js-addToCart').click(function(e) {
  var
  q = Number($('#product-quantity').val()),
  s = $('#product-size').val();
  e.preventDefault();
  if (q && s) {
    $.each(allProducts, function(i) {
      if (allProducts[i].sku === productId) {
        var added = new Product(allProducts[i].title, allProducts[i].desc, allProducts[i].images, allProducts[i].price, allProducts[i].sku, q);
        added.size = s;
        added._addToCart(s,q);
      }
    });
  } else {
    alert('Please select size and quantity');
  }
});
(function() {

  var
  current = 0,
  lightbox = $('#lightbox'),
  photos = $('#photos').find('.photo'),
  slides = lightbox.find('.lightbox-photos').find('.lightbox-photo');

photos.click(function() {

  current = $(this).index();
  $(this).addClass('is-current');
  slides.eq(current).addClass('is-current').show();
  lightbox.addClass('is-visible').fadeIn();

});

function nextSlide() {

  if ((current + 1) === slides.length) {

    photos.eq(current)
      .removeClass('is-current')
      .end()
      .eq(0)
      .addClass('is-current');

    slides.eq(current)
      .removeClass('is-current')
      .hide()
      .end()
      .eq(0)
      .addClass('is-current')
      .show();

    current = 0;

  } else {

    photos.eq(current)
      .removeClass('is-current')
      .end()
      .eq(current + 1)
      .addClass('is-current');

    slides.eq(current)
      .removeClass('is-current')
      .hide()
      .end()
      .eq(current + 1)
      .addClass('is-current')
      .show();

    current++;
  }

}

function prevSlide() {

  if (current === 0) {

    photos.eq(current)
      .removeClass('is-current')
      .end()
      .eq(slides.length - 1)
      .addClass('is-current');

    slides.eq(current)
      .removeClass('is-current')
      .hide()
      .end()
      .eq(slides.length - 1)
      .addClass('is-current')
      .show();

    current = slides.length - 1;

  } else {

    photos.eq(current)
      .removeClass('is-current')
      .end()
      .eq(current - 1)
      .addClass('is-current');

    slides.eq(current)
      .removeClass('is-current')
      .hide()
      .end()
      .eq(current - 1)
      .addClass('is-current')
      .show();

    current--;

  }

}

function closeLightbox() {

  slides.removeClass('is-current').hide();
  lightbox.removeClass('is-visible').fadeOut();

}

$('.lightbox-button').click(function(e) {

  e.preventDefault();
  if ($(this).is('.next')) {
    nextSlide();
  } else {
    prevSlide();
  }

});

$('.lightbox-close').click(closeLightbox);

$(document).keydown(function(e) {

  if (e.which === 27 && lightbox.is('.is-visible')) {
    closeLightbox();
  }

});

})();
