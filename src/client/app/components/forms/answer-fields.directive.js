(function() {
  'use strict';

  angular.module('app.components')
    .directive('answerFields', AnswerFieldsDirective);

  /** @ngInject */
  function AnswerFieldsDirective() {
    var directive = {
      restrict: 'E',
      scope: {
        answers: '=',
        fieldsKey: '@',
        options: '=?'
      },
      link: link,
      templateUrl: 'app/components/answer_fields/answer_fields.html',
      controller: AnswerFieldsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function AnswerFieldsController(Forms) {
      var vm = this;

      vm.fields = [];

      vm.activate = activate;

      function activate() {
        initFields();
      }

      // Private

      function initFields() {
        vm.fields.length = 0;
        vm.fields = vm.fields.concat(Forms.fields(vm.fieldsKey));

        // Exit if nothing to do
        if (0 === vm.fields.length) {
          return;
        }
        angular.forEach(vm.fields, mapField);

        function mapField(field) {
          var answer = lodash.find(vm.record.answers, 'name', field.key);

          nullifyBlankValues(answer);

          if (angular.isDefined(answer)) {
            field.model = answer;
            field.key = 'value';
          }
        }

        // If the answer is being updated and the value is blank then make it null
        // This is so secrets are not overwritten on save.
        // TODO The other part is to convert blanks to null for 'password' inputs
        function nullifyBlankValues(answer) {
          if (answer.id && '' === answer.value) {
            answer.value = null;
          }
        }
      }

    }
  }
})();
