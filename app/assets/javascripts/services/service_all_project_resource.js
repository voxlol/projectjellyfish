'use strict';

/**@ngInject*/
var ServiceProjectCountResource = function($resource, apiResource) {
  return $resource(apiResource('serviceProject'),{})
};

window.ServiceProjectCountResource = ServiceProjectCountResource;
