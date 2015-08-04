(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'orders.create': {
        url: '/:productId',
        templateUrl: 'app/states/orders/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order Create',
        resolve: {
          product: resolveProduct,
          projects: resolveProjects
        }
      }
    };
  }

  /** @ngInject */
  function resolveProduct($stateParams, Product) {
    return Product.get({id: $stateParams.productId, 'includes[]': ['product_type']}).$promise;
  }

  /** @ngInject */
  function resolveProjects(Project) {
    return Project.query({approved: true, archived: false}).$promise;
  }

  /** @ngInject */
  function StateController(lodash, product, projects, Order) {
    var vm = this;

    vm.title = 'Order Create';
    vm.product = product;
    vm.projects = projects;

    vm.activate = activate;

    activate();

    function activate() {
      initOrder();
    }

    // Private

    function initOrder() {
      vm.order = Order.new();
      vm.order.product_id = product.id;
      // Flatten all sections into one; Stop using flatten when sections become a thing
      vm.order.answers = lodash.flatten(lodash.map(product.product_type.order_questions, mapSection));

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
