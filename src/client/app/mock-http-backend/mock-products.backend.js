(function() {
  'use strict';

  angular.module('mock')
    .factory('MockProduct', MockProductFactory)
    .run(mock);

  /** @ngInject */
  function mock($httpBackend, MockHelper, MockProduct) {
    $httpBackend.whenGET(/\/api\/products\/\d+/).respond(getProduct);
    $httpBackend.whenGET(/\/api\/products(?:\?.+)?/).respond(getProducts);
    $httpBackend.whenPOST(/\/api\/products/).respond(postProduct);
    $httpBackend.whenPUT(/\/api\/products\/\d+/).respond(putProduct);
    $httpBackend.whenDELETE(/\/api\/products\/\d+/).respond(deleteProduct);

    function getProduct(method, url, data) {
      var id = url.match(/\/products\/(\d+)/)[1];

      return [200, MockProduct.getProduct(parseInt(id)), {}];
    }

    function getProducts(method, url, data) {
      var parsedUrl = MockHelper.parseURL(url);
      var limit = parsedUrl.searchParams.limit;
      var tags = parsedUrl.searchParams.tags || [];

      return [200, MockProduct.getProducts(tags, limit), {}];
    }

    function postProduct(method, url, data) {
      return [201, data, {}];
    }

    function putProduct(method, url, data) {
      var id = url.match(/\/products\/(\d+)/)[1];

      return [204, '', {}];
    }

    function deleteProduct(method, url, data) {
      var id = url.match(/\/products\/(\d+)/)[1];

      return [204, '', {}];
    }
  }

  /** @ngInject */
  function MockProductFactory(lodash) {
    var service = {
      getProduct: getProduct,
      getProducts: getProducts
    };

    return service;

    function getProduct(id) {
      return lodash.find(data(), 'id', id);
    }

    function getProducts(tags, limit) {
      var list = data();

      if (tags.length > 0) {
        list = lodash.filter(list, tagFilter);
      }

      return list.slice(0, limit);

      function tagFilter(item) {
        return tags.length === lodash.intersection(tags, item.tags).length;
      }
    }

    function data() {
      var id = 1;

      return [
        {
          id: id++,
          name: 'Small MySQL RDS',
          color: 'dark-green',
          description: 'A small MySQL RDS instance. 20GB storage is available. Good for development.',
          tags: ['database', 'rds', 'mysql', 'small', 'aws', 'development'],
          properties: {
            disk_size: '20GB',
            db_instance_size: 'db.m3.medium',
            engine: 'mysql'
          },
          setup_price: '$4.99',
          monthly_price: '$1.99',
          hourly_price: '$0.0099'
        },
        {
          id: id++,
          name: 'Medium MySQL RDS',
          color: 'green',
          description: 'A medium MySQL RDS instance. 40GB storage is available',
          tags: ['database', 'rds', 'mysql', 'medium', 'aws'],
          properties: {
            disk_size: '40GB',
            db_instance_size: 'db.m3.large',
            engine: 'mysql'
          },
          setup_price: '$9.99',
          monthly_price: '$2.49',
          hourly_price: '$0.0199'
        },
        {
          id: id++,
          name: 'Large MySQL RDS',
          color: 'light-green',
          description: 'A large production ready MySQL RDS instance. 80GB storage is available',
          tags: ['database', 'rds', 'mysql', 'large', 'aws', 'production'],
          properties: {
            disk_size: '80GB',
            db_instance_size: 'db.m3.xlarge',
            engine: 'mysql'
          },
          setup_price: '$18.99',
          monthly_price: '$3.29',
          hourly_price: '$0.0399'
        },
        {
          id: id++,
          name: 'Small PostgreSQL RDS',
          color: 'dark-pink',
          description: 'A small PostgreSQL RDS instance. 20GB storage is available. Good for development.',
          tags: ['database', 'rds', 'postgresql', 'postgres', 'small', 'aws', 'development'],
          properties: {
            disk_size: '20GB',
            db_instance_size: 'db.m3.medium',
            engine: 'postgresql'
          },
          setup_price: '$5.99',
          monthly_price: '$1.99',
          hourly_price: '$0.0299'
        },
        {
          id: id++,
          name: 'Medium PostgreSQL RDS',
          color: 'pink',
          description: 'A medium PostgreSQL RDS instance. 40GB storage is available.',
          tags: ['database', 'rds', 'postgresql', 'postgres', 'medium', 'aws'],
          properties: {
            disk_size: '40GB',
            db_instance_size: 'db.m3.large',
            engine: 'postgresql'
          },
          setup_price: '$10.99',
          monthly_price: '$2.79',
          hourly_price: '$0.0499'
        },
        {
          id: id++,
          name: 'Large PostgreSQL RDS',
          color: 'light-pink',
          description: 'A large production ready PostgreSQL RDS instance. 20GB storage is available',
          tags: ['database', 'rds', 'postgresql', 'postgres', 'large', 'aws', 'production'],
          properties: {
            disk_size: '80GB',
            db_instance_size: 'db.m3.xlarge',
            engine: 'postgresql'
          },
          setup_price: '$19.99',
          monthly_price: '$3.89',
          hourly_price: '$0.0699'
        },
        {
          id: id++,
          name: 'LAMP Stack',
          color: 'light-blue',
          description: 'A suite of servers supporting a LAMP stack at AWS. Two application servers with Apache ' +
          'and PHP, one server running MySQL, one load balancer.',
          tags: ['lamp', 'application', 'php', 'mysql', 'aws'],
          properties: {
            servers: 2,
            disk_size: '40GB',
            db_instance_size: 'db.m3.large',
            app_instance_size: 'm3.large',
            engine: 'mysql'
          },
          setup_price: '$21.99',
          monthly_price: '$7.99',
          hourly_price: '$0.099'
        },
        {
          id: id++,
          name: 'LAMP Stack',
          color: 'dark-blue',
          description: 'A suite of servers supporting a LAMP stack at Azure. Two application servers with Apache ' +
          'and PHP, one server running MySQL, one load balancer.',
          tags: ['lamp', 'application', 'php', 'mysql', 'azure'],
          properties: {
            servers: 2,
            disk_size: '40GB',
            db_instance_size: 'D2',
            app_instance_size: 'D2',
            engine: 'mysql'
          },
          setup_price: '$23.99',
          monthly_price: '$8.99',
          hourly_price: '$0.099'
        },
        {
          id: id++,
          name: 'Small Cloud Server',
          color: 'dark-orange',
          description: 'A small server instance running at AWS. Built on an m3.medium image.',
          tags: ['server', 'ec2', 'aws', 'small', 'development'],
          properties: {
            disk_size: '40GB',
            app_instance_size: 'm3.medium'
          },
          setup_price: '$2.99',
          monthly_price: '$2.49',
          hourly_price: '$0.0199'
        },
        {
          id: id++,
          name: 'Medium Cloud Server',
          color: 'orange',
          description: 'A medium server instance running at AWS. Built on an m3.large image.',
          tags: ['server', 'ec2', 'aws', 'medium'],
          properties: {
            disk_size: '80GB',
            app_instance_size: 'm3.large'
          },
          setup_price: '$4.99',
          monthly_price: '$3.29',
          hourly_price: '$0.0299'
        },
        {
          id: id++,
          name: 'Large Cloud Server',
          color: 'light-orange',
          description: 'A large production ready server instance running at AWS',
          tags: ['server', 'ec2', 'aws', 'large', 'production'],
          properties: {
            disk_size: '120GB',
            app_instance_size: 'm3.large'
          },
          setup_price: '$6.99',
          monthly_price: '$4.19',
          hourly_price: '$0.0399'
        }
      ];
    }
  }
})();
