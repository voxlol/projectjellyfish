'use strict';

/**@ngInject*/
function EditProjectQuestionController($scope, $state, projectQuestion, ProjectQuestion, FlashesService) {
  $scope.projectQuestion = projectQuestion;

  $scope.submitProject = function() {
    var filteredProjectQuestion = _.omit($scope.projectQuestion, 'created_at', 'updated_at', 'deleted_at'),
      updatedProjectQuestion = filteredProjectQuestion.options ? filteredProjectQuestion : _.omit(filteredProjectQuestion, 'options');

    ProjectQuestion.update(updatedProjectQuestion, function() {
            FlashesService.add({
                timeout: true,
                type: 'success',
                message: 'Project question successfully edited.'
            });
            $state.go('base.authed.admin.projects.project_questions', {}, {reload: true});
        },
        function() {
            FlashesService.add({
                timeout: true,
                type: 'error',
                message: 'Project question did not update. Please try again, later.'
            });
        });
  };
}

EditProjectQuestionController.resolve = {
  /**@ngInject*/
  projectQuestion: function(ProjectQuestion, $stateParams) {
    return ProjectQuestion.get({id: $stateParams.id}).$promise;
  }
};

window.EditProjectQuestionController = EditProjectQuestionController;
