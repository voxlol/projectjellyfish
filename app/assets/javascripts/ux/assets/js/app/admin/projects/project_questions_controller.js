'use strict';

/**@ngInject*/
function ProjectQuestionsController($scope, $state, projectQuestions, FlashesService) {
  $scope.projectQuestions = projectQuestions;
  $scope.projectQuestion = {};

  $scope.addOption = function() {
    $scope.projectQuestion.options.push('');
  };

  $scope.deleteProjectQuestion = function(question) {
    question.$delete(function() {
            FlashesService.add({
                timeout: true,
                type: 'success',
                message: 'Project question successfully deleted.'
            });
            $state.go('base.authed.admin.projects.project_questions', {}, {reload: true});
        },
        function() {
            FlashesService.add({
                timeout: true,
                type: 'error',
                message: 'Project question deletion failed. Please try again, later.'
            });
        }
    );
  };

  $scope.editProjectQuestion = function(question) {
    $state.go('base.authed.admin.projects.edit_project_questions', {id: question.id}, {reload: true});
  };
}

ProjectQuestionsController.resolve = {
  /**@ngInject*/
  projectQuestions: function(ProjectQuestion) {
    return ProjectQuestion.query().$promise;
  }
};

module.exports = ProjectQuestionsController;
