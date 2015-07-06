(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Service', ServicesFactory);

  /** @ngInject */
  function ServicesFactory($resource) {
    var Service = $resource('/api/v1/services/:id', {id: '@id'}, {
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
      update: {
        method: 'PUT'}
    });

    return Service;
  }
})();
