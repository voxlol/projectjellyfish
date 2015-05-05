//= require_tree .
'use strict';

var AdminListGroupsData = ListGroupsController.resolve;
var AdminAddGroupData = AdminAddGroupController.resolve;
var AdminEditGroupData = AdminEditGroupController.resolve;

var GroupsAdminModule = angular.module('broker.admin.groups', [])
  .controller('GroupsAdminController', GroupsAdminController)
  .controller('ListGroupsController', ListGroupsController)
  .controller('AdminAddGroupController', AdminAddGroupController)
  .controller('AdminEditGroupController', AdminEditGroupController)
  .controller('AdminGroupFormController', AdminGroupFormController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.admin.groups', {
          url: '/groups',
          abstract: true,
          templateUrl: '/templates/partials/admin/groups/base.html',
          controller: 'GroupsAdminController as groupsAdminCtrl'
        })
        .state('base.authed.admin.groups.list', {
          url: '/list',
          templateUrl: '/templates/partials/admin/groups/list_groups.html',
          controller: 'ListGroupsController as listGroupsCtrl',
          resolve: AdminListGroupsData
        })
        .state('base.authed.admin.groups.add', {
          url: '/add',
          templateUrl: '/templates/partials/admin/groups/add_group.html',
          controller: 'AdminAddGroupController as adminAddGroupCtrl',
          resolve: AdminAddGroupData
        })
        .state('base.authed.admin.groups.edit', {
          url: '/edit/:id',
          templateUrl: '/templates/partials/admin/groups/edit_group.html',
          controller: 'AdminEditGroupController as adminEditGroupCtrl',
          resolve: AdminEditGroupData
        });
    }
  );

window.GroupsAdminModule = GroupsAdminModule;
