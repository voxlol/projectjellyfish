(function() {
  'use strict';

  angular.module('app.components')
    .directive('productForm', ProductFormDirective);

  /** @ngInject */
  function ProductFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        heading: '@?',
        product: '=',
        productType: '='
      },
      link: link,
      templateUrl: 'app/components/product-form/product-form.html',
      controller: ProductFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProductFormController($state, lodash, Tag, Toasts, TAG_QUERY_LIMIT) {
      var vm = this;

      var home = 'manage.products';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.queryTags = queryTags;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
        vm.heading = vm.heading || 'Add A Product';
        initFormly();
      }

      function backToList() {
        $state.go(home);
      }

      function queryTags(query) {
        return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.form.$submitted && vm.form.$invalid;
        }

        return vm.form.$submitted && vm.form[field].$invalid;
      }

      function onSubmit() {
        if (vm.form.$valid) {
          if (vm.product.id) {
            vm.product.$update(saveSuccess, saveFailure);
          } else {
            vm.product.$save(saveSuccess, saveFailure);
          }
        }

        return false;

        function saveSuccess() {
          Toasts.toast(vm.product.name + ' saved to products.');
          $state.go(home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      // Private

      function initFormly() {
        vm.fields = lodash.flatten(lodash.map(vm.productType.product_form, mapSection));
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

          field.model = lodash.find(vm.product.answers, {name: definition.name});

          return field;
        }
      }
    }
  }
})();
