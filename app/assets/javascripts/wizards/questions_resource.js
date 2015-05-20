(function() {
  'use strict';

  angular.module('broker.wizard')
    .factory('WizardQuestionsResource', function($resource, apiResource) {
      return $resource(apiResource('wizardQuestions'), {
        id: '@id',
        'includes[]': ['wizard_answers']
      });
    });
}());
