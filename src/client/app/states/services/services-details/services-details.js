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
      'services.details': {
        url: '/:serviceId',
        templateUrl: 'app/states/services/services-details/services-details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Service Details',
        resolve: {
          resolveService: resolveService
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
  function resolveService($stateParams, Service) {
    return Service.get({id: $stateParams.serviceId}).$promise;
  }


  /** @ngInject */
  function StateController($state, logger, resolveService, VIEW_MODES) {
    var vm = this;

    vm.title = 'Service Details';
    vm.service = resolveService;

    vm.viewMode = vm.viewMode || VIEW_MODES.list;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Service Details View');
    }
  }
})
();
