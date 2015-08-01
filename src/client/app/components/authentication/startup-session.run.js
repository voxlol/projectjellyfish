(function() {
  'use strict';

  angular.module('app.components')
    .run(startup);

  /** @ngInject */
  function startup(userSession, SessionService) {
    var dashboard = 'dashboard';
    var login = 'login';

    if (session) {
      SessionService.create(userSession);
    }
  }
})();
