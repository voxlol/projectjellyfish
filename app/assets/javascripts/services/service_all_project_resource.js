"use strict";

/**@ngInject*/
var ServiceProjectCountResource = function($resource, apiResource) {
  return $resource(apiResource("serviceProject"),{
    get: {
      method: "GET",
      isArray: false
    },
    query: {
      isArray: true,
      method: "GET"
    }});
};

window.ServiceProjectCountResource = ServiceProjectCountResource;
