(function () {
  'use strict';

  angular.module('app.components')
    .directive('projectForm', ProjectFormDirective);

  /** @ngInject */
  function ProjectFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        projectQuestions: '='
      },
      link: link,
      templateUrl: 'app/components/project-form/project-form.html',
      controller: ProjectFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectFormController($scope, $state, Toasts, logger) {
      var vm = this;

      var showValidationMessages = false;
      var home = 'projects.list';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.openStart = openStart;
      vm.openEnd = openEnd;

      function activate() {

        if (vm.project.name !== undefined) {
          vm.title = "Edit " + vm.project.name;
        } else {
          vm.title = 'Create Project';
        }
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

        if (vm.form.$valid) {
          vm.project.$save(saveSuccess, saveFailure);
        }

        return false;

        function saveSuccess() {
          Toasts.toast(vm.project.name + ' saved.');
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
    }
  }
})();
