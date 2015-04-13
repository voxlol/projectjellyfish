'use strict';

/**@ngInject*/
var AdminEditGroupController = function(group, FlashesService) {
  this.group = group;
  this.FlashesService = FlashesService;
};

AdminEditGroupController.resolve = {
  /**@ngInject*/
  group: function(GroupsResource, $stateParams) {
    return GroupsResource.get({id: $stateParams.id}).$promise;
  }
};

AdminEditGroupController.prototype = {

};

window.AdminEditGroupController = AdminEditGroupController;
