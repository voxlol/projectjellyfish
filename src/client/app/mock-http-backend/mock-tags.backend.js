(function() {
  'use strict';

  angular.module('mock')
    .factory('MockTag', MockTagFactory)
    .run(mock);

  /** @ngInject */
  function mock($httpBackend, MockHelper, MockTag) {
    $httpBackend.whenGET(/\/api\/tags\/\d+/).respond(getTag);
    $httpBackend.whenGET(/\/api\/tags\/grouped/).respond(getGroupedTags);
    $httpBackend.whenGET(/\/api\/tags(\?limit=\w+)?/).respond(getTags);

    function getTag(method, url, data) {
      var id = url.match(/\/tags\/(\d+)/)[1];

      return [200, MockTag.getTag(parseInt(id)), {}];
    }

    function getTags(method, url, data) {
      var parsedUrl = MockHelper.parseURL(url);
      var limit = parsedUrl.searchParams.limit;
      var q = parsedUrl.searchParams.q;
      var grouped = parsedUrl.searchParams.grouped;

      if (grouped) {
        return [200, MockTag.getGroupedTags(), {}];
      }

      return [200, MockTag.getTags(q, limit), {}];
    }

    function getGroupedTags(method, url, data) {
      var parsedUrl = MockHelper.parseURL(url);

      return [200, MockTag.getGroupedTags(), {}];
    }
  }

  /** @ngInject */
  function MockTagFactory(lodash) {
    var service = {
      getTag: getTag,
      getTags: getTags,
      getGroupedTags: getGroupedTags
    };

    return service;

    function getTag(id) {
      return lodash.find(data(), 'id', id);
    }

    function getTags(q, limit) {
      var list = data();
      var re = new RegExp('^' + lodash.escapeRegExp(q));

      if (q) {
        list = lodash.filter(list, checkQuery);
      }

      return list.slice(0, limit);

      function checkQuery(item) {
        return re.test(item.name);
      }
    }

    function getGroupedTags() {
      var list = {};
      var re = /[A-Z]/;

      data().forEach(groupTag);

      return list;

      function groupTag(tag) {
        var firstChar = tag.name.substring(0, 1).toUpperCase();

        if (!re.test(firstChar)) {
          firstChar = '#';
        }

        if (angular.isUndefined(list[firstChar])) {
          list[firstChar] = [];
        }

        list[firstChar].push(tag);
      }
    }

    function data() {
      var id = 1;

      return lodash.sortBy([
        {id: id++, name: 'aws', results: 9},
        {id: id++, name: 'azure', results: 1},
        {id: id++, name: 'database', results: 9},
        {id: id++, name: 'server', results: 5},
        {id: id++, name: 'development', results: 4},
        {id: id++, name: 'production', results: 4},
        {id: id++, name: 'mysql', results: 5},
        {id: id++, name: 'postgres', results: 5},
        {id: id++, name: 'postgresql', results: 5},
        {id: id++, name: 'relational', results: 6},
        {id: id++, name: 'sql', results: 6},
        {id: id++, name: 'rds', results: 6},
        {id: id++, name: 'ec2', results: 2},
        {id: id++, name: 'small', results: 3},
        {id: id++, name: 'medium', results: 3},
        {id: id++, name: 'large', results: 5},
        {id: id++, name: 'lamp', results: 2},
        {id: id++, name: 'php', results: 2},
        // No results
        {id: id++, name: 'nosql', results: 0},
        {id: id++, name: 'rackspace', results: 0},
        {id: id++, name: 'nodejs', results: 0},
        {id: id++, name: 'rails', results: 0},
        {id: id++, name: 'ios', results: 0},
        {id: id++, name: 'jira', results: 0}
      ], 'name');
    }
  }
})();
