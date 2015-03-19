'use strict';

var AdminListUsersData = require('./list_users_controller').resolve;
var AdminAddUserData = require('./admin_add_user_controller').resolve;
var AdminEditUserData = require('./admin_edit_user_controller').resolve;

/**@ngInject*/
module.exports = function($stateProvider) {
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
};
