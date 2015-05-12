(function() {
  'use strict';

  angular.module('broker.wizard')
    .factory('questions', questions);

  function questions(WizardQuestionsResource) {
    return {
      next: next,
    }

    function next(currentQuestion) {
      return WizardQuestionsResource
        .get({ id: currentQuestion.next_question_id })
        .$promise;
    }
  };
}());
