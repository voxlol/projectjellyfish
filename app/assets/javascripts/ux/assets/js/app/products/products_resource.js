'use strict';

/**@ngInject*/
var ProductsResource = function($resource, apiResource) {
  return $resource(apiResource('productsById'), {'id': '@id'}, {
    'update': {
      method: 'PUT',
      //TODO: This is likely temporary. When the product form gets refactored we will probably rework this.
      url: apiResource('manageIqProductsById')
    },
    'save': {
      method: 'POST',
      //TODO: This is likely temporary. When the product form gets refactored we will probably rework this.
      url: apiResource('manageIqProductsById')
    }
  });
};

window.ProductsResource = ProductsResource;
