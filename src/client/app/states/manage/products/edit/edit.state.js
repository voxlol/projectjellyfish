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
      'manage.products.edit': {
        url: '/edit/:productId',
        templateUrl: 'app/states/manage/products/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Products Edit',
        resolve: {
          product: resolveProduct
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
  function resolveProduct(Product, $stateParams) {
    return Product.get({id: $stateParams.productId, 'includes[]': ['answers', 'product_type']}).$promise;
  }

  /** @ngInject */
  function StateController(product, ProductType) {
    var vm = this;

    vm.product = product;

    vm.title = 'Manage Products Edit';
    vm.activate = activate;

    activate();

    function activate() {
      vm.productType = new ProductType(vm.product.product_type);
      delete vm.product.product_type;
    }
  }
})();
