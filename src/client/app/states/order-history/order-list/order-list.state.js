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
      'order-history.list': {
        url: '', // No url, this state is the index of order-history
        templateUrl: 'app/states/order-history/order-list/order-list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order History',
        resolve: {
          Orders: resolveOrders
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
  function resolveOrders(Orders) {
    return Orders.query().$promise;
  }

  /** @ngInject */
  function StateController($state, logger, Orders) {
    var vm = this;
    alert('success');
    vm.orders = Orders;
    vm.title = 'Order History';
    vm.goTo = goTo;

    activate();

    function activate() {
      logger.info('Activated Order History View');
    }

    function goTo(id) {
      $state.go('order-history.details', {id: id});
    }
  }
})();
