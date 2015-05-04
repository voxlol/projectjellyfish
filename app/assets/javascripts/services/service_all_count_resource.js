/**@ngInject*/
var ServiceAllCountResource = function ($resource, apiResource) {
  "use strict";
  return $resource(apiResource("serviceAll"));
};

window.ServiceAllCountResource = ServiceAllCountResource;
