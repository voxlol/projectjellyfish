'use strict';

var _ = require('lodash');

/**@ngInject*/
function UserOrderController($scope, orders) {
    var provision_status_map = { ok: 0, warning: 1, critical: 2, unknown: 3, pending: 4, retired: 5 };
    _.each(orders, function(order)
    {
        order.provision_status = "ok";
        var retiredCount = 0;
        _.each(order.order_items, function(order_item)
        {
            if (typeof order_item.provision_status === "undefined")
            {
                order_item.provision_status = "unknown";
            }
            if (provision_status_map[order.provision_status] < provision_status_map[order_item.provision_status])
            {
                if (order_item.provision_status === "retired")
                {
                    retiredCount++;
                }
                else
                {
                    order.provision_status = order_item.provision_status;
                }
            }
        });
        if (retiredCount == order.order_items.length)
        {
            if (retiredCount > 0)
            {
                order.provision_status = "retired";
            }
            else
            {
                order.provision_status = "";
            }
        }
    });
    this.orders = orders;
}

UserOrderController.prototype.getOrders = function() {
    return this.orders;
};

UserOrderController.resolve = {
    /**@ngInject*/
    orders: function(UserOrders, currentUser) {
        return UserOrders.query({staff_id: currentUser.id}).$promise;
    }
};

module.exports = UserOrderController;