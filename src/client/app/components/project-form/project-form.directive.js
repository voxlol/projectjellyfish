(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectForm', ProjectFormDirective);

  /** @ngInject */
  function ProjectFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        title: '@?',
        projects: '='
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
    function ProjectFormController($state, Tag, Projects, Toasts, TAG_QUERY_LIMIT) {
      var vm = this;

      var showValidationMessages = false;
      var home = 'projects';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.queryTags = queryTags;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.typeChangeOk = typeChangeOk;
      vm.typeChangeCancel = typeChangeCancel;

      function activate() {
        vm.title = vm.title || 'Add A Project';
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

        if (vm.form.$valid) {
          vm.projects.$save(saveSuccess, saveFailure);
        }

        return false;

        function saveSuccess() {
          Toasts.toast('Project Question saved.');
          $state.go(home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function typeChangeOk() {
        vm.projects.options.length = 0;
        vm.projects.options.push(angular.extend({}, Projects.optionDefaults));
        vm.projects.options.push(angular.extend({}, Projects.optionDefaults));
      }

      function typeChangeCancel() {
        vm.projects.type = 'multiple' === vm.projects.type ? 'yes_no' : 'multiple';
      }
    }
  }
})();
