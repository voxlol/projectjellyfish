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
      'admin.cms.list': {
        url: '', // No url, this state is the index of admin.cms
        templateUrl: 'app/states/admin/cms/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin CMS List',
        resolve: {
          pages: resolvePages
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
  function resolvePages(ContentPage) {
    return ContentPage.query().$promise;
  }

  /** @ngInject */
  function StateController(lodash, logger, $q, $state, pages, Toasts) {
    var vm = this;

    vm.title = 'Admin CMS List';
    vm.pages = pages;

    vm.activate = activate;
    vm.goTo = goTo;

    activate();

    function activate() {
      logger.info('Activated Admin CMS List View');
    }

    function goTo(id) {
      $state.go('admin.cms.create', {alertId: id});
    }

    vm.deletePage = deletePage;

    function deletePage(page) {
      alert('To be implemented!');
    }
  }
})();
