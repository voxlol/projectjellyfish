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
      'services.create': {
        url: '/create',
        templateUrl: 'app/states/services/create/services-create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Service Create'
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
  function StateController(logger) {
    var vm = this;

    vm.title = 'Service Create';

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Project Question Create View');
    }
  }
})();
