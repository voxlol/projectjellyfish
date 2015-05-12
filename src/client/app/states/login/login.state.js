(function() {
  'use strict';
  var isFailedLogin = false;
  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'login': {
        url: '/login',
        templateUrl: 'app/states/login/login.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Login',
        data: {
          layout: 'blank'
        }
      }
    };
  }

  /** @ngInject */
  function StateController($state, logger, AuthenticationService, lodash) {
    var vm = this;

    vm.AuthService = AuthenticationService;
    vm.title = 'Login';
    vm.$state = $state;

    vm.activate = activate;
    vm.login = login;
    vm.hasFailedLogin = hasFailedLogin;

    function activate() {
      logger.info('Activated Login View');
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

        var credentials = {
          staff: {
            email: vm.email,
            password: vm.password
          }
        };

        vm.AuthService.login(credentials).success(lodash.bind(function() {
          vm.$state.transitionTo('base.authed.dashboard');
        }, vm))
          .error(lodash.bind(function() {
            isFailedLogin = true;
          }, vm));
      }
    }
  }
})();
