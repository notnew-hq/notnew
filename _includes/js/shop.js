var shoppingCart = {
	items:[],
	total:0,
},
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
updateCart = function(){
	var total = 0;
	if (shoppingCart.items.length > 0) {
		$.each(shoppingCart.items, function(i){
			// add up the price of each item in cart times their quantities
			total += Number(shoppingCart.items[i].price) * shoppingCart.items[i].quantity;
		});
	}
	shoppingCart.total = total;
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
		shoppingCart.items[i]._displayCart('#cart-contents', (i + 1));
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
		// save state
		updateCart();
		updateStorage();
	};
	this._removeFromCart = function() {
		console.log('Removing from cart...', this);
		$.each(shoppingCart.items, function(i) {
			// find item in cart and differentiate sizes
			if (shoppingCart.items[i].sku === sku && shoppingCart.items[i].size === size) {
				// remove one at a time until there are no more
				if (shoppingCart.items[i].quantity > 1) {
					// adjust quantity in object and cart UI
					shoppingCart.items[i].quantity -= 1;
					$('.cartItem[data-size="' + size + '"][data-sku="' + sku + '"]').find('.cartItem-quantity').text(shoppingCart.items[i].quantity);
				} else {
					console.log('All ' + shoppingCart.items[i].title + ' removed from cart');
					// remove corresponding DOM node
					$('.cartItem[data-size="' + size + '"][data-sku="' + sku + '"]').remove();
					// remove Product from cart items
					shoppingCart.items.splice(i, 1);
					return false;
				}
			}
		});
		updateCart();
		updateStorage();
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
			'<p>' + price + '</p>'
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
}
