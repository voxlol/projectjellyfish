/**@ngInject*/
var ServiceProjectCountResource = function($resource, apiResource) {
  "use strict";
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
