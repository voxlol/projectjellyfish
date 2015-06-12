(function () {
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
        templateUrl: 'app/states/services/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Service Details',
        resolve: {
          service: resolveService
        }
      }
    }
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveService(Service, $stateParams) {
    return Service.get({id: $stateParams.serviceId}).$promise;
  }

  /** @ngInject */
  function StateController(logger, service, Alerts,Project, VIEW_MODES, $stateParams, Product) {
    var vm = this;

    vm.title = 'Service Details';

    vm.viewMode = vm.viewMode || VIEW_MODES.list;
    vm.serviceId = $stateParams.serviceId;
    vm.service = service;
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Service Details View');
      resolveProject();
      resolveProduct();
      if(vm.service.latest_alert_id){
        resolveAlerts();
      }
    }

    function resolveProject(){
      Project.get({id: vm.service.project_id}).$promise.then(function(result){
        vm.project = result;
      })
    }

    function resolveProduct(){
     Product.get({id: vm.service.product_id}).$promise.then(function(result){
       vm.product = result;
     })
    }

    function resolveProduct(){
      Product.get({id: vm.service.product_id}).$promise.then(function(result){
        vm.product = result;
      })
    }

    function resolveAlerts(){
      Alerts.get({id: vm.service.latest_alert_id}).$promise.then(function(result){
        vm.alert = result;
      })
    }
  }
})
();
