'use strict';

/**@ngInject*/
var ProjectHomeController = function($scope, $state, ProjectsResource, projectQuestions, FlashesService, alerts, projects) {

  this.alerts = alerts;
  this.projects = projects;

};

ProjectHomeController.resolve = {
  /**@ngInject*/
  projectQuestions: function(ProjectQuestionsResource) {
    return ProjectQuestionsResource.query().$promise;
  }
};

window.ProjectHomeController = ProjectHomeController;
