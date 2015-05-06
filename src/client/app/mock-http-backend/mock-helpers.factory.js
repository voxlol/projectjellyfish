(function() {
  'use strict';

  angular.module('mock')
    .factory('MockHelper', MockHelperFactory);

  /** @ngInject */
  function MockHelperFactory() {
    var service = {
      parseURL: parseURL
    };

    return service;

    function parseURL(url) {
      var parser = document.createElement('a');
      var searchParams = {};
      var queries;
      var split;
      var i;
      var arrParam;

      // Let the browser do the work
      parser.href = url;
      // Convert query string to object
      queries = parser.search.replace(/^\?/, '').split('&');
      for (i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        // Convert foo[]=1&foo[]=2 to foo=[1,2]
        if (split[0].match(/%5B%5D$/)) {
          split[0] = split[0].substring(0, split[0].length - 6);
          if (typeof searchParams[split[0]] === 'undefined') {
            searchParams[split[0]] = [];
          }
          searchParams[split[0]].push(split[1]);
        } else {
          searchParams[split[0]] = split[1];
        }
      }

      return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchParams: searchParams,
        hash: parser.hash
      };
    }
  }
})();
