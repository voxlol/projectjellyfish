(function() {
  'use strict';

  angular.module('app.components')
    .directive('orderForm', OrderFormDirective);

  /** @ngInject */
  function OrderFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        order: '=',
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
    function OrderFormController($state, lodash, Toasts, ProductType) {
      var vm = this;

      var home = 'marketplace';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
        vm.productType = new ProductType(vm.product.product_type);
        initFormly();
      }

      function backToList() {
        $state.go(home);
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.form.$submitted && vm.form.$invalid;
        }

        return vm.form.$submitted && vm.form[field].$invalid;
      }

      function onSubmit() {
        if (vm.form.$valid) {
          if (vm.order.id) {
            vm.order.$update(saveSuccess, saveFailure);
          } else {
            vm.order.$save(saveSuccess, saveFailure);
          }
        }

        return false;

        function saveSuccess() {
          Toasts.toast('Order saved and services are be processed.');
          $state.go(home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      // Private

      function initFormly() {
        vm.fields = lodash.flatten(lodash.map(vm.productType.order_form, mapSection));
        vm.options = {
          formState: {
            productType: vm.productType
          }
        };

        function mapSection(section) {
          return lodash.map(section, mapField);
        }

        function mapField(definition) {
          var field = definition.control;

          field.model = lodash.find(vm.order.answers, {name: definition.name});

          return field;
        }
      }
    }
  }
})();
