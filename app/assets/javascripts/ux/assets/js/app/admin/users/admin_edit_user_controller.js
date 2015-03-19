'use strict';

/**@ngInject*/
var AdminEditUserController = function(user, FlashesService) {
  this.user = user;
  this.FlashesService = FlashesService;
};

AdminEditUserController.resolve = {
  /**@ngInject*/
  user: function(UsersResource, $stateParams) {
    return UsersResource.get({id: $stateParams.id}).$promise;
  }
};

AdminEditUserController.prototype = {

};

module.exports = AdminEditUserController;
