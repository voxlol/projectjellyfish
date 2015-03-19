'use strict';

var angular = require('angular');

var ErrorsModule = angular.module('broker.errors', [])
  .config(require('./routes'));

module.exports = ErrorsModule;
