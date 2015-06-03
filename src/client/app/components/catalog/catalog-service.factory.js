(function() {
  'use strict';

  angular.module('app.components')
    .factory('CatalogService', CatalogServiceFactory);

  /** @ngInject */
  function CatalogServiceFactory($q, ProductType, Product, lodash) {
    var service = {
      getCatalog: getCatalog
    };

    return service;

    function getCatalog(tags) {
      var categories = [];
      var products = [];
      var deferred = $q.defer();

      $q.all([
        ProductType.query().$promise,
        Product.query({'tags[]': tags}).$promise
      ]).then(buildProductLists);

      return deferred.promise;

      function buildProductLists(results) {
        categories = results[0];
        products = results[1];
        console.log(categories);
        console.log(products);
        categories.forEach(filterProductsForCategory);
        deferred.resolve(categories);
      }

      function filterProductsForCategory(category) {
        category.products = lodash.filter(products, checkTags);

        function checkTags(item) {
          return lodash.intersection(category.tags, item.tag_list).length > 0;
        }
      }
    }
  }
})();
