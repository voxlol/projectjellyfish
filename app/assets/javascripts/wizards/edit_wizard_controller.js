(function() {
  'use strict';

  angular.module('broker.wizard')
    .controller('EditWizardController', function(questions, WizardQuestionsResource) {
      var vm = this;

      vm.questions = questions;
      vm.question = new WizardQuestionsResource({wizard_answers: [{}]});
      vm.createQuestion = createQuestion;
      vm.addAnswer = addAnswer;

      _.each(questions, addAnswer);

      function createQuestion() {
        vm.question.wizard_answers = formatAnswers(vm.question.wizard_answers);
        vm.question.$save(function(question){
          vm.question.id = question.id;
          vm.questions.push(vm.question);
          vm.question = new WizardQuestionsResource({wizard_answers: [{}]});
        });
      }

      vm.deleteQuestion = function(question) {
        question.$delete(function(question){
          vm.questions = _.without(vm.questions, question)
        });
      }

      function addAnswer(question) {
        question.wizard_answers.push({});
      }

      vm.deleteAnswer = function(question, answer) {
        answer["_destroy"] = true
      }

      vm.saveQuestion = function(question) {
        question.wizard_answers = formatAnswers(question.wizard_answers);
        question.$update();
      }

      function formatAnswers(answers){
        return _.map(answers, function(answer) {
          if(typeof answer.tags_to_add === "string") {
            answer.tags_to_add = answer.tags_to_add.split(",");
          }

          if(typeof answer.tags_to_remove === "string") {
            answer.tags_to_remove = answer.tags_to_remove.split(",");
          }

          return answer;
        });
      }
    })
}());
