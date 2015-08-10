(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'manage.project-questions.create': {
        url: '/create',
        templateUrl: 'app/states/manage/project-questions/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Question Create'
      }
    };
  }

  /** @ngInject */
  function StateController(ProjectQuestion) {
    var vm = this;

    vm.title = 'Project Question Create';

    vm.activate = activate;

    activate();

    function activate() {
      initProjectQuestion();
      initOptions();
    }

    // Private

    function initOptions() {
      vm.projectQuestion.options.length = 0;
      vm.projectQuestion.options.push(angular.copy(ProjectQuestion.optionDefaults));
      vm.projectQuestion.options.push(angular.copy(ProjectQuestion.optionDefaults));
    }

    function initProjectQuestion() {
      vm.projectQuestion = ProjectQuestion.new();
    }
  }
})();
