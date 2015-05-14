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
      'authed.order-history': {
        url: '/order-history',
        templateUrl: 'app/states/order-history/order-history.html',
        controller: OrderHistoryController,
        controllerAs: 'vm',
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
        state: 'authed.order-history',
        label: 'Order History',
        style: 'order-history',
        order: 2
      }
    };
  }

  /** @ngInject */
  function OrderHistoryController(logger) {
    var vm = this;

    vm.title = 'Order History';

    activate();

    function activate() {
      logger.info('Activated Order History View');
    }
  }
})();
