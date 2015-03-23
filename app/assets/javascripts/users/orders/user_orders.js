'use strict';

/**@ngInject*/
var UserOrders = function($resource, apiResource) {
    return $resource(apiResource('staffOrders'), {id:'@id', staff_id: '@staff_id'}, {});
};

window.UserOrders = UserOrders;
