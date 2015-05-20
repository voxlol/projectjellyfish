(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Services', ServicesFactory);

  /** @ngInject */
  function ServicesFactory($resource, ApiService) {
    var Services = $resource(ApiService.routeResolve('services'), {});

    return Services;
  }
})();
