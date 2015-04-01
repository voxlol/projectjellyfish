//= require_tree .
'use strict';

var AdminListAlertsData = ListAlertsController.resolve;
var AdminAddAlertData = AdminAddAlertController.resolve;
var AdminEditAlertData = AdminEditAlertController.resolve;

var AlertsAdminModule = angular.module('broker.admin.alerts', [])
  .controller('AlertsAdminController', AlertsAdminController)
  .controller('ListAlertsController', ListAlertsController)
  .controller('AdminAddAlertController', AdminAddAlertController)
  .controller('AdminEditAlertController', AdminEditAlertController)
  .controller('AdminAlertFormController', AdminAlertFormController)
  .config(
  /**@ngInject*/
  function($stateProvider) {
    $stateProvider
      .state('base.authed.admin.alerts', {
        url: '/alerts',
        abstract: true,
        templateUrl: '/templates/partials/admin/alerts/base.html',
        controller: 'AlertsAdminController as alertsAdminCtrl'
      })
      .state('base.authed.admin.alerts.list', {
        url: '/list',
        templateUrl: '/templates/partials/admin/alerts/list_alerts.html',
        controller: 'ListAlertsController as listAlertsCtrl',
        resolve: AdminListAlertsData
      })
      .state('base.authed.admin.alerts.add', {
        url: '/add',
        templateUrl: '/templates/partials/admin/alerts/add_alert.html',
        controller: 'AdminAddAlertController as adminAddAlertCtrl',
        resolve: AdminAddAlertData
      })
      .state('base.authed.admin.alerts.edit', {
        url: '/edit/:id',
        templateUrl: '/templates/partials/admin/alerts/edit_alert.html',
        controller: 'AdminEditAlertController as adminEditAlertCtrl',
        resolve: AdminEditAlertData
      });
  }
);

window.AlertsAdminModule = AlertsAdminModule;