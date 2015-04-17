'use strict';

/**@ngInject*/
var ServicesResource = function($resource, apiResource) {
  return $resource(apiResource('services'),{})
};

window.ServicesResource = ServicesResource;
