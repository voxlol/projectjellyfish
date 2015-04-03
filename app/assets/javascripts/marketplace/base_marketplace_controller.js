'use strict';

function BaseMarketplaceController() {

}

BaseMarketplaceController.resolve = {
  /**@ngInject*/
  categories: function(ProductTypesResource) {
    return ProductTypesResource.query().$promise;
  },
  /**@ngInject*/
  products: function(ProductsResource) {
    return ProductsResource.query({active: true}).$promise;
  }
};

window.BaseMarketplaceController = BaseMarketplaceController;
