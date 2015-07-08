(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Membership', MembershipFactory);

  /** @ngInject */
  function MembershipFactory($resource) {
    var Membership = $resource('/api/v1/projects/:projectId/groups/:groupId',
      {projectId: '@projectId', groupId: '@groupId'}, {});

    Membership.defaults = {
      project_id: 0,
      group_id: 0,
      role_id: 0
    };

    Membership.new = newMembership;

    function newMembership() {
      return new Membership(angular.copy(Membership.defaults));
    }

    return Membership;
  }
})();
