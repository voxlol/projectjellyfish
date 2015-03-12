'use strict';

var _ = require('lodash');

/**@ngInject*/
function UserOrderController($scope, orders) {
    var provision_status_map = { ok: 0, warning: 1, critical: 2, unknown: 3, pending: 4, retired: 5, blank: 6 };
    _.each(orders, function(order)
    {
        order.provision_status = "blank";
        _.each(order.order_items, function(order_item) //can't break out of, so may want to use a for loop and break at lowest status
        {
                if ((typeof order_item.provision_status !== "undefined") && (provision_status_map[order.provision_status] > provision_status_map[order_item.provision_status]))
                {
                    order.provision_status = order_item.provision_status;
                }
        });
        if (order.provision_status === "blank")
        {
            order.provision_status = "";
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