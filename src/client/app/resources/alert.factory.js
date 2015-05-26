(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Alerts', AlertsFactory);

  /** @ngInject */
  function AlertsFactory($resource, ApiService) {
    var Alerts = $resource(ApiService.routeResolve('alerts'), {id: '@id'}, {});

    return Alerts;
  }
})();
