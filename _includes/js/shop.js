{% include js/products.js %}

var shoppingCart = {
	items:[],
	totalItems: 0,
	subTotal: 0,
	// shipping: 0,
},
max_items = 100, // declare max order quantity
cartInfo = function() {
	// Display cart total and calculate shipping
	$('.cart-subtotal').text('$' + shoppingCart.subTotal);
	// $('.cart-shipping').text('$' + shoppingCart.shipping);
	$('.cart-total').text('$' + (shoppingCart.subTotal));
},
checkCart = function(sku, size) {
	var
	cart = shoppingCart.items,
	// empty var to be returned with object data
	item;
	console.log('Checking for item...');
	// loop through cart to find match
	$.each(cart, function(i) {
		// items must have same size AND sku to qualify as match
		if (cart[i].sku === sku && cart[i].size === size) {
			console.log('Found item in cart: ', cart[i]);
			// set empty variable to object
			item = cart[i];
		}
	});
	// return object from cart
	return item;
},
updateCart = function(){
	var
	// shipping = 0,
	subTotal = 0,
	totalItems = 0;
	if (shoppingCart.items.length > 0) {
		$.each(shoppingCart.items, function(i){
			// add up the price of each item in cart times their quantities
			subTotal += Number(shoppingCart.items[i].price) * shoppingCart.items[i].quantity;
			totalItems += shoppingCart.items[i].quantity;
		});
		// update cart properties
		shoppingCart.subTotal = subTotal;
		shoppingCart.totalItems = totalItems;
		// set shipping rates
	// 	if (shoppingCart.totalItems < 2) {
	// 		shoppingCart.shipping = 8;
	// 	} else if (shoppingCart.totalItems > 2 && shoppingCart.totalItems <= 5) {
	// 		shoppingCart.shipping = 15;
	// 	} else if (shoppingCart.totalItems > 5) {
	// 		shoppingCart.shipping = 20;
	// 	}
	// } else {
	// 	shoppingCart.subTotal = 0;
	// 	shoppingCart.totalItems = 0;
	// 	// shoppingCart.shipping = 0;
	}
	// update cart item counters across site
	$('.cart-quantity').text(shoppingCart.totalItems);
	console.log('Updated cart:', shoppingCart);
},
checkStorage = function(key) {
	// localStorage only supports strings so check for valid value
	if (typeof localStorage[key] === 'string') {
		// restore state of shopping cart
		shoppingCart = JSON.parse(localStorage[key]);
		// log what's in storage
		console.log('Existing Cart:', shoppingCart);
		// update cart item counters across site
		$('.cart-quantity').text(shoppingCart.totalItems);
		return shoppingCart;
	} else {
		console.log('No existing ' + key);
		return false;
	}
},
updateStorage = function() {
	localStorage.shoppingCart = JSON.stringify(shoppingCart);
};

// return Product method access to objects in storage
if (checkStorage('shoppingCart')){
	var cartContainer = $('.cart-contents');
	if (cartContainer) {
		var editable = cartContainer.data('editable');
		$.each(shoppingCart.items, function(i) {
			// construct new Product in place of each object in shoppingCart
			shoppingCart.items[i] = new Product(
				shoppingCart.items[i].title,
				shoppingCart.items[i].desc,
				shoppingCart.items[i].images,
				shoppingCart.items[i].price,
				shoppingCart.items[i].sku,
				shoppingCart.items[i].quantity,
				shoppingCart.items[i].size
			);
			// display cart items and append numbers to IDs on product DOM nodes
			shoppingCart.items[i]._displayCart('.cart-contents', (i + 1), editable);
		});
	}
}

// new Product object for each product in products.js
$.each(allProducts, function(i) {
	// read properties from each index in shoppingCart
	// apply as parameters to Product constructor
	allProducts[i] = new Product(
		allProducts[i].title,
		allProducts[i].desc,
		allProducts[i].images,
		allProducts[i].price,
		allProducts[i].sku,
		1);
  allProducts[i]._display('#products');
	console.log(allProducts[i]);
});
// user updates item quantity from dropdown
$('select.cartItem-quantity').change(function(e) {
	var
	$this = $(this),
	// item sku
	sk = $(this).closest('.cartItem').data('sku'),
	// item size
	sz = $(this).closest('.cartItem').data('size'),
	// item with size and sku
	item = checkCart(sk, sz);
	// user selection
	sel = $(this).val();
	// check for item
	if (item) {
		if (Number(sel) > 0) {
			// make sure new quantity doesn't overflow cart
			if ( ((shoppingCart.totalItems - item.quantity) + Number(sel)) > max_items ) {
				// prevent default just in case
				e.preventDefault();
				alert('Sorry, we currently have a limit of ' + max_items + ' items per order.');
				// set value back to what it was before user tried to change
				$this.val(item.quantity);
			} else {
				// set quantity to user selection
				item.quantity = Number(sel);
				// save state and update front end
				updateCart();
				updateStorage();
				cartInfo();
			}
		} else {
			// if user selects 0, just delete item from cart
			item._removeFromCart();
		}
	}
});

