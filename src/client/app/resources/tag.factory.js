(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Tag', TagFactory);

  /** @ngInject */
  function TagFactory($resource, ApiService) {
    var Tag = $resource(ApiService.routeResolve('tags'), {id: '@id'}, {});

    return Tag;
  }
})();
