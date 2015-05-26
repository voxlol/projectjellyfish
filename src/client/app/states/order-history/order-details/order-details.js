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
      'order-history.details': {
        url: '/:id',
        templateUrl: 'app/states/order-history/order-details/order-details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order History Details',
        resolve: {
          order: resolveOrder
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
  function resolveOrder($stateParams, Orders) {
    return Orders.get({id: $stateParams.id}).$promise;
  }

  /** @ngInject */
  function StateController(logger, order) {
    var vm = this;

    vm.title = 'Order History Details';
    vm.orderDetails = order;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Order History Details View');
    }
  }
})();
