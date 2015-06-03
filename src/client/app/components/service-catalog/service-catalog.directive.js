(function() {
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
    function ServiceCatalogController(VIEW_MODES, $state, lodash) {
      var vm = this;

      vm.activate = activate;
      vm.goTo = goTo;
      vm.getServiceWithProduct = getServiceWithProduct;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.list;
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
        angular.forEach(vm.service, vm.getServiceWithProduct);
      }
      function goTo(id) {
        // $state.go('projects.details', {projectId: id});
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
    }
  }
})();
