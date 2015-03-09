'use strict';

/**@ngInject*/
var AdminAddUserController = function(user, FlashesService) {
  this.user = user;
  this.FlashesService = FlashesService;
};

AdminAddUserController.resolve = {
  /**@ngInject*/
  user: function(UsersResource) {
    return new UsersResource();
  }
};

AdminAddUserController.prototype = {

};

module.exports = AdminAddUserController;
