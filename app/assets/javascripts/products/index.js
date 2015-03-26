//= require_tree .
'use strict';

var ProductsModule = angular.module('broker.products', [])
  .factory('ProductsResource', ProductsResource)
  .factory('ProductTypesResource', ProductTypesResource)
  .directive('productBox', ProductBoxDirective )

window.ProductsModule = ProductsModule;
