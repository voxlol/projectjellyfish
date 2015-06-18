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
    vm.tags = [];

    vm.startWizard = startWizard;
    vm.answerWith = answerWith;

    activate();

    function activate() {
    }

    function startWizard() {
      vm.question = vm.questions.shift();
      vm.state = 'wizard';
    }

    function answerWith(index) {
      var answer;

      if (0 <= index) {
        answer = vm.question.wizard_answers[index];
        vm.tags = lodash.without(lodash.union(vm.tags, answer.tags_to_add), answer.tags_to_remove);
      }

      if (vm.questions.length) {
        vm.question = vm.questions.shift();
      } else {
        vm.state = 'complete';
      }
    }
  }
})();
