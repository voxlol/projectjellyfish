(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ServicesOrderProfilesCount', ServicesOrderProfilesCountFactory);

  /** @ngInject */
  function ServicesOrderProfilesCountFactory($resource, ApiService) {
    var ServicesOrderProfilesCount = $resource(ApiService.routeResolve('serviceOrderProfiles'), {});

    return ServicesOrderProfilesCount;
  }
})();

