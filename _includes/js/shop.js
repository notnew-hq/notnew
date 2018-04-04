
var shoppingCart = [], // empty array to store added items in
parsedCart = [],
cartTotal = 0,
checkStorage = function(key) {
	// localStorage only supports strings so check for valid value
	if (typeof localStorage[key] === 'string') {
		// restore state of shopping cart
		shoppingCart = JSON.parse(localStorage[key]);
		// log what's in storage
		console.log('Cached result:', shoppingCart);
		return shoppingCart;
	} else {
		console.log('Nothing for "' + key + '" DAWG' );
		return false;
	}
};

if (checkStorage('shoppingCart')){
	$.each(shoppingCart, function(i) {
		shoppingCart[i] = new Product(shoppingCart[i].title, shoppingCart[i].desc, shoppingCart[i].img, shoppingCart[i].price, shoppingCart[i].sku);
		shoppingCart[i]._displayCart('#cart-contents');
		cartTotal += Number(shoppingCart[i].price);
	});
}

// loop through products, add to page, and log to console
for(var i = 0; i < allProducts.length; i++) {
	// construct new Product on each loop
	// read properties from each index in shoppingCart and apply as parameters to Product constructor
	allProducts[i] = new Product(allProducts[i].title, allProducts[i].desc, allProducts[i].img, allProducts[i].price, allProducts[i].sku);
  allProducts[i]._display('#products');
}

/* Product Prototype */
function Product(title, desc, img, price, sku) {
	// set object properties
	this.title = title;
	this.desc = desc;
	this.img = img;
	this.price = price;
	this.sku = sku;
	// create DOM nodes
	product = $('<div></div>');
	image = $('<img>');
	button = $('<a></a>');
	var $this=this;
	// methods
	this._addToCart = function() {
		shoppingCart.push(this);
		localStorage.shoppingCart = JSON.stringify(shoppingCart);
		console.log(shoppingCart);
		cartTotal += Number(this.price);
		console.log('cart total:', cartTotal);
		return cartTotal;
	}
	this._removeFromCart = function() {
		$.each(shoppingCart, function(i) {
			if (shoppingCart[i].sku === sku) {
				shoppingCart.splice(i, 1);
				localStorage.shoppingCart = JSON.stringify(shoppingCart);
				$('.product[data-sku="' + sku + '"]').remove();
			}
			console.log('Removed from cart:', this);
			console.log('Updated cart:', shoppingCart);
		});
		cartTotal -= Number(this.price);
		console.log('cart total:', cartTotal);
		return cartTotal;
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
			'class': 'j-row vertical-center-row space-between product',
			'data-sku': sku
		})
		.html(
			'<img class="j-col j-col-2" src="' + img + '" alt="' + title + '">' +
			'<div class="j-col j-col-5"><span>' + title + '</span></div>' +
			'<div class="j-col j-col-2"><span>' + price + '</span></div>' +
			'<div class="j-col j-col-2"><span>1</span></div>'
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
