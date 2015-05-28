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
      'projects.details': {
        url: '/:projectId',
        templateUrl: 'app/states/projects/projects-details/projects-details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Details',
        resolve: {
          projectDetails: resolveProjects,
          products: resolveProducts,
          alerts: resolveAlerts
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
  function resolveAlerts($stateParams, Alerts) {
    return Alerts.get({id: $stateParams.projectId}).$promise;
  }

  /** @ngInject */
  function resolveProjects($stateParams, Projects) {
    return Projects.get({id: $stateParams.projectId}).$promise;
  }

  /** @ngInject */
  function resolveProducts(Product) {
    return Product.query().$promise;
  }

  /** @ngInject */
  function StateController($state, logger, projectDetails, products, alerts) {
    var vm = this;

    vm.title = 'Project Details';
    vm.project = projectDetails;
    vm.products = products;
    vm.alerts = alerts;

    vm.activate = activate;
    vm.approve = approve;
    vm.reject = reject;

    activate();

    function activate() {
      logger.info('Activated Project Details View');
    }

    function approve(project) {
      project.$approve();
      $state.reload();
    }

    function reject(project, reason) {
      project.$reject({reason: reason});
      $state.transitionTo('projects.list');
    }
  }
})();
