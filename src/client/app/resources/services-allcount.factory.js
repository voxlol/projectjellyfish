(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ServicesAllCount', ServicesAllCountFactory);

  /** @ngInject */
  function ServicesAllCountFactory($resource, ApiService) {
    var ServicesAllCount = $resource(ApiService.routeResolve('serviceAll'), {});

    return ServicesAllCount;
  }
})();
