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
      'errors.sorry': {
        url: '/whoops-an-error',
        templateUrl: 'app/states/sorry/sorry.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Sorry'
      }
    };
  }

  /** @ngInject */
  function StateController() {
    var vm = this;

    vm.title = 'Sorry';

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();
