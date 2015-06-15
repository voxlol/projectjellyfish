(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Role', RolesFactory);

  /** @ngInject */
  function RolesFactory($resource) {
    var Roles = $resource('/api/v1/roles/:id' , {id: '@id'}, {});

    return Roles;
  }
})();
