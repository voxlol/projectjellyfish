/**@ngInject*/
var ServiceAllCountResource = function ($resource, apiResource) {
  "use strict";
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
