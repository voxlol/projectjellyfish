'use strict';

var _ = require('lodash');

/**@ngInject*/
function NewProjectQuestionController($scope, $state, ProjectQuestion, FlashesService) {
  $scope.projectQuestion = {};

  $scope.submitProject = function() {
    ProjectQuestion.save($scope.projectQuestion.options ? $scope.projectQuestion : _.omit($scope.projectQuestion, 'options'), function() {
        FlashesService.add({
            timeout: true,
            type: 'success',
            message: 'Project question successfully added.'
        });
        $state.go('base.authed.admin.projects.project_questions', {}, {reload: true});
    }, function () {
        FlashesService.add({
            timeout: true,
            type: 'error',
            message: 'Failed adding project question. Please try again later.'
        });
    });
  };
}

module.exports = NewProjectQuestionController;
