/**@ngInject*/
var ServiceOrderProfilesResource = function ($resource, apiResource) {
  "use strict";
  return $resource(apiResource("serviceOrderProfiles"));
};

window.ServicesResource = ServiceOrderProfilesResource;
