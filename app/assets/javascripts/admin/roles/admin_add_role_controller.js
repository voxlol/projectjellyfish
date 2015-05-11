'use strict';

/**@ngInject*/
var AdminAddRoleController = function(role, FlashesService) {
  this.role = role;
  this.FlashesService = FlashesService;
};

AdminAddRoleController.resolve = {
  /**@ngInject*/
  role: function(rolesResource) {
    return new rolesResource();
  }
};

AdminAddRoleController.prototype = {

};

window.AdminAddRoleController = AdminAddRoleController;
