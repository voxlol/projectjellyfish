(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Log', LogFactory);

  /** @ngInject */
  function LogFactory($resource) {
    var Log = $resource('/api/v1/logs/:type/:id' , {id: '@id', type: '@type'}, {

    });

    Log.defaults = {
      log_level: '',
      message: '',
      loggable_type: null,
      loggable_id: null
    };

    Log.new = newLog;

    function newLog(data) {
      return new Log(angular.extend({}, Log.defaults, data || {}));
    }

    return Log;
  }
})();
