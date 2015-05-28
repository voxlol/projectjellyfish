(function() {
  'use strict';

  angular.module('app.components')
    .directive('orderHistoryCatalog', OrderHistoryCatalogDirective);

  /** @ngInject */
  function OrderHistoryCatalogDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        orders: '='
      },
      link: link,
      templateUrl: 'app/components/order-history-catalog/order-history-catalog.html',
      controller: OrderHistoryCatalogController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function OrderHistoryCatalogController(VIEW_MODES, $state) {
      var vm = this;

      vm.activate = activate;
      vm.goTo = goTo;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.list;
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
      }

      function goTo(id) {
        $state.go('order-history.details', {id: id});
      }
    }
  }
})();
