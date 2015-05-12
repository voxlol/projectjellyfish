'use strict';

/**@ngInject*/
var ListRolesController = function(roles) {
  this.roles = roles;
};

ListRolesController.resolve = {
  /**@ngInject*/
  roles: function(RolesResource) {
  return RolesResource.query().$promise;
  }
};

ListRolesController.prototype = {

};

window.ListRolesController = ListRolesController;
