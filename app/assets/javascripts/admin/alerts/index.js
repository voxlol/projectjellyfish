'use strict';

var angular = require('angular');

var AlertsAdminModule = angular.module('broker.admin.alerts', [])
    .controller('AlertsAdminController', require('./alerts_admin_controller'))
    .controller('ListAlertsController', require('./list_alerts_controller'))
    .controller('AdminAddAlertController', require('./admin_add_alert_controller'))
    .controller('AdminEditAlertController', require('./admin_edit_alert_controller'))
    .controller('AdminAlertFormController', require('./admin_alert_form_controller'))
    .config(require('./routes'));

module.exports = AlertsAdminModule;