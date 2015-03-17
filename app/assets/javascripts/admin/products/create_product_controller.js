'use strict';

/**@ngInject*/
function CreateProductController(product, categories, $stateParams) {
  this.product = product;
  this.product.img = "products/aws_ec2.png";
  this.product.provisioning_answers = {};
  this.categories = categories;
  this.categoriesByName = _.object(_.map(categories, function(x){return [x.title, x]}))
}

CreateProductController.resolve = {
  /**@ngInject*/
  product: function(ProductsResource, $stateParams) {
    return new ProductsResource($stateParams);
  }
};

window.CreateProductController = CreateProductController;


