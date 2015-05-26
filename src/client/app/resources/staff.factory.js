(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Staff', StaffFactory);

  /** @ngInject */
  function StaffFactory($resource, ApiService) {
    var Staff = $resource(ApiService.routeResolve('staffById'), {id: '@id'}, {});

    return Staff;
  }
})();

