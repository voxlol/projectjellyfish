'use strict';

var _ = require('lodash');

/**@ngInject*/
function UserOrderController($scope, orders) {
  this.orders = this.getOrderStatus(orders);
}

function _reduceItemStatus(status, order_item) {
  var itemStatus = null;
  var provision_status_map = { ok: 0, pending: 1, unknown: 2, warning: 3, critical: 4, retired: 5 };
  // undefined status and 'unknown' statuses are set to 'warning' for order status
  if ((typeof order_item.provision_status === "undefined") || (order_item.provision_status === "unknown")) {
    itemStatus = "warning";
  } else {
    itemStatus = order_item.provision_status;
  }
  // Compare levels of the statuses - the higher status should represent the status of the order (except retired)
  if ((provision_status_map[itemStatus] > provision_status_map[status]) && (itemStatus !== "retired")) {
    return itemStatus;
  } else {
    // Return existing status
    return status;
  }
}

UserOrderController.prototype.getOrders = function() {
  return this.orders;
};

UserOrderController.prototype.getOrderStatus = function(orders) {
  _.each(orders, function(order)
  {
    if (_.every(order.order_items, {provision_status: 'retired'})) {
      order.provision_status = "retired";
    }
    else {
      order.provision_status = _.reduce(order.order_items, _reduceItemStatus, "ok");
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