//= require_tree .
'use strict';

var AlertsModule = angular.module('broker.alerts', [])
  .directive('alertsTable', AlertsTable)
  .factory('AlertsResource', AlertsResource)

window.AlertsModule = AlertsModule;
