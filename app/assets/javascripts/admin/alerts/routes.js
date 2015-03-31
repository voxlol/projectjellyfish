'use strict';

var AdminListAlertsData = require('./list_alerts_controller').resolve;
var AdminAddAlertData = require('./admin_add_alert_controller').resolve;
var AdminEditAlertData = require('./admin_edit_alert_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider) {
    $stateProvider
        .state('base.authed.admin.alerts', {
            url: '/alerts',
            abstract: true,
            templateUrl: '/partials/admin/alerts/base.html',
            controller: 'AlertsAdminController as alertsAdminCtrl'
        })
        .state('base.authed.admin.alerts.list', {
            url: '/list',
            templateUrl: '/partials/admin/alerts/list_alerts.html',
            controller: 'ListAlertsController as listAlertsCtrl',
            resolve: AdminListAlertsData
        })
        .state('base.authed.admin.alerts.add', {
            url: '/add',
            templateUrl: '/partials/admin/alerts/add_alert.html',
            controller: 'AdminAddAlertController as adminAddAlertCtrl',
            resolve: AdminAddAlertData
        })
        .state('base.authed.admin.alerts.edit', {
            url: '/edit/:id',
            templateUrl: '/partials/admin/alerts/edit_alert.html',
            controller: 'AdminEditAlertController as adminEditAlertCtrl',
            resolve: AdminEditAlertData
        });
};