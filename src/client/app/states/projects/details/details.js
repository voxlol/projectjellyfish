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
        templateUrl: 'app/states/projects/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Details',
        resolve: {
          alerts: resolveAlerts,
          projectDetails: resolveProjects,
          products: resolveProducts,
          staff: resolveStaff
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
  function resolveAlerts(Alerts) {
    return Alerts.query().$promise;
  }

  /** @ngInject */
  function resolveProjects($stateParams, Project) {
    return Project.get({
      id: $stateParams.projectId,
      'includes[]': ['approvals', 'approvers', 'services', 'memberships', 'groups', 'project_answers']
    }).$promise;
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember(
      {'includes[]': ['groups']}
    ).$promise;
  }

  /** @ngInject */
  function resolveProducts(Product) {
    return Product.query().$promise;
  }

  /** @ngInject */
  function StateController($state, logger, projectDetails, products, alerts, VIEW_MODES) {
    var vm = this;

    vm.alerts = alerts;
    vm.title = 'Project Details';
    vm.project = projectDetails;
    vm.products = products;

    vm.viewMode = vm.viewMode || VIEW_MODES.list;

    vm.activate = activate;
    vm.approve = approve;
    vm.reject = reject;

    vm.bRemaining = vm.project.budget - vm.project.spent;
    vm.bUtilization = Math.round((vm.project.spent / vm.project.budget) * 100, -1);
    vm.bTimeRemaining =  vm.project.monthly_spend ? Math.round(vm.bRemaining / vm.project.monthly_spend) : 0;

    // todo: create alert service to poll
    // vm.alerts = lodash.filter(alerts, function(alert) {
    //  return alert.project_id == vm.project.project_id;
    // });

    activate();

    function activate() {
      if (vm.bUtilization <= 60) {
        vm.bUtilizationType = 'success';
      } else if (vm.bUtilization > 60 && vm.bUtilization <= 80 ) {
        vm.bUtilizationType = 'warning';
      } else if (vm.bUtilization > 80 ) {
        vm.bUtilizationType = 'danger';
      }

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
})
();
