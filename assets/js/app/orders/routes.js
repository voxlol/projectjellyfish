'use strict';

var OrdersData = require('./orders_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider) {
  $stateProvider
    .state('base.authed.orders', {
      url: "/orders/:id",
      controller: "OrdersController as ordersCtrl",
      templateUrl: "/partials/orders/orders.html",
      resolve: OrdersData
    });
};
