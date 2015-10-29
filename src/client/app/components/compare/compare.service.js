(function() {
  'use strict';

  angular.module('app.components')
    .service('Compare', CompareService);

  /** @ngInject */
  function CompareService($modal, lodash, MAX_COMPARES) {
    var self = this;

    self.items = [];

    self.add = add;
    self.remove = remove;
    self.clear = clear;
    self.contains = inList;
    self.showModal = showModal;

    function add(product) {
      if (isValid(product)) {
        self.items.push(product);

        return true;
      }

      return false;
    }

    function remove(product) {
      var index = indexOf(product);

      if (index >= 0) {
        self.items.splice(index, 1);

        return true;
      }

      return false;
    }

    function clear() {
      self.items.length = 0;
    }

    function inList(product) {
      return indexOf(product) !== -1;
    }

    function indexOf(product) {
      return lodash.pluck(self.items, 'id').indexOf(product.id);
    }

    function isValid(product) {
      return self.items.length < MAX_COMPARES && !inList(product);
    }

    function showModal(project) {
      var modalOptions = {
        templateUrl: 'app/components/compare/compare-modal.html',
        controller: CompareModalController,
        controllerAs: 'vm',
        resolve: {
          productList: resolveItems,
          project: resolveProject
        },
        windowTemplateUrl: 'app/components/common/modal-window.html',
        size: 'compare'
      };
      var modal = $modal.open(modalOptions);

      modal.result.then();

      function resolveItems() {
        return self.items;
      }

      function resolveProject() {
        return project;
      }
    }
  }

  /** @ngInject */
  function CompareModalController(lodash, productList, project, $modalInstance, $state) {
    var vm = this;

    vm.project = project;
    vm.products = productList;
    vm.rowData = [];
    vm.orderService = orderService;

    buildData();

    function buildData() {
      var properties = [];
      var column = 0;
      var data = {
        description: [],
        setup: [],
        hourly: [],
        monthly: [],
        properties: {}
      };

      angular.forEach(productList, processBasics);
      properties = lodash.uniq(properties.sort(), true);
      angular.forEach(properties, initProperty);
      angular.forEach(productList, processProperties);
      angular.forEach(properties, appendProperty);
      lodash.forOwn(data, createRows);

      function createRows(value, key) {
        if (key !== 'properties') {
          vm.rowData.push({name: lodash.startCase(key), values: value});
        }
      }

      function processBasics(product) {
        data.description.push(product.description);
        data.setup.push(product.setup_price);
        data.hourly.push(product.hourly_price);
        data.monthly.push(product.monthly_price);
        properties = properties.concat(lodash.keys(product.properties));

        if (0 < product.answers.length) {
          lodash.forEach(product.answers, addAnswerKey);
        }
        column++;
      }

      function initProperty(property) {
        data.properties[property] = {name: lodash.startCase(property), values: []};
      }

      function processProperties(product) {
        for (var idx = properties.length; --idx >= 0;) {
          data.properties[properties[idx]].values.push(product.properties[properties[idx]]);
        }
      }

      function appendProperty(property) {
        vm.rowData.push(data.properties[property]);
      }

      function isPurchasable() {
        return angular.isDefined(project);
      }

      function addAnswerKey(answer) {
        if (!data[answer.name]) {
          data[answer.name] = [''];
          data[answer.name][column] = answer.value;
        } else {
          data[answer.name][column] = answer.value;
        }
      }
    }

    function orderService() {
      $modalInstance.close();
      $state.go('orders');
    }
  }
})();
