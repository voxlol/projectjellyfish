'use strict';

/**@ngInject*/
var AdminAddRoleController = function(role, FlashesService) {
  this.role = role;
  this.FlashesService = FlashesService;
};

AdminAddRoleController.resolve = {
  /**@ngInject*/
  role: function(RolesResource) {
    return new RolesResource();
  }
};

AdminAddRoleController.prototype = {

};

window.AdminAddRoleController = AdminAddRoleController;
