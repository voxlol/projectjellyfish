(function() {
  'use strict';

  angular.module('app.resources')
    .factory('OrderItems', OrderItemsFactory);

  /** @ngInject */
  function OrderItemsFactory($resource, ApiService) {
    var OrderItems = $resource(ApiService.routeResolve('orderItems'), {id: '@id'}, {
      startService: {
        method: 'PUT',
        url: ApiService.routeResolve('orderItems') + '/start_service'
      },
      stopService: {
        method: 'PUT',
        url: ApiService.routeResolve('orderItems') + '/stop_service'
      }
    });

    return OrderItems;
  }
})();
