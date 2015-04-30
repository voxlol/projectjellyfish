/**@ngInject*/
var ServiceAllCountResource = function ($resource, apiResource, $state) {
  "use strict";
  return $resource(apiResource("serviceAll"));
};

window.ServiceAllCountResource = ServiceAllCountResource;
