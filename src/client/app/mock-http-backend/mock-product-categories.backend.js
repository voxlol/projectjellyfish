(function() {
  'use strict';

  angular.module('mock')
    .factory('MockProductCategory', MockProductCategoryFactory)
    .run(mock);

  /** @ngInject */
  function mock($httpBackend, MockHelper, MockProductCategory) {
    $httpBackend.whenGET(/\/api\/product_categories\/\d+/).respond(getProductCategory);
    $httpBackend.whenGET(/\/api\/product_categories(?:\?.+)?/).respond(getProductCategories);

    function getProductCategory(method, url, data) {
      var id = url.match(/\/product_categories\/(\d+)/)[1];

      return [200, MockProductCategory.getProductCategory(parseInt(id)), {}];
    }

    function getProductCategories(method, url, data) {
      var parsedUrl = MockHelper.parseURL(url);
      var limit = parsedUrl.searchParams.limit;
      var tags = parsedUrl.searchParams.tags || [];

      return [200, MockProductCategory.getProductCategories(tags, limit), {}];
    }
  }

  /** @ngInject */
  function MockProductCategoryFactory(lodash) {
    var service = {
      getProductCategory: getProductCategory,
      getProductCategories: getProductCategories
    };

    return service;

    function getProductCategory(id) {
      return lodash.find(data(), 'id', id);
    }

    function getProductCategories(tags, limit) {
      var list = data();

      if (tags.length > 0) {
        list = lodash.filter(list, tagFilter);
      }

      return list.slice(0, limit);

      function tagFilter(item) {
        return lodash.intersection(tags, item.tags).length > 0;
      }
    }

    function data() {
      var id = 1;

      return [
        {id: id++, name: 'Databases', tags: ['database', 'relational', 'nosql', 'sql']},
        {id: id++, name: 'Infrastructure', tags: ['server', 'compute', 'storage', 'files']},
        {id: id++, name: 'Platform', tags: ['api', 'server', 'application']}
      ];
    }
  }
})();
