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
      'authed.dashboard': {
        url: '/dashboard',
        templateUrl: 'app/states/dashboard/dashboard.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Dashboard'
      }
    };
  }

  function navItems() {
    return {
      'profile': {
        type: 'profile',
        order: 0
      }
    };
  }

  function sidebarItems() {
    return {
      'dashboard': {
        type: 'state',
        state: 'authed.dashboard',
        label: 'Dashboard',
        style: 'dashboard',
        order: 0
      }
    };
  }

  /** @ngInject */
  function StateController(logger) {
    var vm = this;

    vm.title = 'Dashboard';

    activate();

    function activate() {
      logger.info('Activated Dashboard View');
    }
  }
})();
