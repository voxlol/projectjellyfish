'use strict';

/**@ngInject*/
var ProjectQuestionsResource = function($resource, apiResource) {
  return $resource(
    apiResource('projectQuestions'), {id: '@id'}, {
      query: {
        method: 'GET',
        isArray: true
      }
    }
  );
};

window.ProjectQuestionsResource = ProjectQuestionsResource;
