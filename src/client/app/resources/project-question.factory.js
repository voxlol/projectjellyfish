(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProjectQuestion', ProjectQuestionFactory);

  /** @ngInject */
  function ProjectQuestionFactory($resource) {
    var ProjectQuestion = $resource('/api/project_questions/:id', {id: '@id'}, {
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
      load_order: 0
    };

    return ProjectQuestion;
  }
})();
