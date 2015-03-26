//= require_tree .
'use strict';

var FlashesModule = angular.module('broker.flashes', [])
  .controller('FlashesController', FlashesController)
  .directive('flashes', FlashesDirective)
  .service('FlashesService', FlashesService)

window.FlashesModule = FlashesModule;
