'use strict';

function QuestionInputDirective() {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      question: '=',
      answer: '=',
      form: '=formCtrl'
    },
    controller: 'QuestionInputController',
    controllerAs: 'qiCtrl',
    bindToController: true,
    templateUrl: '/templates/partials/common/question_input.html',
    link: function(scope, el, attrs, required) {
      scope.qiCtrl.init(scope, el, attrs, required);
    }
  };
}

window.QuestionInputDirective = QuestionInputDirective;
