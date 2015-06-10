(function() {
  'use strict';

  angular.module('app.components').config(projectFormDecorator);

  /** @ngInject */
  function projectFormDecorator(schemaFormDecoratorsProvider) {
    var base = 'app/components/project-form/controls/';

    schemaFormDecoratorsProvider.createDecorator('projectFormDecorator', {
      select: base + 'select.html',
      textarea: base + 'textarea.html',
      'default': base + 'default.html'
    }, []);
  }
})();
