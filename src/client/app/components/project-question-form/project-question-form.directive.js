(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectQuestionForm', ProjectQuestionFormDirective);

  /** @ngInject */
  function ProjectQuestionFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        heading: '@?',
        projectQuestion: '='
      },
      link: link,
      templateUrl: 'app/components/project-question-form/project-question-form.html',
      controller: ProjectQuestionFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectQuestionFormController($state, Tag, ProjectQuestion, Toasts, TAG_QUERY_LIMIT, lodash) {
      var vm = this;

      var showValidationMessages = false;
      var home = 'manage.project-questions';
      var lastFieldType = '';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.queryTags = queryTags;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.typeChangeOk = typeChangeOk;
      vm.typeChangeCancel = typeChangeCancel;
      vm.typeHasOptions = typeHasOptions;

      function activate() {
        vm.heading = vm.heading || 'Add Project Question';
        lastFieldType = vm.projectQuestion.field_type;
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
        if (vm.form.$valid) {
          if (vm.projectQuestion.id) {
            vm.projectQuestion.$update(saveSuccess, saveFailure);
          } else {
            vm.projectQuestion.$save(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Project Question saved.');
          $state.go(home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function typeChangeOk() {
        lastFieldType = vm.projectQuestion.field_type;

        vm.projectQuestion.options.length = 0;
        if (typeHasOptions()) {
          vm.projectQuestion.options.push(angular.copy(ProjectQuestion.optionDefaults));
          vm.projectQuestion.options.push(angular.copy(ProjectQuestion.optionDefaults));
        }
      }

      function typeChangeCancel() {
        vm.projectQuestion.field_type = lastFieldType;
      }

      function typeHasOptions() {
        return -1 !== ['yes_no', 'multiple'].indexOf(vm.projectQuestion.field_type)
      }
    }
  }
})();
