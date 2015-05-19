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
      'projects': {
        url: '/projects',
        templateUrl: 'app/states/projects/projects.html',
        controller: ProjectsController,
        controllerAs: 'vm',
        title: 'Projects',
        resolve: {
          Projects: resolveProjects
        }
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
        state: 'projects',
        label: 'My Projects',
        style: 'projects',
        order: 1
      }
    };
  }

  /** @ngInject */
  function resolveProjects(Projects) {
    return Projects.query().$promise;
  }

  /* @ngInject */
  function ProjectsController(logger, Projects, VIEW_MODES) {
    /* jshint validthis: true */
    var vm = this;

    vm.projects = Projects;
    vm.activate = activate;
    vm.title = 'Projects';
    vm.viewMode = VIEW_MODES.list;

    activate();

    function activate() {
      logger.info('Activated Project View');
    }
  }
})();
