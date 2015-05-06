(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductType', ProductTypeFactory);

  /** @ngInject */
  function ProductTypeFactory($resource) {
    var ProductType = $resource('/api/product_types/:id');

    return ProductType;
  }
})();
