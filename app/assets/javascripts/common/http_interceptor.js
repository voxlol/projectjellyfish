'use strict';

/**@ngInject*/
function HttpInterceptor($q, $injector) {

  return {
    /**
     * See also the init.js/stateChangeError method which handles state change for
     * routes that have promises that need to be resolved first.
     */
    responseError: function(error) {
      // When the server sends us a 500 or the server cannot be contacted the
      // status is 0
      if (0 === error.status) {
        $injector.get('$state').transitionTo('errors.no-network');
      }

      return $q.reject(error);
    }
  };
}

window.HttpInterceptor = HttpInterceptor;
