(function() {
  'use strict';

  angular.module('app.components')
    .directive('orderForm', OrderFormDirective);

  /** @ngInject */
  function OrderFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        product: '=',
        projects: '='
      },
      link: link,
      templateUrl: 'app/components/order-form/order-form.html',
      controller: OrderFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function OrderFormController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.order = {
          product_id: vm.product.id,
          project_id: null,
          service: {
            name: null
          }
        };

        vm.model = {
          foo: 'bar',
          fizz: 'buzz',
          lorem: 'ipsum and blah blah',
          pick: 5
        };

        vm.fields = [
          { key: 'foo', type: 'text', templateOptions: { label: 'Foo' } },
          { key: 'fizz', type: 'password', templateOptions: {label: 'Fizz'} },
          { key: 'lorem', type: 'textarea', templateOptions: {label: 'Lorem', rows: 6} },
          { key: 'pick', type: 'select', templateOptions: {
            label: 'Pick One',
            options: [
              { name: 'five', value: 5 },
              {name: 'four', value: 4},
              {name: 'three', value: 3},
              {name: 'two', value: 2},
              {name: 'one', value: 1}
            ]
          }}
        ]
      }
    }
  }
})();
