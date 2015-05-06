(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.states',

    // We don't have a backend so provide a mock
    'mock'
  ]);
})();
