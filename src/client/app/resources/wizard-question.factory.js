(function() {
  'use strict';

  angular.module('app.resources')
    .factory('WizardQuestion', WizardQuestionFactory);

  /** @ngInject */
  function WizardQuestionFactory($resource) {
    var vm = this;
    var WizardQuestion = $resource('/api/v1/wizard_questions', {
      id: '@id',
      'includes[]': ['wizard_answers']
    }, {
      update: { method: 'PUT' }
    });

    WizardQuestion.prototype.next = function() {
      if (this.next_question_id) {
        return WizardQuestion
          .get({ id: this.next_question_id })
          .$promise;
      }
    };

    return WizardQuestion;
  }
})();
