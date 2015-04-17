"use strict";

/**@ngInject*/
var ServicesResource = function ($resource, apiResource) {
  return $resource(apiResource('services'), {
    get: {
      method: 'GET',
      isArray: false
    },
    query: {
      isArray: true,
      method: 'GET'
    }
  });
};

window.ServicesResource = ServicesResource;
