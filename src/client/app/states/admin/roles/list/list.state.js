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
          roles: resolveRoles
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
  function resolveRoles($stateParams, Role) {
    return Role.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, $q, $state, roles, Toasts) {
    var vm = this;

    vm.title = 'Admin Roles List';
    vm.roles = roles;
    vm.activate = activate;
    vm.goTo = goTo;

    activate();

    function activate() {
      logger.info('Activated Admin Role List View');
    }

    function goTo(id) {
      $state.go('admin.roles.create', {id: id});
    }

    vm.deleteRole = deleteRole;

    function deleteRole(index) {
      var roles = vm.role[index];
      roles.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        vm.roles.splice(index, 1);
        Toasts.toast('Role deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }
  }
})();
