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
          project: resolveProjects,
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
  function resolveProjects($stateParams, Project) {
    return Project.get({
      id: $stateParams.projectId,
      'includes[]': ['alerts', 'approvals', 'approvers', 'services', 'memberships', 'groups', 'project_answers']
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
  function StateController($state, lodash, logger, project, products, VIEW_MODES, AddGroup, Toasts, $stateParams) {
    var vm = this;

    vm.title = 'Project Details';
    vm.project = project;
    vm.products = products;

    vm.viewMode = vm.viewMode || VIEW_MODES.list;

    vm.activate = activate;
    vm.openAddGroup = openAddGroup;
    vm.approve = approve;
    vm.reject = reject;
    vm.groupToAdd = {};


    // todo: create alert service to poll
    // vm.alerts = lodash.filter(alerts, function(alert) {
    //  return alert.project_id == vm.project.project_id;
    // });

    activate();

    function activate() {
      // Temporary! Merge products onto services
      tempMergeProductsOntoServices();
      logger.info('Activated Project Details View');
    }

    function approve() {
      $state.reload();
    }

    function reject() {
      $state.transitionTo('projects.list');
    }

    // Private

    function tempMergeProductsOntoServices() {
      angular.forEach(vm.project.services, mergeOnProduct);

      function mergeOnProduct(service) {
        service.product = lodash.find(products, findProduct);

        function findProduct(product) {
          return product.id === service.product_id;
        }
      }
    }

    function openAddGroup() {
      AddGroup.showModal().then(updateGroups);

      function updateGroups(group) {
        vm.groupToAdd = group;
        console.log(vm.groupToAdd)

        if(vm.project.groups === undefined){
          Array.prototype.push.apply(vm.project.group, vm.groupToAdd);
          vm.project.$update(saveSuccess, saveFailure);
        }else if (lodash.result(lodash.find(vm.project.groups, {'id': vm.groupToAdd.id}), 'id')) {
          Toasts.error('Group already associated with project.')
        } else {

        }
      }

      function saveSuccess() {
        Toasts.toast('Project Groups Updated.');
        $state.go(project.details, {id: $stateParams.projectId});
      }

      function saveFailure() {
        Toasts.error('Server returned an error while updating.');
      }
    }
  }
})
();
