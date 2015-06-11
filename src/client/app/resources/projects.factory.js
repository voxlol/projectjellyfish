(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Project', ProjectsFactory);

  /** @ngInject */
  function ProjectsFactory($resource, lodash) {
    var vm = this;
    var Projects = $resource('/api/v1/projects/:id', {id: '@id'}, {
      'query': {
        method: 'GET',
        params: {
          'methods[]': ['domain', 'url', 'problem_count', 'account_number',
            'resources', 'resources_unit', 'status', 'monthly_spend']
        },
        isArray: true
      },
      'get': {
        method: 'GET',
        params: {
          'methods[]': ['domain', 'url', 'problem_count', 'account_number',
            'resources', 'resources_unit', 'status', 'monthly_spend', 'order_history']
        }
      },
      'update': {method: 'PUT'},
      'approve': {
        url: '/api/v1/projects/:id/approve',
        method: 'POST',
        params: {'includes[]': ['approvals', 'approvers']}
      },
      'reject': {
        url: '/api/v1/projects/:id/reject',
        method: 'DELETE',
        params: {'includes[]': ['approvals', 'approvers']}
      },
      'approvals': {
        url: '/api/v1/projects/:id/approvals',
        method: 'GET',
        isArray: true
      }
    });

    Projects.prototype.isApproved = function() {
      return vm.approval === 'approved';
    };

    vm.finalApproval = lodash.memoize(function(approvals, approvers) {
      var approval = approvals[approvals.length - 1];
      if (approvers) {
        lodash.each(approvers, function(approver) {
          if (approver.id === approval.staff_id) {
            approval.staff_name = [approver.first_name, approver.last_name].join(' ');
          }
        });
      }

      return approval;
    });

    Projects.prototype.finalApproval = function() {
      if ((typeof vm.approvals === 'undefined') || (0 === vm.approvals.length)) {
        return null;
      }

      return vm.finalApproval(vm.approvals, vm.approvers);
    };

    return Projects;
  }
})();
