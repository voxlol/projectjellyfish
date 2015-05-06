(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Tag', TagFactory);

  /** @ngInject */
  function TagFactory($resource) {
    var Tag = $resource('/api/tags/:id', {}, {
      grouped: {
        url: '/api/tags/grouped',
        method: 'GET',
        isArray: false
      }
    });

    return Tag;
  }
})();
