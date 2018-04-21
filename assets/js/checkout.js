---
---
var
{% include js/countries.js %},
{% include js/states.js %},
$form = $('#paypal-form'),
shoppingCart = JSON.parse(localStorage['shoppingCart']),
populateStates = function(country) {
  for (c in countries) {
    if (countries[c] === country) {
      for (var i = 0; i < states.length; i++) {
        if (states[i].country === c) {
          $('select[name="state"]').append(
            '<option value="' + states[i].name + '">' + states[i].name + '</option>'
          );
        }
      }
    }
  }
};

$.each(shoppingCart.items, function(i) {
  var
  cartItem = shoppingCart.items[i],
  title = cartItem.title,
  price = cartItem.price,
  qty = cartItem.quantity,
  sku = cartItem.sku;

  $( "<div/>" ).html( "<input type='hidden' name='quantity_" + (i+1) + "' value='" + qty + "'/>" ).insertBefore( "#paypal-btn" );

	$( "<div/>" ).html( "<input type='hidden' name='item_name_" + (i+1) + "' value='" + title + "'/>" ).insertBefore( "#paypal-btn" );

	$( "<div/>" ).html( "<input type='hidden' name='item_number_" + (i+1) + "' value=' " + sku + "'/>" ).insertBefore( "#paypal-btn" );

	$( "<div/>" ).html( "<input type='hidden' name='amount_" + (i+1) + "' value='" + parseFloat(Math.round( (price * qty) * 100) / 100).toFixed(2) + "'/>" ).insertBefore( "#paypal-btn" );
});

console.log(shoppingCart.shipping);

$('<div/>')
.html(
  '<input type="hidden" name="shipping_1" value="' + shoppingCart.shipping + '" />'
).insertBefore('#paypal-btn');

$form
.attr("action", 'https://www.paypal.com/cgi-bin/webscr')
.find("input[name='business']").val('notnewhq@gmail.com')
.end()
.find("input[name='currency_code']" )
.val('USD');

for (country in countries) {
  var dropdown = $('select[name="country"]');

  dropdown.append(
    '<option value="' + countries[country] + '">' + countries[country] + '</option>'
  );
}

$('select[name="country"]').change(function(e) {
  var sel = $(this).val();
  $('select[name="state"]').empty();
  populateStates(sel);
  if ( $('select[name="state"]').find('option').length ) {
    $('.form-field--state')
    .fadeIn()
    .find('select')
    .attr('required', '');
  } else {
    $('.form-field--state')
    .fadeOut()
    .find('select')
    .removeAttr('required');
  }
});

$('form#shipping').submit(function(e) {
  var
  form = $(this),
  firstName = form.find('input[name="first-name"]').val(),
  lastName = form.find('input[name="last-name"]').val(),
  address1 = form.find('input[name="address-1"]').val(),
  address2 = form.find('input[name="address-2"]').val(),
  country = form.find('select[name="country"]').val(),
  city = form.find('input[name="city"]').val(),
  state = form.find('select[name="state"]').val(),
  zip = form.find('input[name="zip"]').val(),
  email = form.find('input[name="email"]').val();
  e.preventDefault();

  $('<div/>')
  .html(
    '<input type="hidden" name="first_name" value="' + firstName + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="last_name" value="' + lastName + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="address1" value="' + address1 + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="address2" value="' + address2 + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="city" value="' + city + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="state" value="' + state + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="country" value="' + country + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="zip" value="' + zip + '" />'
  )
  .insertBefore('#paypal-btn');

  $('<div/>')
  .html(
    '<input type="hidden" name="email" value="' + email + '" />'
  )
  .insertBefore('#paypal-btn');

  $('.checkout-payment').addClass('is-visible');
});
