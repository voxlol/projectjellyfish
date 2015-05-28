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
      'projects.details': {
        url: '/:projectId',
        templateUrl: 'app/states/projects/projects-details/projects-details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Details',
        resolve: {
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
  function resolveProjects($stateParams, Projects) {
    return Projects.get({
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
  function StateController($state, logger, projectDetails, products, lodash) {
    var vm = this;

    vm.title = 'Project Details';
    vm.project = projectDetails;
    vm.products = products;

    vm.activate = activate;
    vm.approve = approve;
    vm.reject = reject;

    // todo: create alert service to poll
    // vm.alerts = lodash.filter(alerts, function(alert) {
    //  return alert.project_id == vm.project.project_id;
    // });

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
