if (typeof localStorage['shoppingCart'] === 'string') {
  // log what's in storage if it exists
  console.log('Cached result:', JSON.parse(localStorage['shoppingCart']));
  // restore state of shopping cart
  shoppingCart = JSON.parse(localStorage.shoppingCart);
} else {
  console.log('Nothing bitch');
}

// // Appends the required hidden values to PayPal's form before submitting
//
// populatePayPalForm: function() {
//     var self = this;
//     if( self.$paypalForm.length ) {
//         var $form = self.$paypalForm;
//         var cart = self._toJSONObject( self.storage.getItem( self.cartName ) );
//         var shipping = self.storage.getItem( self.shippingRates );
//         var numShipping = self._convertString( shipping );
//         var cartItems = cart.items;
//         var singShipping = Math.floor( numShipping / cartItems.length );
//
//         $form.attr( "action", self.paypalURL );
//         $form.find( "input[name='business']" ).val( self.paypalBusinessEmail );
//         $form.find( "input[name='currency_code']" ).val( self.paypalCurrency );
//
//         for( var i = 0; i < cartItems.length; ++i ) {
//             var cartItem = cartItems[i];
//             var n = i + 1;
//             var name = cartItem.product;
//             var price = cartItem.price;
//             var qty = cartItem.qty;
//
//             $( "<div/>" ).html( "<input type='hidden' name='quantity_" + n + "' value='" + qty + "'/>" ).
//             insertBefore( "#paypal-btn" );
//             $( "<div/>" ).html( "<input type='hidden' name='item_name_" + n + "' value='" + name + "'/>" ).
//             insertBefore( "#paypal-btn" );
//             $( "<div/>" ).html( "<input type='hidden' name='item_number_" + n + "' value='SKU " + name + "'/>" ).
//             insertBefore( "#paypal-btn" );
//             $( "<div/>" ).html( "<input type='hidden' name='amount_" + n + "' value='" + self._formatNumber( price, 2 ) + "'/>" ).
//             insertBefore( "#paypal-btn" );
//             $( "<div/>" ).html( "<input type='hidden' name='shipping_" + n + "' value='" + self._formatNumber( singShipping, 2 ) + "'/>" ).
//             insertBefore( "#paypal-btn" );
//
//         }
//
//     }
// }
