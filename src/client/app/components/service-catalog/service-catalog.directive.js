(function () {
  'use strict';

  angular.module('app.components')
    .directive('serviceCatalog', ServiceCatalogDirective);

  /** @ngInject */
  function ServiceCatalogDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        service: '=',
        viewMode: '=?',
        collapsed: '=?',
        products: '='
      },
      link: link,
      templateUrl: 'app/components/service-catalog/service-catalog.html',
      controller: ServiceCatalogController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ServiceCatalogController(VIEW_MODES, $state, lodash, OrderItems, logger) {
      var vm = this;

      vm.activate = activate;
      vm.goTo = goTo;
      vm.getServiceWithProduct = getServiceWithProduct;
      vm.deleteService = deleteService;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.list;
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
        angular.forEach(vm.service, vm.getServiceWithProduct);
      }

      function goTo(serviceId, projectId) {
        if (projectId) {
          $state.go('services.create', {serviceId: serviceId, projectId: projectId});
        } else {
          $state.go('services.details', {serviceId: serviceId, projectId: projectId});
        }
      }

      function getServiceWithProduct(serviceObject) {
        vm.productId = serviceObject.product_id;
        vm.product = lodash.find(vm.products, function (obj) {
          return obj.id === vm.productId;
        });
        serviceObject.img = vm.product.img;
        serviceObject.name = vm.product.name;
        serviceObject.description = vm.product.description;

        return serviceObject;
      }

      function deleteService(serviceId, orderId) {
        vm.orderId = orderId;
        vm.serviceId = serviceId;

        OrderItems.delete({id: vm.serviceId, order_id: vm.orderId}).$promise.then(handleResults);

        function handleResults(results) {
          console.log(results);
          logger.info("Service was removed.");
          $state.reload();
        };
      }
    }
  }
})();
