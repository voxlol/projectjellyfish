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
    return Product.get({id: $stateParams.productId, 'methods[]': ['product_type']}).$promise;
  }

  /** @ngInject */
  function StateController(logger, lodash, product, productTypes) {
    var vm = this;

    vm.title = 'Manage Products Edit';
    vm.activate = activate;

    activate();

    function activate() {
      vm.product = product;
      vm.productType = lodash.find(productTypes, {title: product.product_type});
      logger.info('Activated Manage Products Edit View');
    }
  }
})();
