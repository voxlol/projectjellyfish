(function() {
  'use strict';

  angular.module('broker.wizard')
    .controller('WizardAllQuestionsController', function($stateParams, $state, questions) {
      var vm = this;

      vm.answers = {};
      vm.questions = questions;
      vm.submitAnswers = submitAnswers;
      vm.tags = [];

      function submitAnswers() {
        vm.questions.forEach(function(question) {
          var answer = vm.answers[question.id];
          if(answer) {
            vm.tags = _.union(vm.tags, answer.tags_to_add);
            vm.tags = _.difference(vm.tags, answer.tags_to_remove);
          };
        });

        $state.go(
          "base.authed.project.addService",
          { projectId: $stateParams.projectId, tags: vm.tags }
        );
      }
    });
}());
