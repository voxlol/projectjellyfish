'use strict';

var _ = require('lodash');

/**@ngInject*/
function UserOrderController($scope, orders) {
  this.orders = this.getOrderStatus(orders);
}

UserOrderController.prototype.getOrders = function() {
  return this.orders;
};

UserOrderController.prototype.getOrderStatus = function(orders) {
  // this enumeration of statuses is not consistent with the API's enumeration.
  var provision_status_map = { ok: 0, pending: 1, unknown: 2, warning: 3, critical: 4, retired: 5 };
  _.each(orders, function(order)
  {
    order.provision_status = "ok";
    var retiredCount = 0;
    _.each(order.order_items, function(order_item)
    {
      if (typeof order_item.provision_status === "undefined") {
        order_item.provision_status = "unknown";
      }
      // if an order_item's status is of higher concern than the order's current status
      if (provision_status_map[order.provision_status] < provision_status_map[order_item.provision_status]) {
        if (order_item.provision_status === "retired") {
          retiredCount++;
        }
        // unknown is considered a warning for the order
        else if (order_item.provision_status === "unknown") {
          order.provision_status = "warning";
        }
        else {
          order.provision_status = order_item.provision_status;
        }
      }
    });
    // not retired unless all order_items are retired
    if (retiredCount === order.order_items.length)
    {
      if (retiredCount > 0) {
        order.provision_status = "retired";
      }
      else {
        order.provision_status = "";
      }
    }
  });
  return orders;
};

UserOrderController.resolve = {
  /**@ngInject*/
  orders: function(UserOrders, currentUser) {
    return UserOrders.query({staff_id: currentUser.id}).$promise;
  }
};

module.exports = UserOrderController;