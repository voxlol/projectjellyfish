//= require_tree .
'use strict';

var OrderData = UserOrderController.resolve;

var UserOrdersModule = angular.module('broker.users.orders', [])
    .factory('UserOrders', UserOrders)
    .controller('UserOrdersController', UserOrderController)
    .config(
      function($stateProvider) {
        $stateProvider
          .state('base.authed.users.orders', {
            url: '/orders',
            templateUrl: '/assets/templates/partials/users/orders/index.html',
            controller: 'UserOrdersController as userOrders',
            resolve: OrderData
          });
      }
    );
window.UserOrdersModule = UserOrdersModule;
