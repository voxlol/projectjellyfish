'use strict';

/**@ngInject*/
function EditProjectController($scope, $state, ProjectsResource, project, projectQuestions, FlashesService) {
  $scope.project = project;
  $scope.questions = projectQuestions;

  $scope.updateProject = function() {
    var filteredProject = _.omit($scope.project, 'created_at', 'updated_at', 'deleted_at', 'services', 'domain',
      'url', 'state', 'state_ok', 'problem_count', 'account_number', 'resources', 'icon', 'cpu', 'hdd', 'ram',
      'status', 'users', 'order_history', 'cc', 'staff_id', 'approved', 'project_answers');

    if ((typeof $scope.project.project_answers !== "undefined") && ($scope.project.project_answers.length > 0)) {
      filteredProject.project_answers = _.reduce($scope.project.project_answers,
        function(pas, pa) {
          pas.push(_.omit(pa, 'project_id', 'created_at', 'updated_at',
            'project_question'));
          return pas;
        }, []);
    }

    for (var prop in filteredProject)
    {
        if (filteredProject[prop] === null)
        {
            delete filteredProject[prop];
        }
    }
    ProjectsResource.update(filteredProject, function() {
        FlashesService.add({
            timeout: true,
            type: 'success',
            message: 'Successfully updated the project.'
        });
        $state.go('base.authed.project.view', {projectId: project.id}, {reload: true});
    },
    function() {
        FlashesService.add({
            timeout: true,
            type: 'error',
            message: 'Failed to update the project. Please try again.'
        });
    });
  };
}

EditProjectController.resolve = {
  /**@ngInject*/
  projectQuestions: function(ProjectQuestionsResource) {
    return ProjectQuestionsResource.query().$promise;
  }
};

window.EditProjectController = EditProjectController;
