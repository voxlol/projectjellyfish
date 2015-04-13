'use strict';

/**@ngInject*/
var AdminAddGroupController = function(group, FlashesService) {
  this.group = group;
  this.FlashesService = FlashesService;
};

AdminAddGroupController.resolve = {
  /**@ngInject*/
  group: function(GroupsResource) {
    return new GroupsResource();
  }
};

AdminAddGroupController.prototype = {

};

window.AdminAddGroupController = AdminAddGroupController;
