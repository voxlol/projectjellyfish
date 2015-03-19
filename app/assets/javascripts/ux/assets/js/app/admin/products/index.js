//= require_tree .
'use strict';

var ProductsData = ProductsAdminController.resolve,
    ProductsListData = ListProductsController.resolve,
    ProductEditData = EditProductController.resolve,
    ProductCreateData = CreateProductController.resolve;


var ProductsAdminModule = angular.module('broker.admin.products', [])
  .controller('ProductsAdminController', ProductsAdminController)
  .controller('ListProductsController', ListProductsController)
  .controller('EditProductController', EditProductController)
  .controller('CreateProductController', CreateProductController)
  .controller('ProductFormController', ProductFormController)
  .config(
    /**@ngInject*/
    function($stateProvider) {
      $stateProvider
        .state('base.authed.admin.products', {
          url: '/products',
          abstract: true,
          template: '<div class="products-admin" ui-view></div>',
          controller: 'ProductsAdminController as productsAdminCtrl',
          resolve: ProductsData
        }).state('base.authed.admin.products.list', {
          url: '/list',
          templateUrl: '/partials/admin/products/list_products.html',
          controller: 'ListProductsController as listCtrl',
          resolve: ProductsListData
        }).state('base.authed.admin.products.edit', {
          url: '/edit/{id:int}',
          templateUrl: '/partials/admin/products/edit_product.html',
          controller: 'EditProductController as editCtrl',
          resolve: ProductEditData
        }).state('base.authed.admin.products.create', {
          url: '/create?{product_type_id:int}',
          templateUrl: '/partials/admin/products/create_product.html',
          controller: 'CreateProductController as createCtrl',
          resolve: ProductCreateData
        });
    }
  );

window.ProductsAdminModule = ProductsAdminModule;
