(function() {
  'use strict';

  angular.module('app.components')
    .directive('cart', CartDirective);

  /** @ngInject */
  function CartDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'app/components/cart/cart.html',
      controller: CartController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function CartController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        // TODO Cart directive
        // Likely to be used to manage the cart items, react to 'add to cart' and so on
      }
    }
  }
})();
