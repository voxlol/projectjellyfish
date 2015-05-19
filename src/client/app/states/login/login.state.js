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
      'login': {
        url: '/login',
        templateUrl: 'app/states/login/login.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Login',
        // resolve: {
        //    ssoUrl: ssoUrl
        //  },
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
  function StateController($state, logger, AuthenticationService, lodash) {
    var vm = this;

    vm.AuthService = AuthenticationService;
    vm.title = 'Login';
    // vm.ssoUrl = ssoUrl;

    vm.login = login;
    vm.hasFailedLogin = hasFailedLogin;

    activate();

    function activate() {
      if (AuthenticationService.isAuthenticated()) {
        // logger.info(SessionService.firstName + ' is already logged in, redirecting you to the dashboard.');
        $state.transitionTo('dashboard');
      }
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
          $state.transitionTo('dashboard');
        }, vm))
          .error(lodash.bind(function() {
            isFailedLogin = true;
            logger.error('Invalid login credentials entered, please renter and try again.');
          }, vm));
      }
    }
  }
})();
