(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Product', ProductFactory);

  /** @ngInject */
  function ProductFactory($resource) {
    var Product = $resource('/api/v1/products/:id', {id: '@id'}, {
      // Get Single
      get: {
        method: 'GET',
        isArray: false
      },
      // Get All
      query: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT'}
    });

    Product.defaults = {
      name: '',
      description: '',
      active: true,
      setup_price: '0.0',
      monthly_price: '0.0',
      hourly_price: '0.0',
      tags: [],
      properties: {}
    };

    return Product;
  }
})();
