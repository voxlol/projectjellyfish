(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductType', ProductTypeFactory);

  /** @ngInject */
  function ProductTypeFactory($resource, $http) {
    var ProductType = $resource('/api/v1/product_types/:id', {id: '@id'});

    ProductType.prototype.asyncSelect = asyncSelect;

    function asyncSelect(key) {
      var url = ['/api/v1/product_types', this.id, 'async_select', key].join('/');

      return $http.get(url).then(handleData);

      function handleData(results) {
        return results.data;
      }
    }

    return ProductType;
  }
})();
