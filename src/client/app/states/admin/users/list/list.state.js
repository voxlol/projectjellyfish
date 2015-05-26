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
      'admin.users.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/users/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin User List',
        resolve: {
          staff: resolveStaff
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
  function resolveStaff($stateParams, Staff) {
    return Staff.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, $q, $state, staff) {
    var vm = this;

    vm.title = 'Admin User List';
    vm.staff = staff;
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Admin User List View');
    }
  }
})();
