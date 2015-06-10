(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectFormField', ProjectFormFieldDirective);

  /** @ngInject */
  function ProjectFormFieldDirective($timeout) {
    var directive = {
      restrict: 'AE',
      require: '^productForm',
      link: link
    };

    return directive;

    function link(scope, element, attrs, projectForm, transclude) {
      scope.hasErrors = hasErrors;

      function hasErrors(field) {
        return projectForm.hasErrors(field);
      }
    }
  }
})();
