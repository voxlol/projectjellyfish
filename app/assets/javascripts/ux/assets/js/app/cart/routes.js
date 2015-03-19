'use strict';

/**@ngInject*/
module.exports = function($stateProvider, USER_ROLES) {
  $stateProvider.state('base.authed.cart', {
    url: "^/cart",
    templateUrl: '/partials/cart/cart.html',
    controller: "CartController as cartCtrl"
  });
};
