(function() {
  'use strict';

  angular.module('broker.wizard')
    .controller('WizardQuestionsController', function($stateParams, question, questions) {
      var vm = this;

      vm.nextQuestion = nextQuestion;
      vm.projectId = $stateParams.projectId;
      vm.question = question;
      vm.resetWizard = resetWizard;
      vm.tags = [];

      function nextQuestion() {
        vm.tags = _.union(vm.tags, vm.answer.tags_to_add);
        vm.tags = _.difference(vm.tags, vm.answer.tags_to_remove);

        if(vm.question.next_question_id) {
          questions.next(vm.question).then(function(question) {
            vm.question = question;
          });
        } else {
          vm.noMoreQuestions = true;
        }
      };

      function resetWizard() {
        vm.answer = {};
        vm.question = question;
        vm.tags = [];
      };
    });
}());