/* Product Prototype */
function Product(title, desc, images, price, sku, quantity, size=null) {
	// set object properties
	this.title = title;
	this.desc = desc;
	this.images = images;
	this.price = price;
	this.sku = sku;
	this.quantity = quantity;
	this.size = size;
	// create DOM nodes
	product = $('<div></div>');
	image = $('<img>');
	button = $('<a></a>');
	// methods
	this._addToCart = function(s, q) {
		// check cart for item with checkCart()
		var item = checkCart(this.sku, this.size);
		// if we have room in the cart
		if (shoppingCart.totalItems < max_items) {
			// and if item exists
			if (item) {
				console.log('Adding ' + q + ' ' + title + '(s) to cart...');
				// increase item quantity by quantity selected
				item.quantity += q;
			} else { // item does not exist in cart
				// set size property and add new product to cart
				this.size = s;
				shoppingCart.items.push(this);
			}
			alert('Added to cart: ' + title + ' ' + '(' + quantity + ')');
		} else { // cart is full
			alert('Sorry, we currently have a limit of ' + max_items + ' items per order.');
		}
		// save state
		updateCart();
		updateStorage();
	};
	this._removeFromCart = function() {
		if (confirm('Are you sure you want to remove ' + title + ' from cart?')) {
			var
			item = checkCart(this.sku, this.size),
			itemNode = $('.cartItem[data-size="' + size + '"][data-sku="' + sku + '"]');
			console.log('Removing from cart...', this);
			if (item) {
				// remove Product from cart items
				// find the index of the item node in cart-contents
				// remove the item at matching index of shoppingCart.items
				shoppingCart.items.splice(itemNode.index(), 1);
				// remove DOM node
				itemNode.remove();
			}
			// save state and reflect changes
			updateCart();
			updateStorage();
			cartInfo();
		}
	};
	this._display = function(target) {
		// set image
		// image.attr({
		// 	'src': images[0],
		// });
		// configure product
		product.attr({
			'class': 'j-col j-col-4 product',
			'data-sku': sku
		})
		// populate image, title, description, and price
		.html(
			'<a href="/product/?productId=' + sku + '">' +
			'<img style="display: block; width: 100%;" src="' + images[0] + '" alt="' + title + '">' +
			'<h2>' + title + '</h2></a>' +
			'<p>' + desc + '</p>' +
			'<p>$' + price + '</p>'
		);
		// configure button
		button
		.attr({
			'href': '/product/?productId=' + sku,
			'class': 'button',
		})
		.text('View Item')
		.appendTo(product);
		// add product to page at specified target
		product.appendTo(target);
	};
	// display items in cart
	this._displayCart = function(target, id, editable) {
		// set image
		image.attr({
			'src': images[0],
		});
		// configure product parent node
		product.attr({
			'class': 'j-row vertical-center-row space-between product cartItem',
			// give ID based on index in cart
			'id': 'cart-item-' + id,
			// store differentiating data in html attributes
			'data-sku': sku,
			'data-size': size,
		});
		// render product details
		if(editable) {
			product.html(
				'<img class="j-col j-col-2 cartItem-img" src="' + images[0] + '" alt="' + title + '">' +
				'<div class="j-col j-col-4"><span class="cartItem-title">' + title + '</span></div>' +
				'<div class="j-col j-col-2"><span class="cartItem-size">' + size + '</span></div>' +
				'<div class="j-col j-col-2"><span class="cartItem-price">$' + price + '</span></div>' +
				'<div class="j-col j-col-2"><select class="cartItem-quantity">' +
				'</select>' +
				'</div>'
			);
			// configure button
			button
			.attr({
				'href': 'javascript:void(0)',
				'class': 'button',
			})
			.text('Remove')
			.appendTo(product)
			.click($.proxy(this._removeFromCart, this));
		} else {
			product.html(
				'<img class="j-col j-col-2 cartItem-img" src="' + images[0] + '" alt="' + title + '">' +
				'<div class="j-col j-col-4"><span class="cartItem-title">' + title + '</span></div>' +
				'<div class="j-col j-col-2"><span class="cartItem-size">' + size + '</span></div>' +
				'<div class="j-col j-col-2"><span class="cartItem-quantity--readonly">' + quantity + '</span></div>' +
				'<div class="j-col j-col-2"><span class="cartItem-price">$' + price + '</span></div>' +
				'</div>'
			);
		}
		// add cart item to front end
		product.appendTo(target);
		// add dropdown options to quantity select
		for (var i = 0; i < max_items; i++) {
			$('.cartItem-quantity').append('<option value="' + i +'">' + i + '</option>');
		};
		// set initial values of all dropdowns to match item quantity in cart
		product.find('.cartItem-quantity').val(quantity);
		// display total, shipping, etc.
		cartInfo();
	};
}
