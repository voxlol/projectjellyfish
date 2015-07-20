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
      'services.create': {
        url: '/',
        params: {
          projectId: null,
          serviceId: null
        },
        templateUrl: 'app/states/services/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Service Create'
      }
    };
  }

  /** @ngInject */
  function StateController() {
    var vm = this;

    vm.title = 'Service Create';

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();
