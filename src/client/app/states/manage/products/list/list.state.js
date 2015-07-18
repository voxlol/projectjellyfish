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
      'manage.products.list': {
        url: '', // No url, this state is the index of manage.products
        templateUrl: 'app/states/manage/products/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Products List',
        resolve: {
          products: resolveProducts
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
  function resolveProducts(Product) {
    return Product.query().$promise;
  }

  /** @ngInject */
  function StateController(products, $state) {
    var vm = this;

    vm.title = 'Manage Products List';
    vm.products = products;

    vm.activate = activate;
    vm.createType = createType;

    activate();

    function activate() {
    }

    function createType(productType) {
      $state.go('manage.products.create', {productType: productType});
    }
  }
})();
