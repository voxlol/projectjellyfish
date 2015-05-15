(function() {
  'use strict';
  var isFailedLogin = false;
  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
  }

  function navItems() {
    return {};
  }

  function getStates() {
    return {
      'public.login': {
        url: '/',
        templateUrl: 'app/states/login/login.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Login',
        resolve: {
          ssoUrl: ssoUrl
        },
        data: {
          layout: 'blank'
        }
      }
    };
  }

  /** @ngInject */
  function ssoUrl(AuthenticationService) {
    return AuthenticationService.ssoInit();
  }

  /** @ngInject */
  function StateController($state, logger, AuthenticationService, lodash, ssoUrl) {
    var vm = this;

    vm.AuthService = AuthenticationService;
    vm.title = 'Login';
    vm.ssoUrl = ssoUrl;
    vm.activate = activate;
    vm.login = login;
    vm.hasFailedLogin = hasFailedLogin;

    function activate() {
    }

    function hasFailedLogin() {
      return isFailedLogin;
    }

    function login(sso) {
      if (sso !== undefined) {
        window.location = sso;
      } else {
        // Reset the failed login flag.
        isFailedLogin = false;

        vm.credentials = {
          staff: {
            email: vm.email,
            password: vm.password
          }
        };

        vm.AuthService.login(vm.credentials).success(lodash.bind(function() {
          $state.transitionTo('authed.dashboard');
        }, vm))
          .error(lodash.bind(function() {
            isFailedLogin = true;
            logger.error('Invalid login credentials entered, please renter and try again.');
          }, vm));
      }
    }
  }
})();
