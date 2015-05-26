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
      'admin.alerts.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/alerts/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts List'
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
  function StateController(logger, VIEW_MODES, $q, CatalogService, $state) {
    var vm = this;

    vm.title = 'Admin Products List';
    vm.viewMode = VIEW_MODES.list;

    vm.activate = activate;
    vm.createType = createType;

    activate();

    function activate() {
      logger.info('Activated Admin Products List View');
      updateCatalog();
    }

    function createType(productType) {
      $state.go('admin.products.create', {productType: productType});
    }

    // Private

    function updateCatalog() {
      $q.when(CatalogService.getCatalog([])).then(handleResults);

      function handleResults(results) {
        vm.catalog = results;
      }
    }
  }
})();
