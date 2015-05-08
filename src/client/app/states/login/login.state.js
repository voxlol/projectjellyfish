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
      'login': {
        url: '/login',
        templateUrl: 'app/states/login/login.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Login',
        data: {
          layout: 'blank'
        }
      }
    };
  }

  /** @ngInject */
  function StateController(logger) {
    var vm = this;

    vm.title = 'Login';

    activate();

    function activate() {
      logger.info('Activated Login View');
    }
  }
})();
