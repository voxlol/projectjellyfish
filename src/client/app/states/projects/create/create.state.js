(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'projects.create': {
        url: '/create',
        templateUrl: 'app/states/projects/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Create'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function StateController(logger, ProjectQuestion) {
    var vm = this;

    vm.title = 'Project Create';

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Project Question Create View');
      // initProjectQuestion();
      // initOptions();
    }

    function initOptions() {
      vm.projectQuestion.options.length = 0;
      vm.projectQuestion.options.push(angular.extend({}, ProjectQuestion.optionDefaults));
      vm.projectQuestion.options.push(angular.extend({}, ProjectQuestion.optionDefaults));
    }

    // Private

    function initProjectQuestion() {
      vm.projectQuestion = angular.extend(new ProjectQuestion(), ProjectQuestion.defaults);
    }
  }
})();
