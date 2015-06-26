(function() {
  'use strict';

  angular.module('app.components')
    .directive('productDescription', ProductDescriptionDirective);

  /** @ngInject */
  function ProductDescriptionDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        product: '=',
        linkTo: '@?'
      },
      link: link,
      templateUrl: 'app/components/product-description/product-description.html',
      controller: ProductDescriptionController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProductDescriptionController($state) {
      var vm = this;

      vm.activate = activate;
      vm.clicked = clicked;

      function activate() {
        vm.linkTo = vm.linkTo || 'products.details';
      }

      function clicked() {
        $state.go(vm.linkTo, {productId: vm.product.id});
      }
    }
  }
})();
