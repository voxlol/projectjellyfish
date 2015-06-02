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
        delete $scope.projectQuestion["options[" + index + "]"];
      };

      $scope.$watch('projectQuestion.field_type', function(newType, lastType) {
        if (newType != lastType && newType === 'select_option') {
          $scope.projectQuestion.options = [''];
        } else {
          angular.forEach($scope.projectQuestion.options, function(_, index) {
            $scope.removeOption(index);
          });
          delete $scope.projectQuestion.options;
        }
      });
    }]
  };
}

window.ProjectQuestionForm = ProjectQuestionForm;
