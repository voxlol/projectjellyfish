'use strict';

/**@ngInject*/
var NewProjectController = function($scope, $state, ProjectsResource, projectQuestions) {

  // @todo These should be moved to newProjectCtrl style instead of using scope.
  $scope.project = $scope.project || {};
  $scope.questions = projectQuestions;

  $scope.createProject = function() {
    ProjectsResource.save($scope.project).$promise.then(function(project) {
      console.log("SUCCESS ADDING NEW PROJECT!");
      $state.go('base.authed.project.view', {projectId: project.id});
    }, function () { console.log("FAIL ADDING NEW PROJECT!");});
  };
};

NewProjectController.resolve = {
  /**@ngInject*/
  projectQuestions: function(ProjectQuestionsResource) {
    return ProjectQuestionsResource.query().$promise;
  }
};

module.exports = NewProjectController;
