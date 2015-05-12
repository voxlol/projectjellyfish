(function() {
  'use strict';

  angular.module('broker.wizard')
    .directive('multipleChoice', MultipleChoiceDirective)

  function MultipleChoiceDirective() {
    return {
      restrict: 'E',
      templateUrl: '/templates/partials/wizard/multiple_choice.html',
      link: function(scope) {
        scope.$watch('model', function(newValue){
          if(newValue) {
            scope.action()
          }
        })
      },
      scope: {
        action: "=",
        model: "=",
        options: "=",
      }
    };
  };
}());
