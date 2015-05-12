'use strict';

/**@ngInject*/
window.RolesResource = function($resource, apiResource) {
  return $resource(apiResource('rolesById'), {'id': '@id'}, {
    'update': {
      method: 'PUT'
    }
  });
};
