(function() {
  'use strict';

  angular.module('broker.forms')
    .directive('inputWrap', InputWrap);

  function InputWrap() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '/templates/partials/forms/input_wrap.html',
      scope: {
        errorPresent: "=",
        for: "@",
        label: "@",
      },
    };
  };
}())
