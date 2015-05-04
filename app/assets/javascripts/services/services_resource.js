/**@ngInject*/
var ServicesResource = function ($resource, apiResource) {
  "use strict";
  return $resource(apiResource("services"));
};

window.ServicesResource = ServicesResource;
