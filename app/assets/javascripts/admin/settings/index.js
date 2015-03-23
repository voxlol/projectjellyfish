//= require_tree .
'use strict';

var SettingsData = EditSettingsController.resolve;

var AdminSettingsModule = angular.module('broker.admin.settings', [])
  .controller('EditSettingsController', EditSettingsController)
  .controller('SettingsController', SettingsController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.admin.settings', {
          url: '/settings',
          abstract: true,
          template: '<div class="products-admin" ui-view></div>',
          controller: 'SettingsController as settings'
        })
        .state('base.authed.admin.settings.edit', {
          url: '/edit',
          controller: 'EditSettingsController as editSettings',
          templateUrl: "/partials/admin/settings/edit.html",
          resolve: SettingsData
        });
    }
  );
window.AdminSettingsModule = AdminSettingsModule;
