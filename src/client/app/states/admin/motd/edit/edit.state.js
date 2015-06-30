(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.motd.edit': {
        url: '/motd/edit',
        templateUrl: 'app/states/admin/motd/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Edit MOTD',
        resolve: {
          motd: resolveMotd
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveMotd() {
    return;
  }

  /** @ngInject */
  function StateController(logger, motd) {
    var vm = this;

    vm.title = 'Edit the Message of the Day';
    vm.backToDash = backToDash;
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Edit Message of the Day View');
    }

    function backToDash(){};
  }
})();
