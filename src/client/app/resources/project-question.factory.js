(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProjectQuestion', ProjectQuestionFactory);

  /** @ngInject */
  function ProjectQuestionFactory($resource) {
    var ProjectQuestion = $resource('/api/v1/project_questions/:id' , {id: '@id'}, {
      'update': {
        method: 'PUT',
        isArray: false
      },
      'reposition': {
        method: 'PUT',
        url: '/api/v1/project_questions/:id/reposition',
        isArray: false
      }
    });

    ProjectQuestion.defaults = {
      name: '',
      help: '',
      required: false,
      field_type: 'yes_no',
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
