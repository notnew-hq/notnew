var shoppingCart = {
	items:[],
	total:0,
},
checkCart = function(item) {
	var exists = false;
	console.log('Checking for item...');
	$.each(shoppingCart.items, function(i) {
		if (shoppingCart.items[i].sku === item.sku && shoppingCart.items[i].size === item.size) {
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
	this.size = null;

	// create DOM nodes
	product = $('<div></div>');
	image = $('<img>');
	button = $('<a></a>');
	var $this=this;
	// methods
	this._addToCart = function(size, quantity) {
		if (checkCart(this)) {
			$.each(shoppingCart.items, function(i) {
				if (shoppingCart.items[i].sku === sku && shoppingCart.items[i].size === this.size) {
					shoppingCart.items[i].quantity += quantity;
				}
			});
		} else {
			this.size = size;
			shoppingCart.items.push(this);
		}
		updateCart();
		updateStorage();
	}
	this._removeFromCart = function() {
		$.each(shoppingCart.items, function(i) {
			if (shoppingCart.items[i].sku === sku && shoppingCart.items[i].size === this.size) {
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
			'href': '/product/?productId=' + sku,
			'class': 'button',
		})
		.text('View Item')
		.appendTo(product);
		// .click($.proxy(this._addToCart, this));
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
