(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Services', ServicesFactory);

  /** @ngInject */
  function ServicesFactory($resource) {
    var Services = $resource('/api/v1/services', {});

    return Services;
  }
})();
