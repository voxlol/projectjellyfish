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
      'admin.wizard-questions.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/wizard-questions/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Wizard Quesiton List'
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
  function StateController(logger, $q, $state) {
    var vm = this;

    vm.title = 'Admin Products List';
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Admin Wizrd Quesiton List View');
    }
  }
})();
