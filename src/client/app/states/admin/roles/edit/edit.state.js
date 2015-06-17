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
      'admin.roles.edit': {
        url: '/edit/:roleId',
        templateUrl: 'app/states/admin/roules/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Edit Role',
        resolve: {
          role: resolveRole,
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
  function resolveRole(Role, $stateParams) {
    return Role.get({id: $stateParams.roleId}).$promise;
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, role, staff) {
    var vm = this;

    vm.title = 'Edit Role';
    vm.role = role;
    vm.staff = staff;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Edit Role View');
    }
  }
})();
