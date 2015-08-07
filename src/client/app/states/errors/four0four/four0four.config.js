(function() {
  'use strict';

  angular.module('app.states')
    .run(runNotFound);

  function runNotFound($rootScope, $state) {
    $rootScope.$on('$stateNotFound', notFound);

    function notFound(event) {
      event.preventDefault();
      $state.transitionTo('errors.four0four');
    }
  }
})();
