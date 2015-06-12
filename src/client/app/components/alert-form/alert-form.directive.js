(function () {
  'use strict';

  angular.module('app.components')
    .directive('alertForm', AlertFormDirective);

  /** @ngInject */
  function AlertFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        alertObj: '=?',
        editing: '=?'
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
    function AlertFormController($scope, $state, Toasts) {
      var vm = this;

      var showValidationMessages = false;
      var home = 'admin.alerts.list';
      vm.format = 'yyyy-MM-dd';
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 0,
        showWeeks: false
      };

      vm.statusOptions = [
        {type:'OK'},
        {type:'WARINING'},
        {type:'CRITICAL'}
      ];

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

      }

      function backToList() {
        $state.go(home);
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


        function saveSuccess() {
          Toasts.toast('Alert saved.');
          $state.go(home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function openStart($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.openedStart = true;
      };

      function openEnd($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.openedEnd = true;
      };

      function openAnswerDate($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.startDateOpened = false;
        vm.endDateOpened = false;
        vm.answerDateOpened = [];
        vm.answerDateOpened[index] = true;
      };
    }
  }
})();
