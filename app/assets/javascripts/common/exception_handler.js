'use strict';

window.Exceptions = angular.module('broker.common.exceptions', [])

/**@ngInject*/
  .config(function($provide) {

  /**@ngInject*/
  $provide.decorator("$exceptionHandler", function($delegate) {
    return function(exception, cause) {
      $delegate(exception, cause);
    };
  });
});

window.Exceptions = Exceptions
