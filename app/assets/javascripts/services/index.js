//= require_tree .
'use strict';

var ServiceData = ServiceController.resolve;

var ServicesModule = angular.module('broker.services', [])
  .controller('ServiceController', ServiceController)
  .config(
    /**@ngInject*/
    function($stateProvider, USER_ROLES) {
      $stateProvider
        // service details
        .state('base.authed.service', {
          // @todo order/:order_id should not be needed but API endpoints require it currently.
          // :id is order_item.id
          url: "^/order/:order_id/service/:id",
          templateUrl: "/assets/templates/partials/service.html",
          resolve: ServiceData,
          controller: "ServiceController as serviceCtrl"
        });
    }
  );

window.ServicesModule = ServicesModule;
