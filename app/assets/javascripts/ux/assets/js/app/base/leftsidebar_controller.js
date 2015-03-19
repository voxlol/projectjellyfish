'use strict';

/**@ngInject*/
var LeftSidebarController = function($state, currentUser, projects, AuthService) {
  this.currentUser = currentUser;
  this.projects = projects;

  this.AuthService = AuthService;
  this.$state = $state;
};

LeftSidebarController.prototype = {
  logout: function() {
    return this.AuthService.logout();
  }
};

LeftSidebarController.resolve = {
  /**@ngInject*/
  projects: function(currentUser, ProjectsResource) {
    return ProjectsResource.query().$promise;
  }
};

module.exports = LeftSidebarController;

