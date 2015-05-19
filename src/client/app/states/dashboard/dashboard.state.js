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
      'dashboard': {
        url: '/dashboard',
        templateUrl: 'app/states/dashboard/dashboard.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Dashboard',
        resolve: {
          Projects: resolveProjects
        }
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
        state: 'dashboard',
        label: 'Dashboard',
        style: 'dashboard',
        order: 0
      }
    };
  }

  /** @ngInject */
  function resolveProjects(Projects) {
    return Projects.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, Projects) {
    var vm = this;

    vm.title = 'Dashboard';
    vm.projects = Projects;
    activate();

    function activate() {
      logger.info('Activated Dashboard View');
    }
  }
})();
