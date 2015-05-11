'use strict';

/**@ngInject*/
var ListRolesController = function(roles) {
  this.roles = roles;
};

ListRolesController.resolve = {
  /**@ngInject*/
  roles: function(GroupsResource) {
  return GroupsResource.query().$promise;
  }
};

ListRolesController.prototype = {

};

window.ListRolesController = ListRolesController;
