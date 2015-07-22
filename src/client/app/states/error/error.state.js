(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    var otherwise = '/error';
    routerHelper.configureStates(getStates(), otherwise);
  }

  function getStates() {
    return {
      'error': {
        url: '/error',
        templateUrl: 'app/states/error/error.html',
        title: 'Error',
        data: {
          layout: 'blank',
          error: false
        }
      }
    };
  }
})();
