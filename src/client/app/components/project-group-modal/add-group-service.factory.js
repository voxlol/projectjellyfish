(function() {
  'use strict';

  angular.module('app.components')
    .factory('ProjectGroup', ProjectGroupFactory);

  /** @ngInject */
  function ProjectGroupFactory($modal, Group, Role) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal(editMember) {
      var modalOptions = {
        templateUrl: 'app/components/project-group-modal/add-group-modal.html',
        controller: AddGroupModalController,
        controllerAs: 'vm',
        resolve: {
          groups: resolveGroups,
          roles: resolveRoles,
          editMembership: resolveEditMember
        },
        windowTemplateUrl: 'app/components/wizard/wizard-modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;


      function resolveEditMember() {
        return editMember;
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
  function AddGroupModalController(groups, roles, editMembership) {
    var vm = this;

    vm.groups = groups;
    vm.membership =  editMembership || '';
    vm.roles = roles;



    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;



    function showErrors() {
      return vm.showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return vm.showValidationMessages && vm.form.$invalid;
      }

      return vm.showValidationMessages && vm.form[field].$invalid;
    }

    activate();

    function activate() {
    }
  }
})();
