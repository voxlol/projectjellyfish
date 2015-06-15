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
      'admin.alerts.create': {
        url: '/create/:id',
        templateUrl: 'app/states/admin/alerts/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts Create',
        resolve: {
          alertToEdit: resolveAlert,
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
  function resolveAlert($stateParams, Alert) {
    if ($stateParams.id) {
      return Alert.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember().$promise;
  }

  /** @ngInject */
  function StateController($scope, $state, logger, alertToEdit, $stateParams, Alert, Toasts, staff, lodash) {
    var vm = this;

    vm.title = 'Admin Alerts Create';
    vm.alertToEdit = alertToEdit;
    vm.activate = activate;
    vm.editing = $stateParams.id ? true : false;

    activate();

    var showValidationMessages = false;
    var home = 'admin.alerts.list';
    vm.format = 'yyyy-MM-dd';
    vm.filteredProject = lodash.omit(vm.alertToEdit, 'created_at', 'updated_at', 'deleted_at');
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 0,
      showWeeks: false
    };

    vm.activate = activate;
    activate();

    vm.backToList = backToList;
    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;
    vm.onSubmit = onSubmit;
    vm.openStart = openStart;
    vm.openEnd = openEnd;
    vm.openAnswerDate = openAnswerDate;

    function activate() {
      if (vm.editing) {
        vm.alertToEdit.staff_id = String(vm.alertToEdit.staff_id);
      } else {
        vm.alertToEdit.project_id = '0';
        vm.alertToEdit.order_item_id = '0';
        vm.alertToEdit.staff_id = String(staff.id);
      }
      logger.info('Activated Admin Alerts Create View');
    }

    function backToList() {
      $state.go(home);
    }

    function showErrors() {
      return showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return showValidationMessages && vm.form.$invalid;
      }

      return showValidationMessages && vm.form[field].$invalid;
    }

    function onSubmit() {
      showValidationMessages = true;
      // This is so errors can be displayed for 'untouched' angular-schema-form fields
      $scope.$broadcast('schemaFormValidate');
      if (vm.form.$valid) {
        if (vm.editing) {
          for (var prop in vm.alertToEdit) {
            if (vm.filteredProject[prop] === null) {
              delete vm.filteredProject[prop];
            }
          }
          Alert.update(vm.filteredProject).$promise.then(saveSuccess, saveFailure);

          return false;
        } else {
          Alert.save(vm.alertToEdit).$promise.then(saveSuccess, saveFailure);

          return false;
        }
      }

      function saveSuccess() {
        Toasts.toast('Alert saved.');
        $state.go(home);
      }

      function saveFailure() {
        Toasts.error('Server returned an error while saving.');
      }
    }

    function openStart($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.openedStart = true;
    }

    function openEnd($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.openedEnd = true;
    }

    function openAnswerDate($event, index) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.startDateOpened = false;
      vm.endDateOpened = false;
      vm.answerDateOpened = [];
      vm.answerDateOpened[index] = true;
    }
  }
})();
