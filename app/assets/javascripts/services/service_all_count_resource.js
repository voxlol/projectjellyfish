'use strict';

/**@ngInject*/
var ServiceAllCountResource = function($resource, apiResource) {
  return $resource(apiResource('serviceAll'),{})
};

window.ServiceAllCountResource = ServiceAllCountResource;
