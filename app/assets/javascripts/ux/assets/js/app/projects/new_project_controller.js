'use strict';

/**@ngInject*/
var NewProjectController = function($scope, $state, ProjectsResource, projectQuestions, FlashesService) {

  // @todo These should be moved to newProjectCtrl style instead of using scope.
  $scope.project = $scope.project || {};
  $scope.questions = projectQuestions;

  $scope.createProject = function() {
    ProjectsResource.save($scope.project).$promise.then(
        function(project) {
            FlashesService.add({
                timeout: true,
                type: 'success',
                message: "Project created successfully."
            });
            $state.go('base.authed.project.view', {projectId: project.id});
        }, function() {
            FlashesService.add({
                timeout: true,
                type: 'error',
                message: "There was an issue while creating this project."
            });
    });
  };
};

NewProjectController.resolve = {
  /**@ngInject*/
  projectQuestions: function(ProjectQuestionsResource) {
    return ProjectQuestionsResource.query().$promise;
  }
};

module.exports = NewProjectController;
