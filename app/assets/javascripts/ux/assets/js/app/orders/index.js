//= require_tree .
'use strict';

var OrdersData = OrdersController.resolve;

var OrdersModule = angular.module('broker.orders', [])
  .controller('OrdersController', OrdersController)
  .factory('OrdersResource', OrdersResource)
  .factory('OrderItemsResource', OrderItemsResource)
  .directive('ordersTable', OrdersTable)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.orders', {
          url: "/orders/:id",
          controller: "OrdersController as ordersCtrl",
          templateUrl: "/partials/orders/orders.html",
          resolve: OrdersData
        });
    }
  );

window.OrdersModule = OrdersModule;
