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
      'services.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/services/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Services',
        resolve: {
          services: resolveServices
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
    };
  }

  /** @ngInject */
  function resolveServices(Service) {
    return Service.query({'includes[]': ['product', 'project', 'latest_alert']}).$promise;
  }

  ///** @ngInject */
  //function resolveProducts(Product) {
  //  return Product.query().$promise;
  //}

  /** @ngInject */
  function StateController(logger, services, lodash, $state) {
    /* jshint validthis: true */
    var vm = this;

    vm.services = services;

    vm.activate = activate;
    vm.title = 'Services';
    vm.goTo = goTo;

    activate();

    function activate() {
      logger.info('Activated Service View');

      vm.projects = lodash.map(lodash.groupBy(services, 'project_id'), buildProjectHash);
      console.log(vm.projects)
    }

    function buildProjectHash(value) {
      return {
        project: value[0].project,
        services: lodash.map(value, appendProperties)
      };

      // Useful for making properties available for sorting
      function appendProperties(service) {
        service.product_name = service.product.name;
        return service;
      }
    }

    function goTo(serviceId, productId) {
       $state.go('services.details', {serviceId: serviceId, productId: productId});
    }
  }
})();
