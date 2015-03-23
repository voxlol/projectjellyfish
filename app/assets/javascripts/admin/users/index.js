//= require_tree .
'use strict';

var AdminListUsersData = ListUsersController.resolve;
var AdminAddUserData = AdminAddUserController.resolve;
var AdminEditUserData = AdminEditUserController.resolve;

var UsersAdminModule = angular.module('broker.admin.users', [])
  .controller('UsersAdminController', UsersAdminController)
  .controller('ListUsersController', ListUsersController)
  .controller('AdminAddUserController', AdminAddUserController)
  .controller('AdminEditUserController', AdminEditUserController)
  .controller('AdminUserFormController', AdminUserFormController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.admin.users', {
          url: '/users',
          abstract: true,
          templateUrl: '/partials/admin/users/base.html',
          controller: 'UsersAdminController as usersAdminCtrl'
        })
        .state('base.authed.admin.users.list', {
          url: '/list',
          templateUrl: '/partials/admin/users/list_users.html',
          controller: 'ListUsersController as listUsersCtrl',
          resolve: AdminListUsersData
        })
        .state('base.authed.admin.users.add', {
          url: '/add',
          templateUrl: '/partials/admin/users/add_user.html',
          controller: 'AdminAddUserController as adminAddUserCtrl',
          resolve: AdminAddUserData
        })
        .state('base.authed.admin.users.edit', {
          url: '/edit/:id',
          templateUrl: '/partials/admin/users/edit_user.html',
          controller: 'AdminEditUserController as adminEditUserCtrl',
          resolve: AdminEditUserData
        });
    }
  );

window.UsersAdminModule = UsersAdminModule;
