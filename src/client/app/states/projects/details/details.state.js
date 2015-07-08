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
          staff: resolveStaff,
          groups: resolveGroups,
          roles: resolveRoles
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
  function resolveGroups(Group) {
    return Group.query().$promise;
  }

  /** @ngInject */
  function resolveRoles(Role) {
    return Role.query().$promise;
  }

  /** @ngInject */
  function StateController($state, lodash, project, products, ProjectGroup, Toasts, Membership, groups, roles) {
    var vm = this;

    vm.title = 'Project Details';
    vm.project = project;
    vm.products = products;
    vm.groups = groups;
    vm.roles = roles;

    vm.activate = activate;
    vm.openAddGroup = openAddGroup;
    vm.approve = approve;
    vm.reject = reject;
    vm.groupToAdd = {};

    activate();

    function activate() {
      // Temporary! Merge products onto services
      tempMergeProductsOntoServices();
      vm.project.group_ids = lodash.pluck(vm.project.groups, 'id');
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
      ProjectGroup.showModal().then(updateGroups);

      function updateGroups(membership) {
        vm.project.group_ids = [];
        vm.membership = new Membership();
        vm.groupToAdd = membership.group;
        vm.roleToAdd = membership.role;
        if (lodash.result(lodash.find(vm.project.groups, 'id', vm.groupToAdd.id), 'id')) {
          Toasts.error('Group already associated with this project.');
        } else {
          vm.membership.project_id = vm.project.id;
          vm.membership.group_id = vm.groupToAdd.id;
          vm.membership.role_id = vm.roleToAdd.id;
          vm.project.group_ids.push(vm.groupToAdd.id);
          vm.membership.$save({projectId: vm.project.id}, saveMembershipSuccess, saveMembershipFailure);
          vm.project.$update(updateSuccess, updateFailure);
        }
      }

      function saveMembershipSuccess() {
      }

      function saveMembershipFailure() {
      }

      function updateSuccess() {
        Toasts.toast('Group successfully added.');
        vm.project.groups.push(vm.groupToAdd);
      }

      function updateFailure() {
        Toasts.error('Server returned an error while updating.');
      }
    }
  }
})
();
