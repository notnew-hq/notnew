---
---
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
    var currentProduct = allProducts[i];
    if (currentProduct.sku === productId) {
      $('#product-img').attr({
        'src': currentProduct.img
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
        var added = new Product(allProducts[i].title, allProducts[i].desc, allProducts[i].img, allProducts[i].price, allProducts[i].sku, q);
        added.size = s;
        added._addToCart(s,q);
      }
    });
  } else {
    alert('Please select size and quantity');
  }
});
