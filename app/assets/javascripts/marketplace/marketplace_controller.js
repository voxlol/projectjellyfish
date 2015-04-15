'use strict';

/**@ngInject*/
function MarketplaceController(products, categories) {
  var self = this;

  this.products = products;
  this.categories = categories;

  _.each(this.categories, function(category) {
    category.products = _.filter(self.products, function(product) {
      return product.product_type == category.title;
    });
  });
}

MarketplaceController.resolve = {};

window.MarketplaceController = MarketplaceController;
