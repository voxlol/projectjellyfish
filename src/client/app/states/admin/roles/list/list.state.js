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
      'admin.roles.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/roles/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Roles List',
        resolve: {
          role: resolveRoles
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
  function resolveRoles(Role) {
    return Role.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, $state, role, Toasts) {
    var vm = this;

    vm.title = 'Admin Roles List';
    vm.role = role;
    vm.activate = activate;
    vm.deleteRole = deleteRole;

    activate();

    function activate() {
      logger.info('Activated Admin Role List View');
    }

    function deleteRole(index) {
      var roles = vm.role[index];
      roles.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        vm.role.splice(index, 1);
        Toasts.toast('Role deleted.');
      }
      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }
  }
})();
