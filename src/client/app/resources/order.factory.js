(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Order', OrderFactory);

  /** @ngInject */
  function OrderFactory($resource) {
    var Order = $resource('/api/v1/orders/:id', {id: '@id'});

    return Order;
  }
})();
