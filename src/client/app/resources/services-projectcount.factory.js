(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ServicesProjectCount', ServicesProjectCountFactory);

  /** @ngInject */
  function ServicesProjectCountFactory($resource, ApiService) {
    var ServicesProjectCount = $resource(ApiService.routeResolve('serviceProject'), {});

    return ServicesProjectCount;
  }
})();
