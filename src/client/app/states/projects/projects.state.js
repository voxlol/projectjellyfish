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
        abstract: true,
        url: '/projects',
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
        type: 'dropdown',
        label: 'My Projects',
        style: 'projects',
        order: 1
      }
    };
  }
})();
