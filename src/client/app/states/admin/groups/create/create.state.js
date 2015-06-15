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
      'admin.groups.create': {
        url: '/create',
        templateUrl: 'app/states/admin/groups/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Groups Create',
        resolve: {
          groupToEdit: resolveGroup
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
  function resolveGroup(Group, $stateParams) {
    if ($stateParams.id) {
      return Group.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function StateController($stateParams, logger, groupToEdit) {
    var vm = this;

    vm.title = 'Admin Group Create';
    vm.activate = activate;
    vm.groupToEdit = groupToEdit;
    vm.editing = $stateParams.id ? true : false;

    activate();

    function activate() {
      logger.info('Activated Admin Products Create View');
    }
  }
})();
