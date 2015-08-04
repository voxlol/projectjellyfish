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
      'admin.providers.list': {
        url: '',
        templateUrl: 'app/states/admin/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Providers List',
        resolve: {
          providers: resolveProviders
        }
      }
    };
  }

  /** @ngInject */
  function resolveProviders(Provider) {
    return Provider.query({'includes[]': ['registered_provider']}).$promise;
  }

  /** @ngInject */
  function StateController(providers, registeredProviders) {
    var vm = this;

    vm.title = 'Providers List';

    vm.providers = providers;
    vm.registeredProviders = registeredProviders;

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();
