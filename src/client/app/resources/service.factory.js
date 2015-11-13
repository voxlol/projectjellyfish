(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Service', ServicesFactory);

  /** @ngInject */
  function ServicesFactory($resource) {
    var Service = $resource('/api/v1/services/:id', {id: '@id', action: '@action'}, {
      action: {
        url: '/api/v1/services/:id/actions/:action',
        method: 'PUT',
        isArray: false
      }
    });

    return Service;
  }
})();
