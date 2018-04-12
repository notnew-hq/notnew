var shoppingCart = {
	items:[],
	totalItems: 0,
	subTotal: 0,
	shipping: 0,
},
max_items = 100,
// check if item is already in cart
checkCart = function(item) {
	var exists = false;
	console.log('Checking for item...');
	$.each(shoppingCart.items, function(i) {
		// item must match SKU and size to qualify as duplicate
		if (shoppingCart.items[i].sku === item.sku && shoppingCart.items[i].size === item.size) {
			exists = true;
			console.log('Item already in cart: ', shoppingCart.items[i].title);
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
		console.log('Existing Cart:', shoppingCart);
		return shoppingCart;
	} else {
		console.log('Nothing for "' + key + '" DAWG' );
		return false;
	}
},
updateStorage = function() {
	localStorage.shoppingCart = JSON.stringify(shoppingCart);
},
cartInfo = function() {
	// Display cart total and calculate shipping
	$('.cart-subtotal').text(shoppingCart.subTotal);
	if (shoppingCart.totalItems > 1 && shoppingCart.totalItems < 5) {
		shoppingCart.shipping = 15;
	} else if (shoppingCart.totalItems > 5) {
		shoppingCart.shipping = 20;
	} else {
		shoppingCart.shipping = 8;
	}
	$('.cart-shipping').text(shoppingCart.shipping);
	$('.cart-total').text(shoppingCart.subTotal + shoppingCart.shipping);
},
updateCart = function(){
	var
	shipping = 0,
	subTotal = 0,
	totalItems = 0;
	if (shoppingCart.items.length > 0) {
		$.each(shoppingCart.items, function(i){
			// add up the price of each item in cart times their quantities
			subTotal += Number(shoppingCart.items[i].price) * shoppingCart.items[i].quantity;
			totalItems += shoppingCart.items[i].quantity;
		});
	}
	shoppingCart.subTotal = subTotal;
	shoppingCart.totalItems = totalItems;
	console.log('Updated cart:', shoppingCart);
};

// return Product method access to objects in storage
if (checkStorage('shoppingCart')){
	$.each(shoppingCart.items, function(i) {
		// construct new Product in place of each object in shoppingCart
		shoppingCart.items[i] = new Product(
			shoppingCart.items[i].title,
			shoppingCart.items[i].desc,
			shoppingCart.items[i].img,
			shoppingCart.items[i].price,
			shoppingCart.items[i].sku,
			shoppingCart.items[i].quantity,
			shoppingCart.items[i].size
		);
		// display cart items and append numbers to IDs on product DOM nodes
		shoppingCart.items[i]._displayCart('.cart-contents', (i + 1));
	});
}

// new Product object for each product in products.js
$.each(allProducts, function(i) {
	// read properties from each index in shoppingCart and apply as parameters to Product constructor
	allProducts[i] = new Product(
		allProducts[i].title,
		allProducts[i].desc,
		allProducts[i].img,
		allProducts[i].price,
		allProducts[i].sku,
		1);
  allProducts[i]._display('#products');
});

$('select.cartItem-quantity').change(function(e) {
	var
	$this = $(this),
	sk = $(this).closest('.cartItem').data('sku'),
	sz = $(this).closest('.cartItem').data('size'),
	sel = $(this).val();

	$.each(shoppingCart.items, function(i) {
		if (shoppingCart.items[i].sku === sk && shoppingCart.items[i].size === sz) {
			if ( Number(sel) > 0 ) {
				if (shoppingCart.totalItems < max_items) {
					shoppingCart.items[i].quantity = Number(sel);
					updateCart();
					updateStorage();
					cartInfo();
				} else {
					e.preventDefault();
					alert('Sorry, we currently have a limit of ' + max_items + ' items per order.');
					$this.val(shoppingCart.items[i].quantity);
				}
			} else {
				shoppingCart.items[i]._removeFromCart();
				return false;
			}
		}
	});
});

/* Product Prototype */
function Product(title, desc, img, price, sku, quantity, size=null) {
	// set object properties
	this.title = title;
	this.desc = desc;
	this.img = img;
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
		// check to see if product is already in cart
		if (shoppingCart.totalItems < max_items) {
			if (checkCart(this)) {
				console.log('Adding ' + q + ' ' + title + '(s) to cart...');
				$.each(shoppingCart.items, function(i) {
					// find existing item in cart and increment quantity
					if (shoppingCart.items[i].sku === sku && shoppingCart.items[i].size === s) {
						shoppingCart.items[i].quantity += q;
					}
				});
			} else {
				// set size property and add new product to cart
				this.size = s;
				shoppingCart.items.push(this);
			}
		} else {
			alert('Sorry, we currently have a limit of ' + max_items + ' items per order.');
		}
		// save state
		updateCart();
		updateStorage();
	};
	this._removeFromCart = function() {
		console.log('Removing from cart...', this);
		$.each(shoppingCart.items, function(i) {
			// find item in cart and differentiate sizes
			if (shoppingCart.items[i].sku === sku && shoppingCart.items[i].size === size) {
				// remove corresponding DOM node
				$('.cartItem[data-size="' + size + '"][data-sku="' + sku + '"]').remove();
				// remove Product from cart items
				shoppingCart.items.splice(i, 1);
				return false;
			}
		});
		updateCart();
		updateStorage();
		cartInfo();
	};
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
			'<p>$' + price + '</p>'
		);
		button
		.attr({
			'href': '/product/?productId=' + sku,
			'class': 'button',
		})
		.text('View Item')
		.appendTo(product);
		product.appendTo(target);
	};
	this._displayCart = function(target, id) {
		image.attr({
			'src': img,
		});
		product.attr({
			'class': 'j-row vertical-center-row space-between product cartItem',
			'id': 'cart-item-' + id,
			'data-sku': sku,
			'data-size': size,
		})
		.html(
			'<img class="j-col j-col-2 cartItem-img" src="' + img + '" alt="' + title + '">' +
			'<div class="j-col j-col-4"><span class="cartItem-title">' + title + '</span></div>' +
			'<div class="j-col j-col-4"><span class="cartItem-size">' + size + '</span></div>' +
			'<div class="j-col j-col-2"><span class="cartItem-price">$' + price + '</span></div>' +
			'<div class="j-col j-col-2"><select class="cartItem-quantity">' +
			'</select>' +
			'</div>'
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
		for (var i = 0; i < max_items; i++) {
			$('.cartItem-quantity').append('<option value="' + i +'">' + i + '</option>');
		};
		product.find('.cartItem-quantity').val(quantity);
		cartInfo();
	};
}
