(function() {
  'use strict';

  angular.module('app.components')
    .constant('WIZARD_AUTOSUBMIT', angular.element('meta[name="wizard-autosubmit"]').attr('content') === 'true')
    .constant('WIZARD_MULTIPAGE', angular.element('meta[name="wizard-multipage"]').attr('content') === 'true');
})();
