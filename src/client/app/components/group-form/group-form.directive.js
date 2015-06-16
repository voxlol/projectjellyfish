(function() {
  'use strict';

  angular.module('app.components')
    .directive('groupForm', GroupFormDirective);

  /** @ngInject */
  function GroupFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        group: '=?',
        heading: '@'
      },
      link: link,
      templateUrl: 'app/components/group-form/group-form.html',
      controller: GroupFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function GroupFormController($scope, $state, Toasts, Staff, lodash) {
      var vm = this;

      vm.activate = activate;
      activate();

      vm.showValidationMessages = false;
      vm.home = 'admin.groups.list';
      vm.format = 'yyyy-MM-dd';
      vm.filteredProject = lodash.omit(vm.group, 'created_at', 'updated_at', 'deleted_at');
      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
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

        if (vm.form.$valid) {
          if (vm.group.id) {
            // Update
          } else {
            // Create
          }

          if (vm.editing) {
            for (var prop in vm.group) {
              if (vm.filteredProject[prop] === null) {
                delete vm.filteredProject[prop];
              }
            }
            Staff.update(vm.filteredProject).$promise.then(saveSuccess, saveFailure);

            return false;
          } else {
            Staff.save(vm.group).$promise.then(saveSuccess, saveFailure);

            return false;
          }
        }

        function saveSuccess() {
          Toasts.toast('Group saved.');
          $state.go(vm.home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }
    }
  }
})();
