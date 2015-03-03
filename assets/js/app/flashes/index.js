'use strict';

var angular = require('angular');

var FlashesModule = angular.module('invApp.flashes', [])
  .controller('FlashesController', require('./flashes_controller'))
  .directive('flashes', require('./flashes_directive'))
  .service('FlashesService', require('./../flashes/flashes_service'));

module.exports = FlashesModule;
