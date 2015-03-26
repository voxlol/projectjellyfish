//= require_tree .
'use strict';

var DashboardData = DashboardController.resolve;

var DashboardModule = angular.module('broker.dashboard', [])
  .controller('DashboardController', DashboardController)
  .config(
    /**@ngInject*/
    function($stateProvider, USER_ROLES) {
      $stateProvider
        // Dashboard
        .state('base.authed.dashboard', {
          url: "^/dashboard",
          templateUrl: "/templates/partials/dashboard.html",
          resolve: DashboardData,
          controller: "DashboardController as dashboardCtrl"
        });
    }
  );

window.DashboardModule = DashboardModule;
