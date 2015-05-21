(function() {
  'use strict';

  angular.module('app.components')
    .factory('ApiService', ApiServiceFactory);

  /** @ngInject */
  function ApiServiceFactory(apiRoutes, lodash) {
    var service = {
      routeResolve: routeResolve
    };

    return service;

    function routeResolve(APP_CONFIG) {
      // Get the data from the config if it has been passed in, otherwise use the default
      // from the apiRoutes.json file.

      var apiBasePath = APP_CONFIG.apiBasePath || apiRoutes.basePath;

      // Remove trailing slash if it exists.
      // apiBasePath = apiBasePath.replace(/\/$/, '');

      if (lodash.isObject(APP_CONFIG)) {
        return apiBasePath;
      }

      return apiBasePath + '/v1' + apiRoutes.routes[APP_CONFIG];
    }
  }
})();
