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
      'marketplace': {
        url: '/marketplace?tags',
        templateUrl: 'app/states/marketplace/marketplace.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Marketplace',
        reloadOnSearch: false
      }
    };
  }

  function navItems() {
    return {
      'cart': {
        type: 'cart'
      }
    };
  }

  function sidebarItems() {
    return {
      'marketplace': {
        type: 'state',
        state: 'marketplace',
        label: 'Marketplace',
        style: 'marketplace',
        order: 3
      }
    };
  }

  /** @ngInject */
  function StateController(logger, $q, VIEW_MODES, CatalogService, Tag, Compare, TAG_QUERY_LIMIT, $stateParams) {
    var vm = this;

    var COMPARE_LIMIT = 4;

    vm.title = 'Marketplace';
    vm.tags = [];
    vm.viewMode = VIEW_MODES.list;

    vm.activate = activate;
    vm.updateCatalog = updateCatalog;
    vm.queryTags = queryTags;

    activate();

    function activate() {
      logger.info('Activated Marketplace View');
      updateCatalog();
      Compare.clear();
      Compare.limit = COMPARE_LIMIT;

      if ($stateParams.tags) {
        vm.tags =  $stateParams.tags;
      }
    }

    function updateCatalog() {
      $q.when(CatalogService.getCatalog(vm.tags)).then(handleResults);

      function handleResults(results) {
        vm.catalog = results;
      }
    }

    function queryTags(query) {
      return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
    }
  }
})();
