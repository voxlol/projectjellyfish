(function() {
  'use strict';

  angular.module('app.components')
    .factory('CartService', CartServiceFactory);

  /** @ngInject */
  function CartServiceFactory($modal) {
    var service = {
      items: {},
      add: add,
      remove: remove,
      quantity: quantity,
      clear: clear,
      isEmpty: isEmpty,
      showModal: showModal
    };

    return service;

    function add(project, product, quantity) {
      quantity = isNaN(quantity) ? 1 : quantity;

      if (!!service.items[project.id]) {
        service.items[project.id] = {
          project: project,
          products: {},
          total: 0
        };
      }

      if (!!service.items[project.id].products[product.id]) {
        service.items[project.id][product.id] = {
          product: product,
          quantity: 0,
          price: 0
        };
      }

      service.items[project.id].products[product.id].quantity += 1;
      totalUpProject(project);
    }

    function remove(project, product) {
      if (!inCart(project, product)) {
        return;
      }

      service.items[project.id].products[product.id].quantity -= 1;

      if (0 === service.items[project.id].products[product.id].quantity) {
        delete service.items[project.id].products[product.id];

        if (0 === Object.keys(service.items[project.id].products).length) {
          delete service.items[project.id];
        } else {
          totalUpProject(project);
        }
      }
    }

    function quantity(project, product) {
      if (!inCart(project, product)) {
        return 0;
      }

      return service.items[project.id].products[product.id].quantity;
    }

    function clear() {
      service.items = {};
    }

    function isEmpty() {
      return 0 === Object.keys(service.items).length;
    }

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/cart/cart-modal.html',
        controller: CartModalController,
        controllerAs: 'vm',
        windowTemplateUrl: 'app/components/cart/cart-modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      modal.result.then(handleCheckout);

      function handleCheckout() {
      }
    }

    function inCart(project, product) {
      return service.items[project.id] && service.items[project.id].products[product.id];
    }

    function totalUpProject(project) {
      service.items[project.id].total = 0;
      angular.forEach(service.items[project.id].products, computeProductTotal);

      function computeProductTotal(line) {
        line.price = (parseFloat(line.product.monthly_price))
          + ((parseFloat(line.product.hourly_price)) * 750)
          * line.quantity;
        project.total += line.price;
      }
    }
  }

  /** @ngInject */
  function CartModalController(CartService) {
    var vm = this;

    vm.remove = remove;
    vm.change = change;
    vm.clear = clear;
    vm.isEmpty = isEmpty;

    vm.items = CartService.items;

    function remove(project, product) {
      CartService.remove(project, product);
    }

    function change(project, product) {
      // TODO: Change quantity and re-compute totals.
    }

    function clear() {
      CartService.clear();
    }

    function isEmpty() {
      return CartService.isEmpty();
    }
  }
})();
