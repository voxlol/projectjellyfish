//= require_tree .
var ServiceData = ServiceController.resolve;

var ServicesModule = angular.module("broker.services", [])
  .controller("ServiceController", window.ServiceController)
  .factory("ServicesResource", window.ServicesResource)
  .factory("ServiceAllCountResource", window.ServiceAllCountResource)
  .factory("ServiceProjectCountResource", window.ServiceProjectCountResource)
  .config(
    /**@ngInject*/
    function($stateProvider, USER_ROLES) {
      "use strict";
      $stateProvider
        // service details
        .state("base.authed.service", {
          // @todo order/:order_id should not be needed but API endpoints require it currently.
          // :id is order_item.id
          url: "^/order/:order_id/service/:id",
          templateUrl: "/templates/partials/service.html",
          resolve: ServiceData,
          controller: "ServiceController as serviceCtrl"
        });
    }
  );

window.ServicesModule = ServicesModule;
