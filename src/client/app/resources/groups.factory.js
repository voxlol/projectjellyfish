(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Groups', GroupsFactory);

  /** @ngInject */
  function GroupsFactory($resource) {
    var Groups = $resource('/api/v1/groups/:id' , {id: '@id'}, {});

    return Groups;
  }
})();
