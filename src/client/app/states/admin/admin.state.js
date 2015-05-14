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
      'authed.admin': {
        abstract: true,
        template: '<ui-view></ui-view>',
        url: '/admin'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin': {
        type: 'dropdown',
        state: 'authed.admin',
        label: 'Admin',
        style: 'admin',
        order: 4
      },
      'admin.users': {
        type: 'state',
        state: 'authed.admin.users',
        label: 'Users',
        order: 0
      },
      'admin.settings': {
        type: 'state',
        state: 'authed.admin.settings',
        label: 'Settings',
        order: 3
      }
    };
  }
})();
