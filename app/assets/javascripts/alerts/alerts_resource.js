'use strict';

/**@ngInject*/
var AlertsResource = function($resource, apiResource, $state) {
  return $resource(apiResource('alertsById'), {'id': '@id'}, {
    // Get single
    get: {
      method: 'GET',
      isArray: false
    },
    query: {
      isArray: true,
      method: 'GET'
    },
    'update': {
      method: 'PUT'
    }
  });
};

window.AlertsResource = AlertsResource;
