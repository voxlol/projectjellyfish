'use strict';

/**@ngInject*/
var CartService = function($q, $state, OrdersResource, FlashesService) {
  this.$q = $q;
  this.OrdersResource = OrdersResource;
  this.$state = $state;
  this.FlashesService = FlashesService;

  this.cart = this._getResource();
};

CartService.prototype = {

  /**
   * Get Cart Count
   *
   * @returns {Number}
   */
  getCount: function() {
    return this.cart.length;
  },

  /**
   * Return all cart items.
   *
   * @returns {Array}
   */
  getItems: function() {
    return this.cart;
  },

  /**
   * Clear Cart
   */
  clearCart: function() {
    this.cart = [];
    this._updateResource();
  },

  /**
   * Remove Item from Cart by Cart Index
   *
   * @param key
   */
  removeItemByKey: function(key) {
    this.cart.splice(key, 1);
    this._updateResource();
  },

  /**
   * Add item to cart
   *
   * @param requestedBy (User)
   * @param project
   * @param product
   */
  add: function (requestedBy, project, product) {
    var tmpInCartPrice = this._getInCartPrice(product);
    product.in_cart_price = this._formatCurrency(tmpInCartPrice, 2, 3, ',', '.');
    this.cart.push({
      requestedBy: requestedBy,
      project:     project,
      product:     product
    });
    this._updateResource();
  },

  /**
   * Checkout
   * Creates order for each of the items
   *
   * @param checkoutCallback (optional)
   */
  checkout: function(checkoutCallback) {

    var orderItems = [];
    var staffId;

    _.each(this.cart, _.bind(function(item, key, cart) {
      orderItems.push({
        product_id: item.product.id,
        project_id: item.project.id
      });

      staffId = item.requestedBy.id;

    }, this));

    var order = {
      staff_id: staffId,
      order_items: orderItems,
      total: this.totalPrice
    };

    this.OrdersResource.save(order).$promise.then(_.bind(function() {

      // Empty the Cart.
      this.clearCart();
      this.FlashesService.add({
          timeout: true,
          type: 'success',
          message: "Cart was successfully checked out."
      });

      /**
       * If the state we are on is a project, reload it to get the new data.
       * If we are not on a project, when the user goes back to it, it will be reloaded
       * on state change.
       * @todo This is probably not the best way to handle this, but since the cart can be launched
       *       from anywhere, it's hard to pass in a callback without making an equally ugly global one.
       */
      if (this.$state.is('base.authed.project.view')) {
        this.$state.reload();
      }

      // Call defined callback if exists.
      if (_.isFunction(checkoutCallback)) {
        checkoutCallback();
      }

    }, this), _.bind(function() {
      // @todo Error/Reject case.
        this.FlashesService.add({
            timeout: true,
            type: 'error',
            message: "Cart failed to checkout. Please try again."
        });
    }, this));
  },

  /**
   * Returns sum of prices in cart
   *
   * @returns Float
   */
  getTotalPrice: function() {
    this.totalPrice = 0;
    _.each(this.cart, _.bind(function(item, key, cart) {
      this.totalPrice = parseFloat(this.totalPrice)+(parseFloat(this._getInCartPrice(item.product))*10000);
    }, this));
    this.totalPrice = this.totalPrice/10000;
    return this._formatCurrency(this.totalPrice, 2, 3, ',', '.');
  },

  /**
   * Formats the prices to have at least 2 places after the decimal point,
   * adds commas to separate every three places in the whole numbers.
   * @param number  v: the value to be formatted
   * @param integer n: length of decimal
   * @param integer x: length of whole part
   * @param mixed   s: sections delimiter
   * @param mixed   c: decimal delimiter
   *
   * source: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
   * @private
   */
  _formatCurrency: function(v, n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = v.toFixed(Math.max(n, (v.toString().split('.')[1] || []).length));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  },

  /**
   * Get the price to display in cart
   *
   * @private
   */
  _getInCartPrice: function(product) {
    return ((parseFloat(product.monthly_price)*10000) + ((parseFloat(product.hourly_price) * 10000)*750))/10000;
  },

  /**
   * Update Cart Resource
   *
   * @private
   */
  _updateResource: function() {
    if (window.localStorage) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  },

  /**
   * Get Cart Resource
   *
   * @returns {*|Array}
   * @private
   */
  _getResource: function() {
    if (window.localStorage) {
      var data = localStorage.getItem('cart');
      return data ? JSON.parse(data) : [];
    }

    return [];
  }

};

window.CartService = CartService;
