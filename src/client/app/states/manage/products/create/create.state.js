(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'manage.products.create': {
        url: '/create/:productTypeId',
        templateUrl: 'app/states/manage/products/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Products Create',
        resolve: {
          productType: resolveProductType
        }
      }
    };
  }

  /** @ngInject */
  function resolveProductType($stateParams, ProductType) {
    return ProductType.get({id: $stateParams.productTypeId}).$promise;
  }

  /** @ngInject */
  function StateController(Product, productType, lodash) {
    var vm = this;

    vm.productType = productType;

    vm.title = 'Manage Products Create';
    vm.activate = activate;

    activate();

    function activate() {
      initProduct();
    }

    // Private

    function initProduct() {
      vm.product = Product.new({product_type_id: productType.id});
      // Flatten all sections into one; Stop using flatten when sections become a thing
      vm.product.answers = lodash.flatten(lodash.map(productType.product_form, mapSection));

      function mapSection(section) {
        return lodash.map(section, mapAnswer);
      }

      function mapAnswer(definition) {
        var answer = angular.copy(definition);

        delete answer.control;
        answer.value = '';

        return answer;
      }
    }
  }
})();
