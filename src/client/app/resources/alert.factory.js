(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Alert', AlertsFactory);

  /** @ngInject */
  function AlertsFactory($resource) {
    var Alerts = $resource('/api/v1/alerts/:id' , {id: '@id'}, {});

    return Alerts;
  }
})();
