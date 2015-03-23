//= require_tree .
'use strict';

var SettingsModule = angular.module('broker.settings', [])
    .factory('SettingsResource', SettingsResource);

window.SettingsModule = SettingsModule;
