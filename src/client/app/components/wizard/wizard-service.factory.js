(function() {
  'use strict';

  angular.module('app.components')
    .factory('WizardService', WizardServiceFactory);

  /** @ngInject */
  function WizardServiceFactory($modal, WizardQuestion) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/wizard/wizard-modal.html',
        controller: WizardModalController,
        controllerAs: 'vm',
        resolve: {
          questions: resolveQuestions
        },
        windowTemplateUrl: 'app/components/wizard/wizard-modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveQuestions() {
        return WizardQuestion.query().$promise;
      }
    }
  }

  /** @ngInject */
  function WizardModalController(questions, lodash) {
    var vm = this;

    vm.state = 'intro';
    vm.questions = questions;
    vm.question = null;
    vm.questionsArchive = [];
    vm.answeredQuestions = {};

    vm.startWizard = startWizard;
    vm.answerWith = answerWith;
    vm.previousQuestions = previousQuestions;
    vm.nextQuestions = nextQuestions;
    vm.unansweredQuestionCheck = unansweredQuestionCheck;

    activate();

    function activate() {
    }

    function startWizard() {
      vm.question = vm.questions.shift();

      vm.state = 'wizard';
    }

    function answerWith(index) {
      if (0 <= index) {
        vm.answeredQuestions[vm.question.id] = vm.question.wizard_answers[index];
      }

      if (vm.questions.length) {
        vm.nextQuestions();
      } else {
        lodash.forEach(vm.answeredQuestions, parseQuestionAnswers);
        vm.state = 'complete';
      }
    }

    function parseQuestionAnswers(item) {
      vm.tags = lodash.without(lodash.union(vm.tags, item.tags_to_add), item.tags_to_remove);
    }

    function previousQuestions() {
      vm.questions.unshift(vm.question);
      vm.question = vm.questionsArchive.pop();
    }

    function nextQuestions() {
      vm.questionsArchive.push(vm.question);
      vm.question = vm.questions.shift();
    }

    function unansweredQuestionCheck(){


      return vm.answeredQuestions[vm.question.id].id >= vm.questionsArchive.length+1;
    }
  }
})();
