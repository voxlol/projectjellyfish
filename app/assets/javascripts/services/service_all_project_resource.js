/**@ngInject*/
var ServiceProjectCountResource = function($resource, apiResource) {
  "use strict";
  return $resource(apiResource("serviceProject"));
};

window.ServiceProjectCountResource = ServiceProjectCountResource;
