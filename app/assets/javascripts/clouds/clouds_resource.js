'use strict';

/**@ngInject*/
var CloudsResource = function($resource, apiResource) {
  return $resource(apiResource('cloudsById'));
};

window.CloudsResource = CloudsResource;
