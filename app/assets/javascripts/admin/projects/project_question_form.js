'use strict';

/**@ngInject*/
function ProjectQuestionForm() {
  return {
    restrict: 'E',
    templateUrl: '/templates/partials/admin/projects/project_question_form.html',
    scope: {
      projectQuestion: "=",
      buttonLabel: '=',
      submitFunction: "&submitFunction"
    },
    controller: ['$scope', function($scope) {

      $scope.addOption = function() {
        $scope.projectQuestion.options = $scope.projectQuestion.options || [];
        $scope.projectQuestion.options.push('');
      };

      $scope.removeOption = function(index) {
        $scope.projectQuestion.options.splice(index, 1);
      };

      $scope.$watch('projectQuestion.field_type', function(newType, lastType) {
        if (newType != lastType && newType === 'select_option') {
          $scope.projectQuestion.options = [''];
        } else if (newType != lastType && $scope.projectQuestion.options) {
          $scope.projectQuestion.options = null;
        }
      });
    }]
  };
}

window.ProjectQuestionForm = ProjectQuestionForm;
