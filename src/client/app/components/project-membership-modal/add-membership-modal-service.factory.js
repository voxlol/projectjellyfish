(function() {
  'use strict';

  angular.module('app.components')
    .factory('ProjectMembership', ProjectMembershipFactory);

  /** @ngInject */
  function ProjectMembershipFactory($modal, Group, Role) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal(listMembership, editMembership) {
      var modalOptions = {
        templateUrl: 'app/components/project-membership-modal/add-membership-modal.html',
        controller: AddMembershipModalController,
        controllerAs: 'vm',
        resolve: {
          groups: resolveGroups,
          roles: resolveRoles,
          editMembership: resolveEditMembership,
          listMembership: resolveListMembership

        },
        windowTemplateUrl: 'app/components/project-membership-modal/add-membership-modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveListMembership() {
        return listMembership;
      }

      function resolveEditMembership() {
        return editMembership;
      }

      function resolveGroups() {
        return Group.query().$promise;
      }

      function resolveRoles() {
        return Role.query().$promise;
      }
    }
  }

  /** @ngInject */
  function AddMembershipModalController($stateParams, groups, roles, listMembership, editMembership, Membership,
                                        lodash, Toasts) {
    var vm = this;

    vm.groups = groups;
    vm.currentMembership = editMembership || new Membership();
    vm.roles = roles;
    vm.onSubmit = onSubmit;
    vm.listMembership = listMembership;
    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;

    activate();

    function activate() {
    }

    function onSubmit() {
      vm.showValidationMessages = true;

      if (vm.form.$valid) {
        if (vm.currentMembership.id) {
          vm.currentMembership.role_id = vm.selectedRole.id;
          vm.updateMembership = new Membership();
          vm.updateMembership.role_id = vm.selectedRole.id;
          vm.updateMembership.$update({
              projectId: vm.currentMembership.project_id,
              groupId: vm.currentMembership.group_id
            },
            updateSuccess, updateFailure);
        } else if (!vm.currentMembership.id) {
          if (lodash.result(lodash.find(vm.listMembership, 'group_id', vm.selectedGroup.id), 'group_id')) {
            Toasts.error('Group selected is already associated with project.');
          } else {
            vm.currentMembership.project_id = $stateParams.projectId;
            vm.currentMembership.group_id = vm.selectedGroup.id;
            vm.currentMembership.role_id = vm.selectedRole.id;
            vm.currentMembership.$save({projectId: $stateParams.projectId}, saveSuccess, saveFailure);
          }
        }
      }

      function saveSuccess() {
        vm.listMembership.push(vm.currentMembership);
        Toasts.toast('Group successfully added.');
      }

      function saveFailure() {
        Toasts.error('Server returned an error while saving.');
      }

      function updateSuccess() {
        Toasts.toast('Group successfully updated.');
      }

      function updateFailure() {
        Toasts.error('Server returned an error while updating.');
      }
    }

    function showErrors() {
      return vm.showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return vm.showValidationMessages && vm.form.$invalid;
      }

      return vm.showValidationMessages && vm.form[field].$invalid;
    }
  }
})
();
