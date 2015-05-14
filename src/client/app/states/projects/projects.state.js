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
      'authed.projects': {
        url: '/projects',
        templateUrl: 'app/states/projects/projects.html',
        controller: ProjectsController,
        controllerAs: 'vm',
        title: 'Projects'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'projects': {
        type: 'state',
        state: 'authed.projects',
        label: 'My Projects',
        style: 'projects',
        order: 1
      }
    };
  }

  /* @ngInject */
  function ProjectsController(logger) {
    /* jshint validthis: true */
    var vm = this;

    vm.activate = activate;
    vm.title = 'Projects';

    activate();

    function activate() {
      logger.info('Activated Project View');
    }
  }
})();
