(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductCategory', ProductCategoryFactory);

  /** @ngInject */
  function ProductCategoryFactory($resource) {
    var ProductCategory = $resource('/api/v1/product_categories/:id');

    return ProductCategory;
  }
})();
