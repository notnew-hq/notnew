---
---
var
{% include js/countries.js %},
{% include js/states.js %},
$form = $('#paypal-form'),
shoppingCart = JSON.parse(localStorage['shoppingCart']),
populateStates = function(country) {
  // loop through countries object
  for (c in countries) {
    // find matching abbreviation
    if (countries[c] === country) {
      // loop through states array
      for (var i = 0; i < states.length; i++) {
        // populate with states from selected country
        if (states[i].country === c) {
          $('select[name="state"]').append(
            '<option value="' + states[i].name + '">' + states[i].name + '</option>'
          );
        }
      }
    }
  }
};
// only execute code if shopping cart has contents
if (shoppingCart.items.length > 0) {
  // get cart items ready to send to PayPal
  $.each(shoppingCart.items, function(i) {
    var
    cartItem = shoppingCart.items[i],
    title = cartItem.title,
    price = cartItem.price,
    qty = cartItem.quantity,
    size = cartItem.size,
    sku = cartItem.sku;
    // create div and add data for each item in cart to PayPal form
    $( '<div/>' ).html( '<input type="hidden" name="quantity_' + (i+1) + "' value=" + qty + '"/>' ).insertBefore('#paypal-btn');

  	$('<div/>').html('<input type="hidden" name="item_name_' + (i+1) + '" value="' + title + ' ' + '(' + size + ')' + '"/>').insertBefore('#paypal-btn');

  	$('<div/>').html('<input type="hidden" name="item_number_' + (i+1) + '" value="' + sku + '"/>' ).insertBefore('#paypal-btn');

  	$('<div/>').html('<input type="hidden" name="amount_' + (i+1) + '" value="' + parseFloat(Math.round( (price * qty) * 100) / 100).toFixed(2) + '"/>' ).insertBefore('#paypal-btn');
  });
  // add shipping rate once outside loop
  // we appended the '_1' because it needed to be tied to an existing product
  // so we tie it to the first product in the cart
  $('<div/>')
  .html(
    '<input type="hidden" name="shipping_1" value="' + shoppingCart.shipping + '" />'
  ).insertBefore('#paypal-btn');
  // configure PayPal form
  $form
  .attr("action", 'https://www.paypal.com/cgi-bin/webscr')
  .find("input[name='business']").val('notnewhq@gmail.com')
  .end()
  .find("input[name='currency_code']" )
  .val('USD');
  // populate countries dropdown
  for (country in countries) {
    var dropdown = $('select[name="country"]');
    // add countries to dropdown on a loop because lazy
    dropdown.append(
      '<option value="' + countries[country] + '">' + countries[country] + '</option>'
    );
  }
  // dependent state dropdown
  $('select[name="country"]').change(function(e) {
    // store the value of the dropdown selection in 'sel'
    var sel = $(this).val();
    // if there's already a list of states, delete it
    $('select[name="state"]').empty();
    // populate states based on selection
    populateStates(sel);
    // only show states dropdown when there are states in it
    if ( $('select[name="state"]').find('option').length ) {
      $('.form-field--state')
      .fadeIn() // show
      .find('select')
      .attr('required', ''); // make required
    } else {
      $('.form-field--state')
      .fadeOut() // hide
      .find('select')
      .removeAttr('required'); // make not required
    }
  });
  // user shipping info form
  $('form#shipping').submit(function(e) {
    // store form data in variables
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
    // stop form from reloading page
    e.preventDefault();
    // add all shipping info to PayPal form on submission
    // FIRST NAME
    $('<div/>')
    .html(
      '<input type="hidden" name="first_name" value="' + firstName + '" />'
    )
    .insertBefore('#paypal-btn');
    // LAST NAME
    $('<div/>')
    .html(
      '<input type="hidden" name="last_name" value="' + lastName + '" />'
    )
    .insertBefore('#paypal-btn');
    // ADDRESS 1
    $('<div/>')
    .html(
      '<input type="hidden" name="address1" value="' + address1 + '" />'
    )
    .insertBefore('#paypal-btn');
    // ADDRESS 2
    $('<div/>')
    .html(
      '<input type="hidden" name="address2" value="' + address2 + '" />'
    )
    .insertBefore('#paypal-btn');
    // CITY
    $('<div/>')
    .html(
      '<input type="hidden" name="city" value="' + city + '" />'
    )
    .insertBefore('#paypal-btn');
    // STATE
    $('<div/>')
    .html(
      '<input type="hidden" name="state" value="' + state + '" />'
    )
    .insertBefore('#paypal-btn');
    // COUNTRY
    $('<div/>')
    .html(
      '<input type="hidden" name="country" value="' + country + '" />'
    )
    .insertBefore('#paypal-btn');
    // ZIP
    $('<div/>')
    .html(
      '<input type="hidden" name="zip" value="' + zip + '" />'
    )
    .insertBefore('#paypal-btn');
    // EMAIL
    $('<div/>')
    .html(
      '<input type="hidden" name="email" value="' + email + '" />'
    )
    .insertBefore('#paypal-btn');
    // bring in "Pay with PayPal" button on shipping submission
    $('.checkout-payment').addClass('is-visible');
  });

}
