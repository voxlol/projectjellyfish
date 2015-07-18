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
      'manage.products.create': {
        url: '/create',
        templateUrl: 'app/states/manage/products/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Products Create',
        params: {
          productType: null
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
  function StateController($stateParams, logger, Product, productTypes) {
    var vm = this;

    vm.title = 'Manage Products Create';
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Manage Products Create View');
      vm.productType = null !== $stateParams.productType ? $stateParams.productType : productTypes[0];
      initProduct();
    }

    // Private

    function initProduct() {
      vm.product = angular.extend(new Product(), Product.defaults);
      angular.forEach(vm.productType.schema.properties, initProperty);

      function initProperty(property, key) {
        vm.product.properties[key] = angular.isDefined(property.default) ? property.default : null;
      }
    }
  }
})();
