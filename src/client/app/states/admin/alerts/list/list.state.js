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
      'admin.alerts.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/alerts/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts List',
        resolve: {
          alerts: resolveAlerts
        }
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
  function resolveAlerts($stateParams, Alerts) {
    return Alerts.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, $q, $state, alerts) {
    var vm = this;

    vm.title = 'Admin Products List';
    vm.alerts = alerts;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Admin Products List View');
    }
  }
})();
