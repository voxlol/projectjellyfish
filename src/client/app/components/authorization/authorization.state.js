(function() {
  'use strict';

  angular.module('app.components')
    .run(appRun);

  /** @ngInject */
  function appRun($rootScope, $state, AuthenticationService, AuthorizationService, logger, jQuery, SessionService) {
    activate();

    function activate() {
    }

    // Authorzation and Authentication when switching Pages.
    $rootScope.$on('$stateChangeStart', function(toState, toParams) {
      console.log(toState);
      // console.log(toParams.data.authorizedRoles);
      console.log(SessionService.role);

      // If an unauthenticated user attempts to navigate within app, return them to login
      // if (!AuthenticationService.isAuthenticated()) {
      //  logger.error('Improper authentication, redirecting to login page.');
      //  $state.transitionTo('public.login');
      // }
      // vm.authorizedRoles = next.data.authorizedRoles;
      // if (!AuthorizationService.isAuthorized( vm.authorizedRoles)) {
      // if (AuthorizationService.isAuthenticated()) {
      //   $state.transitionTo('base.authed.errors.unauthorized');
      // } else {
      //   $state.transitionTo('errors.sorry');
      // }
      // }
    });

    // catch any error in resolve in state
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // If a 401 is encountered during a state change, then kick the user back to the login
      if (401 === error.status) {
        if (AuthorizationService.isAuthenticated()) {
          $state.transitionTo('public.logout');
        } else if ('public.login' !== toState.name) {
          $state.transitionTo('public.login');
        }
      } else if (403 === error.status) {
        logger.error('An error has prevent the page from loading. Please try again later.');
        if ('authed.dashboard' !== fromState.name) {
          $state.transitionTo('authed.dashboard');
        }
      } else {
        logger.error('Unhandled State Change Error occurred: ' + (error.statusText || error.message));
      }
      event.preventDefault();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      jQuery('html, body').animate({scrollTop: 0}, 200);
    });

    $rootScope.$on('$stateNotFound', function(event) {
      event.preventDefault();
      // if (AuthorizationService.isAuthenticated()) {
      //  $state.transitionTo('base.authed.errors.not-found');
      // } else {
      //  $state.transitionTo('errors.sorry');
      //     }
    });
  }
})();
