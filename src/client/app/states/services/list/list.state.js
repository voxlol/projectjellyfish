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
          service: resolveService,
          products: resolveProducts
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
  function resolveService(Service) {
    return Service.query().$promise;
  }

  /** @ngInject */
  function resolveProducts(Product) {
    return Product.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, service, VIEW_MODES, products, lodash, $state) {
    /* jshint validthis: true */
    var vm = this;

    vm.services = service;
    vm.products = products;

    vm.activate = activate;
    vm.title = 'Services';
    vm.goTo = goTo;
    vm.getServiceWithProduct = getServiceWithProduct;
    vm.viewMode = VIEW_MODES.list;

    activate();

    function activate() {
      logger.info('Activated Service View');
      angular.forEach(vm.services, vm.getServiceWithProduct);
    }

    function getServiceWithProduct(serviceObject) {
      vm.productId = serviceObject.product_id;
      vm.product = lodash.find(vm.products, function(obj) {
        return obj.id === vm.productId;
      });
      serviceObject.img = vm.product.img;
      serviceObject.name = vm.product.name;
      serviceObject.description = vm.product.description;

      return serviceObject;
    }

    function goTo(serviceId, productId) {
       $state.go('services.details', {serviceId: serviceId, productId: productId});
    }
  }
})();
