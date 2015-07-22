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
    vm.questionPointer = 0;
    vm.questionsEnd = lodash.size(vm.questions) - 1;
    vm.answeredQuestions = {};

    vm.startWizard = startWizard;
    vm.answerWith = answerWith;
    vm.previousQuestions = previousQuestions;
    vm.nextQuestions = nextQuestions;

    activate();

    function activate() {
    }

    function startWizard() {
      vm.question = vm.questions[vm.questionPointer];
      vm.state = 'wizard';
    }

    function answerWith(index) {
      if (0 <= index) {
        vm.answeredQuestions[vm.question.id] = vm.question.wizard_answers[index];
      }

      if (vm.questionPointer < vm.questionsEnd) {
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
      vm.questionPointer --;
      vm.question = vm.questions[vm.questionPointer];
  }

    function nextQuestions() {
      vm.questionPointer ++;
      vm.question = vm.questions[vm.questionPointer];
    }
  }
})();
