(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Alert', AlertsFactory);

  /** @ngInject */
  function AlertsFactory($resource) {
    var Alerts = $resource('/api/v1/alerts/:id' , {id: '@id'}, {
      // Get single
      get: {
        method: 'GET',
        isArray: false
      },
      query: {
        isArray: true,
        method: 'GET'
      },
      'update': {
        method: 'PUT'
      }
    });

    return Alerts;
  }
})();
