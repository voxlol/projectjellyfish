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
  function StateController() {
    var vm = this;

    vm.title = 'Login';
    vm.motd = 'Jellyfish or jellies are the major non-polyp form of individuals of the phylum Cnidaria. ' +
      'They are typified as free-swimming marine animals consisting of a gelatinous umbrella-shaped bell ' +
      'and trailing tentacles.';
    activate();

    function activate() {
    }
  }
})();
