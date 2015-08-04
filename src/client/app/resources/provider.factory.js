(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Provider', ProviderFactory);

  /** @ngInject */
  function ProviderFactory($resource) {
    var Provider = $resource('/api/v1/providers/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    return Provider;
  }
})();
