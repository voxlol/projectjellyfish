(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'wizard.singlepage': {
        controller: StateController,
        controllerAs: 'vm',
        templateUrl: 'app/states/wizard/singlepage-wizard/singlepage-wizard.html'
      }
    };
  }

  /** @ngInject */
  function StateController($stateParams, $state, questions, lodash) {
    var vm = this;

    vm.answers = {};
    vm.questions = questions;
    vm.submitAnswers = submitAnswers;
    vm.tags = [];

    function submitAnswers() {
      vm.questions.forEach(function(question) {
        var answer = vm.answers[question.id];
        if (answer) {
          vm.tags = lodash.union(vm.tags, answer.tags_to_add);
          vm.tags = lodash.difference(vm.tags, answer.tags_to_remove);
        }
      });

      $state.go(
        'marketplace',
        { projectId: $stateParams.projectId, tags: vm.tags }
      );
    }
  }
})();
