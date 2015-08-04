(function() {
  'use strict';

  angular.module('app.components')
    .provider('Forms', FormsProvider);

  function FormsProvider($compileProvider) {
    var provider = {
      register: register,
      $get: FormsHelper
    };

    return provider;

    function register(name, options) {
      var scope = {
        record: '=',
        heading: '=',
        back: '@',
        subHeading: '=?',
        backParams: '=?',
        successMsg: '@?',
        failureMsg: '@?'
      };

      $compileProvider.directive(name, FormsDirective);

      function FormsDirective() {
        var directive = {
          restrict: 'E',
          scope: angular.extend(scope, options.scope || {}),
          link: options.link || link,
          templateUrl: options.templateUrl || 'app/components/forms/form.html',
          controller: FormsController,
          controllerAs: 'vm',
          bindToController: true
        };

        return directive;

        function link(scope, element, attrs, vm, transclude) {
          vm.activate();
        }

        /** @ngInject */
        function FormsController($injector, Toasts, lodash) {
          var vm = this;

          vm.fields = options.fields;

          vm.activate = activate;
          vm.goBack = goBack;
          vm.hasErrors = hasErrors;
          vm.onSubmit = onSubmit;

          if (angular.isDefined(options.controller)) {
            $injector.invoke(options.controller, this);
          }

          function activate() {
            vm.successMsg = vm.successMsg || 'Save successful!';
            vm.failureMsg = vm.failureMsg || 'Error encountered during save attempt!';
            if (angular.isDefined(vm.record.answer)) {
              initAnswerFields();
            }
            if (angular.isDefined(vm.afterActivate)) {
              vm.afterActivate();
            }
          }

          function goBack() {
            $state.go(vm.back, vm.backParams || {});
          }

          function hasErrors(field) {
            if (angular.isUndefined(field)) {
              return vm.form.$submitted && vm.form.$invalid;
            }

            return vm.form.$submitted && vm.form[field].$invalid;
          }

          function onSubmit() {
            if (vm.record.id) {
              vm.record.$update(saveSuccess, saveFailure);
            } else {
              vm.record.$save(saveSuccess, saveFailure);
            }

            function saveSuccess() {
              Toasts.log(vm.successMsg);
              goBack();
            }

            function saveFailure() {
              Toasts.error(vm.failureMsg);
            }
          }
        }
      }
    }

    function FormsHelper() {
      var service = {
        fields: fields
      };
      var fieldStore = {};

      return service;

      function fields(uuid, fields) {
        if (angular.isDefined(fields)) {
          fieldStore[uuid] = fields;
        }
        return fieldStore[uuid] || [];
      }
    }
  }
})();
