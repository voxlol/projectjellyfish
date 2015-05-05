'use strict';

/**@ngInject*/
var ListGroupsController = function(groups) {
  this.groups = groups;
};

ListGroupsController.resolve = {
  /**@ngInject*/
  groups: function(GroupsResource) {
  return GroupsResource.query().$promise;
  }
};

ListGroupsController.prototype = {

};

window.ListGroupsController = ListGroupsController;
