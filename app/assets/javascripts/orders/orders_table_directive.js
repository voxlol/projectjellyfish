'use strict';

/**@ngInject*/
var OrdersTable = function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/partials/common/orders_table.html',
    transclude: true,
    scope: {
      orders: "="
    }
  };
};

window.OrdersTable = OrdersTable;
