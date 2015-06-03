(function () {
  'use strict';

  angular.module('app.resources')
    .factory('ProductCategory', ProductCategoryFactory);

  /** @ngInject */
  function ProductCategoryFactory($resource, ApiService) {
     var ProductCategory = $resource(ApiService.routeResolve('productCategories'), {id: '@id'}, {});

    return ProductCategory;
  }
})();
