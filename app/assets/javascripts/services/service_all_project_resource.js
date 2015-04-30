/**@ngInject*/
var ServiceProjectCountResource = function($resource, apiResource, $state) {
  "use strict";
  return $resource(apiResource("serviceProject"));
};

window.ServiceProjectCountResource = ServiceProjectCountResource;
