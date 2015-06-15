(function() {
  'use strict';

  angular.module('app.components')
    .directive('alertForm', AlertFormDirective);

  /** @ngInject */
  function AlertFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        alertToEdit: '=?',
        editing: '=?',
        staffId: '@?'
      },
      link: link,
      templateUrl: 'app/components/alert-form/alert-form.html',
      controller: AlertFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function AlertFormController($scope, $state, Toasts, Alert, lodash) {
      var vm = this;

      vm.activate = activate;
      activate();

      vm.showValidationMessages = false;
      vm.home = 'admin.alerts.list';
      vm.format = 'yyyy-MM-dd';
      vm.filteredProject = lodash.omit(vm.alertToEdit, 'created_at', 'updated_at', 'deleted_at');
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 0,
        showWeeks: false
      };

      vm.activate = activate;
      activate();

      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.openStart = openStart;
      vm.openEnd = openEnd;
      vm.openAnswerDate = openAnswerDate;

      function activate() {
        if (vm.editing) {
          vm.alertToEdit.staff_id = String(vm.alertToEdit.staff_id);
        } else {
          vm.alertToEdit.project_id = '0';
          vm.alertToEdit.order_item_id = '0';
          vm.alertToEdit.staff_id = String(vm.staffId);
        }
      }

      function backToList() {
        $state.go(vm.home);
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
          if (vm.editing) {
            for (var prop in vm.alertToEdit) {
              if (vm.filteredProject[prop] === null) {
                delete vm.filteredProject[prop];
              }
            }
            Alert.update(vm.filteredProject).$promise.then(saveSuccess, saveFailure);

            return false;
          } else {
            Alert.save(vm.alertToEdit).$promise.then(saveSuccess, saveFailure);

            return false;
          }
        }

        function saveSuccess() {
          Toasts.toast('Alert saved.');
          $state.go(vm.home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function openStart($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.openedStart = true;
      }

      function openEnd($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.openedEnd = true;
      }

      function openAnswerDate($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.startDateOpened = false;
        vm.endDateOpened = false;
        vm.answerDateOpened = [];
        vm.answerDateOpened[index] = true;
      }
    }
  }
})();
