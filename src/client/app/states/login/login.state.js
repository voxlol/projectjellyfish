(function() {
  'use strict';

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
        url: '/',
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

  /** @ngInject */
  function StateController(Motd) {
    var vm = this;

    vm.title = 'Login';
    vm.resolveMotd = resolveMotd;
    activate();

    function activate() {
      vm.resolveMotd();
    }

    function resolveMotd() {
      Motd.query().$promise.then(assignResolved());

      function assignResolved(result) {
        vm.motd = result;
      }
    }
  }
})();
