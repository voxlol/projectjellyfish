'use strict';

/**@ngInject*/
var ProductTypesResource = function($resource, apiResource) {
  return $resource(apiResource('productTypesById'));
};

window.ProductTypesResource = ProductTypesResource;
