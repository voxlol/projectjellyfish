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

  function MultipleChoiceDirectiveController($scope, WIZARD_AUTOSUBMIT) {
    $scope.WIZARD_AUTOSUBMIT = WIZARD_AUTOSUBMIT;
  }

  function handleModelUpdate(scope, WIZARD_AUTOSUBMIT) {
    if(WIZARD_AUTOSUBMIT) {
      scope.$watch('model', function(newValue){
        if(newValue) {
          scope.action()
        }
      })
    }
  };
}());
