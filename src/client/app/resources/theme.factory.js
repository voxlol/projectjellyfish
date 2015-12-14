(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Theme', ThemeFactory);

  /** @ngInject */
  function ThemeFactory($resource) {
    // var theme = $resource('/api/v1/themes/', {}, {});

    var theme = {
      'colors': [{
        type: 'style',
        label: 'Primary Background Color',
        selector: 'primary-background',
        rule: 'background-color',
        value: '#EBEBEB'
      }, {
        type: 'style',
        label: 'Secondary Background Color',
        selector: 'secondary-background',
        rule: 'background-color',
        value: '#FFFFFF'
      }, {
        type: 'style',
        label: 'Primary Text Color',
        selector: 'primary-text',
        rule: 'color',
        value: '#333333'
      }, {
        type: 'style',
        label: 'Primary Title Color',
        selector: 'primary-title',
        rule: 'color',
        value: '#414042'
      }, {
        type: 'style',
        label: 'Primary Accent Color',
        selector: 'primary-accent',
        rule: 'color',
        value: '#2464CC'
      }, {
        type: 'style',
        label: 'Primary Border Color',
        selector: 'primary-border',
        rule: 'border-color',
        value: '#B1B3B6'
      }, {
        type: 'group',
        name: 'link',
        children: [{
          type: 'style',
          label: 'Link Primary Color',
          selector: 'link',
          rule: 'color',
          value: '#2464CC'
        }, {
          type: 'style',
          label: 'Link Hover Color',
          selector: 'link:hover',
          rule: 'color',
          value: '#2464CC'
        }]
      }, {
        type: 'group',
        name: 'Button',
        children: [{
          type: 'mixin',
          label: 'Primary Button Color/Background/Border',
          selector: 'button-primary',
          rule: 'button-variant',
          value: ['#FFFFFF', '2464CC', '#2464CC']
        }, {
          type: 'mixin',
          label: 'Warning Button Color/Background/Border',
          selector: 'button-warning',
          rule: 'button-variant',
          value: ['#FFFFFF', '#CF1020', '#CF1020']
        }, {
          type: 'mixin',
          label: 'Cancel Button Color/Background/Border',
          selector: 'button-cancel',
          rule: 'button-variant',
          value: ['#FFFFFF', '#414042', '#414042']
        }]
      }, {
        type: 'group',
        name: 'Navigation',
        children: [{
          type: 'style',
          label: 'Primary Background Color',
          selector: 'nav-primary-background',
          rule: 'background-color',
          value: '#33394D'
        }, {
          type: 'style',
          label: 'Secondary Background Color',
          selector: 'nav-secondary-background',
          rule: 'background-color',
          value: '#3D445C'
        }, {
          type: 'style',
          label: 'Primary Text Color',
          selector: 'nav-primary-text',
          rule: 'color',
          value: 'rgba(237, 237, 237, 0.7)'
        },
          {
            type: 'style',
            label: 'Primary Brand Color',
            selector: 'nav-primary-brand',
            rule: 'background-color',
            value: '#2464CC'
          },
          {
            type: 'style',
            label: 'Primary Hover Text Color',
            selector: 'nav-primary-text:hover',
            rule: 'color',
            value: '#FFFFFF'
          }, {
            type: 'style',
            label: 'Active Sidebar Link Color',
            selector: 'nav-link-active',
            rule: 'color',
            value: '#FFFFFF'
          }, {
            type: 'style',
            label: 'Active Sidebar Link Background Color',
            selector: 'nav-link-active',
            rule: 'background-color',
            value: '#14855F'
          }, {
            type: 'style',
            label: 'Logout Sidebar Link Background Color',
            selector: 'nav-link-logout',
            rule: 'background-color',
            value: '#2B2E3E'
          }]
      }, {
        type: 'group',
        name: 'Region',
        children: [{
          type: 'style',
          label: 'Header Background Color',
          selector: 'region-header-background',
          rule: 'background-color',
          value: '#FFFFFF'
        }]
      }, {
        type: 'group',
        name: 'Tables',
        children: [{
          type: 'style',
          label: 'Header Background Color',
          selector: 'table-header-background',
          rule: 'background-color',
          value: '#414042'
        }, {
          type: 'style',
          label: 'Compare-select Background Color',
          selector: 'table-compare-select-background',
          rule: 'background-color',
          value: '#14855F'
        }]
      }, {
        type: 'group',
        name: 'Tags',
        children: [{
          type: 'style',
          label: 'Primary Background Color',
          selector: 'tag-primary-background',
          rule: 'background-color',
          value: '#14855F'
        }, {
          type: 'style',
          label: 'Secondary Background Color',
          selector: 'tag-secondary-background',
          rule: 'background-color',
          value: '#23A27E'
        }, {
          type: 'style',
          label: 'Primary Text Color',
          selector: 'tag-primary-text',
          rule: 'color',
          value: '#FFFFFF'
        },
          {
            type: 'style',
            label: 'Secondary Text Color',
            selector: 'tag-secondary-text',
            rule: 'color',
            value: '#14855F'
          }]
      }, {
        type: 'group',
        name: 'Modal',
        children: [{
          type: 'style',
          label: 'Header Background Color',
          selector: 'modal-header-background',
          rule: 'background-color',
          value: '#23A27E'
        }, {
          type: 'style',
          label: 'Header Text Color',
          selector: 'modal-header-text',
          rule: 'color',
          value: '#FFFFFF'
        }, {
          type: 'style',
          label: 'Body Background Color',
          selector: 'modal-body-background',
          rule: 'background-color',
          value: '#FFFFFF'
        }, {
          typetype: 'style',
          label: 'Footer Background Color',
          selector: 'footer-background',
          rule: 'background-color',
          value: '#FFFFFF'
        }]
      }]
    };

    return theme;
  }
})();
