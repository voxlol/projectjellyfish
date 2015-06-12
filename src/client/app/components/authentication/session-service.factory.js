(function() {
  'use strict';

  angular.module('app.components')
    .factory('SessionService', SessionServiceFactory);

  /** @ngInject */
  function SessionServiceFactory() {
    var service = {
      create: create,
      destroy: destroy,
      fullName: fullName
    };

    destroy();

    return service;

    function create(id, firstName, lastName, email, role, updatedAt) {
      service.id = id;
      service.firstName = firstName;
      service.lastName = lastName;
      service.email = email;
      service.role = role;
      service.updatedAt = updatedAt;
    }

    function destroy() {
      service.id = null;
      service.firstName = null;
      service.lastName = null;
      service.email = null;
      service.role = null;
      service.updatedAt = null;
    }

    // Helpers

    function fullName() {
      return [service.firstName, service.lastName].join(' ');
    }
  }
})();
