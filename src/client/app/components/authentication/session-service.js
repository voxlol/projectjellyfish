(function() {
  'use strict';

  angular.module('app.components')
    .service('SessionService', SessionService);

  /* @ngInject */
  function SessionService() {
    var vm = this;

    vm.create = function(email, role) {
      vm.email = email;
      vm.role = role;
    };
    vm.destroy = function() {
      vm.email = null;
      vm.role = null;
    };

    return vm;
  }
})();
