//= require_tree .
'use strict';

var AdminData = AdminController.resolve;

var AdminModule = angular.module(
    'broker.admin',
    ['broker.admin.products', 'broker.admin.projects', 'broker.admin.users', 'broker.admin.settings']
    )
  .controller('AdminController', AdminController)
  .config(function($stateProvider, USER_ROLES) {
    $stateProvider
      .state('base.authed.admin', {
        url: '/admin',
        abstract: true,
        controller: 'AdminController as admin',
        template: '<div ui-view></div>',
        data: {
          authorizedRoles: [USER_ROLES.admin]
        },
        resolve: AdminData
      });
    }
  );

window.AdminModule = AdminModule;
