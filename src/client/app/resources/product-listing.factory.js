(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductListing', ProductListingFactory);

  /** @ngInject */
  function ProductListingFactory($resource) {
    var ProductListing = $resource('/api/v1/product/listings/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    ProductListing.defaults = {
      name: '',
      description: '',
      active: true,
      setup_price: '0.0',
      monthly_price: '0.0',
      hourly_price: '0.0',
      tags: []
    };

    ProductListing.new = newProductListing;

    function newProductListing(data) {
      return new ProductListing(angular.extend({}, ProductListing.defaults, data || {}));
    }

    return ProductListing;
  }
})();
