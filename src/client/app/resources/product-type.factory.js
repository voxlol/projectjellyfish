(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductType', ProductTypeFactory);

  /** @ngInject */
  function ProductTypeFactory($resource, ApiService) {
    var ProductType = $resource(ApiService.routeResolve('productTypesById'));

    return ProductType;
  }
})();
