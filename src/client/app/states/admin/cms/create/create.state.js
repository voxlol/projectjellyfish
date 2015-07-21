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
      'admin.cms.create': {
        url: '/create',
        templateUrl: 'app/states/admin/cms/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin CMS Create',
        resolve: {
          alertRecord: resolveAlert,
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
    //if ($stateParams.id) {
    //  return Alert.get({id: $stateParams.id}).$promise;
    //} else {
    //  return {};
    //}
    return {};
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember().$promise;
  }

  /** @ngInject */
  function StateController(logger, alertRecord, $stateParams, staff) {
    var vm = this;

    vm.title = 'Admin Alerts Create';
    vm.alertRecord = alertRecord;
    vm.activate = activate;
    vm.staffId = staff.id;
    vm.home = 'admin.cms.list';
    vm.homeParams = { };

    // HARD CODED FOR SINGLE TENANT
    vm.alertableType = 'Organization';
    vm.alertableId = '1';

    activate();

    function activate() {
      logger.info('Activated Admin Alerts Create View');
    }
  }
})();
