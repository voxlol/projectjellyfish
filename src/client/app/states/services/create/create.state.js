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
      'services.create': {
        url: '/:productId',
        templateUrl: 'app/states/services/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Service Create',
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
    return Project.query().$promise;
  }

  /** @ngInject */
  function StateController(product, projects) {
    var vm = this;

    vm.title = 'Service Create';
    vm.product = product;
    vm.projects = projects;

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();
