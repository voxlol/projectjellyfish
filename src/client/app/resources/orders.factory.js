(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Orders', OrdersFactory);

  /** @ngInject */
  function OrdersFactory($resource) {
    var Orders = $resource('/api/v1/orders/:id', {id: '@id'}, {});

    return Orders;
  }
})();
