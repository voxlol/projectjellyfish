'use strict';

/**@ngInject*/
var AdminEditRoleController = function(role, FlashesService) {
  this.role = role;
  this.FlashesService = FlashesService;
};

AdminEditRoleController.resolve = {
  /**@ngInject*/
  role: function(rolesResource, $stateParams) {
    return rolesResource.get({id: $stateParams.id}).$promise;
  }
};

AdminEditRoleController.prototype = {

};

window.AdminEditRoleController = AdminEditRoleController;
