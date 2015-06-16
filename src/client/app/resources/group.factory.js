(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Group', GroupFactory);

  /** @ngInject */
  function GroupFactory($resource) {
    var Group = $resource('/api/v1/groups/:id' , {id: '@id'}, {});

    Group.defaults = {
      name: '',
      description: '',
      staff: []
    };

    return Group;
  }
})();
