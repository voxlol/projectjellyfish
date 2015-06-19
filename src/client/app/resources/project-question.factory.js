(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProjectQuestion', ProjectQuestionFactory);

  /** @ngInject */
  function ProjectQuestionFactory($resource) {
    var ProjectQuestion = $resource('/api/v1/project_questions/:id', {id: '@id'}, {
      update: {method: 'PUT'}
    });

    ProjectQuestion.defaults = {
      name: '',
      help: '',
      required: false,
      type: 'multiple',
      options: []
    };

    ProjectQuestion.optionDefaults = {
      option: '',
      include: [],
      exclude: [],
      position: 0
    };

    ProjectQuestion.new = newProjectQuestion;

    function newProjectQuestion() {
      return new ProjectQuestion(angular.copy(ProjectQuestion.defaults));
    }

    return ProjectQuestion;
  }
})();
