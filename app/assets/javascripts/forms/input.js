(function() {
  'use strict';

  angular.module('broker.forms')
    .directive('brokerInput', BrokerInput);

  function BrokerInput() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '/templates/partials/forms/broker_input.html',
      scope: {
        model: "=",
        errorPresent: "=",
        label: "@",
        name: "@",
        ngModel: "=",
        placeholder: "@",
        required: "=",
        type: "@",
      },
    };
  };
}())
