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
      'manage.pages.create': {
        url: '/create',
        templateUrl: 'app/states/manage/pages/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Pages Create',
        resolve: {
          contentPageRecord: resolveContentPage
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
  function resolveContentPage($stateParams, ContentPage) {
    return new ContentPage();
  }

  /** @ngInject */
  function StateController(logger, contentPageRecord, $stateParams) {
    var vm = this;

    vm.title = 'Admin Pages Create';
    vm.contentPageRecord = contentPageRecord;
    vm.activate = activate;
    vm.home = 'manage.pages.list';
    vm.homeParams = { };

    activate();

    function activate() {
      logger.info('Activated Admin Pages Create View');
    }
  }
})();
