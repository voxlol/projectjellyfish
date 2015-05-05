'use strict';

/**@ngInject*/
window.GroupsResource = function($resource, apiResource, $state) {
  return $resource(apiResource('groupsById'), {'id': '@id'}, {
    'update': {
      method: 'PUT'
    }
  });
};
