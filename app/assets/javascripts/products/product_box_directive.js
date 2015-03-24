'use strict';

/**@ngInject*/
var ProductBoxDirective = function() {
  return {
    restrict: 'E',
    templateUrl: '/assets/templates/partials/products/product_box.html',
    transclude: true,
    scope: {
      product: "="
    }
  };
};

window.ProductBoxDirective = ProductBoxDirective;
