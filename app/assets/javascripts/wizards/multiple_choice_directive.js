(function() {
  'use strict';

  angular.module('broker.wizard')
    .directive('multipleChoice', MultipleChoiceDirective)

  function MultipleChoiceDirective() {
    return {
      controller: MultipleChoiceDirectiveController,
      link: handleModelUpdate,
      restrict: 'E',
      scope: {
        action: "=",
        model: "=",
        options: "=",
      },
      templateUrl: 'templates/partials/wizard/multiple_choice.html',
    }
  };

  function MultipleChoiceDirectiveController($scope, WIZARD_AUTOSUBMIT, WIZARD_MULTIPAGE) {
    $scope.WIZARD_AUTOSUBMIT = WIZARD_AUTOSUBMIT;
    $scope.WIZARD_MULTIPAGE = WIZARD_MULTIPAGE;
  }

  function handleModelUpdate(scope) {
    if(scope.WIZARD_AUTOSUBMIT && scope.WIZARD_MULTIPAGE) {
      scope.$watch('model', function(newValue){
        if(newValue) {
          scope.action()
        }
      })
    }
  };
}());
