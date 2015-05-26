(function() {
  'use strict';

  angular.module('app.components')
    .service('SessionService', SessionService);

  /** @ngInject */
  function SessionService() {
    var vm = this;

    vm.create = function(id, firstName, lastName, email, role, updatedAt) {
      vm.id = id;
      vm.firstName = firstName;
      vm.lastName = lastName;
      vm.email = email;
      vm.role = role;
      vm.updatedAt = updatedAt;
    };
    vm.destroy = function() {
      vm.id = null;
      vm.firstName = null;
      vm.lastName = null;
      vm.email = null;
      vm.role = null;
      vm.updatedAt = null;
    };

    return vm;
  }
})();
