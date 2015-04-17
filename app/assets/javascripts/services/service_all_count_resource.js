"use strict";

/**@ngInject*/
var ServiceAllCountResource = function ($resource, apiResource) {
  return $resource(apiResource("serviceAll"), {
    get: {
      method: "GET",
      isArray: false
    },
    query: {
      isArray: true,
      method: "GET"
    }
  });
};

window.ServiceAllCountResource = ServiceAllCountResource;
