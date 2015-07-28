(function() {
  'use strict';

  angular.module('app.components')
    .service('$previousState', PreviousStateService);

  /** @ngInject */
  function PreviousStateService($rootScope, $state) {
    var previous = null;
    var lastPrevious = null;

    $rootScope.$on('$stateChangeStart', function(evt, toState, toStateParams, fromState, fromStateParams) {
      lastPrevious = previous;
      previous = {state: fromState, params: fromStateParams};
    });

    $rootScope.$on('$stateChangeError', function() {
      previous = lastPrevious;
      lastPrevious = null;
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      lastPrevious = null;
    });

    var $previousState = {
      get: function() {
        return previous;
      },
      go: function() {
        var to = $previousState.get();

        return $state.go(to.state, to.params);
      }
    };

    return $previousState;
  }

  angular.module('app.components').run(['$previousState', function($previousState) {
  }]);

  angular.module('app.components')
    .directive('backLink', BackLinkDirective);

  /** @ngInject */
  function BackLinkDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'app/components/back-link/back-link.html',
      controller: BackLinkController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function BackLinkController($previousState) {
      var vm = this;

      vm.activate = activate;
      vm.stateTransition = stateTransition;

      function activate() {
      }

      function stateTransition() {
        $previousState.go();
      }
    }
  }
})();
