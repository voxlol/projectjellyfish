/**@ngInject*/
var ServicesResource = function ($resource, apiResource, $state) {
  "use strict";
  return $resource(apiResource("services"));
};

window.ServicesResource = ServicesResource;
