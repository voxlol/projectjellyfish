    //  (function () {
    //  'use strict';
    //
    //  angular.module('app.components')
    //    .run(appRun);
    //
    //  /** @ngInject */
    //  function appRun($state, AuthorizationService, logger ) {
    //    var vm = this;
    //
    //    activate();
    //
    //    function activate() {
    //      logger.info('State change baby!');
    //    }
    //
    //    // Authorization and Authentication when switching Pages.
    //    $rootScope.$on('$stateChangeStart', function (event, next) {
    //
    //      vm.authorizedRoles = next.data.authorizedRoles;
    //      if (!AuthorizationService.isAuthorized( vm.authorizedRoles)) {
    //        if (AuthorizationService.isAuthenticated()) {
    //          $state.transitionTo('base.authed.errors.unauthorized');
    //        } else {
    //          $state.transitionTo('errors.sorry');
    //        }
    //      }
    //    });
    //
    //    // catch any error in resolve in state
    //    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    //      // If a 401 is encountered during a state change, then kick the user back to the login screen
    //      if (401 === error.status) {
    //        if (AuthorizationService.isAuthenticated()) {
    //          $state.transitionTo('base.public.logout');
    //        } else if ('base.public.login' !== toState.name) {
    //          $state.transitionTo('base.public.login');
    //        }
    //      } else if (403 === error.status) {
    //        logger.error("An error has prevent the page from loading. Please try again later.")
    //        if ('base.authed.dashboard' !== fromState.name) {
    //          $state.transitionTo('base.authed.dashboard');
    //        }
    //      } else {
    //        $log.error('Unhandled State Change Error occurred: ' + (error.statusText || error.message));
    //
    //      }
    //      event.preventDefault();
    //    });
    //
    //    $rootScope.$on('$stateChangeSuccess', function () {
    //      $("html, body").animate({scrollTop: 0}, 200);
    //    });
    //
    //    $rootScope.$on('$stateNotFound', function (event) {
    //      event.preventDefault();
    //      if (AuthorizationService.isAuthenticated()) {
    //        $state.transitionTo('base.authed.errors.not-found');
    //      } else {
    //        $state.transitionTo('errors.sorry');
    //      }
    //    });
    //  }
    //
    //  })();
