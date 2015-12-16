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
      'manage.pages.edit': {
        url: '/edit/:id',
        templateUrl: 'app/states/manage/pages/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Pages Edit',
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
    if ($stateParams.id) {
      return ContentPage.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function StateController(logger, contentPageRecord, $stateParams) {
    var vm = this;

    vm.title = 'Admin Pages Edit';
    vm.contentPageRecord = contentPageRecord;
    vm.activate = activate;
    vm.home = 'manage.pages.list';
    vm.homeParams = { };

    activate();

    function activate() {
      logger.info('Activated Admin Pages Edit View');
    }
  }
})();
