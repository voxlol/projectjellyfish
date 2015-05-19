(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Orders', OrdersFactory);

  /** @ngInject */
  function OrdersFactory($resource, ApiService) {
    var Orders = $resource(ApiService.routeResolve('orders'), {id: '@id'}, {});

    return Orders;
  }
})();
