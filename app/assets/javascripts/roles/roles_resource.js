'use strict';

/**@ngInject*/
window.RolesResource = function($resource, apiResource, $state) {
  return $resource(apiResource('rolesById'), {'id': '@id'}, {
    'update': {
      method: 'PUT'
    }
  });
};
