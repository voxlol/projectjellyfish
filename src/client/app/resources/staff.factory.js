(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Staff', StaffFactory);

  /** @ngInject */
  function StaffFactory($resource, ApiService) {
    var Staff = $resource(ApiService.routeResolve('staffById'), {id: '@id'}, {
      // Get Current
      getCurrentMember: {
        method: 'GET',
        isArray: false,
        url: ApiService.routeResolve('currentMember')
      },
      // Get Single
      get: {
        method: 'GET',
        isArray: false
      },
      // Get All
      query: {
        method: 'GET',
        isArray: true
      },
      'update': {
        method: 'PUT'
      }
    });

    return Staff;
  }
})();
