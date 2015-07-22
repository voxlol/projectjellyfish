(function() {
  'use strict';

  angular.module('app.components')
    .directive('contentPageForm', ContentPageFormDirective);

  /** @ngInject */
  function ContentPageFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        contentPageRecord: '=?',
        heading: '@?',
        staffId: '@?',
        home: '=?',
        homeParams: '=?'
      },
      link: link,
      templateUrl: 'app/components/content-page-form/content-page-form.html',
      controller: ContentPageFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ContentPageFormController($scope, $state, Toasts, Alert, lodash) {
      var vm = this;

      // SO FORM DOESN'T PRELOAD VALIDATION ERRORS
      vm.showValidationMessages = false;

      // METHODS
      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.activate = activate;

      activate();

      function activate() {
      }

      function backToList() {
        $state.go(vm.home, vm.homeParams);
      }

      function showErrors() {
        return vm.showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.showValidationMessages && vm.form.$invalid;
        }

        return vm.showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {

        vm.showValidationMessages = true;

        // This is so errors can be displayed for 'untouched' angular-schema-form fields
        $scope.$broadcast('schemaFormValidate');

        if (vm.form.$valid) {

          Toasts.toast('Content saved.');
          backToList();

          //vm.alertRecord.alertable_type = vm.alertableType;
          //vm.alertRecord.alertable_id = vm.alertableId;
          //
          //// If editing update rather than save
          //if (vm.alertRecord.id) {
          //  for (var prop in vm.alertRecord) {
          //    if (vm.alertRecord[prop] === null) {
          //      delete vm.alertRecord[prop];
          //    }
          //  }
          //
          //  //Alert.update(vm.alertRecord).$promise.then(saveSuccess, saveFailure);
          //
          //  Toasts.toast('Content saved.');
          //  backToList();
          //
          //  return false;
          //} else {
          //
          //  Toasts.toast('Content saved.');
          //  backToList();
          //
          //  //Alert.save(vm.alertRecord).$promise.then(saveSuccess, saveFailure);
          //
          //  return false;
          //}
        }

        function saveSuccess() {
          Toasts.toast('Content saved.');
          backToList();
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }
    }
  }
})();
