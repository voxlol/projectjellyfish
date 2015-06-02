(function () {
  'use strict';

  angular.module('app.resources')
    .factory('ProductCategory', ProductCategoryFactory);

  /** @ngInject */
  function ProductCategoryFactory($resource, ApiService) {
    // var ProductCategory = $resource(ApiService.routeResolve('productsById'), {id: '@id'}, {});

    return [{id: 1, name: 'Databases', tags: ['database', 'relational', 'nosql', 'sql']},
      {id: 2, name: 'Infrastructure', tags: ['server', 'compute', 'storage', 'files']},
      {id: 3, name: 'Platform', tags: ['api', 'server', 'application']}];
  }
})();
