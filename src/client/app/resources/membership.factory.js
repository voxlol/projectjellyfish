(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Membership', MembershipFactory);

  /** @ngInject */
  function MembershipFactory($resource) {
    var Membership = $resource('/api/v1/projects/:projectId/groups/:groupId',
      {projectId: '@projectId', groupId: '@groupId'}, {
        update: {
          method: 'PUT',
          isArray: false
        }
      });

    Membership.defaults = {
      project_id: null,
      group_id: null,
      role_id: null
    };

    Membership.new = newMembership;

    function newMembership() {
      return new Membership(angular.copy(Membership.defaults));
    }

    return Membership;
  }
})();
