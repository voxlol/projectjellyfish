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
      'order-history': {
        abstract: true,
        url: '/order-history',
        title: 'Order History'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'order-history': {
        type: 'state',
        state: 'order-history',
        label: 'Order History',
        style: 'order-history',
        order: 2
      }
    };
  }
})();
