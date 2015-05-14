(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'authed.admin.products': {
        url: '/products',
        redirectTo: 'admin.products.list',
        template: '<ui-view></ui-view>',
        resolve: {
          catalog: resolveCatalog,
          productTypes: resolveProductTypes
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.products': {
        type: 'state',
        state: 'authed.admin.products',
        label: 'Products',
        order: 1
      }
    };
  }

  /** @ngInject */
  function resolveCatalog(CatalogService) {
    return CatalogService.getCatalog([]);
  }

  /** @ngInject */
  function resolveProductTypes(ProductType) {
    return ProductType.query().$promise;
  }
})();
