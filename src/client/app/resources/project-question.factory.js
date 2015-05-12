(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProjectQuestion', ProjectQuestionFactory);

  /** @ngInject */
  function ProjectQuestionFactory($resource, ApiService) {
    var ProjectQuestion = $resource(ApiService.routeResolve('projectQuestions'), {id: '@id'}, {
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
