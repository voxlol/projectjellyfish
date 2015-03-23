//= require_tree .
'use strict';

var CloudsModule = angular.module('broker.clouds', [])
  .factory('CloudsResource', CloudsResource);

window.CloudsModule = CloudsModule;
