//= require_tree .
'use strict';

var AdminListRolesData = ListRolesController.resolve;
var AdminAddRoleData = AdminAddRoleController.resolve;
var AdminEditRoleData = AdminEditRoleController.resolve;

var RolesAdminModule = angular.module('broker.admin.roles', [])
  .controller('RolesAdminController', RolesAdminController)
  .controller('ListRolesController', ListRolesController)
  .controller('AdminAddRoleController', AdminAddRoleController)
  .controller('AdminEditRoleController', AdminEditRoleController)
  .controller('AdminRoleFormController', AdminRoleFormController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.admin.roles', {
          url: '/roles',
          abstract: true,
          templateUrl: '/templates/partials/admin/roles/base.html',
          controller: 'RolesAdminController as rolesAdminCtrl'
        })
        .state('base.authed.admin.roles.list', {
          url: '/list',
          templateUrl: '/templates/partials/admin/roles/list_roles.html',
          controller: 'ListRolesController as listRolesCtrl',
          resolve: AdminListRolesData
        })
        .state('base.authed.admin.roles.add', {
          url: '/add',
          templateUrl: '/templates/partials/admin/roles/add_role.html',
          controller: 'AdminAddRoleController as adminAddRoleCtrl',
          resolve: AdminAddRoleData
        })
        .state('base.authed.admin.roles.edit', {
          url: '/edit/:id',
          templateUrl: '/templates/partials/admin/roles/edit_role.html',
          controller: 'AdminEditRoleController as adminEditRoleCtrl',
          resolve: AdminEditRoleData
        });
    }
  );

window.rolesAdminModule = RolesAdminModule;
