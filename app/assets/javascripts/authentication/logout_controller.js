'use strict';

/**@ngInject*/
function LogoutController(AuthService) {
  AuthService.logout();
}

window.LogoutController = LogoutController;
