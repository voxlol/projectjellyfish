(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Theme', ThemeFactory);

  /** @ngInject */
  function ThemeFactory($resource) {
    // var theme = $resource('/api/v1/themes/', {}, {});
    var theme = {
      id: 1,
      name: 'mock theme',
      description: 'mock theme description',
      config: {
        bg: '#000000',
        font: '#FFFFFF'
      }
    };

    theme.reset = function() {
      // set back to default here
    };

    return theme;
  }
})();
