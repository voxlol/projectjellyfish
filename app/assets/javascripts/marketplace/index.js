//= require_tree .
'use strict';

var BaseData = BaseMarketplaceController.resolve,
  MarketplaceData = MarketplaceController.resolve,
  ShowProductData = ShowProductController.resolve;

var MarketplaceModule = angular.module('broker.marketplace', [])
  .controller('BaseMarketplaceController', BaseMarketplaceController)
  .controller('MarketplaceController', MarketplaceController)
  .controller('ShowProductController', ShowProductController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.marketplace', {
          url: '/marketplace',
          abstract: true,
          template: '<div class="ui-view marketplace"></div>',
          resolve: BaseData,
          controller: 'BaseMarketplaceController as baseMarketplaceCtrl'
        })
        // marketplace
        .state('base.authed.marketplace.list', {
          url: "/list",
          templateUrl: "/templates/partials/marketplace/marketplace.html",
          resolve: MarketplaceData,
          controller: "MarketplaceController as marketplaceCtrl"
        })
        .state('base.authed.marketplace.show', {
          url: '/show/{id:int}',
          templateUrl: '/templates/partials/marketplace/product.html',
          controller: 'ShowProductController as showCtrl',
          resolve: ShowProductData
        });
    }
  );
window.MarketplaceModule = MarketplaceModule;
