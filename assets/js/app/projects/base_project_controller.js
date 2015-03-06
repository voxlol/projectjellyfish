'use strict';

/**@ngInject*/
var BaseProjectController = function() {

};

BaseProjectController.resolve = {
  /**@ngInject*/
  project: function(ProjectsResource, $stateParams) {
    return ProjectsResource.get({id: $stateParams.projectId}).$promise;
  },
  /**@ngInject*/
  products: function(ProductsResource) {
    return ProductsResource.query().$promise;
  }
};

BaseProjectController.prototype = {};

module.exports = BaseProjectController;
