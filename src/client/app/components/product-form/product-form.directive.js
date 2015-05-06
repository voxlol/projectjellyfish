(function() {
  'use strict';

  angular.module('app.components')
    .directive('productForm', ProductFormDirective);

  /** @ngInject */
  function ProductFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        title: '@?',
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
    function ProductFormController($scope, $state, Tag, Toasts, TAG_QUERY_LIMIT) {
      var vm = this;

      var showValidationMessages = false;
      var home = 'admin.products';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.queryTags = queryTags;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
        vm.title = vm.title || 'Add A Product';
      }

      function backToList() {
        $state.go(home);
      }

      function queryTags(query) {
        return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
      }

      function showErrors() {
        return showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return showValidationMessages && vm.form.$invalid;
        }

        return showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {
        showValidationMessages = true;
        // This is so errors can be displayed for 'untouched' angular-schema-form fields
        $scope.$broadcast('schemaFormValidate');

        if (vm.form.$valid) {
          vm.product.$save(saveSuccess, saveFailure);
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
    }
  }
})();
