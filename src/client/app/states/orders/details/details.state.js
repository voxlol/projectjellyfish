(function(){
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'orders.details': {
        url: '/:orderId',
        templateUrl: 'app/states/orders/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order Details',
        resolve: {
          order: resolveOrder
        }
      }
    };
  }

  /** @ngInject */
  function resolveOrder($stateParams, Order){
    return Order.get({
      id: $stateParams.orderId,
      'includes[]': ['project']
    }).$promise;
  }

  function StateController($state, lodash, order) {
    var vm = this;
    vm.order = order;

    vm.activate = activate;

    function activate() {
    }
  }
})();
