(function() {
  'use strict';

  var config = {
    appErrorPrefix: '[Jellyfish] ',
    appTitle: 'Jellyfish UX Prototype'
  };

  angular.module('app.core')
    .value('config', config)
    .config(configure);

  /** @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, $compileProvider) {
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({docTitle: config.appTitle + ': '});

    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(true);
  }
})();
