(function() {
  'use strict';

  angular.module('mock')
    .factory('MockProductType', MockProductTypeFactory)
    .run(mock);

  /** @ngInject */
  function mock($httpBackend, MockHelper, MockProductType) {
    $httpBackend.whenGET(/\/api\/product_types\/\d+/).respond(getProductType);
    $httpBackend.whenGET(/\/api\/product_types(?:\?.+)?/).respond(getProductTypes);

    function getProductType(method, url, data) {
      var id = url.match(/\/product_types\/(\d+)/)[1];

      return [200, MockProductType.getProductType(parseInt(id)), {}];
    }

    function getProductTypes(method, url, data) {
      var parsedUrl = MockHelper.parseURL(url);
      var limit = parsedUrl.searchParams.limit;

      return [200, MockProductType.getProductTypes(limit), {}];
    }
  }

  /** @ngInject */
  function MockProductTypeFactory(lodash) {
    var service = {
      getProductType: getProductType,
      getProductTypes: getProductTypes
    };

    return service;

    function getProductType(id) {
      return lodash.find(data(), 'id', id);
    }

    function getProductTypes(limit) {
      var list = data();

      return list.slice(0, limit);
    }

    function data() {
      var id = 1;

      return [
        {
          id: id++,
          title: 'AWS Fog Databases',
          description: 'An RDS database instance hosted at AWS.',
          schema: {
            type: 'object',
            required: ['DBInstanceClass', 'Engine', 'AllocatedStorage'],
            properties: {
              'DBInstanceClass': {
                'title': 'DB Instance Size',
                'type': 'string',
                'enum': [
                  'db.m3.medium',
                  'db.m3.large',
                  'db.m3.xlarge'
                ],
                'default': 'db.m3.medium'
              },
              'Engine': {
                'title': 'DB Engine',
                'type': 'string',
                'enum': [
                  'aurora',
                  'mysql',
                  'postgresql',
                  'sqlserver'
                ],
                'default': ''
              },
              'AllocatedStorage': {
                'title': 'Disk Size',
                'type': 'string',
                'default': '40',
                'pattern': '^\\d{1,4}$'
              },
              'StorageType': {
                'title': 'Storage Type',
                'type': 'string',
                'enum': [
                  'standard',
                  'gp2',
                  'io1'
                ],
                'default': 'gp2'
              }
            }
          },
          definition: [
            'DBInstanceClass',
            {
              key: 'Engine',
              type: 'select',
              titleMap: [
                {value: 'aurora', name: 'Aurora'},
                {value: 'mysql', name: 'MySQL'},
                {value: 'postgresql', name: 'PostgreSQL'},
                {value: 'sqlserver', name: 'SQL Server'}
              ],
              validationMessage: {
                302: 'A database engine is required.'
              }
            },
            {
              key: 'AllocatedStorage',
              type: 'string',
              validationMessage: {
                202: 'Enter a value between 1 and 9999.',
                302: 'Allocated storage is required.'
              }
            },
            {
              key: 'StorageType',
              type: 'select',
              titleMap: [
                {value: 'standard', name: 'Magnetic'},
                {value: 'gp2', name: 'General Purpose (SSD)'},
                {value: 'io1', name: 'Provisioned IOPS (SSD)'}
              ]
            }
          ]
        },
        {
          id: id++,
          title: 'AWS Fog Infrastructure',
          description: 'An EC2 VM instance hosted at AWS.',
          schema: {
            type: 'object',
            required: ['instance_size', 'disk_size'],
            properties: {
              'instance_size': {
                'title': 'Instance Size',
                'type': 'string',
                'enum': [
                  't2.micro',
                  'm3.medium',
                  'm3.large'
                ],
                'default': 'm3.medium'
              },
              'disk_size': {
                'title': 'Disk Size',
                'type': 'string',
                'default': '40',
                'pattern': '^\\d{1,4}$'
              }
            }
          },
          definition: [
            'instance_size',
            {
              key: 'disk_size',
              type: 'string',
              validationMessage: {
                202: 'Enter a value between 1 and 9999.',
                302: 'Disk size is required.'
              }
            }

          ]
        },
        {
          id: id++,
          title: 'AWS Fog Storage',
          description: 'An S3 bucket hosted at AWS',
          schema: {
            type: 'object',
            required: ['availability', 'region'],
            properties: {
              'availability': {
                'title': 'Storage Redundancy',
                'type': 'string',
                'enum': [
                  'normal',
                  'reduced'
                ],
                'default': 'normal'
              },
              'region': {
                'title': 'Region',
                'type': 'string',
                'enum': [
                  '',
                  'us-west-1',
                  'us-west-2',
                  'eu-central-1',
                  'eu-west-1',
                  'ap-northeast-1',
                  'ap-southeast-1',
                  'ap-southeast-2',
                  'sa-east-1'
                ],
                'default': ''
              }
            }
          },
          definition: [
            'availability',
            {
              key: 'region',
              type: 'select',
              titleMap: [
                {value: '', name: 'US East (N. Virginia)'},
                {value: 'us-west-1', name: 'US West (N. California)'},
                {value: 'us-west-2', name: 'US West (Oregon)'},
                {value: 'eu-central-1', name: 'EU (Frankfurt)'},
                {value: 'eu-west-1', name: 'EU (Ireland)'},
                {value: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)'},
                {value: 'ap-southeast-1', name: 'Asia Pacific (Singapore)'},
                {value: 'ap-southeast-2', name: 'Asia Pacific (Sydney)'},
                {value: 'sa-east-1', name: 'South America (Sao Paulo)'}
              ]
            }
          ]
        }
      ];
    }
  }
})();
