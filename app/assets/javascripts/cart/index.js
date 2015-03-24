//= require_tree .
'use strict';

var CartModule = angular.module('broker.cart', [])
  .controller('CartController', CartController)
  .service('CartService', CartService)
  .config(
    /**@ngInject*/
    function($stateProvider, USER_ROLES) {
      $stateProvider.state('base.authed.cart', {
        url: "^/cart",
        templateUrl: '/assets/templates/partials/cart/cart.html',
        controller: "CartController as cartCtrl"
      });
    }
  );

window.Cart = CartModule;
