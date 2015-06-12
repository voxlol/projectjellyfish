(function () {
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
      'admin.alerts.create': {
        url: '/create/:alertId',
        templateUrl: 'app/states/admin/alerts/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts Create'
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
  function StateController($stateParams, logger, Alert) {
    var vm = this;

    vm.title = 'Admin Alerts Create';
    vm.alertId = $stateParams.alertId;
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Admin Alerts Create View');
      if (vm.alertId) {
        resolveAlert();
        vm.editing = true;
      } else {
        vm.editing = false;
      }
    }

    function resolveAlert() {
      Alert.get({id: vm.alertId}).$promise.then(function (result) {
        vm.alertObj = result;
      })
    }
  }
})();
