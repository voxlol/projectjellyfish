(function() {
  'use strict';

  angular.module('app.components')
    .directive('computedMonthlyPrice', ComputedMonthlyPriceDirective);

  /** @ngInject */
  function ComputedMonthlyPriceDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        hourlyPrice: '=',
        monthlyPrice: '=',
        quantity: '=?'
      },
      link: link,
      templateUrl: 'app/components/monthly-price/monthly-price.html',
      controller: ComputedMonthlyPriceController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ComputedMonthlyPriceController() {
      var vm = this;

      vm.activate = activate;
      vm.computeMonthlyTotal = computeMonthlyTotal;

      function activate() {
        vm.quantity = vm.quantity || 1;
      }

      function computeMonthlyTotal(hourlyprice, monthlyprice) {
        return ((parseFloat(monthlyprice)) + ((parseFloat(hourlyprice)) * 750)) * vm.quantity;
      }
    }
  }
})();
