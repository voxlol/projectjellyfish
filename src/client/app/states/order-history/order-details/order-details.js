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
      'orderhistory.details': {
        url: '/:id',
        templateUrl: 'app/states/order-history/order-details/order-details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order History Details'
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
  function StateController(logger, ProjectQuestion) {
    var vm = this;

    vm.title = 'Order History Details';

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Order History Details View');
    }
  }
})();
