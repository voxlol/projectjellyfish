/**
 * project_jellyfish - Project Jellyfish dependencies
 * @authors Michael Stack,Allen Wight
 * @version v0.0.1
 * @link 
 * @license Apache 2.0
 */
(function() {
  'use strict';

  angular.module('app', [
    'app.core',
    'app.states'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.bind-attrs', []);
})();

/**
 * This comes from https://github.com/rajeshsegu/angular-lazy-bootstrap
 *
 * It adds `.lazy()` to the angular object so that the application can
 * be loaded lazily.
 */
(function(angular) {
  'use strict';

  // Generic

  function makeArray(arr) {
    if (!arr) {
      return [];
    }

    return angular.isArray(arr) ? arr : [arr];
  }

  // Angular

  function provideRootElement(modules, element) {
    element = angular.element(element);
    modules.unshift(unshiftElement);

    /** @ngInject */
    function unshiftElement($provide) {
      $provide.value('$rootElement', element);
    }
  }

  function createInjector(injectorModules, element) {
    var modules = ['ng'].concat(makeArray(injectorModules));

    if (element) {
      provideRootElement(modules, element);
    }

    return angular.injector(modules);
  }

  function bootstrapApplication(angularApp) {
    angular.element(document).ready(bootstrap);

    function bootstrap() {
      angular.bootstrap(document, [angularApp]);
    }
  }

  angular.lazy = function(app, modules) {
    var injector = createInjector(modules);
    var $q = injector.get('$q');
    var promises = [];
    var errorCallback = angular.noop;
    var loadingCallback = angular.noop;
    var doneCallback = angular.noop;

    return {
      resolve: resolve,
      bootstrap: bootstrap,
      loading: loading,
      done: done,
      error: error
    };

    function resolve(promise) {
      promise = $q.when(injector.instantiate(promise));
      promises.push(promise);

      /*jshint validthis: true */
      return this;
    }

    function bootstrap() {
      loadingCallback();

      return $q.all(promises)
        .then(boot, errorCallback)
        .finally(doneCallback);

      function boot() {
        bootstrapApplication(app);
      }
    }

    function loading(callback) {
      loadingCallback = callback;

      /*jshint validthis: true */
      return this;
    }

    function done(callback) {
      doneCallback = callback;

      /*jshint validthis: true */
      return this;
    }

    function error(callback) {
      errorCallback = callback;

      /*jshint validthis: true */
      return this;
    }
  };
})(angular);

(function() {
  'use strict';

  angular.module('blocks.directive-options', []);
})();

(function() {
  'use strict';

  angular.module('blocks.exception', [
    'blocks.logger'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.logger', []);
})();

(function() {
  'use strict';

  angular.module('blocks.multi-transclude', [
    'blocks.logger'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.pub-sub', [
    'blocks.logger'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.recursion', []);
})();

(function() {
  'use strict';

  angular.module('blocks.router', [
    'ui.router',
    'blocks.logger'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.state-override', [
    'ui.router'
  ]);
})();

(function() {
  'use strict';

  angular.module('app.components', [
    'app.core',
    'app.services',

    // Third part modules
    'smart-table',
    'formly',
    'ui.sortable',
    'ui.bootstrap',
    'ngDraggable',
    'highcharts-ng',
    'hc.marked'
  ]);
})();

(function() {
  'use strict';

  angular.module('app.core', [
    // Angular modules
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ngAria',

    // Blocks modules
    'blocks.exception',
    'blocks.logger',
    'blocks.router',
    'blocks.multi-transclude',
    'blocks.pub-sub',
    'blocks.bind-attrs',
    'blocks.directive-options',
    'blocks.recursion',
    'blocks.state-override',

    // Third party modules
    'ui.router',
    'angular.filter'
  ]);
})();

(function() {
  'use strict';

  angular.module('app.layouts', [])
    .run(init);

  /** @ngInject */
  function init(routerHelper) {
    routerHelper.configureStates(getLayouts());
  }

  function getLayouts() {
    return {
      'blank': {
        abstract: true,
        templateUrl: 'app/layouts/blank.html'
      },
      'application': {
        abstract: true,
        templateUrl: 'app/layouts/application.html'
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.resources', ['ngResource']);
})();

(function() {
  'use strict';

  angular.module('app.services', []);
})();

(function() {
  'use strict';

  angular.module('app.states', [
    'app.core',
    'app.layouts',
    'app.components',
    'app.services',
    'app.resources'
  ]);
})();

(function() {
  'use strict';

  angular.module('blocks.bind-attrs')
    .directive('bindAttrs', BindAttrsDirective);

  /** @ngInject */
  function BindAttrsDirective() {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      scope.$watch(attrs.bindAttrs, watch, true);

      function watch(value) {
        angular.forEach(value, set);
      }

      function set(value, key) {
        attrs.$set(key, value);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('blocks.directive-options')
    .factory('DirectiveOptions', DirectiveOptionsFactory);

  /** @ngInject */
  function DirectiveOptionsFactory($interpolate) {
    var service = {
      load: load
    };

    var converters = {};

    converters[String] = stringConverter;
    converters[Number] = numberConverter;
    converters[Boolean] = booleanConverter;
    converters[RegExp] = regExpConverter;

    return service;

    function load(scope, attrs, options) {
      scope.options = {};

      angular.forEach(options, loadValues);

      function loadValues(value, key) {
        var type = value[0];
        var localDefault = value[1];
        var validator = value[2] || defaultValidator;
        var converter = converters[type];

        setValue(attrs[key] && $interpolate(attrs[key])(scope.$parent));

        function setValue(value) {
          scope.options[key] = value && validator(value) ? converter(value) : localDefault;
        }
      }
    }

    function stringConverter(value) {
      return value;
    }

    function numberConverter(value) {
      return parseInt(value, 10);
    }

    function booleanConverter(value) {
      return 'true' === value.toLowerCase();
    }

    function regExpConverter(value) {
      return new RegExp(value);
    }

    function defaultValidator() {
      return true;
    }
  }
})();

// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function() {
  'use strict';

  angular
    .module('blocks.exception')
    .provider('exceptionHandler', exceptionHandlerProvider)
    .config(config);

  /**
   * Must configure the exception handling
   * @return {[type]}
   */
  function exceptionHandlerProvider() {
    /* jshint validthis:true */
    this.config = {
      appErrorPrefix: undefined
    };

    this.configure = function(appErrorPrefix) {
      this.config.appErrorPrefix = appErrorPrefix;
    };

    this.$get = function() {
      return {config: this.config};
    };
  }

  config.$inject = ['$provide'];

  /**
   * Configure by setting an optional string value for appErrorPrefix.
   * Accessible via config.appErrorPrefix (via config value).
   * @param  {[type]} $provide
   * @return {[type]}
   * @ngInject
   */
  function config($provide) {
    $provide.decorator('$exceptionHandler', extendExceptionHandler);
  }

  extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];

  /**
   * Extend the $exceptionHandler service to also display a toast.
   * @param  {Object} $delegate
   * @param  {Object} exceptionHandler
   * @param  {Object} logger
   * @return {Function} the decorated $exceptionHandler service
   */
  function extendExceptionHandler($delegate, exceptionHandler, logger) {
    return function(exception, cause) {
      var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
      var errorData = {exception: exception, cause: cause};
      exception.message = appErrorPrefix + exception.message;
      $delegate(exception, cause);
      /**
       * Could add the error to a service's collection,
       * add errors to $rootScope, log errors to remote web server,
       * or log locally. Or throw hard. It is entirely up to you.
       * throw exception;
       *
       * @example
       *     throw { message: 'error message we added' };
       */
      logger.error(exception.message, errorData);
    };
  }
})();

(function() {
  'use strict';

  angular.module('blocks.exception')
    .factory('exception', exception);

  /** @ngInject */
  function exception(logger) {
    var service = {
      catcher: catcher
    };

    return service;

    function catcher(message) {
      return function(reason) {
        logger.error(message, reason);
      };
    }
  }
})();

(function() {
  'use strict';

  angular.module('blocks.logger')
    .factory('logger', logger);

  /** @ngInject */
  function logger($log, toastr) {
    var service = {
      showToasts: true,

      error: error,
      info: info,
      success: success,
      warning: warning,

      // straight to console; bypass toastr
      log: $log.log
    };

    var options = {
      positionClass: 'toast-bottom-right'
    };

    return service;

    function error(message, data, title) {
      if (service.showToasts) {
        toastr.error(message, title, options);
      }
      $log.error('Error: ' + message, data);
    }

    function info(message, data, title) {
      if (service.showToasts) {
        toastr.info(message, title, options);
      }
      $log.info('Info: ' + message, data);
    }

    function success(message, data, title) {
      if (service.showToasts) {
        toastr.success(message, title, options);
      }
      $log.info('Success: ' + message, data);
    }

    function warning(message, data, title) {
      if (service.showToasts) {
        toastr.warning(message, title, options);
      }
      $log.warn('Warning: ' + message, data);
    }
  }
}());

(function() {
  'use strict';

  angular.module('blocks.multi-transclude')
    .factory('MultiTransclude', MultiTranscludeFactory);

  /** @ngInject */
  function MultiTranscludeFactory() {
    var service = {
      transclude: transclude
    };

    return service;

    function transclude(element, transcludeFn, removeEmptyTranscludeTargets) {
      transcludeFn(transcluder);

      if (!!removeEmptyTranscludeTargets) {
        removeEmptyTargets();
      }

      function transcluder(clone) {
        angular.forEach(clone, cloner);
      }

      /**
       * Transclude in content from transclude-to sources to transclude-id targets
       *
       * @param cloneEl
       */
      function cloner(cloneEl) {
        var $cloneEl = angular.element(cloneEl);
        var transcludeId = $cloneEl.attr('transclude-to');
        var selector = '[transclude-id="' + transcludeId + '"]';
        var target = element.find(selector);

        if (!transcludeId) {
          return;
        }
        if (target.length) {
          target.append($cloneEl);
        } else {
          $cloneEl.remove();
          throw new Error('`transclude-to="' + transcludeId + '"` target not found.');
        }
      }

      /**
       * Locate all transclude targets and check for children.
       */
      function removeEmptyTargets() {
        var targets = element.find('[transclude-id]');

        angular.forEach(targets, removeIfEmpty);
      }

      /**
       * Removes transclude targets that have no child elements or text.
       *
       * @param target Transclude target with transclude-id attribute
       */
      function removeIfEmpty(target) {
        var $target = angular.element(target);

        if (0 === $target.children().length) {
          $target.remove();
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('blocks.pub-sub')
    .factory('PubSub', PubSubFactory);

  /** @ngInject */
  function PubSubFactory(logger) {
    var service = {
      events: events
    };

    return service;

    function events() {
      return new PubSub();
    }

    function PubSub() {
      var self = this;

      var events = {};

      self.on = onEvent;
      self.trigger = triggerEvent;

      function onEvent(keys, handler) {
        if (!angular.isFunction(handler)) {
          logger.error('Handler for `' + keys + '` is not a function. `' + typeof handler + '`');

          return;
        }
        keys.split(' ').forEach(function(key) {
          if (!events[key]) {
            events[key] = [];
          }
          events[key].push(handler);
        });

        return self;
      }

      function triggerEvent(key, args) {
        var handlers = events[key] || [];

        handlers.every(handle);

        return self;

        function handle(handler) {
          var result = handler(args);

          return angular.isUndefined(result) ? true : result;
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('blocks.recursion')
    .factory('RecursionHelper', RecursionHelperFactory);

  /** @ngInject */
  function RecursionHelperFactory($compile) {
    var service = {
      compile: compile
    };

    return service;

    /**
     * Manually compiles the element, fixing the recursion loop.
     * @param element
     * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
     * @returns object An object containing the linking functions.
     */
    function compile(element, link) {
      // Break the recursion loop by removing the contents
      var contents = element.contents().remove();
      var compiledContents;

      // Normalize the link parameter
      if (angular.isFunction(link)) {
        link = {post: link};
      }

      return {
        pre: (link && link.pre) ? link.pre : null,
        post: post
      };

      /**
       * Compiles and re-adds the contents
       */
      function post(scope, element) {
        // Compile the contents
        if (!compiledContents) {
          compiledContents = $compile(contents);
        }
        // Re-add the compiled contents to the element
        compiledContents(scope, function(clone) {
          element.append(clone);
        });

        // Call the post-linking function, if any
        if (link && link.post) {
          link.post.apply(null, arguments);
        }
      }
    }
  }
})();

/* Help configure the state-base ui.router */
(function() {
  'use strict';

  angular.module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

  /** @ngInject */
  function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider, $injector) {
    /* jshint validthis:true */
    var config = {
      docTitle: undefined,
      resolveAlways: {}
    };

    var provider = {
      configure: configure,
      $get: RouterHelper
    };

    $locationProvider.html5Mode(true);

    return provider;

    function configure(cfg) {
      angular.extend(config, cfg);
    }

    /** @ngInject */
    function RouterHelper($location, $rootScope, $state, logger) {
      var handlingStateChangeError = false;
      var hasOtherwise = false;
      var stateCounts = {
        errors: 0,
        changes: 0
      };

      var service = {
        configureStates: configureStates,
        getStates: getStates,
        stateCounts: stateCounts
      };

      init();

      return service;

      function configureStates(states, otherwisePath) {
        angular.forEach(states, buildState);

        if (otherwisePath && !hasOtherwise) {
          hasOtherwise = true;
          $urlRouterProvider.otherwise(otherwisePath);
        }

        function buildState(stateConfig, state) {
          stateConfig.resolve = angular.extend(stateConfig.resolve || {}, config.resolveAlways);
          $stateProvider.state(state, stateConfig);
        }
      }

      function init() {
        // Route cancellation:
        // On routing error, go to the dashboard.
        // Provide an exit clause if it tries to do it twice.
        $rootScope.$on('$stateChangeError', handleRoutingErrors);
        $rootScope.$on('$stateChangeSuccess', updateTitle);
        // Hack in redirect to default children
        // Discussions: https://github.com/angular-ui/ui-router/issues/1235
        // https://github.com/angular-ui/ui-router/issues/27
        $rootScope.$on('$stateChangeStart', redirectTo);
      }

      function getStates() {
        return $state.get();
      }

      // Private

      function handleRoutingErrors(event, toState, toParams, fromState, fromParams, error) {
        var destination;
        var msg;

        if (handlingStateChangeError) {
          return;
        }
        stateCounts.errors++;
        handlingStateChangeError = true;
        destination = (toState && (toState.title || toState.name || toState.loadedTemplateUrl)) || 'unknown target';
        msg = 'Error routing to ' + destination + '. ' + '. <br/>'
          + (error.statusText || '') + ': ' + (error.status || '');
        logger.warning(msg, [toState]);
        $state.go('errors.sorry');
      }

      function updateTitle(event, toState) {
        stateCounts.changes++;
        handlingStateChangeError = false;
        $rootScope.title = config.docTitle + ' ' + (toState.title || ''); // data bind to <title>
      }

      function redirectTo(event, toState, toParams) {
        var redirect = toState.redirectTo;
        var newState;

        if (redirect) {
          if (angular.isString(redirect)) {
            event.preventDefault();
            $state.go(redirect, toParams);
          } else {
            newState = $injector.invoke(redirect, null, {toState: toState, toParams: toParams});
            if (newState) {
              if (angular.isString(newState)) {
                event.preventDefault();
                $state.go(newState);
              } else if (newState.state) {
                event.preventDefault();
                $state.go(newState.state, newState.params);
              }
            }
          }
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('blocks.state-override')
    .factory('StateOverride', StateOverrideFactory);

  /** @ngInject */
  function StateOverrideFactory($injector, lodash) {
    var service = {
      override: override,
      get: get
    };

    var overrides = {};

    return service;

    function override(state, other) {
      initState(state);
      overrides[state].push(other);
    }

    function get(state, locals) {
      if (!lodash.has(overrides, state)) {
        return;
      }

      return lodash.find(lodash.map(overrides[state], invoke));

      function invoke(other) {
        return $injector.invoke(other, {}, locals);
      }
    }

    // Private

    function initState(state) {
      if (angular.isUndefined(overrides[state])) {
        overrides[state] = [];
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('alertForm', AlertFormDirective);

  /** @ngInject */
  function AlertFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        alertRecord: '=?',
        heading: '@?',
        staffId: '@?',
        alertableId: '@?',
        alertableType: '@?',
        home: '=?',
        homeParams: '=?'
      },
      link: link,
      templateUrl: 'app/components/alert-form/alert-form.html',
      controller: AlertFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function AlertFormController($scope, $state, Toasts, Alert, lodash) {
      var vm = this;

      vm.showValidationMessages = false;
      vm.format = 'yyyy-MM-dd';
      vm.dateOptions = {
        formatYear: 'yy',
        startingDay: 0,
        showWeeks: false
      };

      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.openStart = openStart;
      vm.openEnd = openEnd;
      vm.openAnswerDate = openAnswerDate;

      vm.activate = activate;
      activate();

      function activate() {
      }

      function backToList() {
        $state.go(vm.home, vm.homeParams);
      }

      function showErrors() {
        return vm.showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.showValidationMessages && vm.form.$invalid;
        }

        return vm.showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {
        vm.showValidationMessages = true;
        if (vm.form.$valid) {
          vm.alertRecord.alertable_type = vm.alertableType;
          vm.alertRecord.alertable_id = vm.alertableId;
          // If editing update rather than save
          if (vm.alertRecord.id) {
            Alert.update(vm.alertRecord).$promise.then(saveSuccess, saveFailure);
          } else {
            Alert.save(vm.alertRecord).$promise.then(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Alert saved.');
          backToList();
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function openStart($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.openedStart = true;
      }

      function openEnd($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.openedEnd = true;
      }

      function openAnswerDate($event, index) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.startDateOpened = false;
        vm.endDateOpened = false;
        vm.answerDateOpened = [];
        vm.answerDateOpened[index] = true;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .service('$previousState', PreviousStateService);

  /** @ngInject */
  function PreviousStateService($rootScope, $state) {
    var previous = null;
    var lastPrevious = null;

    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeError', stateChangeError);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(evt, toState, toStateParams, fromState, fromStateParams) {
      lastPrevious = previous;
      previous = {state: fromState, params: fromStateParams};
    }

    function stateChangeError() {
      previous = lastPrevious;
      lastPrevious = null;
    }

    function stateChangeSuccess() {
      lastPrevious = null;
    }

    var $previousState = {
      get: getFunction,
      go: goFunction
    };

    function getFunction() {
      return previous;
    }

    function goFunction() {
      var to = $previousState.get();

      return $state.go(to.state, to.params);
    }

    return $previousState;
  }

  angular.module('app.components').run(previousStateInstantiation);

  /** @ngInject */
  function previousStateInstantiation($previousState) {
  }

  angular.module('app.components')
    .directive('backLink', BackLinkDirective);

  /** @ngInject */
  function BackLinkDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      template: '<button class="btn-link" ng-click="vm.stateTransition()">Back</button>',
      controller: BackLinkController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function BackLinkController($previousState) {
      var vm = this;

      vm.activate = activate;
      vm.stateTransition = stateTransition;

      function activate() {
      }

      function stateTransition() {
        $previousState.go();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('catalogCategory', CatalogCategoryDirective);

  /** @ngInject */
  function CatalogCategoryDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        category: '=',
        viewMode: '=?',
        collapsed: '=?',
        comparable: '=?',
        project: '=?'
      },
      link: link,
      templateUrl: 'app/components/catalog/catalog-category.html',
      controller: CatalogCategoryController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function CatalogCategoryController(VIEW_MODES) {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.list;
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
        vm.requiredTags = vm.requiredTags || [];
        vm.comparable = angular.isDefined(vm.comparable) ? vm.comparable : true;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('CatalogService', CatalogServiceFactory);

  /** @ngInject */
  function CatalogServiceFactory($q, ProductCategory, Product, lodash) {
    var service = {
      getCatalog: getCatalog
    };

    return service;

    function getCatalog(tags) {
      var categories = [];
      var products = [];
      var deferred = $q.defer();

      $q.all([
        0 === categories.length ? ProductCategory.query().$promise : angular.noop,
        Product.query({'tags[]': tags, 'includes[]': ['answers']}).$promise
      ]).then(buildProductLists);

      return deferred.promise;

      function buildProductLists(results) {
        if (0 === categories.length) {
          categories = results[0];
        }
        products = results[1];
        categories.forEach(filterProductsForCategory);
        deferred.resolve(categories);
      }

      function filterProductsForCategory(category) {
        category.products = lodash.filter(products, matchAllTags);

        function matchAllTags(item) {
          return lodash.all(category.tags, checkTag);

          function checkTag(tag) {
            return -1 !== item.tags.indexOf(tag);
          }
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .filter('tags', TagsFilter);

  /** @ngInject */
  function TagsFilter(lodash) {
    return filter;

    function filter(items, tagList, allMatch) {
      var filtered = [];

      tagList = tagList || [];
      allMatch = !!allMatch;

      if (0 === tagList.length) {
        return items;
      }

      filtered = lodash.filter(items, checkTags);

      return filtered;

      function checkTags(item) {
        var matches = lodash.intersection(tagList, item.tags).length;

        if (allMatch) {
          return tagList.length === matches;
        } else {
          return 0 < matches;
        }
      }
    }
  }
})();

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

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/compare/compare-modal.html',
        controller: CompareModalController,
        controllerAs: 'vm',
        resolve: {
          productList: resolveItems
        },
        windowTemplateUrl: 'app/components/common/modal-window.html',
        size: 'compare'
      };
      var modal = $modal.open(modalOptions);

      modal.result.then();

      function resolveItems() {
        return self.items;
      }
    }
  }

  /** @ngInject */
  function CompareModalController(lodash, productList) {
    var vm = this;

    vm.products = productList;
    vm.rowData = [];

    buildData();

    function buildData() {
      var properties = [];
      var data = {
        description: [],
        setup: [],
        hourly: [],
        monthly: [],
        properties: {}
      };

      angular.forEach(productList, processBasics);
      vm.rowData.push({name: 'Description', values: data.description});
      properties = lodash.uniq(properties.sort(), true);
      angular.forEach(properties, initProperty);
      angular.forEach(productList, processProperties);
      angular.forEach(properties, appendProperty);
      vm.rowData.push({name: 'Setup', values: data.setup});
      vm.rowData.push({name: 'Hourly', values: data.hourly});
      vm.rowData.push({name: 'Monthly', values: data.monthly});

      function processBasics(product) {
        data.description.push(product.description);
        data.setup.push(product.setup_price);
        data.hourly.push(product.hourly_price);
        data.monthly.push(product.monthly_price);
        properties = properties.concat(lodash.pluck(product.answers, 'name'));
      }

      function initProperty(property) {
        data.properties[property] = {name: lodash.startCase(property), values: []};
      }

      function processProperties(product) {
        for (var idx = properties.length; --idx >= 0;) {
          data.properties[properties[idx]].values.push(
            lodash.result(lodash.find(product.answers, {name: properties[idx]}), 'value'));
        }
      }

      function appendProperty(property) {
        vm.rowData.push(data.properties[property]);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .constant('MAX_COMPARES', 4);
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('selectProduct', SelectProductDirective);

  /** @ngInject */
  function SelectProductDirective($position, $window) {
    var directive = {
      restrict: 'AE',
      scope: {
        product: '='
      },
      link: link,
      templateUrl: 'app/components/compare/select-product.html',
      controller: SelectProductController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate({
        getPosition: getPosition,
        getOffset: getOffset
      });

      function getOffset() {
        return $window.pageYOffset;
      }

      function getPosition() {
        return $position.offset(element);
      }
    }

    /** @ngInject */
    function SelectProductController($scope, Compare, $modal) {
      var vm = this;

      vm.activate = activate;
      vm.toggle = toggle;
      vm.isAdded = isAdded;

      function activate(api) {
        angular.extend(vm, api);
      }

      function toggle() {
        if (Compare.contains(vm.product)) {
          Compare.remove(vm.product);
        } else {
          if (!Compare.add(vm.product)) {
            showLimitModal();
          }
        }
      }

      function isAdded() {
        return Compare.contains(vm.product);
      }

      // Private

      function showLimitModal() {
        var modalOptions = {
          templateUrl: 'app/components/compare/limit-modal.html',
          windowTemplateUrl: 'app/components/compare/limit-modal-window.html',
          scope: $scope
        };

        var offset = vm.getPosition();
        var modal = $modal.open(modalOptions);

        vm.left = offset.left + offset.width + 20;
        vm.top = offset.top - 115 - vm.getOffset();

        modal.result.then(showCompareModal);
      }

      function showCompareModal() {
        Compare.showModal();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('selectedProducts', SelectedProductsDirective);

  /** @ngInject */
  function SelectedProductsDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'app/components/compare/selected-products.html',
      controller: SelectedProductsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function SelectedProductsController(Compare, MAX_COMPARES) {
      var vm = this;

      vm.activate = activate;
      vm.remove = remove;
      vm.showModal = showModal;
      vm.disabled = disabled;

      function activate() {
        buildIndexes(MAX_COMPARES);
        vm.products = Compare.items;
      }

      function remove(product) {
        Compare.remove(product);
      }

      function showModal() {
        Compare.showModal();
      }

      function disabled() {
        return Compare.items.length <= 1;
      }

      // Private

      function buildIndexes(max) {
        vm.indexes = [];

        for (var idx = 0; idx < max; idx++) {
          vm.indexes.push(idx);
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('confirmation', ConfirmationDirective);

  /** @ngInject */
  function ConfirmationDirective($position, $window) {
    var directive = {
      restrict: 'AE',
      scope: {
        position: '@?confirmationPosition',
        message: '@?confirmationMessage',
        trigger: '@?confirmationTrigger',
        ok: '@?confirmationOkText',
        cancel: '@?confirmationCancelText',
        onOk: '&confirmationOnOk',
        onCancel: '&?confirmationOnCancel',
        okStyle: '@?confirmationOkStyle',
        cancelStyle: '@?confirmationCancelStyle',
        confirmIf: '=?confirmationIf',
        showCancel: '=?confirmationShowCancel'
      },
      link: link,
      controller: ConfirmationController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate({
        getOffset: getOffset,
        getPosition: getPosition,
        size: getSizeOfConfirmation()
      });

      element.on(attrs.confirmationTrigger || 'click', vm.onTrigger);

      function getOffset() {
        return $window.pageYOffset;
      }

      function getPosition() {
        return $position.offset(element);
      }

      // Private

      function getSizeOfConfirmation() {
        var height;
        var width;
        var sizerMessage = attrs.confirmationMessage || 'For Sizing';
        var sizer = angular.element('<div class="confirmation__dialog"><div class="confirmation__content">' +
        '<div class="confirmation__body"><p class="confirmation_message">' + sizerMessage +
        '</p><div class="confirmation_buttons">' +
        '<button type="button" class="confirmation__button btn-rounded">For Sizing</button>' +
        '</div></div></div></div>');

        sizer.css('visibility', 'hidden');
        element.parent().append(sizer);
        height = sizer.prop('offsetHeight');
        width = sizer.prop('offsetWidth');
        sizer.detach();

        return {
          height: height,
          width: width
        };
      }
    }

    /** @ngInject */
    function ConfirmationController($scope, $modal) {
      var vm = this;

      var modalOptions = {
        templateUrl: 'app/components/confirmation/confirmation.html',
        windowTemplateUrl: 'app/components/confirmation/confirmation-window.html',
        scope: $scope
      };

      vm.top = 0;
      vm.left = 0;

      vm.activate = activate;
      vm.onTrigger = onTrigger;

      function activate(api) {
        angular.extend(vm, api);
        vm.position = angular.isDefined(vm.position) ? vm.position : 'top-center';
        vm.message = angular.isDefined(vm.message) ? vm.message : 'Are you sure you wish to proceed?';
        vm.ok = angular.isDefined(vm.ok) ? vm.ok : 'Ok';
        vm.cancel = angular.isDefined(vm.cancel) ? vm.cancel : 'Cancel';
        vm.onCancel = angular.isDefined(vm.onCancel) ? vm.onCancel : angular.noop;
        vm.okClass = angular.isDefined(vm.okStyle) ? 'btn-rounded--' + vm.okStyle : '';
        vm.cancelClass = angular.isDefined(vm.cancelStyle) ? 'btn-rounded--' + vm.cancelStyle : 'btn-rounded--gray';
        vm.confirmIf = angular.isDefined(vm.confirmIf) ? vm.confirmIf : true;
        vm.showCancel = angular.isDefined(vm.showCancel) ? vm.showCancel : true;
      }

      function onTrigger() {
        var position = getModalPosition();
        var modal;

        if (vm.confirmIf) {
          vm.left = position.left;
          vm.top = position.top - vm.getOffset();

          modal = $modal.open(modalOptions);
          modal.result.then(onOk, onCancel);
        } else {
          vm.onOk();
        }

        function onOk() {
          vm.onOk();
        }

        function onCancel() {
          vm.onCancel();
        }
      }

      // Grafted in from ui.bootstraps $position.positionElements()
      function getModalPosition() {
        var posParts = vm.position.split('-');
        var pos0 = posParts[0];
        var pos1 = posParts[1] || 'center';
        var hostElPos = vm.getPosition();
        var targetElPos = {};

        var targetElWidth = vm.size.width;
        var targetElHeight = vm.size.height;

        var shiftWidth = {
          center: widthCenter,
          left: widthLeft,
          right: widthRight
        };

        var shiftHeight = {
          center: heightCenter,
          top: heightTop,
          bottom: heightBottom
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;

        function widthRight() {
          return hostElPos.left + hostElPos.width;
        }

        function widthLeft() {
          return hostElPos.left;
        }

        function widthCenter() {
          return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
        }

        function heightBottom() {
          return hostElPos.top + hostElPos.height;
        }

        function heightTop() {
          return hostElPos.top;
        }

        function heightCenter() {
          return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('contentHeader', ContentHeaderDirective);

  /** @ngInject */
  function ContentHeaderDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        short: '=?'
      },
      transclude: true,
      link: link,
      templateUrl: 'app/components/content-header/content-header.html',
      controller: ContentHeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ContentHeaderController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.short = angular.isDefined(vm.short) ? vm.short : false;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('contentPageForm', ContentPageFormDirective);

  /** @ngInject */
  function ContentPageFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        contentPageRecord: '=?',
        heading: '@?',
        home: '=?',
        homeParams: '=?'
      },
      link: link,
      templateUrl: 'app/components/content-page-form/content-page-form.html',
      controller: ContentPageFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ContentPageFormController($rootScope, $scope, $state, Toasts, ContentPage, lodash) {
      var vm = this;

      // SO FORM DOESN'T PRELOAD VALIDATION ERRORS
      vm.showValidationMessages = false;

      // METHODS
      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.activate = activate;

      activate();

      function activate() {
      }

      function backToList() {
        $state.go(vm.home, vm.homeParams);
      }

      function showErrors() {
        return vm.showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.showValidationMessages && vm.form.$invalid;
        }

        return vm.showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {
        vm.showValidationMessages = true;

        // This is so errors can be displayed for 'untouched' angular-schema-form fields
        $scope.$broadcast('schemaFormValidate');

        if (vm.form.$valid) {
          // If editing update rather than save
          if (vm.contentPageRecord.id) {
            vm.contentPageRecord.$update(updateSuccess, saveFailure);
          } else {
            vm.contentPageRecord.$save(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          $rootScope.$emit('newPageAdded', {});
          updateSuccess();
        }

        function updateSuccess() {
          Toasts.toast('Content saved.');
          backToList();
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('navPages', NavPagesDirective);

  /** @ngInject */
  function NavPagesDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        item: '='
      },
      link: link,
      templateUrl: 'app/components/content-pages/nav-pages.html',
      controller: NavPagesController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function NavPagesController($rootScope, $scope, $state, $q, ContentPage, lodash) {
      var vm = this;

      // METHODS
      vm.isActive = isActive;
      vm.activate = activate;

      $rootScope.$on('newPageAdded', updatePageList);

      $rootScope.$on('pageRemoved', updatePageList);

      function activate() {
        updatePageList();
      }

      function isActive() {
        return $state.includes(vm.item.state);
      }

      function updatePageList() {
        $q.when(ContentPage.query()).then(handleResults);

        function handleResults(pages) {
          vm.pages = pages;
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('detailsTable', DetailsTableDirective);

  /** @ngInject */
  function DetailsTableDirective() {
    var directive = {
      restrict: 'AE',
      transclude: true,
      scope: {
        heading: '@?'
      },
      link: link,
      templateUrl: 'app/components/details-table/details-table.html',
      controller: DetailsTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function DetailsTableController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.heading = angular.isDefined(vm.heading) ? vm.heading : 'Details';
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('EditSettingModal', EditSettingFactory);

  /** @ngInject */
  function EditSettingFactory($modal) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal(setting) {
      var modalOptions = {
        templateUrl: 'app/components/edit-setting-modal/edit-setting-modal.html',
        controller: EditSettingModalController,
        controllerAs: 'vm',
        resolve: {
          setting: resolveSetting
        },
        windowTemplateUrl: 'app/components/common/modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveSetting() {
        return setting;
      }
    }
  }

  /** @ngInject */
  function EditSettingModalController(setting, Toasts, $modalInstance) {
    var vm = this;

    // Make a copy to modifications are not reflected elsewhere
    vm.setting = angular.copy(setting);
    vm.onSubmit = onSubmit;
    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;

    activate();

    function activate() {
      determineInputType();
      // TODO: Use formly to create an input with type, error messages, and validation
    }

    function onSubmit() {
      vm.showValidationMessages = true;

      if (vm.form.$valid) {
        vm.setting.$update(updateSuccess, updateFailure);
      }

      function updateSuccess() {
        $modalInstance.close(vm.setting);
        Toasts.toast('Setting successfully saved.');
      }

      function updateFailure() {
        Toasts.error('Server returned an error while updating.');
      }
    }

    function showErrors() {
      return vm.showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return vm.showValidationMessages && vm.form.$invalid;
      }

      return vm.showValidationMessages && vm.form[field].$invalid;
    }

    // Private

    function determineInputType() {
      var type = 'text';

      // TODO: List is far from complete
      switch (setting.value_type) {
        case 'password':
          type = 'password';
          break;
        case 'json':
        case 'certificate':
          type = 'textarea';
          break;
      }
      vm.inputType = type;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('footer', FooterDirective);

  /** @ngInject */
  function FooterDirective() {
    var directive = {
      restrict: 'AE',
      replace: true,
      link: link,
      templateUrl: 'app/components/footer/footer.html',
      controller: FooterController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function FooterController(Version) {
      var vm = this;
      vm.activate = activate;

      function activate() {
        updateVersion();
      }

      function updateVersion() {
        Version.get().$promise.then(handleResults);

        function handleResults(version) {
          vm.version = version.jellyfish_version;
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .run(initFields);

  /** @ngInject */
  function initFields(Forms) {
    // Generic text input
    Forms.fields('text', {
      key: 'value',
      type: 'text',
      templateOptions: {
        label: 'Text'
      }
    });

    Forms.fields('password', {
      key: 'value',
      type: 'password',
      templateOptions: {
        label: 'Password'
      }
    });

    // Generic textarea
    Forms.fields('textarea', {
      key: 'value',
      type: 'textarea',
      templateOptions: {
        label: 'Describe',
        rows: 3
      }
    });

    // Generic checkbox
    Forms.fields('checkbox', {
      key: 'value',
      type: 'checkbox',
      templateOptions: {
        label: 'Toggle'
      }
    });

    // Generic select
    Forms.fields('select', {
      key: 'value',
      type: 'select',
      templateOptions: {
        label: 'Select',
        options: []
      }
    });

    // Generic date
    Forms.fields('date', {
      key: 'value',
      type: 'date',
      templateOptions: {
        label: 'Date'
      }
    });    

    // Generic email
    Forms.fields('email', {
      key: 'value',
      type: 'email',
      templateOptions: {
        label: 'Email'
      }
    });
  }
})();

/* global apiCheck:false */
(function(apiCheck) {
  'use strict';

  angular.module('app.components')
    .constant('jfApiCheck', apiCheck({
      output: {
        prefix: 'Jellyfish Fields:'
      }
    }))
    .run(wrappers)
    .run(types)
    .run(validation);

  /** @ngInject */
  function wrappers(formlyConfig, jfApiCheck) {
    formlyConfig.setWrapper([
      {
        name: 'jfField',
        templateUrl: 'app/components/forms/wrappers/field.html'
      },
      {
        name: 'jfLabel',
        templateUrl: 'app/components/forms/wrappers/label.html',
        apiCheck: checkLabel
      },
      {
        name: 'jfHasError',
        templateUrl: 'app/components/forms/wrappers/has-error.html'
      },
      {
        name: 'jfLoading',
        templateUrl: 'app/components/forms/wrappers/loading.html'
      }
    ]);

    function checkLabel() {
      return {
        templateOptions: {
          label: jfApiCheck.string
        }
      };
    }
  }

  /** @ngInject */
  function types(formlyConfig, jfApiCheck, lodash) {
    textField();
    emailField();
    passwordField();
    textareaField();
    checkboxField();
    selectField();
    dateField();
    priceField();
    asyncSelectField();
    dataSelectField();
    questionsField();
    tagsField();
    imageChooserField();
    multipleOptionsField();

    function textField() {
      formlyConfig.setType({
        name: 'text',
        template: '<input type="text" class="field__input" ng-model="model[options.key]" autocomplete="off" ' +
          'aria-labelledby="{{ ::id }}-label"/>',
        wrapper: ['jfHasError', 'jfLabel', 'jfField']
      });
    }

    function emailField() {
      formlyConfig.setType({
        name: 'email',
        template: '<input type="email" class="field__input" ng-model="model[options.key]" autocomplete="off" ' +
          'aria-labelledby="{{ ::id }}-label"/>',
        wrapper: ['jfHasError', 'jfLabel', 'jfField']
      });
    }

    function passwordField() {
      formlyConfig.setType({
        name: 'password',
        template: '<input type="password" class="field__input" ng-model="model[options.key]" autocomplete="off" ' +
          'aria-labelledby="{{ ::id }}-label"/>',
        wrapper: ['jfHasError', 'jfLabel', 'jfField']
      });
    }

    function textareaField() {
      formlyConfig.setType({
        name: 'textarea',
        template: '<textarea class="field__input" ng-model="model[options.key]" ' +
          'aria-labelledby="{{ ::id }}-label"></textarea>',
        wrapper: ['jfHasError', 'jfLabel', 'jfField'],
        defaultOptions: {
          templateOptions: {
            rows: 3
          },
          ngModelAttrs: {
            rows: {attribute: 'rows'}
          }
        },
        apiCheck: checkTextarea
      });

      function checkTextarea() {
        return {
          templateOptions: {
            rows: jfApiCheck.number.optional
          }
        };
      }
    }

    function checkboxField() {
      formlyConfig.setType({
        name: 'checkbox',
        template: '<div class="field__checkbox"><input ng-model="model[options.key]" type="checkbox"/>' +
        '<label for="{{ options.id }}">{{ to.checkboxLabel || to.label }}</label></div>',
        wrapper: ['jfHasError', 'jfLabel', 'jfField'],
        apiCheck: checkCheckbox
      });

      function checkCheckbox() {
        return {
          templateOptions: {
            checkboxLabel: jfApiCheck.string.optional
          }
        };
      }
    }

    function selectField() {
      formlyConfig.setType({
        name: 'select',
        template: '<select class="field__input" ng-model="model[options.key]" ' +
          'aria-labelledby="{{ ::id }}-label"></select>',
        wrapper: ['jfHasError', 'jfLabel', 'jfField'],
        defaultOptions: selectDefaultOptions,
        apiCheck: checkSelect
      });

      function checkSelect() {
        return {
          templateOptions: {
            options: jfApiCheck.arrayOf(jfApiCheck.object),
            labelProp: jfApiCheck.string.optional,
            valueProp: jfApiCheck.string.optional,
            groupProp: jfApiCheck.string.optional
          }
        };
      }

      function selectDefaultOptions(options) {
        var defaultNgOptions = 'option[to.valueProp || \'value\'] ' +
          'as option[to.labelProp || \'label\'] ' +
          'group by option[to.groupProp || \'group\'] ' +
          'for option in to.options';
        var ngOptions = options.templateOptions.ngOptions || defaultNgOptions;
        var ngModelAttrs = {};

        ngModelAttrs[ngOptions] = {value: 'ng-options'};

        return {
          ngModelAttrs: ngModelAttrs
        };
      }
    }

    function dateField() {
      var attributes = [
        'date-disabled',
        'custom-class',
        'show-weeks',
        'starting-day',
        'init-date',
        'min-mode',
        'max-mode',
        'format-day',
        'format-month',
        'format-year',
        'format-day-header',
        'format-day-title',
        'format-month-title',
        'year-range',
        'shortcut-propagation',
        'datepicker-popup',
        'show-button-bar',
        'current-text',
        'clear-text',
        'close-text',
        'close-on-date-selection',
        'datepicker-append-to-body'
      ];

      var bindings = [
        'datepicker-mode',
        'min-date',
        'max-date'
      ];

      var ngModelAttrs = {};

      angular.forEach(attributes, attributer);
      angular.forEach(bindings, binder);

      formlyConfig.setType({
        name: 'date',
        wrapper: ['jfHasError', 'jfLabel', 'jfField'],
        templateUrl: 'app/components/forms/types/date.html',
        defaultOptions: {
          ngModelAttrs: ngModelAttrs,
          templateOptions: {
            datepickerPopup: 'yyyy-MM-dd',
            datepickerOptions: {
              formatYear: 'yy',
              startingDay: 0,
              showWeeks: false
            }
          }
        }
      });

      function attributer(attr) {
        ngModelAttrs[lodash.camelCase(attr)] = {attribute: attr};
      }

      function binder(binding) {
        ngModelAttrs[lodash.camelCase(binding)] = {bound: binding};
      }
    }

    function priceField() {
      formlyConfig.setType({
        name: 'price',
        extends: 'text',
        defaultOptions: {
          templateOptions: {
            scale: 0
          },
          validators: {
            pattern: {
              expression: function(viewValue, modelValue, scope) {
                var value = modelValue || viewValue;
                var scale = scope.to.scale;
                var precision = scope.to.precision - scale;
                var pRx = '\\d{1,' + precision + '}';
                var sRx = 0 < scale ? '(?:\\.\\d{1,' + scale + '})?' : '';
                var rx = new RegExp(['^', pRx, sRx, '$'].join(''));

                return rx.test(value);
              },
              message: function(foo, bar, scope) {
                var to = scope.to;

                return [
                  'Enter a value between',
                  Math.pow(10, to.scale * -1).toFixed(to.scale),
                  'and',
                  (Math.pow(10, to.precision - to.scale) - Math.pow(10, to.scale * -1)).toFixed(to.scale)
                ].join(' ');
              }
            }
          }
        },
        apiCheck: checkPrice
      });

      function checkPrice() {
        return {
          templateOptions: {
            precision: jfApiCheck.number,
            scale: jfApiCheck.number.optional
          }
        };
      }
    }

    function asyncSelectField() {
      formlyConfig.setType({
        name: 'async_select',
        extends: 'select',
        wrapper: ['jfHasError', 'jfLoading', 'jfLabel', 'jfField']
      });
    }

    function dataSelectField() {
      formlyConfig.setType({
        name: 'data_select',
        extends: 'select',
        apiCheck: checkDataSelect,
        controller: DataSelectController
      });

      function checkDataSelect() {
        return {
          templateOptions: {
            dataKey: jfApiCheck.string
          }
        };
      }

      /** @ngInject */
      function DataSelectController($scope, Toasts) {
        var dataKey = $scope.to.dataKey;

        if (angular.isUndefined(dataKey)) {
          Toasts.warning([$scope.to.label, 'has no dataKey'].join(' '));

          return;
        }

        if (angular.isUndefined($scope.formState[dataKey])) {
          Toasts.warning([$scope.to.label, 'cannot find', dataKey, 'in formState'].join(' '));
        }

        $scope.to.options = $scope.formState[dataKey];
      }
    }

    function questionsField() {
      formlyConfig.setType({
        name: 'questions',
        template: '<formly-form form="form" model="options.data.values" ' +
          'fields="options.data.fields" options="formOptions"></formly-form>',
        defaultOptions: {
          data: {
            fields: [],
            values: {}
          }
        },
        controller: QuestionsController
      });

      /** @ngInject */
      function QuestionsController($scope, lodash, Forms) {
        var templateOptions = [
          'label', 'placeholder', // General
          'options', 'labelProp', 'valueProp', 'groupProp', // Select
          'rows', // Textarea
          'minlength', 'maxlength', 'pattern' // Validation
        ];
        var data = $scope.model[$scope.options.key];

        $scope.options.data.fields = lodash.map(data, buildField);
        $scope.options.data.values = lodash(data).indexBy('name').mapValues('value').value();

        // Make the parent model available
        $scope.options.data.values.$parent = $scope.model;

        function buildField(question) {
          var field = angular.copy(Forms.fields(question.field || 'text'));

          field.key = question.name;

          if (angular.isDefined(field.templateOptions)) {
            angular.merge(field.templateOptions, lodash(question).pick(templateOptions).value());
          }

          if (angular.isDefined(question.required)) {
            setRequired();
          }

          field.watcher = {
            listener: listener
          };

          return field;

          function setRequired() {
            switch (question.required) {
              case 'if_new':
                if (angular.isUndefined(field.expressionProperties)) {
                  field.expressionProperties = {};
                }
                field.expressionProperties['templateOptions.required'] = '!model.id';
                break;
              case true:
                if (angular.isUndefined(field.templateOptions)) {
                  field.templateOptions = {};
                }
                field.templateOptions.required = true;
                break;
              case false:
                break;
              default:
                if (angular.isUndefined(field.expressionProperties)) {
                  field.expressionProperties = {};
                }
                field.expressionProperties['templateOptions.required'] = question.required;
            }
          }

          function listener(field, newValue, oldValue, scope, stopWatching) {
            var name = field.key;
            var question = lodash.find(data, 'name', name);

            if (newValue === oldValue) {
              return;
            }

            question.value = newValue;
          }
        }
      }
    }

    function tagsField() {
      formlyConfig.setType({
        name: 'tags',
        templateUrl: 'app/components/forms/types/tags.html',
        wrapper: ['jfHasError', 'jfLabel', 'jfField'],
        defaultOptions: {
          ngModelAttrs: {
            minTags: {
              attribute: 'min-tags'
            },
            maxTags: {
              attribute: 'max-tags'
            }
          }
        },
        controller: TagsController,
        apiCheck: checkTags,
        apiCheckInstance: jfApiCheck
      });

      function checkTags() {
        return {
          templateOptions: {
            minTags: jfApiCheck.number.optional,
            maxTags: jfApiCheck.number.optional
          }
        };
      }

      /** @ngInject */
      function TagsController($scope, Tag, TAG_QUERY_LIMIT) {
        $scope.queryTags = queryTags;

        function queryTags(query) {
          return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
        }
      }
    }

    function imageChooserField() {
      formlyConfig.setType({
        name: 'image-chooser',
        template: '<image-chooser image="model[options.key]"></image-chooser>',
        defaultOptions: {
          noFormControl: true
        }
      });
    }

    function multipleOptionsField() {
      formlyConfig.setType({
        name: 'multiple-options',
        templateUrl: 'app/components/forms/types/multiple-options.html',
        defaultOptions: {
          noFormControl: true,
          wrapper: null,
          templateOptions: {
            inputOptions: {
              type: 'text',
              wrapper: null
            }
          }
        },
        controller: MultipleOptionsController
      });

      /** @ngInject */
      function MultipleOptionsController($scope) {
        $scope.copyItemOptions = copyItemOptions;

        function copyItemOptions(index) {
          var options = angular.copy($scope.to.inputOptions);

          return options;
        }
      }
    }
  }

  /** @ngInject */
  function validation(formlyConfig, jfApiCheck, formlyValidationMessages) {
    formlyConfig.extras.apiCheckInstance = jfApiCheck;
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'form.$submitted';
    formlyValidationMessages.messages.required = 'to.label + " is required"';
    formlyValidationMessages.messages.email = '$viewValue + " is not a valid email address"';
    formlyValidationMessages.messages.minlength = 'to.label + " is too short"';
    formlyValidationMessages.messages.maxlength = 'to.label + " is too long"';
    formlyValidationMessages.messages.pattern = 'to.label + " is not formatted correctly"';
  }
})(apiCheck);

(function() {
  'use strict';

  angular.module('app.components')
    .provider('Forms', FormsProvider);

  function FormsProvider($compileProvider) {
    var provider = {
      register: register,
      $get: FormsHelper
    };

    return provider;

    function register(name, options) {
      var scope = {
        record: '=',
        heading: '@',
        backTo: '@',
        backToParams: '=?',
        subHeading: '@?',
        successMsg: '@?',
        failureMsg: '@?',
        options: '=?',
        debug: '@?'
      };

      $compileProvider.directive(name, FormsDirective);

      function FormsDirective() {
        var directive = {
          restrict: 'E',
          scope: angular.extend(scope, options.scope || {}),
          link: options.link || link,
          templateUrl: options.templateUrl || 'app/components/forms/form.html',
          controller: FormsController,
          controllerAs: 'vm',
          bindToController: true
        };

        return directive;

        function link(scope, element, attrs, vm, transclude) {
          vm.activate();
        }

        /** @ngInject */
        function FormsController($injector, $state, Toasts) {
          var vm = this;

          vm.fields = options.fields;

          vm.activate = activate;
          vm.goBack = goBack;
          vm.hasErrors = hasErrors;
          vm.onSubmit = onSubmit;

          if (angular.isDefined(options.controller)) {
            $injector.invoke(options.controller, this);
          }

          function activate() {
            vm.successMsg = vm.successMsg || 'Save successful!';
            vm.failureMsg = vm.failureMsg || 'Error encountered during save attempt!';
            vm.options = vm.options || {};
            vm.debug = vm.debug || false;
            if (angular.isDefined(vm.afterActivate)) {
              vm.afterActivate();
            }
          }

          function goBack() {
            $state.go(vm.backTo, vm.backToParams || {});
          }

          function hasErrors(field) {
            if (angular.isUndefined(field)) {
              return vm.form.$submitted && vm.form.$invalid;
            }

            return vm.form.$submitted && vm.form[field].$invalid;
          }

          function onSubmit() {
            if (vm.form.$invalid) {
              return false;
            }

            if (vm.record.id) {
              vm.record.$update(saveSuccess, saveFailure);
            } else {
              vm.record.$save(saveSuccess, saveFailure);
            }

            function saveSuccess() {
              Toasts.toast(vm.successMsg);
              goBack();
            }

            function saveFailure(error) {
              var data = error.data;
              var message = vm.failureMsg;

              if (angular.isObject(data) && angular.isDefined(data.error)) {
                message = data.error;
              }

              Toasts.error(message);
            }
          }
        }
      }
    }

    function FormsHelper() {
      var service = {
        fields: fields
      };
      var fieldsMap = {};

      return service;

      function fields(key, field) {
        if (angular.isDefined(field)) {
          fieldsMap[key] = field;
        }

        return fieldsMap[key] || {noFormControl: true, template: '<div>fieldsMap["' + key + '"] is undefined</div>'};
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(orderForm);

  /** @ngInject */
  function orderForm(FormsProvider) {
    FormsProvider.register('orderForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              model: 'model.service',
              templateOptions: {
                label: 'Service Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A service name must be provided"'
                }
              }
            },
            {
              key: 'project_id',
              type: 'data_select',
              templateOptions: {
                label: 'Project',
                options: [],
                labelProp: 'name',
                valueProp: 'id',
                dataKey: 'projects',
                required: true
              },
              validation: {
                messages: {
                  required: '"You must select a project for the service to belong to"'
                }
              }
            },
            {
              key: 'answers',
              type: 'questions'
            }
          ]
        }
      ]
    });
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(form);

  /** @ngInject */
  function form(FormsProvider) {
    FormsProvider.register('productCategoryForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A category name must be provided"'
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              templateOptions: {
                label: 'Description',
                required: true
              },
              validation: {
                messages: {
                  required: '"A description must be provided"'
                }
              }
            },
            {
              key: 'tags',
              type: 'tags',
              templateOptions: {
                label: 'Tag(s)',
                minTags: 1
              },
              validation: {
                messages: {
                  minTags: '"At least one tag must be used"'
                }
              }
            }
          ]
        }
      ]
    });
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(productForm);

  /** @ngInject */
  function productForm(FormsProvider) {
    FormsProvider.register('productForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A product name must be provided"'
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              templateOptions: {
                label: 'Description',
                required: true
              },
              validation: {
                messages: {
                  required: '"A product description must be provided"'
                }
              }
            },
            {
              key: 'active',
              type: 'checkbox',
              templateOptions: {
                label: 'Available',
                checkboxLabel: 'Active'
              }
            },
            {
              key: 'setup_price',
              type: 'price',
              templateOptions: {
                label: 'Setup Price',
                required: true,
                precision: 10,
                scale: 4
              }
            },
            {
              key: 'monthly_price',
              type: 'price',
              templateOptions: {
                label: 'Monthly Price',
                required: true,
                precision: 10,
                scale: 4
              }
            },
            {
              key: 'hourly_price',
              type: 'price',
              templateOptions: {
                label: 'Hourly Price',
                required: true,
                precision: 10,
                scale: 4
              }
            },
            {
              key: 'answers',
              type: 'questions'
            },
            {
              key: 'tags',
              type: 'tags',
              templateOptions: {
                label: 'Tag(s)',
                minTags: 1
              },
              validation: {
                messages: {
                  minTags: '"At least one tag must be entered"'
                }
              }
            }
          ]
        },
        {
          className: 'forms__aside',
          fieldGroup: [
            {
              key: 'img',
              type: 'image-chooser'
            }
          ]
        }
      ]
    });
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(projectQuestionForm);

  /** @ngInject */
  function projectQuestionForm(FormsProvider) {
    FormsProvider.register('projectQuestionForm', {
      fields: [
        {
          className: 'forms__full',
          fieldGroup: [
            {
              key: 'question',
              type: 'text',
              templateOptions: {
                label: 'Question',
                labelClass: 'field__aside--slim',
                required: true
              },
              validation: {
                messages: {
                  required: '"A question must be provided"'
                }
              }
            },
            {
              key: 'help_text',
              type: 'text',
              templateOptions: {
                label: 'Help Text',
                labelClass: 'field__aside--slim'
              }
            },
            {
              key: 'required',
              type: 'checkbox',
              templateOptions: {
                label: 'Answer',
                labelClass: 'field__aside--slim',
                checkboxLabel: 'Required'
              }
            },
            {
              key: 'field_type',
              type: 'select',
              templateOptions: {
                label: 'Question Type',
                labelClass: 'field__aside--slim',
                options: [
                  {label: '"Yes or No"', value: 'yes_no'},
                  {label: 'Multiple Choice', value: 'multiple'},
                  {label: 'Text Input', value: 'text'},
                  {label: 'Date Input', value: 'date'},
                  {label: 'Checkbox Toggle', value: 'checkbox'}
                ],
                onChange: typeChanged
              }
            },
            {
              key: 'options',
              type: 'multiple-options',
              templateOptions: {
                label: '',
                labelClass: 'field__aside--slim',
                noFormControl: true,
                sortableOptions: {
                  axis: 'y',
                  cursor: 'move',
                  handle: '.multiple-option__action--handle',
                  opacity: 0.9,
                  placeholder: 'multiple-options__placeholder'
                }
              },
              hideExpression: 'model.field_type != "multiple"'
            }
          ]
        }
      ]
    });

    function typeChanged(value, field, scope) {
      if ('multiple' !== value) {
        scope.model.options.length = 0;
      } else {
        scope.model.options.push('');
        scope.model.options.push('');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(projectForm);

  /** @ngInject */
  function projectForm(FormsProvider) {
    FormsProvider.register('projectForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A project name must be provided"'
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              templateOptions: {
                label: 'Description'
              }
            },
            {
              key: 'budget',
              type: 'price',
              templateOptions: {
                label: 'Budget',
                required: true,
                precision: 12,
                scale: 2
              },
              validation: {
                messages: {
                  required: '"A budget must be provided"'
                }
              }
            },
            {
              key: 'monthly_budget',
              type: 'price',
              templateOptions: {
                label: 'Monthly Budget',
                required: true,
                precision: 12,
                scale: 2
              },
              validation: {
                messages: {
                  required: '"A monthly budget must be provided"'
                }
              }
            },
            {
              key: 'start_date',
              type: 'date',
              templateOptions: {
                label: 'Start Date',
                required: true
              },
              expressionProperties: {
                'templateOptions.maxDate': 'model.end_date'
              },
              validation: {
                messages: {
                  required: '"A start date must be provided"'
                }
              }
            },
            {
              key: 'end_date',
              type: 'date',
              templateOptions: {
                label: 'End Date',
                required: true
              },
              expressionProperties: {
                'templateOptions.minDate': 'model.start_date'
              },
              validation: {
                messages: {
                  required: '"An end date must be provided"'
                }
              }
            },
            {
              key: 'answers',
              type: 'questions'
            }
          ]
        },
        {
          className: 'forms__aside',
          fieldGroup: [
            {
              key: 'img',
              type: 'image-chooser'
            }
          ]
        }
      ]
    });
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(providerForm);

  /** @ngInject */
  function providerForm(FormsProvider) {
    FormsProvider.register('providerForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A provider name must be provided"'
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              templateOptions: {
                label: 'Description'
              }
            },
            {
              key: 'active',
              type: 'checkbox',
              templateOptions: {
                label: 'Available',
                checkboxLabel: 'Active'
              }
            },
            {
              key: 'answers',
              type: 'questions'
            },
            {
              key: 'tags',
              type: 'tags',
              templateOptions: {
                label: 'Tags'
              }
            }
          ]
        }
      ]
    });
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .config(userForm);

  /** @ngInject */
  function userForm(FormsProvider) {
    FormsProvider.register('userForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'first_name',
              type: 'text',
              templateOptions: {
                label: 'First Name',
                required: true,
                placeholder: 'Enter a first name.'
              }
            },
            {
              key: 'last_name',
              type: 'text',
              templateOptions: {
                label: 'Last Name',
                required: true,
                placeholder: 'Enter a last name.'
              }
            },
            {
              key: 'email',
              type: 'email',
              controller: EmailFieldController,
              templateOptions: {
                label: 'Email',
                required: true,
                type: 'email',
                placeholder: 'Enter a valid email address.'
              },
              asyncValidators: {
                uniqueEmail: {
                  expression: uniqueEmail,
                  message: '"This email address is already taken, please try another."'
                }
              }
            },
            {
              key: 'phone',
              type: 'text',
              templateOptions: {
                label: 'Phone Number',
                placeholder: 'Enter a valid phone number.'
              },
              validators: {
                phoneNumber: {
                  expression: validatePhoneNumber,
                  message: '$viewValue + " is not a valid phone number"'
                }
              }
            },
            {
              key: 'password',
              type: 'password',
              templateOptions: {
                label: 'Password',
                placeholder: 'Enter a password.',
                minlength: 8
              },
              expressionProperties: {
                'templateOptions.required': '!model.id'
              },
              validation: {
                messages: {
                  required: '"A password must be provided"'
                }
              }
            },
            {
              key: 'password_confirmation',
              type: 'password',
              extras: {validateOnModelChange: true},
              templateOptions: {
                label: 'Confirm Password',
                placeholder: 'Please re-enter your password',
                minlength: 8
              },
              expressionProperties: {
                'templateOptions.required': 'model.password'
              },
              validators: {
                samePassword: samePassword
              },
              validation: {
                messages: {
                  required: '"A password confirmation must be provided"',
                  samePassword: '"Must match your password"'
                }
              }
            },
            {
              key: 'role',
              type: 'select',
              templateOptions: {
                label: 'Role',
                options: [
                  {label: 'User', value: 'user'},
                  {label: 'Manager', value: 'manager'},
                  {label: 'Admin', value: 'admin'}
                ],
                required: true
              },
              validation: {
                messages: {
                  required: '"An user status is required."'
                }
              }
            }
          ]
        }
      ]
    });

    /** @ngInject */
    function EmailFieldController($scope, $q, Staff) {
      $scope.Staff = Staff;
      $scope.q = $q;

      init();

      function init() {
        $scope.initialEmail = $scope.model.email;
      }
    }

    function uniqueEmail(view, model, scope) {
      var defer = scope.q.defer();

      if (scope.model.id && scope.initialEmail && view === scope.initialEmail) {
        defer.resolve();
      } else {
        scope.Staff.query({query: view, with_deleted: true}).$promise.then(handleRequest);
      }

      return defer.promise;

      function handleRequest(res) {
        return res.length > 0 ? defer.reject() : defer.resolve();
      }
    }

    function samePassword(view, model, scope) {
      return view === scope.model.password;
    }

    function validatePhoneNumber($viewValue, $modelValue, scope) {
      var value = $viewValue || $modelValue;

      return value ? /^\+?[0-9\-]+\*?$/.test(value) : true;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('groupForm', GroupFormDirective);

  /** @ngInject */
  function GroupFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        group: '=',
        staff: '=',
        heading: '@'
      },
      link: link,
      templateUrl: 'app/components/group-form/group-form.html',
      controller: GroupFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function GroupFormController($state, Toasts, lodash) {
      var vm = this;

      vm.activate = activate;
      activate();

      vm.home = 'admin.groups.list';

      vm.addMember = addMember;
      vm.removeMember = removeMember;

      vm.backToList = backToList;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
        initMembers();
      }

      function backToList() {
        $state.go(vm.home);
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.form.$submitted && vm.form.$invalid;
        }

        return vm.form.$submitted && vm.form[field].$invalid;
      }

      function onSubmit() {
        if (vm.form.$valid) {
          if (vm.group.id) {
            vm.group.$update(saveSuccess, saveFailure);
          } else {
            vm.group.$save(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Group saved.');
          $state.go(vm.home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function addMember(staffId) {
        var staff = lodash.find(vm.staff, {id: staffId});

        if (!staff) {
          return;
        }

        if (!lodash.find(vm.members, {id: staffId})) {
          vm.members.push(staff);
        }

        if (-1 === vm.group.staff_ids.indexOf(staffId)) {
          vm.group.staff_ids.push(staffId);
        }

        vm.selectedStaff = null;
      }

      function removeMember(staffId) {
        lodash.remove(vm.members, {id: staffId});
        lodash.pull(vm.group.staff_ids, staffId);
      }

      // Private

      function initMembers() {
        vm.members = [];
        angular.forEach(vm.group.staff_ids, addMember);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('groupsTable', GroupsTableDirective);

  /** @ngInject */
  function GroupsTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        groups: '='
      },
      link: link,
      templateUrl: 'app/components/groups-table/groups-table.html',
      controller: GroupsTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function GroupsTableController(lodash, Group, Toasts) {
      var vm = this;

      vm.activate = activate;
      vm.deleteGroup = deleteGroup;

      function activate() {
      }

      function deleteGroup(index) {
        var group = vm.groups[index];

        if (!group) {
          return;
        }

        lodash.remove(vm.groups, {id: group.id});
        group.$delete(deleteSuccess, deleteError);

        function deleteSuccess() {
          Toasts.toast('Group deleted.');
        }

        function deleteError() {
          Toasts.error('Could not delete group. Try again later.');
          vm.groups.splice(index, 0, group);
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('imageChooser', ImageChooserDirective);

  /** @ngInject */
  function ImageChooserDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        image: '='
      },
      link: link,
      templateUrl: 'app/components/image-chooser/image-chooser.html',
      controller: ImageChooserController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ImageChooserController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        // TODO Implement

        // Create a Image service to talk to the server  !!Keep service concerns out of this directive!!
        // Create a modal service that has a showModal() !!Keep modal concerns out of this directive!!
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('latestAlertsTable', LatestAlertsTableDirective);

  /** @ngInject */
  function LatestAlertsTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        alerts: '='
      },
      link: link,
      templateUrl: 'app/components/latest-alerts-table/latest-alerts-table.html',
      controller: LatestAlertsTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function LatestAlertsTableController(lodash, Alert, Toasts) {
      var vm = this;

      vm.activate = activate;
      vm.deleteAlert = deleteAlert;

      activate();

      function activate() {
      }

      function deleteAlert(alert) {
        // TODO: FIGURE OUT THE RIGHT WAY TO DO THIS
        // alert.$delete(deleteSuccess, deleteFailure) returns method not found error
        var deletedAlert = Alert.delete({id: alert.id}).$promise;
        lodash.remove(vm.alerts, {id: alert.id});
        Toasts.toast('Alert deleted.');

        function deleteSuccess() {
          lodash.remove(vm.alerts, {id: alert.id});
          Toasts.toast('Alert deleted.');
        }

        function deleteFailure() {
          Toasts.error('Server returned an error while deleting.');
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('logTable', LogTableDirective);

  /** @ngInject */
  function LogTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        heading: '@',
        records: '=',
        collapsed: '=?',
        itemsPerPage: '=?'
      },
      link: link,
      templateUrl: 'app/components/log-table/log-table.html',
      controller: LogTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function LogTableController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
        vm.itemsPerPage = angular.isDefined(vm.itemsPerPage) ? vm.itemsPerPage : 10;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('loginForm', LoginFormDirective);

  /** @ngInject */
  function LoginFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'app/components/login-form/login-form.html',
      controller: LoginFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function LoginFormController(Toasts, $state, AuthenticationService) {
      var vm = this;

      var showValidationMessages = false;
      var dashboard = 'dashboard';

      vm.email = '';
      vm.password = '';

      vm.activate = activate;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
      }

      function showErrors() {
        return showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return showValidationMessages && vm.form.$invalid;
        }

        return showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {
        showValidationMessages = true;

        if (vm.form.$valid) {
          AuthenticationService.login(vm.email, vm.password)
            .success(loginSuccess)
            .error(loginError);
        }

        function loginSuccess() {
          Toasts.toast('You have successfully logged in.');
          $state.go(dashboard);
        }

        function loginError() {
          Toasts.error('Invalid login credentials entered, please reenter and try again.');
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('MembershipModal', MembershipModalFactory);

  /** @ngInject */
  function MembershipModalFactory($modal) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal(membership) {
      var modalOptions = {
        templateUrl: 'app/components/membership-modal/membership-modal.html',
        controller: MembershipModalController,
        controllerAs: 'vm',
        resolve: {
          roles: resolveRoles,
          groups: resolveGroups,
          membership: resolveMembership
        },
        windowTemplateUrl: 'app/components/common/modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveRoles(Role) {
        return Role.query().$promise;
      }

      /** @ngInject */
      function resolveGroups(Group) {
        return Group.query().$promise;
      }

      function resolveMembership() {
        return membership;
      }
    }
  }

  /** @ngInject */
  function MembershipModalController(lodash, membership, roles, groups) {
    var vm = this;

    vm.membership = membership;

    activate();

    function activate() {
      initFields();
    }

    // Private

    function initFields() {
      vm.fields = [
        {
          key: 'group_id',
          type: 'select',
          templateOptions: {
            label: 'Group',
            options: groups,
            valueProp: 'id',
            labelProp: 'name',
            onChange: setRelations
          }
        },
        {
          key: 'role_id',
          type: 'select',
          templateOptions: {
            label: 'Role',
            options: roles,
            valueProp: 'id',
            labelProp: 'name',
            onChange: setRelations
          }
        }
      ];
    }

    function setRelations() {
      if (vm.membership.group_id) {
        vm.membership.group = lodash.find(groups, 'id', vm.membership.group_id);
      }
      if (vm.membership.role_id) {
        vm.membership.role = lodash.find(roles, 'id', vm.membership.role_id);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('computedMonthlyPrice', ComputedMonthlyPriceDirective);

  /** @ngInject */
  function ComputedMonthlyPriceDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        pricing: '=',
        quantity: '=?'
      },
      link: link,
      template: '<span>{{ vm.computeMonthlyTotal()| currency}}</span>',
      controller: ComputedMonthlyPriceController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ComputedMonthlyPriceController() {
      var vm = this;

      vm.activate = activate;
      vm.computeMonthlyTotal = computeMonthlyTotal;

      function activate() {
        vm.quantity = vm.quantity || 1;
      }

      function computeMonthlyTotal() {
        return ((parseFloat(vm.pricing.monthly_price)) + ((parseFloat(vm.pricing.hourly_price)) * 750)) * vm.quantity;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('multipleChoice', MultipleChoiceDirective);

  function MultipleChoiceDirective() {
    return {
      controller: MultipleChoiceDirectiveController,
      controllerAs: 'vm',
      link: link,
      restrict: 'E',
      scope: {
        action: '&?',
        actionText: '=',
        model: '=',
        options: '='
      },
      templateUrl: 'app/components/multiple-choice/multiple-choice.html'
    };
  }

  function MultipleChoiceDirectiveController(WIZARD_AUTOSUBMIT, WIZARD_MULTIPAGE) {
    var vm = this;

    activate();

    function activate() {
      vm.autoSubmit = WIZARD_AUTOSUBMIT;
      vm.multiPage = WIZARD_MULTIPAGE;
    }
  }

  function link(scope) {
    if (scope.vm.autoSubmit && scope.vm.multiPage) {
      scope.$watch('model', function(newValue) {
        if (newValue) {
          scope.action();
        }
      });
    }
  }
}());

(function() {
  'use strict';

  angular.module('app.components')
    .directive('navItem', NavItemDirective);

  /** @ngInject */
  function NavItemDirective(RecursionHelper) {
    var directive = {
      restrict: 'AE',
      require: '^navigation',
      scope: {
        item: '='
      },
      compile: compile,
      templateUrl: 'app/components/navigation/nav-item.html',
      controller: NavItemController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function compile(element) {
      return RecursionHelper.compile(element, link);
    }

    function link(scope, element, attrs, navigation, transclude) {
      var vm = scope.vm;

      vm.activate();
    }

    /** @ngInject */
    function NavItemController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .provider('navigationHelper', NavigationHelperProvider);

  /** @ngInject */
  function NavigationHelperProvider(lodash) {
    var provider = {
      configure: configure,
      $get: NavigationHelper
    };

    var config = {
      glue: '.',
      brandState: 'dashboard',
      items: {
        nav: [],
        sidebar: []
      },
      searches: {
        nav: new NavigationSearch(),
        sidebar: new NavigationSearch()
      }
    };

    return provider;

    function configure(cfg) {
      angular.extend(config, cfg);
    }

    /** @ngInject */
    function NavigationHelper($injector) {
      var service = {
        navItems: lodash.partial(navigationItems, 'nav'),
        navSearch: lodash.partial(navigationSearch, 'nav'),
        removeNavItem: lodash.partial(removeNavigationItem, 'nav'),

        sidebarItems: lodash.partial(navigationItems, 'sidebar'),
        sidebarSearch: lodash.partial(navigationSearch, 'sidebar'),
        removeSidebarItem: lodash.partial(removeNavigationItem, 'sidebar'),

        brandState: brandState
      };

      return service;

      function navigationItems(root, data) {
        var builder = lodash.partial(createItem, root);

        // Get all items
        if (null === data || angular.isUndefined(data)) {
          return getItem(lodash.sortBy(lodash.filter(config.items[root], filterVisible), 'order'));
        }

        // Get single item by path
        if (angular.isString(data)) {
          return lodash.find(config.items[root], 'path', data);
        }

        // Create one or more items
        if (angular.isObject(data)) {
          angular.forEach(data, builder);
        }

        function createItem(root, options, path) {
          config.items[root].push(new NavigationItem(path, options));
        }

        function getItem(scope) {
          var items = getChildren({path: ''});

          function getChildren(item) {
            item.items = lodash.filter(scope, 'parent', item.path);
            lodash.forEach(item.items, getChildren);

            return item;
          }

          return items.items;
        }

        function filterVisible(item) {
          return $injector.invoke(item.isVisible);
        }
      }

      function removeNavigationItem(root, path) {
        var tags = path.split(config.glue);
        var tag = tags.pop();
        var scope;

        if (1 === tags.length) {
          scope = config.items[root];
        } else {
          tag = tags.pop();
          scope = config.items[root].getChild(tag);
        }

        if (scope) {
          scope.removeChild(tag);
        }
      }

      function brandState() {
        return config.brandState;
      }

      function navigationSearch(root) {
        return config.searches[root];
      }
    }

    function NavigationItem(path, options) {
      var self = this;

      self.path = path;
      self.parent = path.split(config.glue).slice(0, -1).join(config.glue);

      init();

      function init() {
        // Visibility
        self.isVisible = isVisible;
        // Set defaults
        self.order = 0;
        self.collapsed = true;
        configure(options || {});
      }

      function configure(options) {
        angular.extend(self, options);
      }

      function isVisible() {
        return true;
      }
    }

    function NavigationSearch(options) {
      var self = this;

      init();

      function init() {
        // Set Defaults
        self.value = null;
        self.visible = false;
        self.icon = 'fa-search';
        self.placeholder = 'search site';
        self.onSubmit = function() {
        };
        configure(options || {});
      }

      function configure(options) {
        angular.extend(self, options);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('navigation', NavigationDirective);

  /** @ngInject */
  function NavigationDirective(MultiTransclude) {
    var directive = {
      priority: -1,
      restrict: 'AE',
      scope: {
      },
      transclude: true,
      link: link,
      templateUrl: 'app/components/navigation/navigation.html',
      controller: NavigationController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      MultiTransclude.transclude(element, transclude, true);
      vm.activate();
    }

    /** @ngInject */
    function NavigationController($rootScope, navigationHelper) {
      var vm = this;

      vm.navItems = [];
      vm.sidebarItems = [];
      vm.sidebarCollapsed = false;

      vm.activate = activate;
      vm.brandState = brandState;
      vm.navSearch = navigationHelper.navSearch();
      vm.sidebarSearch = navigationHelper.sidebarSearch();

      function activate() {
        $rootScope.$on('$navigationRefresh', reloadNavigation);
        reloadNavigation();
      }

      function brandState() {
        return navigationHelper.brandState();
      }

      // Private

      function reloadNavigation() {
        vm.navItems = navigationHelper.navItems();
        vm.sidebarItems = navigationHelper.sidebarItems();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('sidebarItem', SidebarItemDirective);

  /** @ngInject */
  function SidebarItemDirective(RecursionHelper) {
    var directive = {
      restrict: 'AE',
      require: '^navigation',
      scope: {
        item: '='
      },
      compile: compile,
      templateUrl: 'app/components/navigation/sidebar-item.html',
      controller: SidebarItemController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function compile(element) {
      return RecursionHelper.compile(element, link);
    }

    function link(scope, element, attrs, navigation, transclude) {
      var vm = scope.vm;

      vm.activate();
    }

    /** @ngInject */
    function SidebarItemController($state) {
      var vm = this;

      vm.activate = activate;
      vm.isActive = isActive;

      function activate() {
        vm.item.collapsed = !isActive();
      }

      function isActive() {
        return $state.includes(vm.item.state);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('operationsButton', OperationsButtonDirective);

  /** @ngInject */
  function OperationsButtonDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        service: '=service'
      },
      link: link,
      templateUrl: 'app/components/operations-button/operations-button.html',
      controller: OperationsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function OperationsController(Service) {
      var vm = this;

      vm.activate = activate;
      vm.operations = [{name: 'Deprovision'}];
      vm.executeOperation = executeOperation;

      function activate() {
      }

      function executeOperation(operation) {
        Service.operation({id: vm.service.id, operation: operation.toLowerCase()})
          .$promise.then(operationSuccess, operationFailure);
      }

      function operationSuccess(data) {
      }

      function operationFailure(data) {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('productCategoriesTable', ProductCategoriesTableDirective);

  /** @ngInject */
  function ProductCategoriesTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        productCategories: '='
      },
      link: link,
      templateUrl: 'app/components/product-categories-table/product-categories-table.html',
      controller: ProductCategoriesTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProductCategoriesTableController(Toasts) {
      var vm = this;

      vm.activate = activate;
      vm.deleteCategory = deleteCategory;

      function activate() {
      }

      function deleteCategory(index) {
        var category = vm.productCategories[index];

        category.$delete(deleteSuccess, deleteFailure);

        function deleteSuccess() {
          vm.questions.splice(index, 1);
          Toasts.toast('Product Category deleted.');
        }

        function deleteFailure() {
          Toasts.error('Server returned an error while deleting.');
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('productDescription', ProductDescriptionDirective);

  /** @ngInject */
  function ProductDescriptionDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        product: '='
      },
      link: link,
      templateUrl: 'app/components/product-description/product-description.html',
      controller: ProductDescriptionController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProductDescriptionController($state) {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('ProductTypeModal', ProductTypeModalFactory);

  /** @ngInject */
  function ProductTypeModalFactory($modal) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/product-type-modal/product-type-modal.html',
        controller: ProductTypeModalController,
        controllerAs: 'vm',
        resolve: {
          providers: resolveProviders
        },
        windowTemplateUrl: 'app/components/common/modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveProviders(Provider) {
        return Provider.query().$promise;
      }
    }
  }

  /** @ngInject */
  function ProductTypeModalController(providers) {
    var vm = this;

    vm.selections = {
      providerId: null,
      productTypeId: null
    };

    activate();

    function activate() {
      initFields();
    }

    // Private

    function initFields() {
      vm.fields = [
        {
          key: 'providerId',
          type: 'select',
          templateOptions: {
            label: 'Provider',
            options: providers,
            valueProp: 'id',
            labelProp: 'name'
          }
        },
        {
          key: 'productTypeId',
          type: 'async_select',
          templateOptions: {
            label: 'Product Type',
            options: [],
            valueProp: 'id',
            labelProp: 'name'
          },
          controller: ProductTypeController,
          expressionProperties: {
            'templateOptions.disabled': '!model.providerId'
          }
        }
      ];

      /** @ngInject */
      function ProductTypeController($scope, ProviderProductType) {
        $scope.$watch('model.providerId', loadProductTypes);

        function loadProductTypes(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }

          if ($scope.model[$scope.options.key] && oldValue) {
            $scope.model[$scope.options.key] = null;
          }

          $scope.to.loading = ProviderProductType.query({providerId: newValue}).$promise.then(handleResults);

          function handleResults(data) {
            $scope.to.options = data;
          }
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('productsTable', ProductsTableDirective);

  /** @ngInject */
  function ProductsTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        products: '=',
        productTypes: '='
      },
      link: link,
      templateUrl: 'app/components/products-table/products-table.html',
      controller: ProductsTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProductsTableController(lodash) {
      var vm = this;

      vm.activate = activate;

      function activate() {
        setProductTypes();
      }

      // Private

      function setProductTypes() {
        angular.forEach(vm.products, setProductType);

        function setProductType(product) {
          var productType = lodash.find(vm.productTypes, {id: product.product_type_id});
          product.product_type = productType ? productType.name : 'Unknown';
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('navProfile', NavProfileDirective);

  /** @ngInject */
  function NavProfileDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      link: link,
      templateUrl: 'app/components/profile/nav-profile.html',
      controller: NavProfileController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function NavProfileController(SessionService) {
      var vm = this;

      vm.alerts = [];

      vm.activate = activate;

      function activate() {
        vm.name = SessionService.fullName();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectApproval', ProjectApprovalDirective);

  /** @ngInject */
  function ProjectApprovalDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        onApproved: '&?',
        onRejected: '&?'
      },
      link: link,
      templateUrl: 'app/components/project-approval/project-approval.html',
      controller: ProjectApprovalController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectApprovalController() {
      var vm = this;

      vm.message = '';

      vm.activate = activate;
      vm.approve = approve;
      vm.reject = reject;

      function activate() {
        vm.onApproved = angular.isDefined(vm.onApproved) ? vm.onApproved : angular.noop;
        vm.onRejected = angular.isDefined(vm.onRejected) ? vm.onRejected : angular.noop;
      }

      function approve() {
        vm.project.$approve(vm.onApproved);
      }

      function reject() {
        vm.project.$reject({reason: vm.message}, vm.onRejected);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectDescription', ProjectDescriptionDirective);

  /** @ngInject */
  function ProjectDescriptionDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        linkTo: '@?'
      },
      link: link,
      templateUrl: 'app/components/project-description/project-description.html',
      controller: ProjectDescriptionController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectDescriptionController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectMemberships', ProjectMembershipsDirective);

  /** @ngInject */
  function ProjectMembershipsDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        memberships: '='
      },
      link: link,
      templateUrl: 'app/components/project-memberships/project-memberships.html',
      controller: ProjectMembershipsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectMembershipsController(lodash, Toasts, Membership, MembershipModal) {
      var vm = this;

      vm.activate = activate;
      vm.showModal = showModal;
      vm.remove = remove;
      vm.readOnly = readOnlyCheck;

      function activate() {
      }

      function showModal(membership) {
        var clonedMembership = null;

        if (angular.isUndefined(membership)) {
          membership = Membership.new({project_id: vm.projectId});
        }
        clonedMembership = angular.copy(membership);
        MembershipModal.showModal(clonedMembership).then(handleResult);

        function handleResult() {
          membership = angular.merge(membership, clonedMembership);
          if (membership.id) {
            membership.$update(updateSuccess, saveFailure);
          } else {
            membership.$save(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Membership saved.');
          membership = angular.merge(membership, clonedMembership);
          vm.memberships.push(membership);
        }

        function updateSuccess() {
          membership = angular.merge(membership, clonedMembership);
          Toasts.toast('Membership updated.');
        }

        function saveFailure(error) {
          Toasts.error('Error while saving membership.');
        }
      }

      function remove(membership) {
        membership.$delete(deleteSuccess, deleteFailure);

        function deleteSuccess() {
          lodash.remove(vm.memberships, {id: membership.id});
          Toasts.toast('Membership successfully removed.');
        }

        function deleteFailure() {
          Toasts.error('Could not remove membership. Try again later.');
        }
      }

      function readOnlyCheck() {
        return null === vm.project.archived;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('projectServices', ProjectServicesDirective);

  /** @ngInject */
  function ProjectServicesDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        project: '=',
        services: '='
      },
      link: link,
      templateUrl: 'app/components/project-services/project-services.html',
      controller: ProjectServicesController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ProjectServicesController() {
      var vm = this;

      vm.activate = activate;
      vm.readOnly = readOnlyCheck;

      function activate() {
      }

      function readOnlyCheck() {
        return null === vm.project.archived;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('ProviderTypeModal', ProviderTypeModalFactory);

  /** @ngInject */
  function ProviderTypeModalFactory($modal) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/provider-type-modal/provider-type-modal.html',
        controller: ProviderTypeModalController,
        controllerAs: 'vm',
        resolve: {
          registeredProviders: resolveRegisteredProviders
        },
        windowTemplateUrl: 'app/components/common/modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      /** @ngInject */
      function resolveRegisteredProviders(RegisteredProvider) {
        return RegisteredProvider.query().$promise;
      }
    }
  }

  /** @ngInject */
  function ProviderTypeModalController(lodash, registeredProviders) {
    var vm = this;

    vm.selections = {
      provider: null
    };

    activate();

    function activate() {
      initFields();
    }

    // Private

    function initFields() {
      vm.fields = [
        {
          key: 'provider',
          type: 'select',
          templateOptions: {
            label: 'Provider Type',
            options: providers(),
            labelProp: 'label'
          }
        }
      ];

      function providers() {
        return lodash.map(registeredProviders, mapProviders);

        function mapProviders(provider) {
          return {
            value: provider,
            label: provider.name
          };
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('region', RegionDirective);

  /** @ngInject */
  function RegionDirective() {
    var directive = {
      restrict: 'AE',
      transclude: true,
      scope: {
        heading: '@',
        collapsed: '=?'
      },
      link: link,
      templateUrl: 'app/components/region/region.html',
      controller: RegionController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function RegionController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.collapsed = angular.isDefined(vm.collapsed) ? vm.collapsed : false;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('roleForm', RoleFormDirective);

  /** @ngInject */
  function RoleFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        record: '=',
        heading: '@'
      },
      link: link,
      templateUrl: 'app/components/role-form/role-form.html',
      controller: RoleFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function RoleFormController($scope, $state, Toasts, lodash, Role) {
      var vm = this;

      vm.activate = activate;
      activate();

      vm.home = 'admin.roles.list';
      vm.showValidationMessages = false;

      vm.backToList = backToList;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;

      function activate() {
        initPermissions();
      }

      function backToList() {
        $state.go(vm.home);
      }

      function initPermissions() {
        vm.permissions = Role.new().permissions;
      }
      function showErrors() {
        return vm.showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return vm.showValidationMessages && vm.form.$invalid;
        }

        return vm.showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {
        vm.showValidationMessages = true;

        if (vm.form.$valid) {
          if (vm.record.id) {
            vm.record.$update(saveSuccess, saveFailure);
          } else {
            vm.record.$save(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Role saved.');
          $state.go(vm.home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('serviceBasicDetails', ServiceBasicDetailsDirective);

  /** @ngInject */
  function ServiceBasicDetailsDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        service: '='
      },
      link: link,
      templateUrl: 'app/components/service-basic-details/service-basic-details.html',
      controller: ServiceBasicDetailsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ServiceBasicDetailsController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('servicesTable', ServicesTableDirective);

  /** @ngInject */
  function ServicesTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        services: '='
      },
      link: link,
      templateUrl: 'app/components/services-table/services-table.html',
      controller: ServicesTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ServicesTableController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('status', StatusDirective);

  /** @ngInject */
  function StatusDirective() {
    var directive = {
      restrict: 'E',
      transclude: true,
      scope: {
        type: '@?'
      },
      link: link,
      template: '<span class="status" ng-class="\'status--\' + vm.modifier" ng-transclude></span>',
      controller: StatusController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function StatusController(lodash) {
      var vm = this;

      vm.activate = activate;

      function activate() {
        vm.modifier = angular.isDefined(vm.type) ? lodash.trim(vm.type.toLowerCase()) : 'warning';
      }
    }
  }
})();

(function() {
  'use strict';

  var KEYS = {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    delete: 46,
    comma: 188
  };

  angular.module('app.components')
    .constant('KEYS', KEYS);
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagAutocomplete', TagAutocompleteDirective);

  /** @ngInject */
  function TagAutocompleteDirective(logger, lodash, $q, KEYS, DirectiveOptions) {
    var directive = {
      restrict: 'AE',
      require: '^tagField',
      scope: {
        source: '&'
      },
      link: link,
      templateUrl: 'app/components/tags/tag-autocomplete.html',
      controller: TagAutocompleteController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function scrollToElement(root, index) {
      var element = root.find('li').eq(index);
      var parent = element.parent();
      var elementTop = element.prop('offsetTop');
      var elementHeight = element.prop('offsetHeight');
      var parentHeight = parent.prop('clientHeight');
      var parentScrollTop = parent.prop('scrollTop');

      if (elementTop < parentScrollTop) {
        parent.prop('scrollTop', elementTop);
      } else if (elementTop + elementHeight > parentHeight + parentScrollTop) {
        parent.prop('scrollTop', elementTop + elementHeight - parentHeight);
      }
    }

    function link(scope, element, attrs, tagField, transclude) {
      var vm = scope.vm;
      var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down];

      DirectiveOptions.load(vm, attrs, {
        debounceDelay: [Number, 275]
      });

      vm.activate(tagField);

      tagField.events
        .on('tag-added tag-invalid input-blur', vm.suggestionList.reset)
        .on('input-change', inputChanged)
        .on('input-focus', inputFocused)
        .on('input-keydown', inputKeydown);

      vm.events
        .on('suggestion-selected', suggestionSelected);

      function inputChanged(value) {
        if (shouldLoadSuggestions(value)) {
          vm.suggestionList.load(value);
        } else {
          vm.suggestionList.reset();
        }
      }

      function inputFocused() {
        var value = tagField.newTag;

        if (shouldLoadSuggestions(value)) {
          vm.suggestionList.load(value);
        }
      }

      function inputKeydown(event) {
        var key = event.keyCode;
        var handled = false;

        if (-1 === hotkeys.indexOf(key)) {
          return;
        }

        if (vm.suggestionList.visible) {
          // Visible
          if (key === KEYS.down) {
            vm.suggestionList.selectNext();
            handled = true;
          } else if (key === KEYS.up) {
            vm.suggestionList.selectPrevious();
            handled = true;
          } else if (key === KEYS.escape) {
            vm.suggestionList.reset();
            handled = true;
          } else if (key === KEYS.enter || key === KEYS.tab) {
            handled = vm.addSuggestion();
          }
        } else {
          // Not visible
          if (key === KEYS.down) {
            vm.suggestionList.load(tagField.newTag);
            handled = true;
          }
        }

        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();

          return false;
        }
      }

      function suggestionSelected(index) {
        scrollToElement(element, index);
      }

      // Private

      function shouldLoadSuggestions(value) {
        return !!(value && value.length >= tagField.options.minLength);
      }
    }

    /** @ngInject */
    function TagAutocompleteController(PubSub) {
      var vm = this;

      vm.activate = activate;
      vm.addSuggestion = addSuggestion;
      vm.addSuggestionByIndex = addSuggestionByIndex;

      function activate(tagField) {
        vm.mode = tagField.mode;
        vm.events = PubSub.events();
        vm.tagField = tagField;
        vm.suggestionList = new SuggestionList(vm.source, vm.options, vm.events);
      }

      function addSuggestion() {
        var added = false;

        if (vm.suggestionList.selected) {
          vm.tagField.addTag(angular.copy(vm.suggestionList.selected));
          vm.suggestionList.reset();
          vm.tagField.focusInput();
          added = true;
        }

        return added;
      }

      function addSuggestionByIndex(index) {
        vm.suggestionList.select(index);
        addSuggestion();
      }
    }

    function SuggestionList(loadFn, options, events) {
      var self = this;

      var lastPromise = null;

      self.items = [];
      self.visible = false;
      self.index = -1;
      self.selected = null;
      self.query = null;

      self.reset = reset;
      self.show = show;
      self.load = lodash.debounce(load, options.debounceDelay);
      self.select = select;
      self.selectNext = selectNext;
      self.selectPrevious = selectPrevious;

      function reset() {
        lastPromise = null;
        self.items.length = 0;
        self.visible = false;
        self.index = -1;
        self.selected = null;
        self.query = null;
      }

      function show() {
        select(0);
        self.visible = true;
      }

      function load(query) {
        self.query = query;

        var promise = $q.when(loadFn({query: query}));

        lastPromise = promise;
        promise.then(onResults);

        function onResults(items) {
          if (promise !== lastPromise) {
            return;
          }

          self.items = items;
          if (self.items.length > 0) {
            self.show();
          } else {
            self.reset();
          }
        }
      }

      function select(index) {
        if (index < 0) {
          index = self.items.length - 1;
        } else if (index >= self.items.length) {
          index = 0;
        }
        self.index = index;
        self.selected = self.items[index];
        events.trigger('suggestion-selected', index);
      }

      function selectNext() {
        select(++self.index);
      }

      function selectPrevious() {
        select(--self.index);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagAutosize', TagAutosizeDirective);

  /** @ngInject */
  function TagAutosizeDirective() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel, transclude) {
      var threshold = 3;
      var span = angular.element('<span class="tag-input"></span>');
      var width = 0;

      span
        .css('display', 'none')
        .css('visibility', 'hidden')
        .css('width', 'auto')
        .css('white-space', 'pre');

      element.parent().append(span);

      ngModel.$parsers.unshift(resize);
      ngModel.$formatters.unshift(resize);

      attrs.$observe('placeholder', updatePlaceholder);

      function resize(originalValue) {
        var value = originalValue;

        if (angular.isString(value) && 0 === value.length) {
          value = attrs.placeholder;
        }

        if (value) {
          span.text(value);
          span.css('display', '');
          width = span.prop('offsetWidth');
          span.css('display', 'none');
        }

        element.css('width', width ? width + threshold + 'px' : '');

        return originalValue;
      }

      function updatePlaceholder(value) {
        if (ngModel.$modelValue) {
          return;
        }
        resize(value);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagField', TagFieldDirective);

  /** @ngInject */
  function TagFieldDirective($document, $timeout, $window, KEYS, lodash, DirectiveOptions) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      scope: {
        tags: '=ngModel',
        onTagAdding: '&',
        onTagAdded: '&',
        onTagRemoving: '&',
        onTagRemoved: '&',
        onTagsCleared: '&',
        onInvalidTag: '&',
        mode: '@?tagMode'
      },
      transclude: true,
      link: link,
      templateUrl: templateUrl,
      controller: TagFieldController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function templateUrl(element, attrs) {
      var mode = attrs.tagMode || 'field';
      var url;

      if ('search' === mode) {
        url = 'app/components/tags/tag-search.html';
      } else {
        url = 'app/components/tags/tag-field.html';
      }

      return url;
    }

    function link(scope, element, attrs, ngModelCtrl, transclude) {
      var vm = scope.vm;
      var input = element.find('input');
      var hotKeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace, KEYS.delete, KEYS.left, KEYS.right];
      var addKey = {};
      var removeKey = {};
      var selectKey = {};

      activate();

      function activate() {
        var api = {
          inputChange: inputChange,
          inputKeydown: inputKeydown,
          inputFocus: inputFocus,
          inputBlur: inputBlur,
          inputPaste: inputPaste,
          hostClick: hostClick,
          focusInput: focusInput
        };

        addKey[KEYS.enter] = true;
        addKey[KEYS.comma] = true;
        addKey[KEYS.space] = true;

        removeKey[KEYS.backspace] = true;
        removeKey[KEYS.delete] = true;

        selectKey[KEYS.backspace] = true;
        selectKey[KEYS.left] = true;
        selectKey[KEYS.right] = true;

        attrs.$observe('disabled', setDisabled);

        ngModelCtrl.$isEmpty = isEmpty;

        scope.$watch('vm.tags.length', function() {
          setElementValidity();
          ngModelCtrl.$validate();
        });

        vm.events
          .on('tag-added', handleUndefinedWith(vm.onTagAdded || angular.identity, true))
          .on('tag-added', clearNewTag)
          .on('invalid-tag', handleUndefinedWith(vm.onInvalidTag || angular.identity, true))
          .on('invalid-tag', setInvalid)
          .on('tag-removed', handleUndefinedWith(vm.onTagRemoved || angular.identity, true))
          .on('tags-cleared', handleUndefinedWith(vm.onTagsCleared || angular.identity, true))
          .on('tag-added tag-removed', setDirty)
          .on('input-change', changed)
          .on('input-focus', focused)
          .on('input-blur', blurred)
          .on('input-keydown', keydown)
          .on('input-paste', paste);

        DirectiveOptions.load(vm, attrs, {
          minTags: [Number, 0],
          maxTags: [Number, 99],
          minLength: [Number, 1],
          maxLength: [Number, 255],
          addFromAutocompleteOnly: [Boolean, false],
          addOnPaste: [Boolean, true],
          pasteSplitPattern: [RegExp, /,/],
          placeholder: [String, 'Add a tag']
        });

        vm.activate(api);
      }

      function setDisabled(value) {
        vm.disabled = value;
      }

      function inputChange(text) {
        vm.events.trigger('input-change', text);
      }

      function inputKeydown($event) {
        vm.events.trigger('input-keydown', $event);
      }

      function inputFocus() {
        if (vm.hasFocus) {
          return;
        }

        vm.hasFocus = true;
        vm.events.trigger('input-focus');
      }

      function inputBlur() {
        $timeout(onBlur);

        function onBlur() {
          var activeElement = $document.prop('activeElement');
          var lostFocusToBrowserWindow = activeElement === input[0];
          var lostFocusToChildElement = element[0].contains(activeElement);

          if (lostFocusToBrowserWindow || !lostFocusToChildElement) {
            vm.hasFocus = false;
            vm.events.trigger('input-blur');
          }
        }
      }

      function inputPaste($event) {
        $event.getTextData = function() {
          var clipboardData = $event.clipboardData || ($event.originalEvent && $event.originalEvent.clipboardData);

          return clipboardData ? clipboardData.getData('text/plain') : $window.clipboardData.getData('Text');
        };
        vm.events.trigger('input-paste', $event);
      }

      function hostClick() {
        if (vm.disabled) {
          return;
        }
        focusInput();
      }

      function focusInput() {
        input[0].focus();
      }

      function setElementValidity() {
        ngModelCtrl.$setValidity('maxTags', vm.tags.length <= vm.options.maxTags);
        ngModelCtrl.$setValidity('minTags', vm.tags.length >= vm.options.minTags);
      }

      function isEmpty(value) {
        return !value || !value.length;
      }

      function clearNewTag() {
        vm.newTag = '';
      }

      function setInvalid() {
        vm.invalid = true;
      }

      function setDirty() {
        ngModelCtrl.$setDirty();
      }

      function changed() {
        vm.tagList.clearSelection();
        vm.invalid = null;
      }

      function focused() {
        element.triggerHandler('focus');
      }

      function blurred() {
        element.triggerHandler('blur');
        setElementValidity();
      }

      function keydown(event) {
        var key = event.keyCode;
        var isModifier = event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
        var shouldAdd;
        var shouldRemove;
        var shouldSelect;

        if (isModifier || -1 === hotKeys.indexOf(key)) {
          return;
        }

        shouldAdd = !vm.options.addFromAutocompleteOnly && addKey[key];
        shouldRemove = vm.tagList.selected && removeKey[key];
        shouldSelect = vm.newTag.length === 0 && selectKey[key];

        if (shouldAdd || shouldSelect || shouldRemove) {
          handleAction();
        }

        function handleAction() {
          if (shouldAdd) {
            vm.tagList.add(vm.newTag);
          } else if (shouldRemove) {
            vm.tagList.removeSelected();
          } else {
            if (key === KEYS.left || key === KEYS.backspace) {
              vm.tagList.selectPrevious();
            } else {
              vm.tagList.selectNext();
            }
          }

          event.preventDefault();
        }
      }

      function paste(event) {
        if (vm.options.addOnPaste) {
          var data = event.getTextData();
          var tags = data.split(vm.options.pasteSplitPattern);

          if (tags.length > 1) {
            tags.forEach(function(tag) {
              vm.tagList.add(tag);
            });
            event.preventDefault();
          }
        }
      }
    }

    /** @ngInject */
    function TagFieldController(PubSub) {
      var vm = this;

      vm.newTag = '';
      vm.placeholder = '';
      vm.events = PubSub.events();
      vm.tagList = null;
      vm.hasFocus = false;
      vm.invalid = false;
      vm.disabled = false;

      vm.activate = activate;
      vm.clearTags = clearTags;
      vm.removeTag = removeTag;
      vm.addTag = addTag;

      function activate(api) {
        angular.extend(vm, api);
        vm.tags = vm.tags || [];
        vm.onTagAdding = handleUndefinedWith(vm.onTagAdding || angular.identity, true);
        vm.onTagRemoving = handleUndefinedWith(vm.onTagRemoving || angular.identity, true);
        vm.tagList = new TagList(vm.options, vm.events, vm.onTagAdding, vm.onTagRemoving);
        vm.tagList.tags = vm.tags;
        vm.mode = angular.isDefined(vm.mode) ? vm.mode : 'field';
      }

      function removeTag(index) {
        if (vm.disabled) {
          return;
        }
        vm.tagList.remove(index);
      }

      function addTag(tag) {
        vm.tagList.add(tag.name);
      }

      function clearTags() {
        if (vm.disabled) {
          return;
        }
        vm.tagList.clear();
      }
    }
  }

  function TagList(options, events, onTagAdding, onTagRemoving) {
    var self = this;

    self.tags = [];
    self.index = -1;
    self.selected = null;

    self.tagInList = tagInList;
    self.add = add;
    self.remove = remove;
    self.clear = clear;
    self.select = select;
    self.selectPrevious = selectPrevious;
    self.selectNext = selectNext;
    self.removeSelected = removeSelected;
    self.clearSelection = clearSelection;

    function add(tag) {
      if (tagIsValid(tag)) {
        self.tags.push(tag);
        events.trigger('tag-added', {tag: tag});

        return tag;
      }
      events.trigger('invalid-tag', {tag: tag});

      return false;
    }

    function remove(index) {
      var tag = self.tags[index];

      if ((onTagRemoving || angular.identity)(tag)) {
        self.tags.splice(index, 1);
        self.clearSelection();
        events.trigger('tag-removed', {tag: tag});

        return tag;
      }

      return false;
    }

    function clear() {
      self.tags.length = 0;
      self.clearSelection();
      events.trigger('tags-cleared');
    }

    function select(index) {
      if (index < 0) {
        index = self.tags.length - 1;
      } else if (index >= self.tags.length) {
        index = 0;
      }

      self.index = index;
      self.selected = self.tags[index];
    }

    function selectPrevious() {
      return select(--self.index);
    }

    function selectNext() {
      return select(++self.index);
    }

    function removeSelected() {
      return remove(self.index);
    }

    function clearSelection() {
      self.index = -1;
      self.selected = null;
    }

    function tagInList(tag) {
      return self.tags.indexOf(tag) !== -1;
    }

    // Private

    function tagIsValid(tag) {
      return tag.length >= options.minLength
        && tag.length <= options.maxLength
        && !tagInList(tag)
        && onTagAdding(tag);
    }
  }

  function handleUndefinedWith(fn, valueOtherwise) {
    return handled;

    function handled() {
      var result = fn.apply(null, arguments);

      return angular.isUndefined(result) ? valueOtherwise : result;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagItem', TagItemDirective);

  /** @ngInject */
  function TagItemDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        text: '=',
        selected: '=?',
        active: '=?',
        onRemove: '&?',
        allowRemove: '=?'
      },
      link: link,
      templateUrl: 'app/components/tags/tag-item.html',
      controller: TagItemController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function TagItemController($scope) {
      var vm = this;

      vm.tagField = null;

      vm.activate = activate;
      vm.remove = remove;

      function activate() {
        vm.selected = angular.isUndefined(vm.selected) ? false : vm.selected;
        vm.active = angular.isUndefined(vm.active) ? false : vm.active;
        vm.allowRemove = angular.isUndefined(vm.allowRemove) ? true : vm.allowRemove;
      }

      function remove() {
        vm.onRemove();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagMatch', TagMatchDirective);

  /** @ngInject */
  function TagMatchDirective(logger) {
    var directive = {
      restrict: 'AE',
      require: '^tagAutocomplete',
      scope: {
        tag: '=',
        selected: '='
      },
      link: link,
      templateUrl: 'app/components/tags/tag-match.html',
      controller: TagMatchController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, tagAutocomplete, transclude) {
      var vm = scope.vm;

      vm.activate();
    }

    /** @ngInject */
    function TagMatchController() {
      var vm = this;

      vm.activate = activate;

      function activate() {
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('tagShowModal', TagShowModalDirective);

  /** @ngInject */
  function TagShowModalDirective() {
    var directive = {
      restrict: 'AE',
      require: '^tagField',
      scope: {},
      link: link,
      transclude: true,
      templateUrl: 'app/components/tags/tag-show-modal.html',
      controller: TagShowModalController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, tagField, transclude) {
      var vm = scope.vm;

      vm.activate(tagField);
    }

    /** @ngInject */
    function TagShowModalController(Tag, $modal) {
      var vm = this;

      var modalOptions = {};

      vm.activate = activate;
      vm.showModal = showModal;

      function activate(tagField) {
        vm.mode = tagField.mode;
        vm.tagField = tagField;
        modalOptions = {
          templateUrl: 'app/components/tags/tag-modal.html',
          controller: TagModalController,
          controllerAs: 'vm',
          resolve: {
            tagList: resolveTagList,
            tagCommands: resolveTagCommands,
            tags: resolveTags,
            mode: resolveMode
          },
          windowTemplateUrl: 'app/components/common/modal-window.html',
          size: 'all-tags'
        };
      }

      function showModal() {
        var modal = $modal.open(modalOptions);

        modal.result.then();
      }

      // Private

      function resolveTagList() {
        return vm.tagField.tagList;
      }

      function resolveTagCommands() {
        return {
          add: vm.tagField.addTag,
          remove: vm.tagField.removeTag,
          clear: vm.tagField.clearTags
        };
      }

      function resolveTags() {
        return Tag.grouped();
      }

      function resolveMode() {
        return vm.mode;
      }
    }

    /** @ngInject */
    function TagModalController(tagList, tagCommands, tags, mode, $location, $timeout, lodash) {
      var vm = this;

      vm.tagList = tagList;
      vm.addTag = tagCommands.add;
      vm.removeTag = tagCommands.remove;
      vm.clearTags = tagCommands.clear;
      vm.tags = tags;

      vm.shortcuts = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      vm.tagsExistForLetter = tagsExistForLetter;
      vm.tagInUse = tagInUse;
      vm.tagUnavailable = tagUnavailable;
      vm.gotoHash = gotoHash;

      activate();

      function activate() {
        vm.tags = initTags(vm.tags);
      }

      function tagsExistForLetter(letter) {
        return angular.isDefined(vm.tags[letter]);
      }

      function tagInUse(tag) {
        return vm.tagList.tagInList(tag);
      }

      function tagUnavailable(tag) {
        if ('search' === mode) {
          return tagInUse(tag.name) || 0 === tag.results;
        } else {
          return tagInUse(tag.name);
        }
      }

      // Remove the hash fragment from the URL which can cause the $digest to infinitely loop
      // TODO: Use a method that doesn't alter $location
      function gotoHash(letter) {
        $location.hash(letter);
        $timeout(function() {
          $location.hash('');
        });
      }

      function initTags(tags) {
        var letters = Object.keys(tags);

        return lodash.map(letters.sort(), createTagHash);

        function createTagHash(letter) {
          return {
            letter: letter,
            tags: lodash.sortBy(tags[letter], 'name')
          };
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .constant('TAG_QUERY_LIMIT', 10);
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('Toasts', ToastsFactory);

  /** @ngInject */
  function ToastsFactory(toastr) {
    var service = {
      toast: toast,
      info: info,
      success: success,
      error: error,
      warning: warning
    };

    var defaults = {
      containerId: 'toasts__container',
      positionClass: 'toasts--top-center',
      // Timing
      extendedTimeOut: 1000,
      timeOut: 5000,
      showDuration: 500,
      hideDuration: 500,
      // Classes
      toastClass: 'toasts',
      titleClass: 'toasts__title',
      messageClass: 'toasts__message'
    };

    return service;

    function toast(message, title, options) {
      toastr.info(message, title, angular.extend({}, defaults, options || {iconClass: 'toasts--default'}));
    }

    function info(message, title, options) {
      toastr.info(message, title, angular.extend({}, defaults, options || {iconClass: 'toasts--info'}));
    }

    function success(message, title, options) {
      toastr.success(message, title, angular.extend({}, defaults, options || {iconClass: 'toasts--success'}));
    }

    function error(message, title, options) {
      toastr.error(message, title, angular.extend({}, defaults, options || {iconClass: 'toasts--danger'}));
    }

    function warning(message, title, options) {
      toastr.warning(message, title, angular.extend({}, defaults, options || {iconClass: 'toasts--warning'}));
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('viewModeSwitch', ViewModeSwitchDirective);

  /** @ngInject */
  function ViewModeSwitchDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        viewMode: '='
      },
      link: link,
      templateUrl: 'app/components/view-mode-switch/view-mode-switch.html',
      controller: ViewModeSwitchController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function ViewModeSwitchController(VIEW_MODES) {
      var vm = this;

      vm.activate = activate;
      vm.setViewMode = setViewMode;

      function activate() {
        vm.viewMode = vm.viewMode || VIEW_MODES.grid;
      }

      function setViewMode(mode) {
        if (mode === vm.viewMode) {
          return;
        }
        vm.viewMode = mode;
      }
    }
  }
})();

(function() {
  'use strict';

  var VIEW_MODES = {
    list: 'list',
    grid: 'grid'
  };

  angular.module('app.components')
    .constant('VIEW_MODES', VIEW_MODES);
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('wizardQuestionForm', WizardQuestionFormDirective);

  /** @ngInject */
  function WizardQuestionFormDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        heading: '@?',
        question: '='
      },
      link: link,
      templateUrl: 'app/components/wizard-question-form/wizard-question-form.html',
      controller: WizardQuestionFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function WizardQuestionFormController($state, Tag, WizardQuestion, Toasts, TAG_QUERY_LIMIT) {
      var vm = this;

      var showValidationMessages = false;
      var home = 'manage.wizard-questions';

      vm.activate = activate;
      vm.backToList = backToList;
      vm.queryTags = queryTags;
      vm.showErrors = showErrors;
      vm.hasErrors = hasErrors;
      vm.onSubmit = onSubmit;
      vm.typeChangeOk = typeChangeOk;
      vm.typeChangeCancel = typeChangeCancel;

      function activate() {
        vm.heading = vm.heading || 'Add A Wizard Question';
      }

      function backToList() {
        $state.go(home);
      }

      function queryTags(query) {
        return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
      }

      function showErrors() {
        return showValidationMessages;
      }

      function hasErrors(field) {
        if (angular.isUndefined(field)) {
          return showValidationMessages && vm.form.$invalid;
        }

        return showValidationMessages && vm.form[field].$invalid;
      }

      function onSubmit() {
        showValidationMessages = true;

        if (vm.form.$valid) {
          if (vm.question.id) {
            vm.question.$update(saveSuccess, saveFailure);
          } else {
            vm.question.$save(saveSuccess, saveFailure);
          }
        }

        function saveSuccess() {
          Toasts.toast('Wizard Question saved.');
          $state.go(home);
        }

        function saveFailure() {
          Toasts.error('Server returned an error while saving.');
        }
      }

      function typeChangeOk() {
        vm.question.options.length = 0;
        vm.question.options.push(angular.extend({}, WizardQuestion.optionDefaults));
        vm.question.options.push(angular.extend({}, WizardQuestion.optionDefaults));
      }

      function typeChangeCancel() {
        vm.question.type = 'multiple' === vm.question.type ? 'yes_no' : 'multiple';
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('wizardQuestionOption', WizardQuestionOptionDirective);

  /** @ngInject */
  function WizardQuestionOptionDirective() {
    var directive = {
      restrict: 'AE',
      require: ['^wizardQuestionForm', '^wizardQuestionOptions'],
      scope: {
        option: '=',
        index: '=optionIndex',
        label: '@optionLabel'
      },
      link: link,
      templateUrl: 'app/components/wizard-question-form/wizard-question-option.html',
      controller: WizardQuestionOptionController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, ctrls, transclude) {
      var vm = scope.vm;

      vm.activate({
        hasErrors: ctrls[0].hasErrors,
        canRemove: ctrls[1].canRemove,
        canSort: ctrls[1].canSort,
        removeOption: ctrls[1].removeOption
      });
    }

    /** @ngInject */
    function WizardQuestionOptionController(Tag, TAG_QUERY_LIMIT) {
      var vm = this;

      vm.activate = activate;
      vm.queryTags = queryTags;
      vm.hasError = hasError;
      vm.remove = remove;

      function activate(api) {
        angular.extend(vm, api);
        vm.formattedLabel = vm.label.replace(/[\s]/g, '-');
      }

      function queryTags(query) {
        return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
      }

      function hasError() {
        return vm.hasErrors() && vm.form.option.$invalid;
      }

      function remove() {
        vm.removeOption(vm.index);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('wizardQuestionOptions', WizardQuestionOptionsDirective);

  /** @ngInject */
  function WizardQuestionOptionsDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        options: '=',
        maxOptions: '=?'
      },
      link: link,
      templateUrl: 'app/components/wizard-question-form/wizard-question-options.html',
      controller: WizardQuestionOptionsController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function WizardQuestionOptionsController(WizardQuestion, lodash) {
      var vm = this;

      var MAX_OPTIONS = 10;

      vm.activate = activate;
      vm.canAdd = canAdd;
      vm.addOption = addOption;
      vm.canRemove = canRemove;
      vm.removeOption = removeOption;

      function activate() {
        vm.maxOptions = angular.isDefined(vm.maxOptions) ? vm.maxOptions : MAX_OPTIONS;
      }

      function addOption() {
        vm.options.push(angular.extend({}, WizardQuestion.optionDefaults));
      }

      function removeOption(index) {
        // jscs:disable disallowDanglingUnderscores
        vm.options[index]._destroy = true;
        // jscs:enable
      }

      function canAdd() {
        return MAX_OPTIONS > vm.options.length;
      }

      function canRemove() {
        return lodash.reject(vm.options, {'_destroy': true}).length > 2;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .directive('wizardQuestionsTable', WizardQuestionsTableDirective);

  /** @ngInject */
  function WizardQuestionsTableDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        questions: '='
      },
      link: link,
      templateUrl: 'app/components/wizard-questions-table/wizard-questions-table.html',
      controller: WizardQuestionsTableController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    function link(scope, element, attrs, vm, transclude) {
      vm.activate();
    }

    /** @ngInject */
    function WizardQuestionsTableController(Toasts, jQuery, $timeout) {
      var vm = this;

      vm.sortableOptions = {
        axis: 'y',
        cursor: 'move',
        handle: '.wizard-questions-table__handle',
        helper: sortableHelper,
        opacity: 0.9,
        placeholder: 'wizard-questions-table__placeholder',
        update: sortableUpdate
      };

      vm.activate = activate;
      vm.deleteQuestion = deleteQuestion;

      function activate() {
      }

      function deleteQuestion(index) {
        var question = vm.questions[index];

        question.$delete(deleteSuccess, deleteFailure);

        function deleteSuccess() {
          vm.questions.splice(index, 1);
          Toasts.toast('Wizard Question deleted.');
        }

        function deleteFailure() {
          Toasts.error('Server returned an error while deleting.');
        }
      }

      // Private

      function sortableHelper(event, element) {
        var $originals = element.children();
        var $helper = element.clone();

        $helper.children().each(setCloneWidth);

        return $helper;

        function setCloneWidth(index, element) {
          // Set helper cell sizes to match the original sizes
          jQuery(element).width($originals.eq(index).width());
        }
      }

      function sortableUpdate(event, ui) {
        var question = angular.element(ui.item).scope().row;

        // Update fires before the mode is updated; Stop won't tell us if we actually moved anything
        // So wait a moment and let things settle then perform the update
        $timeout(savePosition);

        function savePosition() {
          question.load_order = ui.item.index();
          question.$update(updateSuccess, updateFailure);

          function updateSuccess() {
            Toasts.toast('Wizard Question order saved.');
          }

          function updateFailure() {
            Toasts.error('Server returned an error while saving.');
          }
        }
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('WizardService', WizardServiceFactory);

  /** @ngInject */
  function WizardServiceFactory($modal, WizardQuestion) {
    var service = {
      showModal: showModal
    };

    return service;

    function showModal() {
      var modalOptions = {
        templateUrl: 'app/components/wizard/wizard-modal.html',
        controller: WizardModalController,
        controllerAs: 'vm',
        resolve: {
          questions: resolveQuestions
        },
        windowTemplateUrl: 'app/components/common/modal-window.html'
      };
      var modal = $modal.open(modalOptions);

      return modal.result;

      function resolveQuestions() {
        return WizardQuestion.query().$promise;
      }
    }
  }

  /** @ngInject */
  function WizardModalController(questions, lodash) {
    var vm = this;

    vm.state = 'intro';
    vm.questions = questions;
    vm.question = null;
    vm.questionPointer = 0;
    vm.answeredQuestions = [];

    vm.startWizard = startWizard;
    vm.answerWith = answerWith;
    vm.questionNavigation = questionNavigation;

    activate();

    function activate() {
    }

    function startWizard() {
      vm.question = vm.questions[vm.questionPointer];
      vm.state = 'wizard';
    }

    function answerWith(index) {
      vm.answeredQuestions[vm.questionPointer] = 0 > index ? -1 : vm.question.wizard_answers[index];

      if (vm.questionPointer < vm.questions.length - 1) {
        vm.questionNavigation(1);
      } else {
        lodash.forEach(vm.answeredQuestions, parseQuestionAnswers);
        vm.state = 'complete';
      }
    }

    function parseQuestionAnswers(item) {
      var filter;

      if (item !== -1) {
        filter = item.tags_to_remove;
        filter.unshift(lodash.union(vm.tags, item.tags_to_add));
        vm.tags = lodash.without.apply(vm, filter);
      }
    }

    function questionNavigation(direction) {
      vm.questionPointer = vm.questionPointer + direction;
      vm.question = vm.questions[vm.questionPointer];
    }
  }
})();

/* global session:true */
(function(angular) {
  'use strict';

  /** @ngInject */
  function initUserData($http) {
    $http.get('/api/v1/staff/current_member')
      .then(handleResults);

    function handleResults(data) {
      session = angular.extend(session, data.data);
    }
  }

  /** @ngInject */
  function initExtensions($http, $q) {
    var scripts = [];
    var deferred = $q.defer();

    $http.get('/api/v1/extensions')
      .then(handleResults, handleError);

    return deferred.promise;

    function handleResults(results) {
      angular.forEach(results.data, loadExtension);
      loadScripts();

      function loadExtension(extension) {
        scripts = scripts.concat(extension.scripts);
      }
    }

    function handleError(error) {
      console.error('Failed to load extensions');
      console.dir(error);
      deferred.resolve();
    }

    function loadScripts() {
      angular.forEach(scripts, injectScript);

      function injectScript(script) {
        var tag = angular.element('<script>');
        angular.element('body').append(tag);
        tag.on('load', scriptLoaded);
        tag.on('error', scriptError);
        tag.attr('src', script);

        function scriptLoaded() {
          scripts.splice(scripts.indexOf(script), 1);
          if (0 === scripts.length) {
            deferred.resolve();
          }
        }

        function scriptError() {
          console.error('Failed to load extension script', script);
          scriptLoaded();
        }
      }
    }
  }

  angular.lazy('app')
    .resolve(initUserData)
    .resolve(initExtensions)
    .bootstrap();
})(angular);

(function() {
  'use strict';

  var config = {
    appErrorPrefix: '[Jellyfish] ',
    appTitle: 'Jellyfish'
  };

  angular.module('app.core')
    .value('config', config)
    .config(configure)
    .run(init);

  /** @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, $compileProvider) {
    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({docTitle: config.appTitle + ': '});

    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(false);
  }

  /** @ngInject */
  function init(logger) {
    logger.showToasts = false;
  }
})();

/* global toastr:false, moment:false, _:false, $:false, session:true */
(function() {
  'use strict';

  // Session is set during the bootstrap process (prior to angular running)
  // The variable exists in index.html and will be undefined in tests
  window.session = window.session || {};

  angular.module('app.core')
    .constant('lodash', _)
    .constant('jQuery', $)
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('userSession', window.session);
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Alert', AlertFactory);

  /** @ngInject */
  function AlertFactory($resource) {
    var Alert = $resource('/api/v1/alerts/:id', {id: '@id'}, {
      // Get single
      'update': {
        method: 'PUT',
        isArray: false
      }
    });

    Alert.statusToType = statusToType;

    return Alert;

    function statusToType(status) {
      switch (status) {
        case 'critical':
          return 'danger';
        case 'ok':
          return 'success';
        case 'warning':
          return 'warning';
        default:
          return 'info';
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ContentPage', ContentPagesFactory);

  /** @ngInject */
  function ContentPagesFactory($resource) {
    var ContentPages = $resource('/api/v1/content_pages/:id' , {id: '@id'}, {
      'update': {
        method: 'PUT',
        isArray: false
      }
    });

    return ContentPages;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Dashboard', DashboardFactory);

  /** @ngInject */
  function DashboardFactory() {
    return [{
      options: {
        chart: {
          type: 'spline'
        },
        credits: {
          enabled: false
        },
        title: {
          text: 'Hourly Burn Analysis'
        },
        subtitle: {
          text: 'A snapshot of the last 24 hours.'
        },
        xAxis: {
          type: 'datetime',
          labels: {
            overflow: 'justify'
          }
        },
        yAxis: {
          title: {
            text: '% Budget Utilization'
          },
          min: 0,
          minorGridLineWidth: 0,
          gridLineWidth: 0,
          alternateGridColor: null,
          plotBands: [{
            from: 0,
            to: 30,
            color: 'rgba(0, 255, 255, 0.3)',
            label: {
              text: 'Low Burn',
              style: {
                color: '#000000'
              }
            }
          }, {
            from: 30,
            to: 60,
            color: 'rgba(29, 197, 142, 0.3)',
            label: {
              text: 'Normal Burn',
              style: {
                color: '#000000'
              }
            }
          }, {
            from: 60,
            to: 90,
            color: 'rgba(255, 255, 0, 0.3)',
            label: {
              text: 'Medium Burn',
              style: {
                color: '#000000'
              }
            }
          }, {
            from: 90,
            to: 100,
            color: 'rgba(248, 137, 84, 0.6)',
            label: {
              text: 'High Burn',
              style: {
                color: '#000000'
              }
            }
          }, {
            from: 100,
            to: 150,
            color: 'rgba(241, 59, 84, 0.3)',
            label: {
              text: 'Unsustainable Burn',
              style: {
                color: '#000000'
              }
            }
          }]
        },
        tooltip: {
          valueSuffix: ' %'
        },
        plotOptions: {
          spline: {
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 4
              }
            },
            marker: {
              enabled: false
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2015, 5, 18, 0, 0, 0)
          }
        }
      },
      series: [{
        name: 'Project Jellyfish',
        data: [40.3, 50.1, 40.3, 50.2, 50.4, 40.7, 30.5, 40.1, 50.6, 70.4, 60.9, 70.1,
          70.9, 70.9, 70.5, 60.7, 70.7, 70.7, 70.4, 70.0, 70.1, 50.8, 50.9, 70.4, 80.1],
        color: '#F88954'

      }, {
        name: 'Cloud Exchange',
        data: [0.0, 0.0, 20.0, 119, 45.0, 58.0, 68.0, 11.0, 2.1, 0.0, 0.3, 0.0,
          0.0, 0.4, 0.0, 10.1, 0.0, 0.0, 0.0, 0.0, 0.0, 90.0, 100.0, 0.0, 20.2],
        color: '#1DC58E'
      },
        {
          name: 'Blog',
          data: [10.0, 30.0, 0.0, 2, 5, 0.0, 3, 2, 5, 1, 0.3, 0.0,
            0.0, 0.4, 0.0, 20.1, 0.0, 0.0, 80.0, 0.0, 10.0, 30.0, 20.0, 120.0, 110],
          color: '#3397DB'
        }],
      navigation: {
        menuItemStyle: {
          fontSize: '10px'
        }
      }
    },
      {
        options: {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Monthly Cost Analysis'
          },
          xAxis: {
            categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
            ],
            crosshair: true
          },
          yAxis: {
            lineWidth: 1,
            tickWidth: 1,
            title: {
              align: 'high',
              offset: 0,
              text: 'Cost ($1000 USD)',
              rotation: 0,
              y: -10
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          credits: {
            enabled: false
          }
        },
        series: [{
          name: 'Project Jellyfish',
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
          color: '#F88954'

        }, {
          name: 'Blog',
          data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
          name: 'Cloud Exchange',
          data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
          color: '#1DC58E'

        }]
      },
      {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Active Service Types by Overall % '
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: 'black'
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Active Service Percentages',
          data: [
            ['MS Exchange Server', 45.0],
            ['Rails Stack', 26.8],
            {
              name: 'LampStack',
              y: 12.8,
              sliced: true,
              selected: true
            },
            ['Small MySQL', 8.5],
            ['S3 Storage', 6.2],
            ['Large PostgreSQL', 0.7]
          ]
        }]
      },
      {
        options: {
          chart: {
            type: 'column',
            options3d: {
              enabled: true,
              alpha: 15,
              beta: 15,
              viewDistance: 25,
              depth: 40
            },
            marginTop: 80,
            marginRight: 40
          },

          title: {
            text: 'Total Services by Project'
          },

          xAxis: {
            categories: ['Blog', 'Project Jellyfish', 'Cloud Exchange']
          },

          yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
              text: 'Number of Services'
            }
          },

          tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: '<span style="color:{series.color}">\u25CF</span> ' +
            '{series.name}: {point.y} / {point.stackTotal}'
          },

          plotOptions: {
            column: {
              stacking: 'normal',
              depth: 40
            }
          }
        },

        series: [{
          name: 'MS Exchange Server',
          data: [4, 4, 2]
        }, {
          name: 'Rails Stack',
          data: [3, 2, 4]
        }, {
          name: 'LampStack',
          data: [3, 0, 1]
        }, {
          name: 'Small MySQL',
          data: [1, 1, 1]
        }, {
          name: 'S3 Storage',
          data: [2, 0, 1]
        }, {
          name: 'Large PostgreSQL',
          data: [1, 0, 0]
        }]
      }
    ];
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Group', GroupFactory);

  /** @ngInject */
  function GroupFactory($resource) {
    var Group = $resource('/api/v1/groups/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    Group.defaults = {
      name: '',
      description: '',
      staff_ids: []
    };

    Group.new = newGroup;

    function newGroup() {
      return new Group(angular.copy(Group.defaults));
    }

    return Group;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Log', LogFactory);

  /** @ngInject */
  function LogFactory($resource) {
    var Log = $resource('/api/v1/logs/:type/:id' , {id: '@id', type: '@type'}, {});
    delete Log.get;
    delete Log.save;
    delete Log.remove;
    delete Log.delete;

    return Log;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Membership', MembershipFactory);

  /** @ngInject */
  function MembershipFactory($resource) {
    var Membership = $resource('/api/v1/memberships/:id',
      {id: '@id', project_id: '@project_id'}, {
        query: {
          url: '/api/v1/projects/:project_id/memberships',
          method: 'GET',
          isArray: true
        },
        save: {
          url: '/api/v1/projects/:project_id/memberships',
          method: 'POST',
          isArray: false
        },
        update: {
          method: 'PUT',
          isArray: false
        }
      });

    Membership.defaults = {
      project_id: null,
      group_id: null,
      role_id: null
    };

    Membership.new = newMembership;

    return Membership;

    function newMembership(data) {
      return new Membership(angular.extend({}, Membership.defaults, data || {}));
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Motd', MotdFactory);

  /** @ngInject */
  function MotdFactory($resource) {
    var Motd = $resource('/api/v1/motd/', {}, {
      'update': {
        method: 'PUT',
        isArray: false
      }
    });

    return Motd;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Order', OrderFactory);

  /** @ngInject */
  function OrderFactory($resource) {
    var Order = $resource('/api/v1/orders/:id', {id: '@id'});

    Order.defaults = {
      product_id: null,
      project_id: null,
      service: {
        name: null
      }
    };

    Order.new = newOrder;
    Order.prototype.total = total;

    function newOrder(data) {
      return new Order(angular.extend({}, Order.defaults, data || {}));
    }

    function total() {
      /*jshint validthis: true */
      return this.hourly_price * 750 + this.monthly_price;
    }

    return Order;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductCategory', ProductCategoryFactory);

  /** @ngInject */
  function ProductCategoryFactory($resource) {
    var ProductCategory = $resource('/api/v1/product_categories/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    ProductCategory.defaults = {
      name: '',
      description: '',
      tags: []
    };

    ProductCategory.new = newProductCategory;

    function newProductCategory() {
      return new ProductCategory(angular.copy(ProductCategory.defaults));
    }

    return ProductCategory;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProductType', ProductTypeFactory);

  /** @ngInject */
  function ProductTypeFactory($resource, $http) {
    var ProductType = $resource('/api/v1/product_types/:id', {id: '@id'});

    return ProductType;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Product', ProductFactory);

  /** @ngInject */
  function ProductFactory($resource) {
    var Product = $resource('/api/v1/products/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    Product.defaults = {
      name: '',
      description: '',
      active: true,
      setup_price: '0.0',
      monthly_price: '0.0',
      hourly_price: '0.0',
      tags: []
    };

    Product.new = newProduct;

    function newProduct(data) {
      return new Product(angular.extend({}, Product.defaults, data || {}));
    }

    return Product;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProjectQuestion', ProjectQuestionFactory);

  /** @ngInject */
  function ProjectQuestionFactory($resource, lodash) {
    var ProjectQuestion = $resource('/api/v1/project_questions/:id' , {id: '@id'}, {
      'update': {
        method: 'PUT',
        isArray: false
      },
      'reposition': {
        method: 'PUT',
        url: '/api/v1/project_questions/:id/reposition',
        isArray: false
      }
    });

    ProjectQuestion.defaults = {
      question: '',
      help: '',
      required: false,
      field_type: 'yes_no',
      options: []
    };

    ProjectQuestion.optionDefaults = {
      option: '',
      include: [],
      exclude: [],
      position: 0
    };

    ProjectQuestion.new = newProjectQuestion;

    ProjectQuestion.prototype.asField = asField;

    return ProjectQuestion;

    function newProjectQuestion() {
      return new ProjectQuestion(angular.copy(ProjectQuestion.defaults));
    }

    function asField() {
      /*jshint validthis: true */
      var self = this;

      var field = {
        name: self.uuid,
        value_type: 'string',
        label: self.question,
        required: self.required
      };

      setFieldType();

      return field;

      function setFieldType() {
        switch (self.field_type) {
          case 'yes_no':
            field.options = [
              {label: 'Yes', value: 'Yes'},
              {label: 'No', value: 'No'}
            ];
            field.field = 'select';
            break;
          case 'multiple':
            field.options = lodash.map(self.options, asOption);
            field.field = 'select';
            break;
          default:
            field.field = self.field_type;
        }
      }

      function asOption(option) {
        return {label: option, value: option};
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProjectService', ProjectServiceFactory);

  /** @ngInject */
  function ProjectServiceFactory($resource) {
    var ProjectService = $resource('/api/v1/projects/:projectId/services', {
      projectId: '@project_id'
    });

    return ProjectService;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Project', ProjectFactory);

  /** @ngInject */
  function ProjectFactory($resource, lodash, moment) {
    var Project = $resource('/api/v1/projects/:id', {id: '@id'}, {
      'update': {
        method: 'PUT',
        isArray: false
      },
      'approve': {
        url: '/api/v1/projects/:id/approve',
        method: 'POST',
        params: {'includes[]': ['approvals', 'approvers']}
      },
      'reject': {
        url: '/api/v1/projects/:id/reject',
        method: 'DELETE',
        params: {'includes[]': ['approvals', 'approvers']}
      },
      'approvals': {
        url: '/api/v1/projects/:id/approvals',
        method: 'GET',
        isArray: true
      }
    });

    Project.defaults = {
      name: '',
      description: '',
      img: '',
      start_date: null,
      end_date: null
    };

    Project.new = newProject;

    Project.prototype.finalApproval = finalApproval;
    Project.prototype.scheduleRemaining = scheduleRemaining;
    Project.prototype.monthsRemaining = monthsRemaining;
    Project.prototype.budgetRemaining = budgetRemaining;
    Project.prototype.budgetUtilization = budgetUtilization;
    Project.prototype.budgetUtilizationStatus = budgetUtilizationStatus;
    Project.prototype.budgetRemainder = budgetRemainder;
    Project.prototype.budgetRemainderStatus = budgetRemainderStatus;

    return Project;

    function newProject(data) {
      return new Project(angular.extend({}, angular.copy(Project.defaults), data || {}));
    }

    function finalApproval() {
      /* jshint validthis:true */
      var self = this;

      if (!angular.isDefined(self.approvals) || (0 === self.approvals.length)) {
        return null;
      }

      return findFinalApproval(self.approvals, self.approvers);

      function findFinalApproval(approvals, approvers) {
        var approval = approvals[approvals.length - 1];

        if (approvers) {
          lodash.each(approvers, function(approver) {
            if (approver.id === approval.staff_id) {
              approval.staff_name = [approver.first_name, approver.last_name].join(' ');
            }
          });
        }

        return approval;
      }
    }

    function scheduleRemaining() {
      /* jshint validthis:true */
      var self = this;

      var now = moment();
      var endDate = moment(self.end_date);

      if (!self.end_date) {
        return 0;
      }

      if (now.isAfter(endDate)) {
        return 0;
      }

      return parseFloat(endDate.diff(now, 'months', true).toFixed(1));
    }

    function monthsRemaining() {
      /* jshint validthis:true */
      var self = this;

      return self.monthly_spend ? parseFloat((self.budgetRemaining() / self.monthly_spend).toFixed(1)) : '99+';
    }

    function budgetRemaining() {
      /* jshint validthis:true */
      var self = this;

      return Math.max(0, self.budget - self.spent);
    }

    function budgetUtilization() {
      /* jshint validthis:true */
      var self = this;

      return Math.round(self.spent / self.budget * 100);
    }

    function budgetUtilizationStatus() {
      /* jshint validthis:true */
      var self = this;

      var util = self.budgetUtilization();

      if (util <= 60) {
        return 'success';
      } else if (util <= 80) {
        return 'warning';
      }

      return 'danger';
    }

    function budgetRemainder() {
      /* jshint validthis:true */
      var self = this;

      return Math.round((self.budget - self.spent) / self.budget * 100);
    }

    function budgetRemainderStatus() {
      /* jshint validthis:true */
      var self = this;

      var rem = self.budgetRemainder();

      if (rem >= 40) {
        return 'success';
      } else if (rem >= 20) {
        return 'warning';
      }

      return 'danger';
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('ProviderProductType', ProviderProductTypeFactory);

  /** @ngInject */
  function ProviderProductTypeFactory($resource) {
    var ProviderProductType = $resource('/api/v1/providers/:providerId/product_types', {
      providerId: '@provider_id'
    });

    return ProviderProductType;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Provider', ProviderFactory);

  /** @ngInject */
  function ProviderFactory($resource) {
    var Provider = $resource('/api/v1/providers/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    Provider.defaults = {
      registered_provider_id: null,
      name: '',
      description: '',
      active: false,
      tags: [],
      answers: []
    };

    Provider.new = newProvider;

    function newProvider(data) {
      return new Provider(angular.extend({}, Provider.defaults, data || {}));
    }

    return Provider;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('RegisteredProvider', RegisteredProviderFactory);

  /** @ngInject */
  function RegisteredProviderFactory($resource) {
    var RegisteredProvider = $resource('/api/v1/registered_providers/:id');

    return RegisteredProvider;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Role', RolesFactory);

  /** @ngInject */
  function RolesFactory($resource) {
    var Role = $resource('/api/v1/roles/:id', {id: '@id'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    Role.defaults = {
      name: '',
      description: '',
      permissions: {approvals: [], projects: [], memberships: []}
    };

    Role.new = newRole;

    function newRole() {
      return new Role(angular.copy(Role.defaults));
    }

    return Role;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Service', ServicesFactory);

  /** @ngInject */
  function ServicesFactory($resource) {
    var Service = $resource('/api/v1/services/:id', {id: '@id', operation: '@operation'}, {
      operation: {
        url: '/api/v1/services/:id/operations/:operation',
        method: 'PUT',
        isArray: false
      }
    });

    return Service;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Setting', SettingsFactory);

  /** @ngInject */
  function SettingsFactory($resource) {
    var Setting = $resource('/api/v1/settings/:name', {name: '@name'}, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    return Setting;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('StaffPermissions', StaffPermissionsFactory);

  /** @ngInject */
  function StaffPermissionsFactory($resource) {
    var StaffPermissions = $resource('/api/v1/staff/:id/permissions/:projectId', {
      id: '@id',
      projectId: '@projectId'
    });

    return StaffPermissions;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Staff', StaffFactory);

  /** @ngInject */
  function StaffFactory($resource) {
    var Staff = $resource('/api/v1/staff/:id', {id: '@id'}, {
      // Get Current
      getCurrentMember: {
        method: 'GET',
        isArray: false,
        url: '/api/v1/staff/current_member'
      },
      // Get Single
      get: {
        method: 'GET',
        isArray: false
      },
      // Get All
      query: {
        method: 'GET',
        isArray: true
      },
      'update': {
        method: 'PUT'
      }
    });

    Staff.defaults = {
      first_name: '',
      last_name: '',
      phone: '',
      role: 'user',
      email: ''
    };

    Staff.new = newStaff;

    Staff.prototype.fullName = fullName;

    return Staff;

    function fullName() {
      /*jshint validthis: true */
      return [this.first_name, this.last_name].join(' ');
    }

    function newStaff(data) {
      return new Staff(angular.extend({}, angular.copy(Staff.defaults), data || {}));
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Tag', TagFactory);

  /** @ngInject */
  function TagFactory($resource) {
    var Tag = $resource('/api/v1/tags/:id', {id: '@id'}, {});

    // Instead of making an api call we'll call query and group the tags ourselves.
    Tag.grouped = grouped;

    function grouped() {
      return Tag.query().$promise.then(groupTags);

      function groupTags(tags) {
        var list = {};
        var re = /[A-Z]/;

        tags.forEach(processTag);

        return list;

        function processTag(tag) {
          var firstChar = tag.name.substring(0, 1).toUpperCase();

          if (!re.test(firstChar)) {
            firstChar = '#';
          }

          if (angular.isUndefined(list[firstChar])) {
            list[firstChar] = [];
          }

          // Trim the data to only the data points we care about.
          list[firstChar].push(new Tag({
            id: tag.id,
            name: tag.name,
            count: tag.count
          }));
        }
      }
    }

    return Tag;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('Version', VersionFactory);

  /** @ngInject */
  function VersionFactory($resource) {
    var Version = $resource('/api/v1/version/', {});

    return Version;
  }
})();

(function() {
  'use strict';

  angular.module('app.resources')
    .factory('WizardQuestion', WizardQuestionFactory);

  /** @ngInject */
  function WizardQuestionFactory($resource) {
    var vm = this;
    var WizardQuestion = $resource('/api/v1/wizard_questions/:id', {
      id: '@id',
      'includes[]': ['wizard_answers']
    }, {
      update: {
        method: 'PUT',
        isArray: false
      }
    });

    WizardQuestion.defaults = {
      text: ''
    };

    WizardQuestion.answerDefaults = {
      text: '',
      tags_to_add: [],
      tags_to_remove: []
    };

    WizardQuestion.new = newQuestion;

    WizardQuestion.prototype.next = function() {
      if (this.next_question_id) {
        return WizardQuestion
          .get({id: this.next_question_id})
          .$promise;
      }
    };

    function newQuestion() {
      return new WizardQuestion(angular.copy(WizardQuestion.defaults));
    }

    return WizardQuestion;
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('AuthenticationService', AuthenticationServiceFactory);

  /** @ngInject */
  function AuthenticationServiceFactory($http, $q, SessionService) {
    var service = {
      login: login,
      logout: logout,
      isAuthenticated: isAuthenticated,
      ssoInit: ssoInit
    };

    return service;

    function ssoInit() {
      var deferred = $q.defer();

      $http
        .get('/api/v1/saml/init')
        .success(samlSuccess)
        .error(samlError);

      return deferred.promise;

      function samlSuccess(response) {
        deferred.resolve(response.url);
      }

      function samlError() {
        deferred.resolve(false);
      }
    }

    function login(email, password) {
      var credentials = {
        staff: {
          email: email,
          password: password
        }
      };

      return $http
        .post('/api/v1/staff/sign_in', credentials)
        .success(loginSuccess);

      function loginSuccess(data) {
        SessionService.create(data);
      }
    }

    function logout() {
      return $http
        .delete('/api/v1/staff/sign_out')
        .success(logoutSuccess);

      function logoutSuccess() {
        SessionService.destroy();
      }
    }

    function isAuthenticated() {
      return !!SessionService.email;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .run(startup);

  /** @ngInject */
  function startup(userSession, SessionService) {
    if (angular.isDefined(userSession.id)) {
      SessionService.create(userSession);
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('SessionService', SessionServiceFactory);

  /** @ngInject */
  function SessionServiceFactory() {
    var service = {
      create: create,
      destroy: destroy,
      fullName: fullName,
      isAdmin: isAdmin,
      isManager: isManager
    };

    destroy();

    return service;

    function create(data) {
      service.id = data.id;
      service.firstName = data.first_name;
      service.lastName = data.last_name;
      service.email = data.email;
      service.role = data.role;
      service.updatedAt = data.updated_at;
    }

    function destroy() {
      service.id = null;
      service.firstName = null;
      service.lastName = null;
      service.email = null;
      service.role = null;
      service.updatedAt = null;
    }

    // Helpers

    function fullName() {
      return [service.firstName, service.lastName].join(' ');
    }

    function isAdmin() {
      return service.role === 'admin';
    }

    function isManager() {
      return isAdmin() || 'manager' === service.role;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .factory('AuthorizationService', AuthorizationServiceFactory);

  /** @ngInject */
  function AuthorizationServiceFactory(SessionService, userRoles, AuthenticationService) {
    var service = {
      isAuthorized: isAuthorized
    };

    return service;

    function isAuthorized(authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      if (0 === authorizedRoles.length) {
        authorizedRoles = [userRoles.all];
      }
      // If authorizedRoles contains 'all', then we allow it through.
      if (-1 !== authorizedRoles.indexOf(userRoles.all)) {
        return true;
      } else {
        return (AuthenticationService.isAuthenticated() && -1 !== authorizedRoles.indexOf(SessionService.role));
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .run(appRun);

  /** @ngInject */
  function appRun($rootScope, $state, AuthenticationService, AuthorizationService, jQuery) {
    $rootScope.$on('$stateChangeStart', changeStart);
    $rootScope.$on('$stateChangeError', changeError);
    $rootScope.$on('$stateChangeSuccess', changeSuccess);

    function changeStart(event, toState, toParams, fromState, fromParams) {
      var authorizedRoles = ['all'];

      if (toState.data && toState.data.authorizedRoles) {
        authorizedRoles = toState.data.authorizedRoles;
      }

      if (!AuthorizationService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthenticationService.isAuthenticated()) {
          $state.transitionTo('errors.unauthorized');
        } else {
          $state.transitionTo('login');
        }
      }
    }

    function changeError(event, toState, toParams, fromState, fromParams, error) {
      // If a 401 is encountered during a state change, then kick the user back to the login
      if (401 === error.status) {
        event.preventDefault();
        if (AuthenticationService.isAuthenticated()) {
          $state.transitionTo('logout');
        } else if ('login' !== toState.name) {
          $state.transitionTo('login');
        }
      }
    }

    function changeSuccess() {
      jQuery('html, body').animate({scrollTop: 0}, 200);
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.components')
    .constant('userRoles', {
      all: 'all',
      user: 'user',
      manager: 'manager',
      admin: 'admin'
    });
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin': {
        parent: 'application',
        abstract: true,
        template: '<ui-view></ui-view>',
        url: '/admin',
        data: {
          authorizedRoles: ['admin']
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin': {
        type: 'dropdown',
        state: 'admin',
        label: 'Admin',
        style: 'admin',
        order: 1000,
        isVisible: isVisible
      }
    };
  }

  /** @ngInject */
  function isVisible(SessionService) {
    return SessionService.isAdmin();
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.alerts': {
        url: '/alerts',
        redirectTo: 'admin.alerts.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.alerts': {
        type: 'state',
        state: 'admin.alerts',
        label: 'Alerts',
        order: 0
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.alerts.create': {
        url: '/create/:id',
        templateUrl: 'app/states/admin/alerts/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts Create',
        resolve: {
          alertRecord: resolveAlert,
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveAlert($stateParams, Alert) {
    if ($stateParams.id) {
      return Alert.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember().$promise;
  }

  /** @ngInject */
  function StateController(logger, alertRecord, $stateParams, staff) {
    var vm = this;

    vm.title = 'Admin Alerts Create';
    vm.alertRecord = alertRecord;
    vm.activate = activate;
    vm.staffId = staff.id;
    vm.home = 'admin.alerts.list';
    vm.homeParams = { };

    // HARD CODED FOR SINGLE TENANT
    vm.alertableType = 'Organization';
    vm.alertableId = '1';

    activate();

    function activate() {
      logger.info('Activated Admin Alerts Create View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.alerts.edit': {
        url: '/edit/:id',
        templateUrl: 'app/states/admin/alerts/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts Create',
        resolve: {
          alertRecord: resolveAlert,
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveAlert($stateParams, Alert) {
    if ($stateParams.id) {
      return Alert.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember().$promise;
  }

  /** @ngInject */
  function StateController(logger, alertRecord, $stateParams, staff) {
    var vm = this;

    vm.title = 'Admin Alerts Edit';
    vm.alertRecord = alertRecord;
    vm.activate = activate;
    vm.staffId = staff.id;
    vm.home = 'admin.alerts.list';
    vm.homeParams = { };

    // HARD CODED FOR SINGLE TENANT
    vm.alertableType = 'Organization';
    vm.alertableId = '1';

    activate();

    function activate() {
      logger.info('Activated Admin Alerts Create View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.alerts.list': {
        url: '', // No url, this state is the index of admin.alerts
        templateUrl: 'app/states/admin/alerts/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Alerts List',
        resolve: {
          alerts: resolveAlerts
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveAlerts(Alert) {
    return Alert.query({latest: 'true', alertable_type: 'Organization'}).$promise;
  }

  /** @ngInject */
  function StateController(lodash, logger, $q, $state, alerts, Toasts) {
    var vm = this;

    vm.title = 'Admin Products List';
    vm.alerts = alerts;

    vm.activate = activate;
    vm.goTo = goTo;
    activate();

    function activate() {
      logger.info('Activated Admin Products List View');
    }

    function goTo(id) {
      $state.go('admin.alerts.create', {alertId: id});
    }

    vm.deleteAlert = deleteAlert;

    function deleteAlert(alert) {
      alert.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        lodash.remove(vm.alerts, {id: alert.id});
        Toasts.toast('Alert deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.groups.create': {
        url: '/create',
        templateUrl: 'app/states/admin/groups/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Groups Create',
        resolve: {
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, Group, staff) {
    var vm = this;

    vm.title = 'Admin Group Create';
    vm.staff = staff;

    vm.activate = activate;

    activate();

    function activate() {
      initGroup();
      logger.info('Activated Admin Products Create View');
    }

    // Private

    function initGroup() {
      vm.group = Group.new();
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.groups.edit': {
        url: '/edit/:groupId',
        templateUrl: 'app/states/admin/groups/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Edit Group',
        resolve: {
          group: resolveGroup,
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveGroup(Group, $stateParams) {
    return Group.get({id: $stateParams.groupId, 'includes[]': ['staff']}).$promise;
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, group, staff) {
    var vm = this;

    vm.title = 'Edit Group';
    vm.group = group;
    vm.staff = staff;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Edit Group View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.groups': {
        url: '/groups',
        redirectTo: 'admin.groups.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.alerts': {
        type: 'state',
        state: 'admin.groups',
        label: 'Groups',
        order: 1
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.groups.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/groups/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Groups List',
        resolve: {
          groups: resolveGroups
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveGroups($stateParams, Group) {
    return Group.query({'includes[]': ['staff']}).$promise;
  }

  /** @ngInject */
  function StateController(logger, $q, $state, groups, Toasts) {
    var vm = this;

    vm.title = 'Admin Groups List';
    vm.groups = groups;
    vm.activate = activate;
    vm.goTo = goTo;

    activate();

    function activate() {
      logger.info('Activated Admin Groups List View');
    }

    function goTo(id) {
      $state.go('admin.groups.create', {id: id});
    }

    vm.deleteGroup = deleteGroup;

    function deleteGroup(index) {
      var group = vm.groups[index];
      group.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        vm.groups.splice(index, 1);
        Toasts.toast('Group deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'admin.providers.create': {
        url: '/create/:registeredProviderId',
        templateUrl: 'app/states/admin/providers/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Create Provider',
        resolve: {
          registeredProvider: resolveRegisteredProvider
        }
      }
    };
  }

  /** @ngInject */
  function resolveRegisteredProvider($stateParams, registeredProviders, lodash) {
    return lodash.find(registeredProviders, 'id', parseInt($stateParams.registeredProviderId, 10));
  }

  /** @ngInject */
  function StateController(Provider, registeredProvider) {
    var vm = this;

    vm.title = 'Create Provider';

    vm.activate = activate;

    activate();

    function activate() {
      initProvider();
    }

    // Private

    function initProvider() {
      vm.provider = Provider.new({registered_provider_id: registeredProvider.id});
      vm.provider.tags = angular.copy(registeredProvider.tags);
      vm.provider.answers = angular.copy(registeredProvider.questions);
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'admin.providers.edit': {
        url: '/edit/:providerId',
        templateUrl: 'app/states/admin/providers/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Edit Provider',
        resolve: {
          provider: resolveProvider
        }
      }
    };
  }

  /** @ngInject */
  function resolveProvider($stateParams, Provider) {
    return Provider.get({id: $stateParams.providerId, 'includes[]': ['registered_provider', 'answers']}).$promise;
  }

  /** @ngInject */
  function StateController(lodash, provider) {
    var vm = this;

    vm.title = 'Edit Provider';
    vm.provider = provider;

    vm.activate = activate;

    activate();

    function activate() {
      initProvider();
    }

    // Private

    function initProvider() {
      var questions = angular.copy(provider.registered_provider.questions);

      delete provider.registered_provider;
      angular.forEach(questions, mergeWithAnswer);
      vm.provider.answers = questions;

      function mergeWithAnswer(question) {
        var answer = lodash.find(provider.answers, 'name', question.name);

        angular.extend(question, answer || {});
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'admin.providers.list': {
        url: '',
        templateUrl: 'app/states/admin/providers/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Providers List',
        resolve: {
          providers: resolveProviders
        }
      }
    };
  }

  /** @ngInject */
  function resolveProviders(Provider) {
    return Provider.query().$promise;
  }

  /** @ngInject */
  function StateController($state, providers, ProviderTypeModal) {
    var vm = this;

    vm.title = 'Providers List';

    vm.providers = providers;

    vm.activate = activate;
    vm.showModal = showModal;
    vm.edit = edit;

    activate();

    function activate() {
    }

    function showModal() {
      ProviderTypeModal.showModal().then(handleResult);

      function handleResult(registeredProvider) {
        $state.go('admin.providers.create', {registeredProviderId: registeredProvider.id});
      }
    }

    function edit(provider) {
      $state.go('admin.providers.edit', {providerId: provider.id});
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.providers': {
        url: '/providers',
        redirectTo: 'admin.providers.list',
        template: '<ui-view></ui-view>',
        resolve: {
          registeredProviders: resolveRegisteredProviders
        }
      }
    };
  }

  /** @ngInject */
  function resolveRegisteredProviders(RegisteredProvider) {
    return RegisteredProvider.query().$promise;
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.providers': {
        type: 'state',
        state: 'admin.providers',
        label: 'Providers',
        order: 9
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.roles.create': {
        url: '/create',
        templateUrl: 'app/states/admin/roles/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Roles Create'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function StateController(logger, Role) {
    var vm = this;

    vm.title = 'Admin Role Create';

    vm.activate = activate;

    activate();

    function activate() {
      initRole();
      logger.info('Activated Admin Products Create View');
    }

    // Private

    function initRole() {
      vm.role = Role.new();
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.roles.edit': {
        url: '/edit/:roleId',
        templateUrl: 'app/states/admin/roles/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Edit Role',
        resolve: {
          role: resolveRole
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveRole(Role, $stateParams) {
    return Role.get({id: $stateParams.roleId}).$promise;
  }

  /** @ngInject */
  function StateController(logger, role) {
    var vm = this;

    vm.title = 'Edit Role';
    vm.role = role;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Edit Role View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.roles.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/roles/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin Roles List',
        resolve: {
          roles: resolveRoles
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveRoles(Role) {
    return Role.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, $state, roles, Toasts, lodash) {
    var vm = this;

    vm.title = 'Admin Roles List';
    vm.roles = roles;
    vm.activate = activate;
    vm.deleteRole = deleteRole;
    vm.permissionsList = permissionsList;
    activate();

    function activate() {
      logger.info('Activated Admin Role List View');
    }

    function deleteRole(index) {
      var roles = vm.roles[index];
      roles.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        vm.roles.splice(index, 1);
        Toasts.toast('Role deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }

    function permissionsList(list) {
      return lodash.flatten(lodash.map(list, formatPermissions)).join('');

      function formatPermissions(value, key) {
        return ['<strong>', key, '</strong>: ', value.join(' '), '<br>'];
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.roles': {
        url: '/roles',
        redirectTo: 'admin.roles.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.roles': {
        type: 'state',
        state: 'admin.roles',
        label: 'Roles',
        order: 2
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.settings': {
        url: '/settings',
        templateUrl: 'app/states/admin/settings/settings.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Settings',
        resolve: {
          settings: resolveSettings
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.settings': {
        type: 'state',
        state: 'admin.settings',
        label: 'Settings',
        order: 4
      }
    };
  }

  /** @ngInject */
  function resolveSettings(Setting) {
    return Setting.query().$promise;
  }

  /** @ngInject */
  function StateController(settings, lodash, EditSettingModal) {
    var vm = this;

    vm.title = 'Settings';

    vm.activate = activate;
    vm.edit = edit;

    activate();

    function activate() {
      createSettingGroups();
    }

    function edit(setting) {
      EditSettingModal.showModal(setting).then(updateSetting);

      function updateSetting(result) {
        setting.value = result.value;
      }
    }

    // Private

    function createSettingGroups() {
      vm.groups = lodash.groupBy(settings, groupByGroup);

      function groupByGroup(setting) {
        return setting.group;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.users.create': {
        url: '/create',
        templateUrl: 'app/states/admin/users/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin User Create'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function StateController(Staff) {
    var vm = this;

    vm.title = 'Admin User Create';
    vm.activate = activate;

    activate();

    function activate() {
      initStaff();
    }

    // Private

    function initStaff() {
      vm.user = Staff.new();
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.users.edit': {
        url: '/edit/:id',
        templateUrl: 'app/states/admin/users/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin User Edit',
        resolve: {
          user: resolveUser
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveUser(Staff, $stateParams) {
    return Staff.get({id: $stateParams.id}).$promise;
  }

  /** @ngInject */
  function StateController($stateParams, user) {
    var vm = this;

    vm.title = 'Admin User Edit';
    vm.activate = activate;
    vm.user = user;

    activate();

    function activate() {
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.users.list': {
        url: '', // No url, this state is the index of admin.products
        templateUrl: 'app/states/admin/users/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin User List',
        resolve: {
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveStaff($stateParams, Staff) {
    return Staff.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, $q, $state, staff, Toasts) {
    var vm = this;

    vm.title = 'Admin User List';
    vm.staff = staff;
    vm.activate = activate;
    vm.goTo = goTo;

    activate();

    function activate() {
      logger.info('Activated Admin User List View');
    }

    function goTo(id) {
      $state.go('admin.users.create', {id: id});
    }

    vm.deleteUser = deleteUser;

    function deleteUser(index) {
      var users = vm.staff[index];
      users.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        vm.staff.splice(index, 1);
        Toasts.toast('User deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'admin.users': {
        url: '/users',
        redirectTo: 'admin.users.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'admin.users': {
        type: 'state',
        state: 'admin.users',
        label: 'Users',
        order: 5
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'dashboard': {
        parent: 'application',
        url: '/',
        templateUrl: 'app/states/dashboard/dashboard.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Dashboard',
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }

  function navItems() {
    return {
      'profile': {
        type: 'profile',
        order: 0
      }
    };
  }

  function sidebarItems() {
    return {
      'dashboard': {
        type: 'state',
        state: 'dashboard',
        label: 'Dashboard',
        style: 'dashboard',
        order: 0
      }
    };
  }

  /** @ngInject */
  function StateController(Dashboard, logger) {
    var vm = this;

    vm.title = 'Dashboard';
    vm.onDropComplete = onDropComplete;

    activate();
    function activate() {
      vm.chartCollection = Dashboard;
      logger.info('Activated Dashboard View');
    }

    function onDropComplete(index, obj) {
      vm.secondObj = vm.chartCollection[index];
      vm.secondIndex = vm.chartCollection.indexOf(obj);
      vm.chartCollection[index] = obj;
      vm.chartCollection[vm.secondIndex] = vm.secondObj;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'errors': {
        parent: 'blank',
        abstract: true,
        template: '<ui-view></ui-view>',
        url: '/errors'
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(runNotFound);

  function runNotFound($rootScope, $state) {
    $rootScope.$on('$stateNotFound', notFound);

    function notFound(event, toState) {
      event.preventDefault();
      $state.go('errors.four0four', {toState: toState});
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates(), '/errors/404');
  }

  function getStates() {
    return {
      'errors.four0four': {
        url: '/404',
        templateUrl: 'app/states/errors/four0four/four0four.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Not Found : 404',
        params: {
          toState: null
        }
      }
    };
  }

  /** @ngInject */
  function StateController($stateParams) {
    var vm = this;

    vm.state = '';

    if ($stateParams.toState) {
      vm.state = $stateParams.toState.to;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'errors.sorry': {
        url: '/sorry',
        templateUrl: 'app/states/errors/sorry/sorry.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Sorry',
        data: {
          layout: 'blank'
        }
      }
    };
  }

  /** @ngInject */
  function StateController() {
    var vm = this;

    vm.title = 'Sorry';
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'errors.unauthorized': {
        url: '/unauthorized-access',
        templateUrl: 'app/states/errors/unauthorized/unauthorized.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Unauthorized',
        data: {
          layout: 'blank'
        }
      }
    };
  }

  /** @ngInject */
  function StateController() {
    var vm = this;

    vm.title = 'Unauthorized';

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
  }

  function navItems() {
    return {};
  }

  function getStates() {
    return {
      'login': {
        parent: 'blank',
        url: '/login',
        templateUrl: 'app/states/login/login.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Login',
        resolve: {
          motd: resolveMotd
        }
      }
    };
  }

  /** @ngInject */
  function resolveMotd(Motd) {
    return Motd.get().$promise;
  }

  /** @ngInject */
  function StateController(motd) {
    var vm = this;

    vm.title = 'Login';
    vm.motd = motd;
    activate();

    function activate() {
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'logout': {
        parent: 'blank',
        url: '/logout',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Logout'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'logout': {
        type: 'state',
        state: 'logout',
        label: 'Logout',
        style: 'logout',
        isVisible: isVisible,
        order: 9999
      }
    };
  }

  /** @ngInject */
  function isVisible() {
    // Visibility can be conditional
    return true;
  }

  /** @ngInject */
  function StateController($state, AuthenticationService, logger, lodash) {
    var vm = this;

    vm.AuthService = AuthenticationService;
    vm.title = '';

    vm.AuthService.logout().success(lodash.bind(function() {
      logger.info('You have been logged out.');
      $state.transitionTo('login');
    }, vm)).error(lodash.bind(function() {
      logger.info('An error has occured at logout.');
    }, vm));
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.cms': {
        url: '/cms',
        redirectTo: 'manage.cms.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'manage.cms': {
        type: 'state',
        state: 'manage.cms',
        label: 'CMS',
        order: 10
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.cms.create': {
        url: '/create',
        templateUrl: 'app/states/manage/cms/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin CMS Create',
        resolve: {
          contentPageRecord: resolveContentPage
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveContentPage($stateParams, ContentPage) {
    return new ContentPage();
  }

  /** @ngInject */
  function StateController(logger, contentPageRecord, $stateParams) {
    var vm = this;

    vm.title = 'Admin CMS Create';
    vm.contentPageRecord = contentPageRecord;
    vm.activate = activate;
    vm.home = 'manage.cms.list';
    vm.homeParams = { };

    activate();

    function activate() {
      logger.info('Activated Admin CMS Create View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.cms.edit': {
        url: '/edit/:id',
        templateUrl: 'app/states/manage/cms/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin CMS Edit',
        resolve: {
          contentPageRecord: resolveContentPage
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveContentPage($stateParams, ContentPage) {
    if ($stateParams.id) {
      return ContentPage.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function StateController(logger, contentPageRecord, $stateParams) {
    var vm = this;

    vm.title = 'Admin CMS Edit';
    vm.contentPageRecord = contentPageRecord;
    vm.activate = activate;
    vm.home = 'manage.cms.list';
    vm.homeParams = { };

    activate();

    function activate() {
      logger.info('Activated Admin CMS Edit View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.cms.list': {
        url: '', // No url, this state is the index of manage.cms
        templateUrl: 'app/states/manage/cms/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Admin CMS List',
        resolve: {
          pages: resolvePages
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolvePages(ContentPage) {
    return ContentPage.query().$promise;
  }

  /** @ngInject */
  function StateController($rootScope, lodash, logger, $q, $state, pages, Toasts) {
    var vm = this;

    // ATTRIBUTES
    vm.title = 'Admin CMS List';
    vm.pages = pages;

    // METHODS
    vm.deleteContentPage = deleteContentPage;
    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Admin CMS List View');
    }

    function deleteContentPage(page) {
      page.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        lodash.remove(vm.pages, {id: page.id});
        $rootScope.$emit('pageRemoved', {});
        Toasts.toast('Content deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage': {
        parent: 'application',
        abstract: true,
        template: '<ui-view></ui-view>',
        url: '/manage',
        data: {
          authorizedRoles: ['admin', 'manager']
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'manage': {
        type: 'dropdown',
        state: 'manage',
        label: 'Manage',
        style: 'manage',
        order: 900,
        isVisible: isVisible
      }
    };
  }

  /** @ngInject */
  function isVisible(SessionService) {
    return SessionService.isManager();
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.motd.edit': {
        url: '/motd/edit',
        templateUrl: 'app/states/manage/motd/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Edit MOTD',
        resolve: {
          motd: resolveMotd
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveMotd(Motd) {
    return Motd.get().$promise;
  }

  /** @ngInject */
  function StateController($state, logger, motd, Toasts, lodash, Motd) {
    var vm = this;

    vm.title = 'Edit Message of the Day';
    vm.backToDash = backToDash;
    vm.showValidationMessages = false;
    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;
    vm.onSubmit = onSubmit;
    vm.activate = activate;
    vm.home = 'dashboard';
    vm.motd = motd;

    activate();

    function activate() {
      logger.info('Activated Edit Message of the Day View');
    }

    function backToDash() {
      $state.go(vm.home);
    }

    function showErrors() {
      return vm.showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return vm.showValidationMessages && vm.form.$invalid;
      }

      return vm.showValidationMessages && vm.form[field].$invalid;
    }

    function onSubmit() {
      vm.showValidationMessages = true;

      if (vm.form.$valid) {
        if (vm.motd.id) {
          vm.motd.$update(saveSuccess, saveFailure);
        } else {
          vm.motd.$save(saveSuccess, saveFailure);
        }
      }

      function saveSuccess() {
        Toasts.toast('Message of the Day updated.');
        $state.go(vm.home);
      }

      function saveFailure() {
        Toasts.error('Server returned an error while saving.');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.motd': {
        url: '/motd',
        redirectTo: 'manage.motd.edit',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'manage.alerts': {
        type: 'state',
        state: 'manage.motd',
        label: 'Message of the Day',
        order: 3
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.product-categories.create': {
        url: '/create',
        templateUrl: 'app/states/manage/product-categories/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Create Product Category'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function StateController(logger, ProductCategory) {
    var vm = this;

    vm.title = 'Create Product Category';

    vm.activate = activate;

    activate();

    function activate() {
      initProductCategory();
      logger.info('Activated Create Product Category View');
    }

    // Private

    function initProductCategory() {
      vm.productCategory = ProductCategory.new();
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.product-categories.edit': {
        url: '/edit/:productCategoryId',
        templateUrl: 'app/states/manage/product-categories/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Edit Product Categories',
        resolve: {
          productCategory: resolveProductCategory
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveProductCategory(ProductCategory, $stateParams) {
    return ProductCategory.get({id: $stateParams.productCategoryId}).$promise;
  }

  /** @ngInject */
  function StateController(logger, productCategory) {
    var vm = this;

    vm.title = 'Edit Product Category';
    vm.productCategory = productCategory;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Edit Product Category View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.product-categories.list': {
        url: '',
        templateUrl: 'app/states/manage/product-categories/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Product Categories List',
        resolve: {
          productCategories: resolveProductCategories
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveProductCategories(ProductCategory) {
    return ProductCategory.query().$promise;
  }

  /** @ngInject */
  function StateController(logger, productCategories) {
    var vm = this;

    vm.title = 'Manage Product Categories List';
    vm.productCategories = productCategories;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Manage Product Categories List View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.product-categories': {
        url: '/product-categories',
        redirectTo: 'manage.product-categories.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'manage.product-categories': {
        type: 'state',
        state: 'manage.product-categories',
        label: 'Product Categories',
        order: 4
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'manage.products.create': {
        url: '/create/:providerId/:productTypeId',
        templateUrl: 'app/states/manage/products/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Products Create',
        resolve: {
          provider: resolveProvider,
          productType: resolveProductType
        }
      }
    };
  }

  /** @ngInject */
  function resolveProvider($stateParams, Provider) {
    return Provider.get({id: $stateParams.providerId}).$promise;
  }

  /** @ngInject */
  function resolveProductType($stateParams, ProductType) {
    return ProductType.get({id: $stateParams.productTypeId}).$promise;
  }

  /** @ngInject */
  function StateController(Product, provider, productType) {
    var vm = this;

    vm.title = 'Manage Products Create';
    vm.activate = activate;

    activate();

    function activate() {
      vm.subHeading = [provider.name, productType.name].join(' :: ');
      initProduct();
      initForm();
    }

    // Private

    function initProduct() {
      vm.product = Product.new({provider_id: provider.id, product_type_id: productType.id});
      vm.product.tags = provider.tags.concat(productType.tags);
      vm.product.answers = angular.copy(productType.product_questions);
    }

    function initForm() {
      vm.options = {
        formState: {
          provider: provider
        }
      };
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'manage.products.edit': {
        url: '/edit/:productId',
        templateUrl: 'app/states/manage/products/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Product Edit',
        resolve: {
          product: resolveProduct
        }
      }
    };
  }

  /** @ngInject */
  function resolveProduct(Product, $stateParams) {
    return Product.get({id: $stateParams.productId, 'includes[]': ['answers', 'product_type', 'provider']}).$promise;
  }

  /** @ngInject */
  function StateController(lodash, product) {
    var vm = this;

    var provider = product.provider;
    var productType = product.product_type;

    vm.product = product;

    vm.title = 'Product Edit';
    vm.activate = activate;

    activate();

    function activate() {
      vm.subHeading = [provider.name, productType.name].join(' :: ');
      initProduct();
      initForm();
    }

    // Private

    function initProduct() {
      var questions = angular.copy(productType.product_questions);

      delete vm.product.provider;
      delete vm.product.product_type;
      angular.forEach(questions, mergeWithAnswer);
      vm.product.answers = questions;

      function mergeWithAnswer(question) {
        var answer = lodash.find(product.answers, 'name', question.name);

        angular.extend(question, answer || {});
      }
    }

    function initForm() {
      vm.options = {
        formState: {
          provider: provider
        }
      };
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'manage.products.list': {
        url: '', // No url, this state is the index of manage.products
        templateUrl: 'app/states/manage/products/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Products List',
        resolve: {
          products: resolveProducts
        }
      }
    };
  }

  /** @ngInject */
  function resolveProducts(Product) {
    return Product.query().$promise;
  }

  /** @ngInject */
  function StateController($state, products, productTypes, ProductTypeModal) {
    var vm = this;

    vm.title = 'Manage Products List';
    vm.products = products;
    vm.productTypes = productTypes;

    vm.showModal = showModal;

    function showModal() {
      ProductTypeModal.showModal().then(handleResult);

      function handleResult(selections) {
        $state.go('manage.products.create', selections);
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.products': {
        url: '/products',
        redirectTo: 'manage.products.list',
        template: '<ui-view></ui-view>',
        resolve: {
          productTypes: resolveProductTypes
        }
      }
    };
  }

  function sidebarItems() {
    return {
      'manage.products': {
        type: 'state',
        state: 'manage.products',
        label: 'Products',
        order: 5
      }
    };
  }

  /** @ngInject */
  function resolveProductTypes(ProductType) {
    return ProductType.query().$promise;
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'manage.project-questions.create': {
        url: '/create',
        templateUrl: 'app/states/manage/project-questions/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Question Create'
      }
    };
  }

  /** @ngInject */
  function StateController(ProjectQuestion) {
    var vm = this;

    vm.title = 'Project Question Create';

    vm.activate = activate;

    activate();

    function activate() {
      initProjectQuestion();
      initOptions();
    }

    // Private

    function initOptions() {
      vm.projectQuestion.options.length = 0;
    }

    function initProjectQuestion() {
      vm.projectQuestion = ProjectQuestion.new();
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.project-questions.edit': {
        url: '/edit/:projectQuestionId',
        templateUrl: 'app/states/manage/project-questions/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Project Question Edit',
        resolve: {
          projectQuestion: resolveProjectQuestion
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveProjectQuestion(ProjectQuestion, $stateParams) {
    return ProjectQuestion.get({id: $stateParams.projectQuestionId}).$promise;
  }

  /** @ngInject */
  function StateController(projectQuestion) {
    var vm = this;

    vm.title = 'Manage Project Question Edit';
    vm.activate = activate;

    activate();

    function activate() {
      vm.projectQuestion = projectQuestion;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.project-questions.list': {
        url: '', // No url, this state is the index of manage.project-questions
        templateUrl: 'app/states/manage/project-questions/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Questions',
        resolve: {
          projectQuestions: resolveProjectQuestions
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveProjectQuestions(ProjectQuestion) {
    return ProjectQuestion.query().$promise;
  }

  /** @ngInject */
  function StateController(jQuery, logger, Toasts, projectQuestions, $timeout) {
    var vm = this;

    vm.title = 'Project Questions';
    vm.projectQuestions = projectQuestions;
    vm.currentSort = [];
    vm.sortableOptions = {
      axis: 'y',
      cursor: 'move',
      handle: '.project-questions-table__handle',
      helper: sortableHelper,
      opacity: 0.9,
      placeholder: 'project-questions-table__placeholder',
      stop: sortableStop
    };

    vm.activate = activate;
    vm.deleteQuestion = deleteQuestion;

    activate();

    function activate() {
      logger.info('Activated Project Questions View');
    }

    function deleteQuestion(index) {
      var projectQuestion = vm.projectQuestions[index];

      projectQuestion.$delete(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        vm.projectQuestions.splice(index, 1);
        Toasts.toast('Project Question deleted.');
      }

      function deleteFailure() {
        Toasts.error('Server returned an error while deleting.');
      }
    }

    // Private

    function sortableHelper(event, element) {
      var $originals = element.children();
      var $helper = element.clone();

      $helper.children().each(setCloneWidth);

      return $helper;

      function setCloneWidth(index, element) {
        // Set helper cell sizes to match the original sizes
        jQuery(element).width($originals.eq(index).width());
      }
    }

    function sortableStop(event, ui) {
      var projectQuestion = ui.item.sortable.model;

      projectQuestion.position = ui.item.index();
      projectQuestion.$reposition(updateSuccess, updateFailure);

      function updateSuccess() {
        Toasts.toast('Project Question order saved.');
      }

      function updateFailure() {
        Toasts.error('Server returned an error while saving.');
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.project-questions': {
        url: '/project-questions',
        redirectTo: 'manage.project-questions.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'manage.project-questions': {
        type: 'state',
        state: 'manage.project-questions',
        label: 'Project Questions',
        order: 6
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.wizard-questions.create': {
        url: '/create',
        templateUrl: 'app/states/manage/wizard-questions/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Create Wizard Question'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function StateController(logger, WizardQuestion) {
    var vm = this;

    vm.title = '';

    vm.activate = activate;

    activate();

    function activate() {
      initQuestion();
      initAnswers();
      logger.info('Activated Manage Create Wizard Question View');
    }

    function initQuestion() {
      vm.question = WizardQuestion.new();
    }

    function initAnswers() {
      vm.question.wizard_answers = [];
      vm.question.wizard_answers.push(angular.extend({}, angular.copy(WizardQuestion.answerDefaults)));
      vm.question.wizard_answers.push(angular.extend({}, angular.copy(WizardQuestion.answerDefaults)));
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.wizard-questions.edit': {
        url: '/edit/:questionId',
        templateUrl: 'app/states/manage/wizard-questions/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Edit Wizard Question',
        resolve: {
          wizardQuestion: resolveWizardQuestion
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveWizardQuestion(WizardQuestion, $stateParams) {
    return WizardQuestion.get({id: $stateParams.questionId}).$promise;
  }

  /** @ngInject */
  function StateController(logger, wizardQuestion) {
    var vm = this;

    vm.title = 'Edit Wizard Question';
    vm.question = wizardQuestion;

    vm.activate = activate;

    activate();

    function activate() {
      logger.info('Activated Edit Wizard Question View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.wizard-questions.list': {
        url: '', // No url, this state is the index of manage.products
        templateUrl: 'app/states/manage/wizard-questions/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Wizard Quesiton List',
        resolve: {
          /** @ngInject */
          questions: function(WizardQuestion) {
            return WizardQuestion.query().$promise;
          }
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function StateController(questions, WizardQuestion, logger, $q, $state, lodash) {
    var vm = this;

    vm.questions = questions;
    vm.question = new WizardQuestion({wizard_answers: [{}]});
    vm.createQuestion = createQuestion;
    vm.addAnswer = addAnswer;
    vm.deleteQuestion = deleteQuestion;

    lodash.each(questions, addAnswer);

    function createQuestion() {
      vm.question.wizard_answers = formatAnswers(vm.question.wizard_answers);
      vm.question.$save(buildQuestion);
    }

    function buildQuestion(question) {
      vm.question.id = question.id;
      vm.questions.push(vm.question);
      vm.question = new WizardQuestion({wizard_answers: [{}]});
    }

    function deleteQuestion(question) {
      question.$delete(removeQuestion);
    }

    function removeQuestion(question) {
      vm.questions = lodash.without(vm.questions, question);
    }

    function addAnswer(question) {
      question.wizard_answers.push({});
    }

    vm.deleteAnswer = function(question, answer) {
      // jscs:disable disallowDanglingUnderscores
      answer._destroy = true;
      // jscs:enable
    };

    vm.saveQuestion = function(question) {
      question.wizard_answers = formatAnswers(question.wizard_answers);
      question.$update();
    };

    function formatAnswers(answers) {
      return lodash.map(answers, splitTags);
    }

    function splitTags(answer) {
      if (typeof answer.tags_to_add === 'string') {
        answer.tags_to_add = answer.tags_to_add.split(',');
      }

      if (typeof answer.tags_to_remove === 'string') {
        answer.tags_to_remove = answer.tags_to_remove.split(',');
      }

      return answer;
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.wizard-questions': {
        url: '/wizard-questions',
        redirectTo: 'manage.wizard-questions.list',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'manage.alerts': {
        type: 'state',
        state: 'manage.wizard-questions',
        label: 'Wizard Questions',
        order: 9
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'marketplace': {
        parent: 'application',
        url: '/marketplace?tags',
        templateUrl: 'app/states/marketplace/marketplace.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Marketplace',
        reloadOnSearch: false,
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }

  function navItems() {
    return {
      'cart': {
        type: 'cart'
      }
    };
  }

  function sidebarItems() {
    return {
      'marketplace': {
        type: 'state',
        state: 'marketplace',
        label: 'Marketplace',
        style: 'marketplace',
        order: 400
      }
    };
  }

  /** @ngInject */
  function StateController(logger, $q, VIEW_MODES, CatalogService, Tag,
                           Compare, TAG_QUERY_LIMIT, $stateParams, WizardService) {
    var vm = this;

    vm.title = 'Marketplace';
    vm.tags = [];
    vm.viewMode = VIEW_MODES.list;

    vm.activate = activate;
    vm.updateCatalog = updateCatalog;
    vm.queryTags = queryTags;
    vm.openWizard = openWizard;

    activate();

    function activate() {
      updateCatalog();
      Compare.clear();

      if ($stateParams.tags) {
        vm.tags = $stateParams.tags;
      }
      logger.info('Activated Marketplace View');
    }

    function updateCatalog() {
      $q.when(CatalogService.getCatalog(vm.tags)).then(handleResults);

      function handleResults(results) {
        vm.catalog = results;
      }
    }

    function queryTags(query) {
      return Tag.query({q: query, limit: TAG_QUERY_LIMIT}).$promise;
    }

    function openWizard() {
      WizardService.showModal().then(updateTags);

      function updateTags(tags) {
        vm.tags.length = 0;
        Array.prototype.push.apply(vm.tags, tags);
        updateCatalog();
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'orders.create': {
        url: '/:productId',
        templateUrl: 'app/states/orders/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order Create',
        resolve: {
          product: resolveProduct,
          projects: resolveProjects
        }
      }
    };
  }

  /** @ngInject */
  function resolveProduct($stateParams, Product) {
    return Product.get({id: $stateParams.productId, 'includes[]': ['product_type', 'provider']}).$promise;
  }

  /** @ngInject */
  function resolveProjects(Project) {
    return Project.query({approved: true, archived: false}).$promise;
  }

  /** @ngInject */
  function StateController(product, projects, Order) {
    var vm = this;

    vm.title = 'Order Create';

    vm.activate = activate;

    activate();

    function activate() {
      vm.subHeading = [product.product_type.name, product.name].join(' :: ');
      initOrder();
      initForm();
    }

    // Private

    function initOrder() {
      vm.order = Order.new({product_id: product.id});
      vm.order.product_id = product.id;
      vm.order.answers = product.order_questions;
    }

    function initForm() {
      vm.options = {
        formState: {
          product: product,
          provider: product.provider,
          projects: projects
        }
      };
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'orders.details': {
        url: '/details/:orderId',
        templateUrl: 'app/states/orders/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order Details',
        resolve: {
          order: resolveOrder
        }
      }
    };
  }

  /** @ngInject */
  function resolveOrder($stateParams, Order) {
    return Order.get({
      id: $stateParams.orderId,
      'includes[]': ['product', 'project', 'service', 'staff']
    }).$promise;
  }

  /** @ngInject */
  function StateController(order) {
    var vm = this;

    vm.order = order;
    vm.staff = order.staff;
    vm.product = order.product;
    vm.service = order.service;
    vm.project = order.project;

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'orders.list': {
        url: '', // No url, this state is the index of orders
        templateUrl: 'app/states/orders/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Order History',
        resolve: {
          orders: resolveOrders
        }
      }
    };
  }

  /** @ngInject */
  function resolveOrders(Order) {
    return Order.query({'includes[]': ['staff', 'project', 'product']}).$promise;
  }

  /** @ngInject */
  function StateController(lodash, orders, Staff) {
    var vm = this;

    vm.title = 'Order History';

    activate();

    function activate() {
      initOrders();
    }

    // Private

    function initOrders() {
      vm.projects = lodash.groupBy(lodash.map(orders, mapOrder), 'project_id');

      function mapOrder(order) {
        var project = order.project;
        var staff = order.staff;

        delete order.project;
        delete order.staff;

        order.project = project.name;
        order.project_id = project.id;
        order.product_name = order.product.name;
        order.total = order.total();
        order.staff = new Staff(staff).fullName();
        order.status = lodash.capitalize(order.status);

        return order;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'orders': {
        parent: 'application',
        url: '/orders',
        redirectTo: 'orders.list',
        template: '<ui-view></ui-view>',
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }

  function sidebarItems() {
    return {
      'order-history': {
        type: 'state',
        state: 'orders',
        label: 'Orders',
        style: 'orders',
        order: 250
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'pages': {
        parent: 'application',
        url: '/pages/:slug',
        templateUrl: 'app/states/pages/page.html',
        title: 'Pages',
        controller: StateController,
        controllerAs: 'vm',
        resolve: {
          page: resolvePage
        },
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'pages': {
        type: 'pages',
        state: 'pages',
        label: 'Pages',
        style: 'pages',
        order: 5
      }
    };
  }

  /** @ngInject */
  function resolvePage($stateParams, ContentPage) {
    return ContentPage.get({id: $stateParams.slug}).$promise;
  }

  /** @ngInject */
  function StateController(page) {
    var vm = this;

    vm.page = page;
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'products.details': {
        url: 'product/:productId',
        templateUrl: 'app/states/products/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Product Details',
        resolve: {
          product: resolveProduct
        }
      }
    };
  }

  /** @ngInject */
  function resolveProduct(Product, $stateParams) {
    return Product.get({
      id: $stateParams.productId,
      'includes[]': ['product_type', 'answers', 'provider']
    }).$promise;
  }

  /** @ngInject */
  function StateController(product) {
    var vm = this;

    vm.title = 'Product Details';

    vm.product = product;

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'products': {
        parent: 'application',
        url: '/',
        redirectTo: 'marketplace',
        template: '<ui-view></ui-view>',
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'projects.create': {
        url: '/create',
        templateUrl: 'app/states/projects/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Create',
        resolve: {
          projectQuestions: resolveProjectQuestions
        }
      }
    };
  }

  /** @ngInject */
  function resolveProjectQuestions(ProjectQuestion, lodash) {
    return ProjectQuestion.query({ordered: true}).$promise.then(mapAsFieldQuestions);

    function mapAsFieldQuestions(questions) {
      return lodash.map(questions, mapQuestion);

      function mapQuestion(question) {
        return question.asField();
      }
    }
  }

  /** @ngInject */
  function StateController(Project, projectQuestions) {
    var vm = this;

    vm.activate = activate;

    activate();

    function activate() {
      initProject();
    }

    // Private

    function initProject() {
      vm.project = Project.new({answers: projectQuestions});
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'projects.alerts': {
        abstract: true,
        url: '/:projectId/alerts',
        template: '<ui-view></ui-view>'
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'projects.alerts.create': {
        url: '/create',
        templateUrl: 'app/states/projects/details/alerts/create/create.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Alerts Create',
        resolve: {
          alertRecord: resolveAlert,
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveAlert($stateParams, Alert) {
    if ($stateParams.id) {
      return Alert.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember().$promise;
  }

  /** @ngInject */
  function StateController(logger, alertRecord, $stateParams, staff) {
    var vm = this;

    vm.title = 'Project Alerts Create';
    vm.alertRecord = alertRecord;
    vm.activate = activate;
    vm.staffId = staff.id;
    vm.home = 'projects.details';
    vm.homeParams = { projectId: $stateParams.projectId };

    // HARD CODED FOR SINGLE TENANT
    vm.alertableType = 'Project';
    vm.alertableId = $stateParams.projectId;

    activate();

    function activate() {
      logger.info('Activated Project Alerts Create View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'projects.alerts.edit': {
        url: '/edit/:id',
        templateUrl: 'app/states/projects/details/alerts/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Alerts Edit',
        resolve: {
          alertRecord: resolveAlert,
          staff: resolveStaff
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveAlert($stateParams, Alert) {
    if ($stateParams.id) {
      return Alert.get({id: $stateParams.id}).$promise;
    } else {
      return {};
    }
  }

  /** @ngInject */
  function resolveStaff(Staff) {
    return Staff.getCurrentMember().$promise;
  }

  /** @ngInject */
  function StateController(logger, alertRecord, $stateParams, staff) {
    var vm = this;

    vm.title = 'Project Alerts Edit';
    vm.alertRecord = alertRecord;
    vm.activate = activate;
    vm.staffId = staff.id;
    vm.home = 'projects.details';
    vm.homeParams = { projectId: $stateParams.projectId };

    // HARD CODED FOR SINGLE TENANT
    vm.alertableType = 'Project';
    vm.alertableId = $stateParams.projectId;

    activate();

    function activate() {
      logger.info('Activated Project Alerts Edit View');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'projects.details': {
        url: '/:projectId',
        templateUrl: 'app/states/projects/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Details',
        resolve: {
          project: resolveProject,
          services: resolveServices,
          memberships: resolveMemberships,
          projectQuestions: resolveProjectQuestions
        }
      }
    };
  }

  /** @ngInject */
  function resolveProject($stateParams, Project) {
    return Project.get({
      id: $stateParams.projectId,
      'includes[]': ['latest_alerts', 'approvals', 'approvers', 'memberships', 'groups', 'answers']
    }).$promise;
  }

  /** @ngInject */
  function resolveServices($stateParams, ProjectService) {
    return ProjectService.query({
      projectId: $stateParams.projectId,
      'includes[]': ['product']
    }).$promise;
  }

  /** @ngInject */
  function resolveMemberships($stateParams, Membership) {
    return Membership.query({
      project_id: $stateParams.projectId,
      'includes[]': ['group', 'role']
    }).$promise;
  }

  /** @ngInject */
  function resolveProjectQuestions(ProjectQuestion, lodash) {
    return ProjectQuestion.query({ordered: true}).$promise.then(mapAsFieldQuestions);

    function mapAsFieldQuestions(questions) {
      return lodash.map(questions, mapQuestion);

      function mapQuestion(question) {
        return question.asField();
      }
    }
  }

  /** @ngInject */
  function StateController($state, lodash, Toasts, project, services, memberships, projectQuestions) {
    var vm = this;

    vm.title = 'Project Details';
    vm.project = project;
    vm.services = services;
    vm.memberships = memberships;
    vm.activeServices = activeServices;
    vm.archiveProject = archiveProject;

    vm.activate = activate;
    vm.approve = approve;
    vm.reject = reject;

    activate();

    function activate() {
      initAnswers();
    }

    function approve() {
      $state.reload();
    }

    function reject() {
      $state.transitionTo('projects.list');
    }

    // Private

    function initAnswers() {
      angular.forEach(projectQuestions, addAnswer);
      vm.project.answers = projectQuestions;

      function addAnswer(question) {
        var answer = lodash.find(vm.project.answers, 'name', question.name);

        angular.extend(question, answer || {});
      }
    }

    function activeServices() {
      var status = lodash.pluck(vm.services, 'status');
      if (0 === status.length) {
        return false;
      }
    }

    function archiveProject() {
      vm.project.$delete(saveSuccess, saveFailure);

      function saveSuccess() {
        Toasts.toast('Project Archived');
        $state.go('projects');
      }

      function saveFailure(error) {
        var data = error.data;
        var message = 'Project Not Archived';

        if (angular.isObject(data) && angular.isDefined(data.error)) {
          message = data.error;
        }

        Toasts.error(message);
      }
    }
  }
})
();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'projects.edit': {
        url: '/edit/:projectId',
        templateUrl: 'app/states/projects/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Edit Role',
        resolve: {
          project: resolveProject,
          projectQuestions: resolveProjectQuestions
        }
      }
    };
  }

  /** @ngInject */
  function resolveProject(Project, $stateParams) {
    return Project.get({
      id: $stateParams.projectId,
      'includes[]': ['answers']
    }).$promise;
  }

  /** @ngInject */
  function resolveProjectQuestions(ProjectQuestion, lodash) {
    return ProjectQuestion.query({ordered: true}).$promise.then(mapAsFieldQuestions);

    function mapAsFieldQuestions(questions) {
      return lodash.map(questions, mapQuestion);

      function mapQuestion(question) {
        return question.asField();
      }
    }
  }

  /** @ngInject */
  function StateController(lodash, project, projectQuestions) {
    var vm = this;

    vm.title = 'Project Role';
    vm.project = project;

    vm.activate = activate;

    activate();

    function activate() {
      initAnswers();
    }

    // Private

    function initAnswers() {
      angular.forEach(projectQuestions, addAnswer);
      vm.project.answers = projectQuestions;

      function addAnswer(question) {
        var answer = lodash.find(vm.project.answers, 'name', question.name);

        angular.extend(question, answer || {});
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'projects.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/projects/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Projects',
        resolve: {
          projects: resolveProjects
        }
      }
    };
  }

  /** @ngInject */
  function resolveProjects(Project) {
    return Project.query({archived: false}).$promise;
  }

  /** @ngInject */
  function StateController(projects, lodash) {
    var vm = this;
    var allProjects = lodash.partition(projects, {'archived': null});
    vm.projects = allProjects[0];
    vm.activate = activate;
    vm.title = 'Projects';
    vm.archivedProjects = allProjects[1];

    activate();

    function activate() {
      vm.projects = lodash.sortBy(vm.projects, 'name');
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'projects': {
        parent: 'application',
        url: '/projects',
        redirectTo: 'projects.list',
        template: '<ui-view></ui-view>',
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'projects': {
        type: 'state',
        state: 'projects',
        label: 'Projects',
        style: 'projects',
        order: 100
      }
    };
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'services.details': {
        url: '/:serviceId',
        title: 'Service Details',
        templateProvider: templateProvider,
        controllerProvider: controllerProvider,
        controllerAs: 'vm',
        resolve: {
          service: resolveService
        }
      }
    };
  }

  /** @ngInject */
  function resolveService(Service, $stateParams) {
    var includes = ['order', 'product', 'project', 'provider', 'service_outputs', 'logs'];

    return Service.get({id: $stateParams.serviceId, 'includes[]': includes}).$promise;
  }

  /** @ngInject */
  function templateProvider($templateFactory, StateOverride, service) {
    var templateUrl = 'app/states/services/details/details.html';
    var override = StateOverride.get('services.details', {service: service}) || {templateUrl: templateUrl};

    return $templateFactory.fromUrl(override.templateUrl);
  }

  /** @ngInject */
  function controllerProvider(StateOverride, service) {
    var controller = StateController;
    var override = StateOverride.get('services.details', {service: service}) || {controller: controller};

    return override.controller;
  }

  /** @ngInject */
  function StateController(service) {
    var vm = this;

    vm.title = 'Service Details';

    vm.service = service;
    vm.logs = service.logs;

    vm.activate = activate;

    activate();

    function activate() {
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'services.list': {
        url: '', // No url, this state is the index of projects
        templateUrl: 'app/states/services/list/list.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Services',
        resolve: {
          services: resolveServices
        }
      }
    };
  }

  /** @ngInject */
  function resolveServices(Service) {
    return Service.query({'includes[]': ['product', 'project']}).$promise;
  }

  /** @ngInject */
  function StateController($state, services, lodash) {
    /* jshint validthis: true */
    var vm = this;

    vm.services = services;

    vm.activate = activate;
    vm.title = 'Services';
    vm.goTo = goTo;

    activate();

    function activate() {
      initServices();
    }

    function goTo(serviceId, productId) {
      $state.go('services.details', {serviceId: serviceId, productId: productId});
    }

    // Private

    function initServices() {
      vm.projects = lodash.groupBy(lodash.map(services, mapService), 'project_id');

      function mapService(service) {
        var project = service.project;

        delete service.project;

        service.project_id = project.id;
        service.project = project.name;

        return service;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'services': {
        parent: 'application',
        url: '/services',
        redirectTo: 'services.list',
        template: '<ui-view></ui-view>',
        data: {
          authorizedRoles: ['user', 'manager', 'admin']
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {
      'services': {
        type: 'state',
        state: 'services',
        label: 'Services',
        style: 'services',
        order: 300
      }
    };
  }
})();

angular.module("app.core").run(["$templateCache", function($templateCache) {$templateCache.put("app/layouts/application.html","<navigation><span transclude-to=navbar-brand><img src=images/jellyfish_main_logo.png alt=\"Jellyfish Main Logo\"></span></navigation><div class=main-content><ui-view></ui-view></div><footer></footer>");
$templateCache.put("app/layouts/blank.html","<ui-view></ui-view>");
$templateCache.put("app/components/alert-form/alert-form.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><content-header short=true><div><span class=\"content-header__title alert-form__title\">{{ vm.heading }}</span> <span class=alert-form__title-error ng-if=vm.hasErrors()>Please complete required fields in red</span></div></content-header><div class=row><div class=alert-form__body><div class=alert-field><div class=alert-field__aside><label class=alert-field__label id=status-label>Status</label></div><div class=alert-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'status\')}\"><select id=alert-name name=status ng-model=vm.alertRecord.status class=alert-field__input aria-labelledby=status-label required><option value=ok>ok</option><option value=warning>warning</option><option value=critical>critical</option><option value=unknown>unknown</option></select><div class=alert-field__feedback ng-messages=vm.form.status.$error><div ng-message=required>An alert status is required.</div></div></div></div><div class=alert-field><div class=alert-field__aside><label class=alert-field__label id=category-label>Category</label></div><div class=alert-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'category\')}\"><input type=text id=alert-category ng-model=vm.alertRecord.category name=category class=alert-field__input aria-labelledby=category-label required><div class=alert-field__feedback ng-messages=vm.form.category.$error><div ng-message=required>An alert category is required.</div></div></div></div><div class=alert-field><div class=alert-field__aside><label class=alert-field__label id=message-label>Message</label></div><div class=alert-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'message\')}\"><textarea id=alert-description ng-model=vm.alertRecord.message name=message class=\"alert-field__input field__input--textarea\" rows=3 aria-labelledby=message-label required></textarea><div class=alert-field__feedback ng-messages=vm.form.message.$error><div ng-message=required>An alert message is required.</div></div></div></div><div class=alert-field><div class=alert-field__aside><label class=alert-field__label id=start-date-label>Start Date</label></div><div class=alert-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'startDate\')}\"><div class=input-group><span class=input-group-btn><button type=button class=\"btn btn-default alert-field__group-input--button\" aria-labelledby=start-date-label ng-click=vm.openStart($event)><i class=\"fa fa-calendar\"></i></button></span> <input ng-click=vm.openStart($event) class=alert-field__group-input--input name=startDate datepicker-popup={{vm.format}} ng-model=vm.alertRecord.start_date is-open=vm.openedStart max-date=vm.alertRecord.end_date datepicker-options=vm.dateOptions ng-required=false aria-labelledby=start-date-label close-text=Close></div><div class=alert-field__feedback ng-messages=vm.form.startDate.$error><div ng-message=required>A start date is required.</div><div ng-message=pattern>Enter a value of the format yyyy/MM/dd</div></div></div></div><div class=alert-field><div class=alert-field__aside><label class=alert-field__label id=end-date-label>End Date</label></div><div class=alert-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'endDate\')}\"><div class=input-group><span class=input-group-btn><button type=button class=\"btn btn-default alert-field__group-input--button\" aria-labelledby=end-date-label ng-click=vm.openEnd($event)><i class=\"fa fa-calendar\"></i></button></span> <input ng-click=vm.openEnd($event) class=alert-field__group-input--input name=endDate datepicker-popup={{vm.format}} ng-model=vm.alertRecord.end_date is-open=vm.openedEnd min-date=vm.alertRecord.start_date datepicker-options=vm.dateOptions ng-required=false aria-labelledby=end-date-label close-text=Close></div><div class=alert-field__feedback ng-messages=vm.form.endDate.$error><div ng-message=required>An end date is required.</div><div ng-message=pattern>Enter a value of the format yyyy/MM/dd</div></div></div></div></div></div><div class=row><div class=col-sm-7><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=\"btn-rounded alert-form__submit\" ng-disabled=vm.hasErrors()>Save</button> <button type=button class=\"btn btn-link alert-form__cancel\" confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.backToList() confirmation-show-cancel=false>Cancel</button></div></div></div></form>");
$templateCache.put("app/components/catalog/catalog-category.html","<div ng-if=\"::vm.category.products.length > 0\" class=catalog-category><div class=catalog-category__header><span class=catalog-category__title>{{ ::vm.category.name }}</span> <a href=# title=Collapse><img class=catalog-category__collapse-icon src=images/ic_viewcategory_dropdown.png ng-click=\"vm.collapsed = !vm.collapsed\" alt=Collapse></a></div><div class=catalog-category__body collapse=vm.collapsed role=group><table st-table=vm.category.products class=tables><thead><tr><th class=\"tables__heading catalog-category__compare\">Compare</th><th st-sort=name class=\"tables__heading tables__heading--sortable catalog-category__description\">Description</th><th st-sort=monthly_price class=\"tables__heading tables__heading--sortable catalog-category__monthly\">Monthly Price</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.category.products track by row.id\"><td class=\"tables__cell catalog-category__compare\"><select-product product=::row></select-product></td><td class=\"tables__cell catalog-category__description\"><product-description product=::row></product-description></td><td class=\"tables__cell catalog-category__monthly\"><computed-monthly-price pricing=row></computed-monthly-price></td><td class=\"tables__cell tables__cell--actions\"><a ui-sref=\"orders.create({productId: row.id})\" class=tables__action title=\"Configure Product\"><img src=images/ic_config.png alt=\"Configure Product\"></a></td></tr></tbody></table></div></div>");
$templateCache.put("app/components/compare/compare-modal.html","<div class=compare-modal__header><button type=button class=compare-modal__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=compare-modal__title>Compare</div></div><div class=compare-modal__body><div class=compare-modal__table><div class=\"compare-modal__table-row compare-modal__table-row--header\"><div class=\"compare-modal__cell compare-modal__cell--key compare-modal__cell--header\"></div><div class=\"compare-modal__cell compare-modal__cell--value compare-modal__cell--header\" ng-repeat=\"product in ::vm.products track by product.id\" ng-class=\"{\'compare-modal__cell--even\': $even}\">{{ ::product.name }}</div></div><div class=compare-modal__table-body><div class=compare-modal__table-row ng-repeat=\"row in ::vm.rowData\"><div class=\"compare-modal__cell compare-modal__cell--key\">{{ ::row.name }}</div><div class=\"compare-modal__cell compare-modal__cell--value\" ng-repeat=\"value in ::row.values track by $index\" ng-class=\"{\'compare-modal__cell--even\': $even}\">{{ ::value }}</div></div></div><div class=\"compare-modal__table-row compare-modal__table-row--footer\"><div class=\"compare-modal__cell compare-modal__cell--key\"></div><div class=\"compare-modal__cell compare-modal__cell--value compare-modal__cell--footer\" ng-repeat=\"product in ::vm.products track by product.id\" ng-class=\"{\'compare-modal__cell--even\': $even}\"><button type=button class=btn-rounded ui-sref=\"orders.create({productId: product.id})\" ng-click=$close()>Order</button></div></div></div></div>");
$templateCache.put("app/components/compare/limit-modal-window.html","<div modal-render={{$isRendered}} tabindex=-1 role=dialog class=limit-modal modal-animation-class=fade modal-in-class=in ng-style=\"{\'z-index\': 1050 + index*10, display: \'block\', overflow: \'hidden\'}\" ng-click=close($event)><div class=limit-modal__dialog ng-style=\"{top: $parent.vm.top, left: $parent.vm.left}\"><div class=limit-modal__content modal-transclude></div></div></div>");
$templateCache.put("app/components/compare/limit-modal.html","<div class=limit-modal__body><p>You can compare up to 4 items at a time. Would you like to compare the first 4 items you\'ve selected?</p><div class=limit-modal__buttons><button type=button class=\"limit-modal__button btn-rounded btn-rounded--gray\" ng-click=$dismiss()>Cancel</button> <button type=button class=\"limit-modal__button btn-rounded\" ng-click=$close()>Compare</button></div></div>");
$templateCache.put("app/components/compare/select-product.html","<a href=# class=select-product ng-class=\"{\'select-product--active\': vm.isAdded()}\" title=Compare ng-click=vm.toggle()></a>");
$templateCache.put("app/components/compare/selected-products.html","<div class=selected-products><div class=selected-products__item ng-repeat=\"index in ::vm.indexes track by $index\"><div ng-if=vm.products[index]><div ng-if=vm.products[index].img><img class=selected-products__image ng-src=images/assets/{{vm.products[index].img}} alt=vm.products[index].description></div><div ng-if=!vm.products[index].img><img class=selected-products__image ng-src=images/jelly_alone.png alt=\"Jellyfish Logo\"></div><a href=# title=Remove class=selected-products__remove ng-click=vm.remove(vm.products[index])><img src=/images/ic_closecompare.png alt=Close></a></div></div></div><button type=button class=\"btn-rounded btn btn-primary text-uppercase\" ng-click=vm.showModal() ng-disabled=vm.disabled()>Compare</button>");
$templateCache.put("app/components/common/modal-window.html","<div modal-render={{$isRendered}} tabindex=-1 role=dialog class=modals modal-animation-class=fade modal-in-class=in ng-style=\"{\'z-index\': 1050 + index*10, display: \'block\'}\" ng-click=close($event)><div class=modals__dialog ng-class=\"size ? \'modals__dialog--\' + size : \'\'\"><div class=modals__content modal-transclude></div></div></div>");
$templateCache.put("app/components/confirmation/confirmation-window.html","<div modal-render={{$isRendered}} tabindex=-1 role=dialog class=confirmation modal-animation-class=fade modal-in-class=in ng-style=\"{\'z-index\': 1050 + index*10, display: \'block\', overflow: \'hidden\'}\" ng-click=close($event)><div class=confirmation__dialog ng-style=\"{top: $parent.vm.top, left: $parent.vm.left}\"><div class=confirmation__content modal-transclude></div></div></div>");
$templateCache.put("app/components/confirmation/confirmation.html","<div class=confirmation__body><p class=confirmation__message>{{ ::vm.message }}</p><div class=confirmation__buttons><button ng-if=vm.showCancel type=button class=\"confirmation__button btn-rounded\" ng-class=::vm.cancelClass ng-click=$dismiss()>{{ ::vm.cancel }}</button> <button type=button class=\"confirmation__button btn-rounded\" ng-class=::vm.okClass ng-click=$close()>{{ ::vm.ok }}</button></div></div>");
$templateCache.put("app/components/content-header/content-header.html","<div class=content-header ng-class=\"::{\'content-header--short\': vm.short}\"><div class=content-header__wrapper ng-transclude></div></div>");
$templateCache.put("app/components/content-page-form/content-page-form.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><content-header short=true><div><span class=\"content-header__title content-page-form__title\">{{ vm.heading }}</span> <span class=content-page-form__title-error ng-if=vm.hasErrors()>Please complete required fields in red</span></div></content-header><div class=row><div class=content-page-form__body><div class=content-page-field><div class=content-page-field__aside><label class=content-page-field__label id=title-label>Title</label></div><div class=content-page-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'title\')}\"><textarea id=content-page-title ng-model=vm.contentPageRecord.title name=title class=\"content-page-field__input field__input--textarea\" rows=1 aria-labelledby=title-label required></textarea><div class=content-page-field__feedback ng-messages=vm.form.title.$error><div ng-message=required>An page title is required.</div></div></div></div><div class=content-page-field><div class=content-page-field__aside><label class=content-page-field__label id=content-label>Content</label></div><div class=content-page-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'body\')}\"><textarea id=content-page-body ng-model=vm.contentPageRecord.body name=body class=\"content-page-field__input field__input--textarea field__input--monospaced\" rows=10 aria-label=Content aria-labelledby=content-label required></textarea><div class=content-page-field__feedback ng-messages=vm.form.body.$error><div ng-message=required>A page body is required.</div></div></div></div><div class=content-page-field><div class=content-page-field__aside><label class=content-page-field__label id=preview-label>Preview</label></div><div class=content-page-field__body><div class=content-page-field__body--markdown marked=vm.contentPageRecord.body aria-labelledby=preview-label></div></div></div></div></div><div class=row><div class=col-sm-7><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=\"btn-rounded content-page-form__submit\" ng-disabled=vm.hasErrors()>Save</button> <button type=button class=\"btn btn-link content-page-form__cancel\" confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.backToList() confirmation-show-cancel=false>Cancel</button></div></div></div></form>");
$templateCache.put("app/components/content-pages/nav-pages.html","<a class=\"sidebar__item-body sidebar__dropdown sidebar__link\" ng-class=\"[vm.item.style, (vm.isActive(vm.item.state) ? \'sidebar__item-body--active\' : \'\')]\" ng-click=\"vm.item.collapsed = !vm.item.collapsed\"><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span> <i class=\"fa fa-fw sidebar__arrow\" ng-class=\"vm.item.collapsed ? \'fa-angle-left\' : \'fa-angle-down\'\"></i></a><ul class=\"sidebar__nav sidebar__nav--subnav\" collapse=vm.item.collapsed role=group><li class=\"dropdown sidebar__item\" ng-repeat=\"page in vm.pages\"><a class=\"sidebar__item-body sidebar__link\" ui-sref=\"pages({slug: page.slug})\" ui-sref-active=sidebar__item-body--active><span>{{ ::page.title }}</span></a></li></ul>");
$templateCache.put("app/components/edit-setting-modal/edit-setting-modal.html","<form name=vm.form role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><div class=modals__header><button type=button class=modals__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=modals__title>Edit Setting</div></div><div class=modals__body><div class=forms><div class=field ng-switch=vm.inputType><div class=field__aside><label class=field__label id={{vm.setting.name}}-label>{{ ::vm.setting.name }}</label></div><div class=field__body ng-class=\"{\'has-error\': vm.hasErrors(\'value\')}\"><input ng-switch-when=text name=value type=text class=field__input ng-model=vm.setting.value aria-labelledby={{vm.setting.name}}-label> <input ng-switch-when=password name=value type=password class=field__input ng-model=vm.setting.value> <textarea ng-switch-when=textarea name=value rows=10 class=field__input ng-model=vm.setting.value></textarea></div></div></div></div><div class=modals__footer><button type=button class=\"modals__button modals__button--cancel\" ng-click=$dismiss()>Cancel</button> <button ng-disabled=vm.hasErrors() type=submit class=modals__button>Save</button></div></form>");
$templateCache.put("app/components/details-table/details-table.html","<region heading=\"{{ ::vm.heading }}\"><div class=col-sm-12 ng-transclude></div></region>");
$templateCache.put("app/components/footer/footer.html","<div class=footer>Project Jellyfish &mdash; Version {{ ::vm.version }} Copyright &copy; 2015 Booz Allen Hamilton All Rights Reserved</div>");
$templateCache.put("app/components/group-form/group-form.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.form.$submitted}\"><content-header short=true><div><span class=\"content-header__title group-form__title\" ng-bind=::vm.heading></span> <span class=group-form__title-error ng-if=vm.hasErrors()>Please complete required fields in red</span></div></content-header><div class=row><div class=group-form__body><div class=group-field><div class=group-field__aside><label class=group-field__label id=name-label>Name</label></div><div class=group-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'name\')}\"><input id=group-name ng-model=vm.group.name name=name type=text class=group-field__input placeholder=\"Enter a group name.\" aria-labelledby=name-label required><div class=group-field__feedback ng-messages=vm.form.name.$error><div ng-message=required>A group name is required.</div></div></div></div><div class=group-field><div class=group-field__aside><label class=group-field__label id=description-label>Description</label></div><div class=group-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'description\')}\"><textarea id=group-description ng-model=vm.group.description name=description class=\"group-field__input field__input--textarea\" rows=3 placeholder=\"Enter a group description.\" aria-labelledby=description-label required></textarea><div class=group-field__feedback ng-messages=vm.form.description.$error><div ng-message=required>An group description is required.</div></div></div></div><div class=group-field><div class=group-field__aside><label class=group-field__label id=add-user-label>Add User</label></div><div class=group-field__body><select id=group-role name=staff ng-model=vm.selectedStaff class=group-field__input ng-options=\"staff as staff.full_name for staff in vm.staff track by staff.id\" aria-labelledby=add-user-label ng-change=vm.addMember(vm.selectedStaff.id)></select></div></div><div class=group-field><div class=group-field__aside><label class=group-field__label>Members</label></div><div class=group-field__body><div class=group-field__member ng-repeat=\"staff in vm.members track by staff.id\">{{ ::staff.full_name }} <a href=# ng-click=vm.removeMember(staff.id) class=group-field__member-remove title=\"Remove Member\"><img src=/images/ic_deletequestion.png alt=\"Remove Member\"></a></div></div></div></div></div><div class=row><div class=col-sm-7><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=\"btn-rounded group-form__submit\" ng-disabled=vm.hasErrors()>Save</button> <button type=button class=\"btn btn-link group-form__cancel\" confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.backToList() confirmation-show-cancel=false>Cancel</button></div></div></div></form>");
$templateCache.put("app/components/forms/form.html","<form name=vm.form class=forms role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.form.$submitted}\"><content-header short=true><div><span class=content-header__title>{{ ::vm.heading }}</span> <span class=forms__title--error ng-if=vm.hasErrors()>Please complete required fields in red</span></div><div><small class=forms__title--description>{{ ::vm.subHeading }}</small></div></content-header><div class=row><formly-form form=vm.form model=vm.record fields=vm.fields options=vm.options></formly-form></div><div class=row><div class=forms__buttons><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=forms__submit ng-disabled=vm.hasErrors()>Save</button> <button type=button class=forms__cancel confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.goBack() confirmation-show-cancel=false>Cancel</button></div></div></div></form><pre ng-if=::vm.debug>{{vm.record|json}}</pre>");
$templateCache.put("app/components/groups-table/groups-table.html","<table ng-if=\"0 < vm.groups.length\" class=groups-table><thead><tr><th class=\"groups-table__heading groups-table__heading--padding\"></th><th class=\"groups-table__heading groups-table__heading--name\">Name</th><th class=\"groups-table__heading groups-table__heading--description\">Description</th><th class=\"groups-table__heading groups-table__heading--members\">Members</th><th class=\"groups-table__heading groups-table__heading--actions\">Action</th></tr></thead><tbody><tr class=groups-table__row ng-repeat=\"row in vm.groups track by row.id\"><td class=\"groups-table__cell groups-table__cell--padding\"></td><td class=\"groups-table__cell groups-table__cell--name\">{{ ::row.name}}</td><td class=\"groups-table__cell groups-table__cell--description\">{{ ::row.description }}</td><td class=\"groups-table__cell groups-table__cell--members\">{{ ::row.staff.length }}</td><td class=\"groups-table__cell groups-table__cell--actions\"><a ui-sref=\"admin.groups.edit({groupId: row.id})\" class=\"groups-table__action groups-table__action--edit\"><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=\"groups-table__action groups-table__action--delete\" confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this group?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteGroup($index) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table><div ng-if=\"0 === vm.groups.length\" class=groups-table__empty>No groups at this time.</div>");
$templateCache.put("app/components/image-chooser/image-chooser.html","<div class=image-chooser><div class=image-chooser__image></div><button type=button class=btn-rounded>Choose Image</button></div>");
$templateCache.put("app/components/latest-alerts-table/latest-alerts-table.html","<table ng-if=\"::0 < vm.alerts.length\" st-table=vm.alerts class=latest-alerts-table><thead><tr><th class=\"latest-alerts-table__heading latest-alerts-table__heading--padding\"></th><th class=\"latest-alerts-table__heading latest-alerts-table__heading--category latest-alerts-table__heading--sortable\" st-sort=category>Category</th><th class=\"latest-alerts-table__heading latest-alerts-table__heading--status latest-alerts-table__heading--sortable\" st-sort=status>Status</th><th class=\"latest-alerts-table__heading latest-alerts-table__heading--message latest-alerts-table__heading--sortable\" st-sort=message>Message</th><th class=\"latest-alerts-table__heading latest-alerts-table__heading--start-date latest-alerts-table__heading--sortable\" st-sort=start_date>Start Date</th><th class=\"latest-alerts-table__heading latest-alerts-table__heading--end-date latest-alerts-table__heading--sortable\" st-sort=end_date>End Date</th><th class=\"latest-alerts-table__heading latest-alerts-table__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.alerts | filter: { status: \'!ok\'} track by row.id\"><td class=\"latest-alerts-table__cell latest-alerts-table__cell--padding\"></td><td class=\"latest-alerts-table__cell latest-alerts-table__cell--category\">{{ ::row.category}}</td><td class=\"latest-alerts-table__cell latest-alerts-table__cell--status\"><status type=\"{{ ::row.status }}\">{{ ::row.status }}</status></td><td class=\"latest-alerts-table__cell latest-alerts-table__cell--message\">{{ ::row.message }}</td><td class=\"latest-alerts-table__cell latest-alerts-table__cell--start-date\">{{ ::row.start_date | date:\'short\' }}</td><td class=\"latest-alerts-table__cell latest-alerts-table__cell--end-date\">{{ ::row.end_date | date:\'short\' }}</td><td class=\"latest-alerts-table__cell latest-alerts-table__cell--actions\"><a ui-sref=\"projects.alerts.edit({projectId: row.alertable_id, id: row.id})\" class=latest-alerts-table__cell><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=latest-alerts-table__cell confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this alert and it\'s content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteAlert(row) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table><div ng-if=\"::0 === vm.alerts.length\" class=latest-alerts-table__empty>No alerts at this time.</div>");
$templateCache.put("app/components/log-table/log-table.html","<div class=log-table><div class=log-table__header><span class=log-table__title ng-bind-html=::vm.heading></span> <a href=# title=Collapse><img class=log-table__collapse-icon src=images/ic_viewcategory_dropdown.png ng-click=\"vm.collapsed = !vm.collapsed\" alt=Collapse></a></div><div class=log-table__body collapse=vm.collapsed role=log><table st-table=vm.records class=tables><thead><tr><th class=tables__heading>Time</th><th class=tables__heading>Level</th><th class=tables__heading>Message</th></tr></thead><tbody><tr ng-repeat=\"log in vm.records | orderBy : \'created_at\'\"><td class=\"tables__cell log-table__time\">{{ ::log.created_at | date : \'medium\' }}</td><td class=\"tables__cell log-table__level\">{{ ::log.log_level }}</td><td class=tables__cell>{{ ::log.message }}</td></tr></tbody><tfoot><tr><td colspan=5 class=text-center><div st-pagination st-items-by-page=::vm.itemsPerPage st-display-pages=50></div></td></tr></tfoot></table></div></div>");
$templateCache.put("app/components/login-form/login-form.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><content-header short=true><div><span class=\"content-header__title login-form__title\">Login</span> <span class=login-form__title-error ng-if=vm.hasErrors()>Please correct the errors in red</span></div></content-header><div class=login-form__body><div class=login-field><div class=login-field__aside><label id=login-email-label class=login-field__label>Email</label></div><div class=login-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'email\')}\"><input id=login-email ng-model=vm.email name=email type=email class=login-field__input placeholder aria-labelledby=login-email-label required><div class=login-field__feedback ng-messages=vm.form.email.$error><div ng-message=required>Your email is required.</div><div ng-message=email>Enter a valid email address.</div></div></div></div><div class=login-field><div class=login-field__aside><label id=login-password-label class=login-field__label>Password</label></div><div class=login-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'password\')}\"><input id=login-password ng-model=vm.password name=password type=password class=login-field__input placeholder aria-labelledby=login-password-label required><div class=login-field__feedback ng-messages=vm.form.password.$error><div ng-message=required>Your password is required.</div></div></div></div></div><div class=\"row login-form__buttons\"><div class=login-field__aside></div><div class=login-field__body><button type=submit class=\"btn-rounded login-form__submit\" ng-disabled=vm.hasErrors()>Login</button></div></div></form>");
$templateCache.put("app/components/membership-modal/membership-modal.html","<div class=modals__header><button type=button class=modals__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=modals__title>Membership</div></div><div class=modals__body><form class=forms><formly-form model=vm.membership fields=vm.fields></formly-form></form></div><div class=modals__footer><button type=button class=\"modals__button modals__button--cancel\" ng-click=$dismiss()>Cancel</button> <button type=button class=modals__button ng-click=$close(vm.membership) ng-disabled=\"!vm.membership.group_id || !vm.membership.role_id\">Ok</button></div>");
$templateCache.put("app/components/multiple-choice/multiple-choice.html","<div><div style=\"text-align: center; width: 200px; margin: 0 auto !important\" ng-if=\"options.length > 4\"><select ng-model=$parent.model ng-options=\"option.text for option in options\"></select></div><div class=row><div class=\"col-sm-6 col-sm-offset-3\"><div style=\"width: 200px; margin: 0 auto\" ng-if=\"options.length <= 4\" ng-repeat=\"option in options\"><label style=\"font-size: 32px !important; line-height: 20px !important; vertical-align: bottom !important; padding: 10px;\"><input type=radio ng-model=$parent.$parent.model ng-value=option> {{option.text}}</label></div><input class=\"btn btn-primary btn-lg pull-right\" type=submit value={{actionText}} ng-click=action() ng-hide=\"vm.autoSubmit || !vm.multiPage\"></div></div></div>");
$templateCache.put("app/components/navigation/nav-item.html","<div ng-switch=::vm.item.type><a ng-switch-when=state class=\"navigation__item-body navigation__link\" ng-class=::vm.item.style ui-sref=\"{{ ::vm.item.state }}\" ui-sref-active=navigation__link--active><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></a> <a ng-switch-when=link class=\"navigation__item-body navigation__link\" ng-class=::vm.item.style ng-href=\"{{ ::vm.item.link }}\" target=\"{{ ::vm.item.target || \'_self\' }}\"><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></a><div ng-switch-when=button class=\"navigation__item-body navigation__button-wrapper\"><button class=navigation__button ng-class=\"vm.item.style || \'btn-default\'\" type=button ng-click=vm.item.onClick()><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></button></div><div ng-switch-when=text class=\"navigation__item-body navigation__text\" ng-class=vm.item.style><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></div><a ng-switch-when=dropdown class=\"navigation__item-body navigation__dropdown navigation__link\" dropdown-toggle ng-class=::vm.item.style role=button><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span ng-if=::vm.item.label>{{ ::vm.item.label }}</span> <i class=\"fa fa-caret-down\"></i></a><ul ng-if=\"::vm.item.items.length > 0\" class=dropdown-menu role=menu><li class=navigation__item dropdown ng-repeat=\"item in ::vm.item.items\" ng-class=\"::{true: \'divider\'}[\'divider\' === vm.item.type]\"><nav-item item=::item></nav-item></li></ul><nav-cart ng-switch-when=cart class=nav-cart></nav-cart><nav-profile ng-switch-when=profile class=nav-profile></nav-profile><span ng-switch-default class=\"navigation__item-body navigation__text\"><span class=text-danger><i class=\"fa fa-fw fa-warning\"></i>Unknown type</span></span></div>");
$templateCache.put("app/components/navigation/navigation.html","<nav class=navigation role=navigation ng-cloak><div class=navigation__header><button type=button class=navigation__toggle ng-click=\"vm.sidebarCollapsed = !vm.sidebarCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navigation__brand ui-sref=\"{{ vm.brandState() }}\" transclude-id=navbar-brand></a></div><ul class=\"navigation__nav navigation__nav--right\"><li ng-if=vm.navSearch.visible class=\"navigation__item navigation__item--search\"><form class=navigation__form ng-submit=vm.navSearch.onSubmit()><div class=input-group><input type=text class=\"form-control search-input\" placeholder=\"{{ vm.navSearch.placeholder }}\" ng-model=vm.navSearch.value> <span class=input-group-btn><button class=\"btn btn-default\" type=submit><i class=fa ng-class=vm.navSearch.icon></i></button></span></div></form></li><li class=navigation__item dropdown ng-repeat=\"item in vm.navItems\"><nav-item item=::item></nav-item></li></ul><div class=sidebar role=navigation><div class=sidebar__filler></div><div class=sidebar__wrapper collapse=vm.sidebarCollapsed role=navigation><ul class=sidebar__nav><li ng-if=vm.sidebarSearch.visible class=\"sidebar__item sidebar__item--search\"><form class=sidebar__form ng-submit=vm.sidebarSearch.onSubmit()><div class=input-group><input type=text class=\"form-control search-input\" placeholder=\"{{ ::vm.sidebarSearch.placeholder }}\" ng-model=vm.sidebarSearch.value> <span class=input-group-btn><button class=\"btn btn-default\" type=submit><i class=fa ng-class=::vm.sidebarSearch.icon></i></button></span></div></form></li><li class=\"dropdown sidebar__item\" ng-class=\"::\'sidebar__item--\' + item.type\" ng-repeat=\"item in vm.sidebarItems\"><sidebar-item item=::item></sidebar-item></li></ul></div></div></nav>");
$templateCache.put("app/components/navigation/sidebar-item.html","<div ng-switch=::vm.item.type><a ng-switch-when=state class=\"sidebar__item-body sidebar__link\" ng-class=::vm.item.style ui-sref=\"{{ ::vm.item.state }}\" ui-sref-active=sidebar__item-body--active><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <img ng-if=::vm.item.image ng-src=\"::\'image/\' + vm.item.image + \'.png\'\" alt=\"{{vm.item.label}} Icon\"> <span>{{ ::vm.item.label }}</span></a> <a ng-switch-when=link class=\"sidebar__item-body sidebar__link\" ng-class=::vm.item.style ng-href=\"{{ ::vm.item.link }}\" target=\"{{ ::vm.item.target }}\"><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></a><div ng-switch-when=button class=sidebar__item-body><button type=button class=sidebar__button ng-class=\"::vm.item.style || \'btn-default\'\" ng-click=vm.item.onClick()><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></button></div><div ng-switch-when=text class=\"sidebar__item-body sidebar__text\" ng-class=::vm.item.style><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span></div><a ng-switch-when=dropdown class=\"sidebar__item-body sidebar__dropdown sidebar__link\" ng-class=\"[vm.item.style, (vm.isActive(vm.item.state) ? \'sidebar__item-body--active\' : \'\')]\" ng-click=\"vm.item.collapsed = !vm.item.collapsed\"><i ng-if=::vm.item.icon ng-class=::vm.item.icon class=\"fa fa-fw\"></i> <span>{{ ::vm.item.label }}</span> <i class=\"fa fa-fw sidebar__arrow\" ng-class=\"vm.item.collapsed ? \'fa-angle-left\' : \'fa-angle-down\'\"></i></a><ul ng-if=\"::vm.item.items.length > 0\" class=\"sidebar__nav sidebar__nav--subnav\" collapse=vm.item.collapsed role=group><li class=\"dropdown sidebar__item\" ng-repeat=\"item in ::vm.item.items\"><sidebar-item item=::item></sidebar-item></li></ul><nav-pages ng-switch-when=pages item=vm.item></nav-pages><div ng-switch-default class=\"sidebar__item-body sidebar__text\"><span class=text-danger><i class=\"fa fa-fw fa-warning\"></i>Unknown type</span></div></div>");
$templateCache.put("app/components/operations-button/operations-button.html","<div class=btn-group dropdown keyboard-nav><button id=simple-btn-keyboard-nav type=button class=btn-rounded dropdown-toggle>Actions <span class=caret></span></button><ul class=dropdown-menu role=menu aria-labelledby=simple-btn-keyboard-nav><li role=menuitem ng-repeat=\"operation in vm.operations\"><a href=# ng-click=vm.executeOperation(operation.name)>{{ ::operation.name }}</a></li></ul></div>");
$templateCache.put("app/components/product-categories-table/product-categories-table.html","<table ng-if=\"0 < vm.productCategories.length\" class=product-categories-table><thead><tr><th class=\"product-categories-table__heading product-categories-table__heading--description\">Description</th><th class=\"product-categories-table__heading product-categories-table__heading--actions\">Action</th></tr></thead><tbody ng-model=vm.productCategories><tr class=product-categories-table__row ng-repeat=\"row in vm.productCategories\"><td class=\"product-categories-table__cell product-categories-table__cell--description\">{{ ::row.name }} &mdash; {{ ::row.description }}</td><td class=\"product-categories-table__cell product-categories-table__cell--actions\"><a ui-sref=\"manage.product-categories.edit({productCategoryId: row.id})\" class=\"product-categories-table__action product-categories-table__action--edit\" title=Edit><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=\"product-categories-table__action product-categories-table__action--delete\" title=Delete confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to delete this category?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteCategory($index) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table><div ng-if=\"::0 === vm.productCategories.length\" class=product-categories-table__empty>No categories at this time.</div>");
$templateCache.put("app/components/product-description/product-description.html","<div class=product-description><div ng-if=::!vm.product.img class=\"product-description__image product-description__image--missing\"></div><img ng-if=::vm.product.img class=product-description__image ng-src=\"images/assets/{{ ::vm.product.img }}\" alt=\"Product Icon\"> <a ui-sref=\"products.details({productId: vm.product.id})\">{{ ::vm.product.name }}</a> <span ng-if=::vm.product.description class=product-description__description>&mdash; {{ ::vm.product.description }}</span></div>");
$templateCache.put("app/components/product-type-modal/product-type-modal.html","<div class=modals__header><button type=button class=modals__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=modals__title>Select Product Type</div></div><div class=modals__body><p>Select the provider and product type you\'d like to create</p><form class=forms><formly-form model=vm.selections fields=vm.fields></formly-form></form></div><div class=modals__footer><button type=button class=\"modals__button modals__button--cancel\" ng-click=$dismiss()>Cancel</button> <button type=button class=modals__button ng-click=$close(vm.selections) ng-disabled=!vm.selections.productTypeId>Ok</button></div>");
$templateCache.put("app/components/profile/nav-profile.html","<div class=nav-profile__column><img class=nav-profile__image src=/images/assets/projects/5.png alt=\"User Avatar\"> <a ng-show=\"0 < vm.alerts.length\" class=nav-profile__alerts ui-sref=alerts>{{ vm.alerts.length }}</a><div class=nav-profile__heading>Welcome</div><div class=dropdown><a class=nav-profile__name data-target=# href=http://example.com data-toggle=dropdown aria-haspopup=true role=button aria-expanded=false>{{ ::vm.name }} <i class=\"nav-profile__arrow fa fa-angle-down\"></i></a><ul class=dropdown-menu role=menu><li role=presentation><a role=menuitem tabindex=-1 href=#>Edit Profile</a></li><li role=presentation><a role=menuitem tabindex=-1 href=#>Settings</a></li><li role=presentation class=divider></li><li role=presentation><a role=menuitem tabindex=-1 ui-sref=logout>Logout</a></li></ul></div></div>");
$templateCache.put("app/components/project-approval/project-approval.html","<div ng-if=\"::\'approved\' !== vm.project.status\"><div ng-if=\"::\'undecided\' === vm.project.status\" class=project-approval><div class=project-approval__heading>Project Pending, Requires <span class=project-approval__heading--approval>Approval</span> or <span class=project-approval__heading--rejection>Rejection</span></div><div class=project-approval__body><div class=project-approval__button><button type=button class=\"btn-rounded project-approval__button--input\" ng-click=vm.approve()>Approve</button></div><div class=project-approval__input><input type=text class=\"field__input project-approval__input--input\" ng-model=vm.message ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 500, \'blur\': 0} }\" placeholder=\"Reason for rejection\" aria-label=rejection-reason></div><div class=project-approval__button><button ng-disabled=\"vm.message == \'\'\" type=button class=\"btn-rounded btn-rounded--danger project-approval__button--input\" ng-click=vm.reject()>Reject</button></div></div></div></div><div ng-if=\"::\'rejected\' === vm.project.status\"><details-table heading=\"Project was rejected\"><div class=details-table__row><div class=details-table__label>by</div><div class=\"details-table__detail project-approval__rejection-message--response\">{{ ::vm.project.finalApproval().staff_name }}</div></div><div class=details-table__row><div class=details-table__label>reason</div><div class=\"details-table__detail project-approval__rejection-message--response\">{{ ::vm.project.finalApproval().reason }}</div></div></details-table></div>");
$templateCache.put("app/components/products-table/products-table.html","<table st-table=vm.products class=tables><thead><tr><th st-sort=name class=\"tables__heading tables__heading--sortable\">Description</th><th st-sort=product_type class=\"tables__heading products-table__product_type tables__heading--sortable\">Product Type</th><th st-sort=active class=\"tables__heading products-table__available tables__heading--centered tables__heading--sortable\">Available</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.products track by row.id\"><td class=\"tables__cell tables__cell--description\"><product-description product=::row></product-description></td><td class=tables__cell>{{ ::row.product_type }}</td><td class=\"tables__cell tables__cell--centered\"><img ng-if=::row.active src=images/ic_required.png alt=Active title=Active></td><td class=\"tables__cell tables__cell--actions\"><a ui-sref=\"manage.products.edit({productId: row.id})\" class=tables__action><img src=images/ic_edit.png alt=\"Edit Product\" title=\"Edit Product\"></a></td></tr></tbody></table>");
$templateCache.put("app/components/project-description/project-description.html","<div class=project-description><div ng-if=::!vm.project.img class=\"project-description__image project-description__image--missing\"></div><img ng-if=::vm.project.img class=project-description__image ng-src=\"images/assets/{{ ::vm.project.img }}\" alt=\"Product Icon\"> <a ui-sref=\"{{ ::vm.linkTo }}\">{{ ::vm.project.name }}</a> <span ng-if=::vm.project.description class=project-description__description>&mdash; {{ ::vm.project.description }}</span></div>");
$templateCache.put("app/components/project-memberships/project-memberships.html","<region heading=Memberships><div class=region__buttons><button ng-if=vm.readOnly() type=button class=\"btn-rounded btn-rounded--short\" ng-click=vm.showModal()>Add Membership</button></div><table ng-if=\"0 < vm.memberships.length\" class=tables><thead><tr><th class=tables__heading>Group</th><th class=tables__heading>Role</th><th class=\"tables__heading tables__heading--centered\">Members</th><th ng-if=vm.readOnly() class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.memberships track by row.id\"><td class=tables__cell>{{ row.group.name }}</td><td class=tables__cell>{{ row.role.name }}</td><td class=\"tables__cell tables__cell--centered\">{{ row.group.staff_count }}</td><td class=\"tables__cell tables__cell--actions\"><a ng-if=vm.archivedProject() href=# ng-click=vm.showModal(row) class=tables__action title=Edit><img src=/images/ic_edit.png alt=Edit></a> <a ng-if=vm.readOnly() href=# class=tables__action title=Delete confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this membership?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.remove(row) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table><div ng-if=\"0 === vm.memberships.length\" class=tables__empty>No memberships at this time.</div></region>");
$templateCache.put("app/components/project-services/project-services.html","<region heading=Services><div class=region__buttons><button ng-if=vm.readOnly() type=button class=\"btn-rounded btn-rounded--short\" ui-sref=marketplace>Add Service</button></div><table ng-if=\"0 < vm.services.length\" class=tables><thead><tr><th class=tables__heading>Name</th><th class=tables__heading>Product</th><th class=\"tables__heading tables__heading--centered tables__heading--status\">Status</th><th class=\"tables__heading tables__heading--centered tables__heading--health\">Health</th><th ng-if=vm.readOnly() class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.services track by row.id\"><td class=tables__cell>{{ ::row.name }}</td><td class=tables__cell>{{ ::row.product.name }}</td><td class=\"tables__cell tables__cell--centered\">{{ ::row.status }}</td><td class=\"tables__cell tables__cell--centered\"><status type=\"{{ :: row.health }}\">{{ ::row.health }}</status></td><td class=\"tables__cell tables__cell--actions\"><a ng-if=vm.readOnly() ui-sref=\"services.details({serviceId: row.id})\" class=tables__action title=Edit><img src=/images/ic_edit.png alt=Edit></a></td></tr></tbody></table><div ng-if=\"0 === vm.services.length\" class=tables__empty>No services have been added.</div></region>");
$templateCache.put("app/components/provider-type-modal/provider-type-modal.html","<div class=modals__header><button type=button class=modals__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=modals__title>Select Provider Type</div></div><div class=modals__body><form class=forms><formly-form model=vm.selections fields=vm.fields></formly-form></form></div><div class=modals__footer><button type=button class=\"modals__button modals__button--cancel\" ng-click=$dismiss()>Cancel</button> <button type=button class=modals__button ng-click=$close(vm.selections.provider) ng-disabled=!vm.selections.provider>Ok</button></div>");
$templateCache.put("app/components/region/region.html","<div class=region><div class=region__header><span class=region__title ng-bind-html=::vm.heading></span> <a href=# title=Collapse><img class=region__collapse-icon src=images/ic_viewcategory_dropdown.png ng-click=\"vm.collapsed = !vm.collapsed\" alt=Collapse></a></div><div class=region__body collapse=vm.collapsed role=region ng-transclude></div></div>");
$templateCache.put("app/components/role-form/role-form.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><content-header short=true><div><span class=\"content-header__title role-form__title\" ng-bind=::vm.heading></span> <span class=role-form__title-error ng-if=vm.hasErrors()>Please complete required fields in red</span></div></content-header><div class=row><div class=role-form__body><div class=role-field><div class=role-field__aside><label class=role-field__label id=name-label>Name</label></div><div class=role-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'name\')}\"><input id=role-name ng-model=vm.role.name name=name type=text class=role-field__input placeholder=\"Enter a role name.\" aria-labelledby=name-label required><div class=role-field__feedback ng-messages=vm.form.name.$error><div ng-message=required>A role name is required.</div></div></div></div><div class=role-field><div class=role-field__aside><label class=role-field__label id=description-label>Description</label></div><div class=role-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'description\')}\"><textarea id=role-description ng-model=vm.role.description name=description class=\"role-field__input field__input--textarea\" rows=3 placeholder=\"Enter a role description.\" aria-labelledby=description-label required></textarea><div class=role-field__feedback ng-messages=vm.form.description.$error><div ng-message=required>An role description is required.</div></div></div></div><div class=role-field ng-repeat=\"(permission, value) in vm.permissions\"><div class=role-field__aside><label class=role-field__label>{{permission}}</label></div><div class=role-field__radio><input id=\"{{::[permission, value, \'read\'].join(\'-\')}}\" name=\"{{::[permission, value, \'read\'].join(\'-\')}}\'\" type=radio ng-model=vm.role.permissions[permission] ng-value=\"[\'read\']\" class=role-field__radio> <label for=\"{{::[permission, value, \'read\'].join(\'-\')}}\">Read</label> <input id=\"{{::[permission, value, \'write\'].join(\'-\')}}\" name=\"{{::[permission, value, \'write\'].join(\'-\')}}\" type=radio ng-model=vm.role.permissions[permission] ng-value=\"[\'read\', \'write\']\" class=role-field__radio> <label for=\"{{::[permission, value, \'write\'].join(\'-\')}}\">Read/Write</label></div></div></div></div><div class=row><div class=col-sm-7><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=\"btn-rounded role-form__submit\" ng-disabled=vm.hasErrors()>Save</button> <button type=button class=\"btn btn-link role-form__cancel\" confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.backToList() confirmation-show-cancel=false>Cancel</button></div></div></div></form>");
$templateCache.put("app/components/service-basic-details/service-basic-details.html","<details-table heading=Details><alert ng-repeat=\"alert in vm.service.latest_alerts track by latest_alert.id\" type=\"{{ ::Alert.statusToType(alert.status) }}\"><strong>[{{ ::alert.category | uppercase }}]</strong> &mdash; {{ ::alert.message }}</alert><div class=details-table__row><div class=details-table__label>Project</div><div class=details-table__detail><project-description project=vm.service.project link-to=\"projects.details({projectId: {{vm.service.project.id}}})\"></project-description></div></div><div class=details-table__row><div class=details-table__label>Product</div><div class=details-table__detail><product-description product=vm.service.product link-to=\"products.details({productId: {{vm.service.product.id}}})\"></product-description></div></div><div class=details-table__row><div class=details-table__label>Service Status</div><div class=details-table__detail><status type=\"{{ ::vm.service.provision_status }}\"><strong>{{ ::vm.service.provision_status.toUpperCase() }}</strong> &mdash; {{ ::vm.service.status_msg || \'No status message is available at this time.\' }}</status></div></div><div class=details-table__row><div class=details-table__label>Creation Date</div><div class=details-table__detail>{{ ::vm.service.created_at | date:\'medium\' }}</div></div><div class=details-table__row><div class=details-table__label>Last Updated</div><div class=details-table__detail>{{ ::vm.service.updated_at | date:\'medium\' }}</div></div><div class=details-table__row><div class=details-table__label>Setup Price</div><div class=details-table__detail>{{ ::vm.service.order.setup_price | currency }}</div></div><div class=details-table__row><div class=details-table__label>Monthly Cost</div><div class=details-table__detail>{{ ::vm.service.order.monthly_cost | currency }}</div></div></details-table>");
$templateCache.put("app/components/services-table/services-table.html","<table ng-if=\"::0 < vm.services.length\" st-table=vm.services class=tables><thead><tr><th class=\"tables__heading tables__heading--sortable services-table__heading--service-id\" st-sort=id st-sort-default=true>Service Id</th><th st-sort=product_name class=\"tables__heading tables__heading--sortable services-table__heading--description\">Product</th><th st-sort=provision_status class=\"tables__heading tables__heading--sortable services-table__heading--status\">Status</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.services track by row.id\"><td class=\"tables__cell services-table__cell--service-id\">{{ ::row.id }}</td><td class=\"tables__cell services-table__cell--description\"><product-description product=row.product></product-description></td><td class=\"tables__cell services-table__cell--status\"><status type=\"{{ ::row.status }}\">{{ ::row.status }}</status></td><td class=\"tables__cell tables__cell-actions\"><a ui-sref=\"services.details({serviceId: row.id})\"><img src=images/ic_edit.png alt=Edit></a></td></tr></tbody></table><div ng-if=\"::0 === vm.services.length\" class=services-table__empty>No services at this time.</div>");
$templateCache.put("app/components/tags/tag-autocomplete.html","<div ng-if=vm.suggestionList.visible><div class=\"tag-autocomplete autocomplete\" ng-class=\"::{\'tag-autocomplete--search\': \'search\' === vm.mode}\"><ul class=\"tag-autocomplete__list suggestion-list\"><li class=\"tag-autocomplete__item suggestion-item\" ng-repeat=\"item in vm.suggestionList.items track by item.id\" ng-click=vm.addSuggestionByIndex($index) ng-mouseenter=vm.suggestionList.select($index)><tag-match tag=item selected=\"item == vm.suggestionList.selected\"></tag-match></li></ul></div></div>");
$templateCache.put("app/components/tags/tag-field.html","<div class=tag-field tabindex=-1 ng-click=vm.hostClick()><div class=tag-field__tags ng-class=\"{focused: vm.hasFocus}\"><ul class=tag-field__list><li class=tag-field__item ng-repeat=\"tag in vm.tagList.tags\"><tag-item text=tag selected=\"tag === vm.tagList.selected\" on-remove=vm.removeTag($index)></tag-item></li></ul><input type=text spellcheck=false class=tag-input autocomplete=off ng-model=vm.newTag aria-label=tag-input ng-keydown=vm.inputKeydown($event) ng-focus=vm.inputFocus($event) ng-blur=vm.inputBlur($event) ng-paste=vm.inputPaste($event) bind-attrs=\"{placeholder: vm.options.placeholder}\" ng-trim=false ng-class=\"{\'invalid-tag\': vm.invalid}\" ng-disabled=vm.disabled tag-autosize></div><div ng-transclude></div></div>");
$templateCache.put("app/components/tags/tag-item.html","<span class=tag-item ng-class=\"{\'tag-item--selected\': vm.selected, \'tag-item--removable\': vm.allowRemove}\">{{ ::vm.text }} <i class=\"tag-item__active fa fa-check\" ng-if=vm.active></i> <a ng-if=vm.allowRemove href=# class=tag-item__button ng-click=vm.remove()><i class=\"fa fa-remove\"></i></a></span>");
$templateCache.put("app/components/tags/tag-match.html","<div class=tag-match ng-class=\"{\'tag-match--selected\': vm.selected}\">{{ vm.tag.name }} ({{ vm.tag.taggings_count }})</div>");
$templateCache.put("app/components/tags/tag-modal.html","<div class=tag-modal__header><button type=button class=tag-modal__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=tag-modal__title>Active Filters</div></div><div class=tag-modal__body><div class=tag-modal__active-tags><ul class=tag-modal__active-list><li class=tag-modal__active-item ng-repeat=\"tag in vm.tagList.tags track by tag\"><tag-item text=tag selected=\"tag === vm.tagList.selected\" on-remove=vm.removeTag($index)></tag-item></li></ul><a ng-if=\"vm.tagList.tags.length > 0\" href=# title=\"Remove all tags\" class=tag-modal__clear ng-click=vm.clearTags()><span class=tag-modal__clear-text>Clear</span></a></div><div class=tag-modal__shortcuts><div class=tag-modal__shortcut-title>All Filters</div><div class=tag-modal__shortcut-list><span class=tag-modal__shortcut-item ng-repeat=\"letter in ::vm.shortcuts track by letter\"><a class=tag-modal__shortcut-item--link ng-if=vm.tagsExistForLetter(letter) ng-click=vm.gotoHash(letter)>{{ ::letter }}</a> <span class=tag-modal__shortcut-item--text ng-if=!vm.tagsExistForLetter(letter)>{{ ::letter }}</span></span></div></div><div class=tag-modal__letters><div class=tag-modal__letters-list><div class=tag-modal__letters-item ng-repeat=\"tagHash in ::vm.tags track by $index\"><a bind-attrs=\"{name: letter}\" class=tag-modal__letter>{{ ::tagHash.letter }}</a><ul class=tag-modal__list><li class=tag-modal__item ng-repeat=\"tag in ::tagHash.tags track by tag.id\"><button type=button class=tag-modal__tag ng-click=vm.addTag(tag) ng-disabled=vm.tagUnavailable(tag)>{{ ::tag.name }} <span class=tag-modal__tag-results ng-if=!vm.tagInUse(tag.name)>{{ ::tag.results }}</span> <i class=\"tag-modal__tag-results fa fa-check\" ng-if=vm.tagInUse(tag.name)></i></button></li></ul></div></div></div></div><div class=tag-modal__footer><button type=button class=\"btn-rounded tag-modal__ok\" ng-click=$close()>Ok</button></div>");
$templateCache.put("app/components/tags/tag-search.html","<div class=tag-search tabindex=-1 ng-click=vm.hostClick()><div class=tag-search__tags ng-class=\"{focused: vm.hasFocus}\"><ul class=tag-search__list><li class=tag-search__item ng-repeat=\"tag in vm.tagList.tags\"><tag-item text=tag selected=\"tag === vm.tagList.selected\" on-remove=vm.removeTag($index)></tag-item></li></ul><input type=text spellcheck=false class=tag-input autocomplete=off ng-model=vm.newTag ng-change=vm.inputChange(vm.newTag) ng-keydown=vm.inputKeydown($event) ng-focus=vm.inputFocus($event) ng-blur=vm.inputBlur($event) ng-paste=vm.inputPaste($event) bind-attrs=\"{placeholder: vm.options.placeholder}\" ng-trim=false ng-class=\"{\'invalid-tag\': vm.invalid}\" ng-disabled=vm.disabled aria-label=tag-search tag-autosize> <a ng-if=\"vm.tagList.tags.length > 0\" href=# title=\"Remove all tags\" class=tag-search__clear ng-click=vm.clearTags()><span class=tag-search__clear-text>Clear</span></a></div><div ng-transclude></div></div>");
$templateCache.put("app/components/tags/tag-show-modal.html","<div class=tag-show-modal><a href=# class=tag-show-modal__link ng-click=vm.showModal()><span class=tag-show-modal__text ng-transclude></span></a></div>");
$templateCache.put("app/components/view-mode-switch/view-mode-switch.html","<div class=view-mode-switch><a href=# class=\"view-mode-switch__option view-mode-switch__option--grid\" title=\"Grid View\" ng-click=\"vm.setViewMode(\'grid\')\" ng-class=\"{\'view-mode-switch__option--active\': \'grid\' == vm.viewMode}\"><span class=sr-only>Grid</span></a> <a href=# class=\"view-mode-switch__option view-mode-switch__option--list\" title=\"List View\" ng-click=\"vm.setViewMode(\'list\')\" ng-class=\"{\'view-mode-switch__option--active\': \'list\' == vm.viewMode}\"><span class=sr-only>List</span></a></div>");
$templateCache.put("app/components/wizard/wizard-modal.html","<div class=wizard-modal__header><button type=button class=wizard-modal__close ng-click=$dismiss() aria-label=Close><i class=\"fa fa-close\" aria-hidden=true></i> <span class=sr-only>Close</span></button><div class=wizard-modal__title>Product Wizard</div></div><div class=wizard-modal__body ng-switch=vm.state><div ng-switch-when=intro><div class=wizard-modal__question>Welcome to the Wizard!</div><div class=wizard-modal__subtitle>Determine the best-suited products for your project<br>by answering the following set of questions.</div><button type=button class=\"btn-rounded wizard-modal__button\" ng-click=vm.startWizard()>Get Started</button></div><div ng-switch-when=wizard><div class=wizard-modal__question>{{ vm.question.text }}</div><div class=wizard-modal__answers><button type=button class=\"btn-rounded btn-rounded--capitalize wizard-modal__button\" ng-repeat=\"answer in vm.question.wizard_answers track by answer.id\" ng-class=\"{\'wizard-modal__button--selected\': vm.answeredQuestions[vm.questionPointer].id === answer.id}\" ng-click=vm.answerWith($index)>{{ ::answer.text }}</button> <button type=button class=\"btn-link wizard-modal__button\" ng-click=vm.answerWith(-1)>Not Sure</button></div></div><div ng-switch-when=complete><div class=wizard-modal__question>Congratulations!</div><div class=wizard-modal__subtitle>The Wizard has come up with the best service options for you.</div><button type=button class=\"btn-rounded wizard-modal__button\" ng-click=$close(vm.tags)>Show Matching Products</button></div></div><div class=wizard-modal__footer ng-switch=vm.state><button type=button ng-switch-when=wizard ng-disabled=\"vm.questionPointer <= 0 || vm.state !== \'wizard\'\" class=\"btn-rounded wizard-modal__ok\" ng-click=vm.questionNavigation(-1)>Previous</button> <button type=button ng-switch-when=wizard ng-disabled=\"vm.answeredQuestions.length <= vm.questionPointer || vm.state !== \'wizard\'\" class=\"btn-rounded wizard-modal__ok\" ng-click=vm.questionNavigation(1)>Next</button></div>");
$templateCache.put("app/components/wizard-question-form/wizard-question-form.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><content-header short=true><div><span class=\"content-header__title wizard-question-form__title\">{{ ::vm.heading }}</span> <span class=wizard-question-form__title-error ng-if=vm.hasErrors()>Please complete required fields in red</span></div></content-header><div class=wizard-question-form__body><div class=wizard-question-field><div class=wizard-question-field__aside><label class=wizard-question-field__label id=question-label>Question</label></div><div class=wizard-question-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'question\')}\"><input id=wizard-question-name ng-model=vm.question.text name=question type=text class=wizard-question-field__input placeholder aria-labelledby=question-label required><div class=wizard-question-field__feedback ng-messages=vm.form.question.$error><div ng-message=required>A question is required.</div></div></div></div><wizard-question-options options=vm.question.wizard_answers></wizard-question-options></div><div class=\"row wizard-question-form__buttons\"><div class=col-sm-7><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=\"btn-rounded wizard-question-form__submit\" ng-disabled=vm.hasErrors()>Save</button> <button type=button class=\"btn btn-link wizard-question-form__cancel\" confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.backToList() confirmation-show-cancel=false>Cancel</button></div></div></div></form>");
$templateCache.put("app/components/wizard-question-form/wizard-question-option.html","<div ng-form name=vm.form class=wizard-question-option__container><div class=wizard-question-option><div class=wizard-question-option__aside><label class=wizard-question-option__label id=\"{{ vm.formattedLabel }}\">{{ vm.label }}</label></div><div class=wizard-question-option__body ng-class=\"{\'has-error\': vm.hasError()}\"><input ng-model=vm.option.text name=option type=text class=wizard-question-option__input placeholder aria-labelledby=\"{{ vm.formattedLabel }}\" required><div class=wizard-question-option__feedback ng-messages=vm.form.option.$error><div ng-message=required>Option text is required.</div></div></div><div class=wizard-question-option__actions><a ng-show=vm.canRemove() href=# class=wizard-question-option__action confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to delete this option and it\'s content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.remove() confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></div></div><div class=wizard-question-option><div class=\"wizard-question-option__aside wizard-question-option__aside--tags\"><label class=\"wizard-question-option__label wizard-question-option__label--tags\">Include</label></div><div class=\"wizard-question-option__body wizard-question-option__body--tags\"><tag-field ng-model=vm.option.tags_to_add name=tags placeholder=\"Enter tag name(s)\"><tag-autocomplete source=vm.queryTags(query)></tag-autocomplete><tag-show-modal>Show all tags</tag-show-modal></tag-field></div></div><div class=wizard-question-option><div class=\"wizard-question-option__aside wizard-question-option__aside--tags\"><label class=\"wizard-question-option__label wizard-question-option__label--tags\">Exclude</label></div><div class=\"wizard-question-option__body wizard-question-option__body--tags\"><tag-field ng-model=vm.option.tags_to_remove name=tags placeholder=\"Enter tag name(s)\"><tag-autocomplete source=vm.queryTags(query)></tag-autocomplete><tag-show-modal>Show all tags</tag-show-modal></tag-field></div></div></div>");
$templateCache.put("app/components/wizard-question-form/wizard-question-options.html","<div><div wizard-question-option class=wizard-question-option ng-repeat=\"option in vm.options\" ng-if=!option._destroy option=option option-index=$index option-label=\"{{ \'Option \' + ($index + 1) }}\"></div></div><div class=wizard-question-options__footer><div class=wizard-question-options__actions><button type=button class=\"btn-bordered btn-bordered--short btn-bordered--capitalize\" ng-click=vm.addOption() ng-disabled=!vm.canAdd()>Add Option</button></div></div>");
$templateCache.put("app/components/wizard-questions-table/wizard-questions-table.html","<table ng-if=\"0 < vm.questions.length\" class=wizard-questions-table><thead><tr><th class=\"wizard-questions-table__heading wizard-questions-table__heading--order\">Order</th><th class=\"wizard-questions-table__heading wizard-questions-table__heading--question\">Question</th><th class=\"wizard-questions-table__heading wizard-questions-table__heading--actions\">Action</th></tr></thead><tbody ui-sortable=vm.sortableOptions ng-model=vm.questions><tr class=wizard-questions-table__row ng-repeat=\"row in vm.questions\"><td class=\"wizard-questions-table__cell wizard-questions-table__cell--order\">{{ $index+1 }}</td><td class=\"wizard-questions-table__cell wizard-questions-table__cell--question\">{{ ::row.text }}</td><td class=\"wizard-questions-table__cell wizard-questions-table__cell--actions\"><a ui-sref=\"manage.wizard-questions.edit({questionId: row.id})\" class=\"wizard-questions-table__action wizard-questions-table__action--edit\" title=Edit><img src=/images/ic_edit.png alt=Edit></a><a href=# class=\"wizard-questions-table__action wizard-questions-table__action--delete\" title=Delete confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to delete this question and it\'s content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteQuestion($index) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table><div ng-if=\"::0 === vm.questions.length\" class=wizard-questions-table__empty>No questions at this time.</div>");
$templateCache.put("app/states/dashboard/dashboard.html","<div class=chartboard><div ng-repeat=\"charts in vm.chartCollection | groupBy:2\"><div class=chartboard--layout ng-repeat=\"chart in charts\"><div class=chartboard__chart ng-drag=true ng-drop=true ng-drop-success=\"vm.onDropComplete($index, $data, $event)\" ng-drag-data=chart><highchart config=chart></highchart></div></div></div></div>");
$templateCache.put("app/states/login/login.html","<div class=\"navigation navigation__brand\"><a class=navigation__brand><img src=images/jellyfish_main_logo.png alt=\"Jellyfish Main Logo\"></a></div><div class=login__window><div ng-if=vm.motd.message><div class=well><div><span class=login__title>message of the day</span></div><div marked=vm.motd.message></div></div><hr></div><login-form></login-form></div><footer></footer>");
$templateCache.put("app/states/marketplace/marketplace.html","<content-header><div class=marketplace__body><tag-field ng-model=vm.tags class=search-input placeholder=\"Enter product tag or category\" add-from-autocomplete-only=true on-tag-added=vm.updateCatalog() on-tag-removed=vm.updateCatalog() on-tags-cleared=vm.updateCatalog() tag-mode=search><tag-autocomplete source=vm.queryTags(query)></tag-autocomplete><tag-show-modal>Show all tags</tag-show-modal></tag-field></div><div class=marketplace__aside><div><selected-products></selected-products></div><button type=button class=\"btn-rounded btn-rounded--short btn-rounded--capitalize marketplace__wizard\" ng-click=vm.openWizard()>Open Product Wizard</button></div></content-header><catalog-category ng-repeat=\"category in vm.catalog\" category=category view-mode=vm.viewMode required-tags=vm.tags></catalog-category>");
$templateCache.put("app/states/pages/page.html","<div class=pages-field__body><div class=pages-field__body--markdown marked=vm.page.body></div></div>");
$templateCache.put("app/components/forms/types/date.html","<div class=input-group><span class=input-group-btn><button type=button class=\"btn btn-default field__group-button\" ng-click=\"datepicker.opened = !datepicker.opened\" aria-labelledby=\"{{ ::id }}-label\"><i class=\"fa fa-calendar\"></i></button></span> <input class=field__input ng-model=model[options.key] is-open=datepicker.opened datepicker-options=to.datepickerOptions ng-click=\"datepicker.opened= !datepicker.opened\" aria-labelledby=\"{{ ::id }}-label\"></div>");
$templateCache.put("app/components/forms/types/multiple-options.html","<div class=multiple-options ui-sortable=to.sortableOptions ng-model=model[options.key]><div ng-repeat=\"item in model[options.key] track by $index\" ng-init=\"itemOptions = copyItemOptions($index)\" class=multiple-option><div class=row><div class=multiple-option__aside><label class=field__label>{{ \'Option \'+ ($index+1) }}</label></div><div class=multiple-option__body ng-class=\"{\'has-error\': showError}\"><formly-field options=itemOptions model=model[options.key] form=form index=$index></formly-field><div class=field__feedback ng-messages=fc.$error ng-if=showError><div ng-message=required>Option text is required.</div></div></div><div class=multiple-option__actions><img class=\"multiple-option__action multiple-option__action--handle\" src=/images/ic_sort.png alt=Sort> <a ng-if=\"2 < model[options.key].length\" href=# class=multiple-option__action confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to delete this option and it\'s content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=\"model[options.key].splice($index, 1)\" confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></div></div></div></div><div class=row><div class=multiple-options__footer><button type=button class=\"btn-bordered btn-bordered--short btn-bordered--capitalize pull-right\" ng-click=\"model[options.key].push(\'\')\">Add Option</button></div></div>");
$templateCache.put("app/components/forms/types/tags.html","<tag-field ng-model=model[options.key]><tag-autocomplete source=queryTags(query)></tag-autocomplete><tag-show-modal>Show all tags</tag-show-modal></tag-field>");
$templateCache.put("app/components/forms/wrappers/field.html","<div class=field><formly-transclude></formly-transclude></div>");
$templateCache.put("app/components/forms/wrappers/has-error.html","<div class=field__body ng-class=\"{\'has-error\': showError}\"><formly-transclude></formly-transclude><div class=field__feedback ng-messages=fc.$error ng-if=showError><div ng-message=\"{{ ::name }}\" ng-repeat=\"(name, message) in ::options.validation.messages\">{{ message(fc.$viewValue, fc.$modelValue, this) }}</div></div></div>");
$templateCache.put("app/components/forms/wrappers/label.html","<div class=field__aside ng-class=::to.labelClass><label class=field__label id=\"{{ ::id }}-label\">{{ ::to.label }}</label></div><formly-transclude></formly-transclude>");
$templateCache.put("app/components/forms/wrappers/loading.html","<div ng-if=\"to.loading.$$state.status === 0\" class=\"field__body field__body--loading\"><select class=field__input disabled><option value>Loading...</option></select></div><div ng-if=\"to.loading.$$state.status !== 0\"><formly-transclude></formly-transclude></div>");
$templateCache.put("app/states/admin/settings/settings.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Settings</span></div></content-header><region ng-repeat=\"(title, settings) in ::vm.groups\" heading=\"{{ ::title }}\"><table class=tables><thead><tr><th class=\"tables__heading settings-table__name\">Name</th><th class=\"tables__heading settings-table__description\">Description</th><th class=tables__heading>Value</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in ::settings\"><td class=tables__cell>{{ ::row.name }}</td><td class=tables__cell>{{ ::row.description }}</td><td ng-if=\"::row.value_type == \'password\'\" class=tables__cell>&mdash; <em>hidden</em> &mdash;</td><td ng-if=\"::row.value_type != \'password\'\" class=tables__cell>{{ row.value }}</td><td class=\"tables__cell tables__cell--actions\"><img ng-click=vm.edit(row) class=tables__action src=/images/ic_edit.png alt=Edit></td></tr></tbody></table></region>");
$templateCache.put("app/states/errors/four0four/four0four.html","<div class=errors><div class=navigation><a class=navigation__brand ui-sref=dashboard><img src=images/jellyfish_main_logo.png alt=\"Jellyfish Main Logo\"></a></div><div class=errors__window><img class=errors__logo src=images/jelly_alone.png alt=\"Jellyfish Logo\"><div class=errors__title>The page you requested cannot be found.</div><p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p><p>We apologize for the inconvenience.</p><p ng-if=vm.state><strong>Unknown state: {{ vm.state }}</strong></p></div></div>");
$templateCache.put("app/states/errors/sorry/sorry.html","<div class=errors><div class=navigation><a class=navigation__brand ui-sref=dashboard><img src=images/jellyfish_main_logo.png alt=\"Jellyfish Main Logo\"></a></div><div class=errors__window><img class=errors__logo src=images/jelly_alone.png alt=\"Jellyfish Logo\"><div class=errors__title>An Error Was Encountered</div><p>The application has encountered an error while loading resources for the requested page.</p><p>You may go back and attempt the action again.</p></div></div>");
$templateCache.put("app/states/errors/unauthorized/unauthorized.html","<div class=errors><div class=navigation><a class=navigation__brand ui-sref=dashboard><img src=images/jellyfish_main_logo.png alt=\"Jellyfish Main Logo\"></a></div><div class=errors__window><img class=errors__logo src=images/jelly_alone.png alt=\"Jellyfish Logo\"><div class=errors__title>Unauthorized Page Access</div><p>You do not have permission to access that page.</p></div></div>");
$templateCache.put("app/states/orders/create/create.html","<order-form record=vm.order back-to=marketplace options=vm.options heading=\"Configure Service\" sub-heading=\"{{ ::vm.subHeading }}\"></order-form>");
$templateCache.put("app/states/orders/details/details.html","<content-header short=true><span class=content-header__title>Order Details</span></content-header><details-table><div class=details-table__row><div class=details-table__label>Product</div><product-description product=vm.product></product-description></div><div class=details-table__row><div class=details-table__label>Project</div><project-description project=vm.project link-to=\"projects.details({projectId: vm.project.id})\"></project-description></div><div class=details-table__row><div class=details-table__label>Service</div><div class=details-table__detail><a ui-sref=\"services.details({serviceId: vm.service.id})\">{{ ::vm.service.name }}</a></div></div><div class=details-table__row><div class=details-table__label>Placed by</div><div class=details-table__detail>{{ ::vm.staff.full_name }}</div></div><div class=details-table__row><div class=details-table__label>Status</div><div class=details-table__detail><status type=\"{{ ::vm.order.status }}\">{{ ::vm.order.status | uppercase }}</status></div></div><div class=details-table__row><div class=details-table__label>Status Message</div><div class=details-table__detail>{{ ::vm.order.status_msg }}</div></div><div class=details-table__row><div class=details-table__label>Creation Date</div><div class=details-table__detail>{{ ::vm.order.created_at | date:\'medium\' }}</div></div><div class=details-table__row><div class=details-table__label>Last Updated</div><div class=details-table__detail>{{ ::vm.order.updated_at | date:\'medium\' }}</div></div></details-table>");
$templateCache.put("app/states/orders/list/list.html","<content-header short=true><span class=content-header__title>Order History</span></content-header><region ng-repeat=\"(id, orders) in vm.projects track by id\" heading=\"{{ ::orders[0].project }}\"><table st-table=orders class=tables><thead><tr><th class=\"tables__heading tables__heading--sortable\" st-sort=product_name>Product</th><th class=\"tables__heading tables__heading--sortable orders-list__staff\" st-sort=staff>Placed By</th><th class=\"tables__heading tables__heading--sortable orders-list__cost\" st-sort=total>Monthly Cost</th><th class=\"tables__heading tables__heading--sortable orders-list__status\">Status</th><th class=\"tables__heading tables__heading--sortable orders-list__date\" st-sort=created_at>Order Date</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr class=selectRow ng-repeat=\"row in orders\"><td class=tables__cell><product-description product=row.product></product-description></td><td class=tables__cell>{{ ::row.staff }}</td><td class=tables__cell>{{ ::row.total | currency }}</td><td class=tables__cell><status type=\"{{ ::row.status }}\">{{ ::row.status }}</status></td><td class=tables__cell>{{ ::row.created_at | date:\'short\' }}</td><td class=\"tables__cell tables__cell--actions\"><a ui-sref=\"orders.details({orderId: row.id})\" class=tables__action><img src=images/ic_info.png alt=Details title=Details></a></td></tr></tbody></table></region>");
$templateCache.put("app/states/products/details/details.html","<content-header><div class=product-details-heading><img ng-if=vm.product.img class=product-details-heading__icon ng-src=\"images/assets/{{ ::vm.product.img }}\" alt=\"Product Icon\"> <span class=content-header__title>{{ ::vm.product.name }}</span></div><div class=content-header__aside><back-link></back-link></div></content-header><details-table heading=Details><div class=details-table__row><div class=details-table__label>Name</div><div class=details-table__detail>{{ ::vm.product.name }}</div></div><div class=details-table__row><div class=details-table__label>Description</div><div class=details-table__detail>{{ ::vm.product.description }}</div></div><div class=details-table__row><div class=details-table__label>Product Status</div><div class=details-table__detail>{{ ::vm.product.active ? \'Active\' : \'Inactive\' }}</div></div><div class=details-table__row><div class=details-table__label>Product Type</div><div class=details-table__detail>{{ ::vm.product.product_type.name }}</div></div><div class=details-table__row><div class=details-table__label>Product Tags</div><div class=details-table__detail><div class=product-details__tag ng-repeat=\"tag in vm.product.tags track by $index\"><tag-item allow-remove=false active=true text=::tag></tag-item></div></div></div><div class=details-table__row><div class=details-table__label>Provider</div><div class=details-table__detail>{{ ::vm.product.provider.name }}</div></div><div class=details-table__row><div class=details-table__label>Creation Date</div><div class=details-table__detail>{{ ::vm.product.created_at | date:\'short\' }}</div></div><div class=details-table__row><div class=details-table__label>Last Updated</div><div class=details-table__detail>{{ ::vm.product.updated_at | date:\'short\' }}</div></div></details-table><details-table heading=\"Provisioning Answers\"><div class=details-table__row ng-repeat=\"answer in vm.product.answers track by answer.id\"><div class=details-table__label>{{ ::answer.name | uppercase }}</div><div class=details-table__detail>{{ ::answer.value }}</div></div></details-table><region heading=Pricing><table class=product-pricing><thead><tr><th class=product-pricing__heading></th><th class=product-pricing__heading>Setup</th><th class=product-pricing__heading>Hourly</th><th class=product-pricing__heading>Monthly</th></tr></thead><tbody><tr class=selectRow><td class=\"product-pricing__cell product-pricing__cell--padding\"></td><td class=\"product-pricing__cell product-pricing__cell\">{{ ::vm.product.setup_price | currency }}</td><td class=\"product-pricing__cell product-pricing__cell\">{{ ::vm.product.hourly_price | currency }}</td><td class=\"product-pricing__cell product-pricing__cell\">{{ ::vm.product.monthly_price | currency }}</td></tr></tbody></table></region>");
$templateCache.put("app/states/projects/create/create.html","<project-form record=vm.project heading=\"Create Project\" back-to=^></project-form>");
$templateCache.put("app/states/projects/edit/edit.html","<project-form record=vm.project heading=\"Edit Project\" back-to=projects.list></project-form>");
$templateCache.put("app/states/projects/details/details.html","<content-header><div class=content-header__body><img ng-if=::vm.project.img class=project-details__icon ng-src=images/assets/{{vm.project.img}} alt=\"Project Icon\"><div ng-if=::!vm.project.img class=\"project-details__icon project-details__icon--missing\"></div><span class=content-header__title>{{ ::vm.project.name }}</span></div><div class=content-header__aside><button ng-if=\"::null === vm.project.archived\" class=btn-rounded ari-label=archive ng-disabled=vm.activeServices() confirmation confirmation-position=bottom confirmation-message=\"Would you like to archive this project?\" confirmation-ok-style=primary confirmation-ok-text=Archive confirmation-on-ok=vm.archiveProject() confirmation-show-cancel=true>Archive</button> <a ng-if=\"::null === vm.project.archived && \'approved\' === vm.project.status\" ui-sref=\"projects.edit({projectId: vm.project.id})\" class=btn-rounded ari-label=edit>Edit</a></div></content-header><project-approval project=vm.project on-approved=vm.approve() on-rejected=vm.reject()></project-approval><alert ng-repeat=\"alert in ::vm.project.latest_alerts\" type=\"{{ ::Alert.statusToType(alert.status) }}\"><strong>[{{ ::alert.category | uppercase }}]</strong> {{ ::alert.message }}</alert><details-table><div class=details-table__row><div class=details-table__label>Description</div><div class=details-table__detail>{{ ::vm.project.description }}</div></div><div class=details-table__row><div class=details-table__label>Status</div><div class=details-table__detail><status type=\"{{ ::vm.project.status }}\">{{ ::vm.project.status | uppercase }}</status></div></div><div class=details-table__row><div class=details-table__label>Schedule</div><div class=details-table__detail>{{ ::vm.project.start_date | date:\'short\' }} &mdash; {{ ::vm.project.end_date | date:\'short\' }}</div></div><div class=details-table__row><div class=details-table__label>Months</div><div class=details-table__detail>{{ ::vm.project.scheduleRemaining() }} months remaining</div></div><div class=details-table__row><div class=details-table__label>Creation Date</div><div class=details-table__detail>{{ ::vm.project.created_at | date:\'medium\' }}</div></div><div class=details-table__row><div class=details-table__label>Last Updated</div><div class=details-table__detail>{{ ::vm.project.updated_at | date:\'medium\' }}</div></div></details-table><details-table heading=Budget><alert ng-if=\"::0 >= vm.project.budgetRemainder()\" type=danger><strong>Budget Exceeded</strong> &mdash; The project budget has been exceeded!</alert><alert ng-if=\"::vm.project.monthly_spend && vm.project.scheduleRemaining() > vm.project.monthsRemaining()\" type=danger><strong>Budget Overrun</strong> &mdash; The monthly spend is projected to exceed the budget based on the number of months remaining.</alert><div class=details-table__row><div class=details-table__label>Total Budget</div><div class=details-table__detail>{{ ::vm.project.budget | currency }}</div></div><div class=details-table__row><div class=details-table__label>Budget Spent</div><div class=details-table__detail>{{ ::vm.project.spent | currency }}</div></div><div class=details-table__row><div class=details-table__label>Available</div><div class=details-table__detail><progressbar animate=false value=::vm.project.budgetRemainder() type=\"{{ ::vm.project.budgetUtilizationStatus() }}\" title=\"{{ ::vm.project.spent | currency }} of {{ ::vm.project.budget | currency }} spent\" class=details-table__progressbar><span class=project-details__budget-util>{{ ::vm.project.budgetRemainder() }}%</span></progressbar></div></div><div class=details-table__row><div class=details-table__label>Monthly Budget</div><div class=details-table__detail>{{ ::vm.project.monthly_budget | currency }}</div></div><div class=details-table__row><div class=details-table__label>Monthly Spend</div><div class=details-table__detail>{{ ::vm.project.monthly_spend | currency }}</div></div><div class=details-table__row><div class=details-table__label>Projection</div><div class=details-table__detail>{{ ::vm.project.monthsRemaining() }} months of remaining funds</div></div></details-table><project-services ng-if=\"::\'approved\' === vm.project.status\" project=vm.project services=vm.services></project-services><project-memberships ng-if=\"::\'approved\' === vm.project.status\" project=vm.project memberships=vm.memberships></project-memberships><region heading=\"Project Specifications\"><table st-table=vm.project.answers class=tables><thead><tr><th class=\"tables__heading project-details__question\">Question</th><th class=tables__heading>Response</th></tr></thead><tbody><tr ng-repeat=\"answer in vm.project.answers track by $index\"><td class=tables__cell>{{ ::answer.label }}</td><td class=tables__cell><span ng-if=!answer.value>N/A</span>{{ ::answer.value }}</td></tr></tbody></table></region>");
$templateCache.put("app/states/projects/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Projects</span></div><div class=content-header__aside><div><button type=button class=btn-rounded ui-sref=projects.create>Add Project</button></div></div></content-header><table st-table=vm.projects class=\"tables tables--bordered\"><thead><tr><th st-sort=name class=\"tables__heading tables__heading--sortable\">Project</th><th st-sort=approval class=\"tables__heading tables__heading--centered tables__heading--sortable projects-list__approval\">Approved</th><th st-sort=health class=\"tables__heading tables__heading--centered tables__heading--health tables__heading--sortable\">Health</th><th st-sort=budget class=\"tables__heading tables__heading--sortable projects-list__budget\">Budget</th><th st-sort=spent class=\"tables__heading tables__heading--sortable projects-list__spent\">Spent</th></tr></thead><tbody><tr ng-repeat=\"row in vm.projects track by row.id\"><td class=\"tables__cell tables__cell--description\"><project-description project=row link-to=\"projects.details({projectId: {{row.id}}})\"></project-description></td><td class=\"tables__cell tables__cell--centered\"><img ng-if=\"::\'approved\' === row.status\" src=/images/ic_required.png alt=Approved title=\"Project is approved\"> <img ng-if=\"::\'rejected\' === row.status\" src=/images/ic_deletequestion.png alt=Rejected title=\"Project is rejected\"></td><td class=\"tables__cell tables__cell--centered\"><status type=\"{{ ::row.health }}\">{{ ::row.health }}</status></td><td class=\"tables__cell tables__cell--budget\">{{ ::row.budget | currency }}</td><td class=\"tables__cell tables__cell--spent\">{{ ::row.spent | currency }}</td></tr></tbody></table><hr><region ng-if=\"::vm.archivedProjects.length >= 1\" heading=\"Archived Projects\"><table st-table=vm.projects class=tables><thead><tr><th st-sort=name class=\"tables__heading tables__heading--sortable\">Project</th><th st-sort=approval class=\"tables__heading tables__heading--centered tables__heading--sortable projects-list__approval\">Approved</th><th st-sort=health class=\"tables__heading tables__heading--centered tables__heading--health tables__heading--sortable\">Health</th><th st-sort=budget class=\"tables__heading tables__heading--sortable projects-list__budget\">Budget</th><th st-sort=spent class=\"tables__heading tables__heading--sortable projects-list__spent\">Spent</th></tr></thead><tbody><tr ng-repeat=\"row in vm.archivedProjects track by row.id\"><td class=\"tables__cell tables__cell--description\"><project-description project=row link-to=\"projects.details({projectId: {{row.id}}})\"></project-description></td><td class=\"tables__cell tables__cell--centered\"><img ng-if=\"::\'approved\' === row.status\" src=/images/ic_required.png alt=Approved title=\"Project is approved\"> <img ng-if=\"::\'rejected\' === row.status\" src=/images/ic_deletequestion.png alt=Rejected title=\"Project is rejected\"></td><td class=\"tables__cell tables__cell--centered\"><status type=\"{{ ::row.health }}\">{{ ::row.health }}</status></td><td class=\"tables__cell tables__cell--budget\">{{ ::row.budget | currency }}</td><td class=\"tables__cell tables__cell--spent\">{{ ::row.spent | currency }}</td></tr></tbody></table></region>");
$templateCache.put("app/states/services/details/details.html","<content-header short=true><div class=content-header__body><img ng-if=vm.product.img class=service-details-heading__icon ng-src=\"images/assets/{{ ::vm.product.img }}\" alt=\"Product Icon\"> <span class=content-header__title>{{ ::vm.service.product.name }}</span></div><div class=content-header__aside><operations-button service=vm.service></operations-button><back-link></back-link></div></content-header><service-basic-details service=vm.service></service-basic-details><details-table heading=\"Provisioning Output\"><div ng-if=::!vm.service.service_outputs.length class=details-table__row><div class=details-table__empty>Provisioning output not available for this service.</div></div><div ng-if=::vm.service.service_outputs.length class=details-table__row ng-repeat=\"output in ::vm.service.service_outputs\"><div class=details-table__label>{{ ::output.name }}</div><div class=details-table__detail>{{ ::output.value }}</div></div></details-table><log-table heading=Logs records=vm.logs items-per-page=10></log-table>");
$templateCache.put("app/states/services/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Services</span></div></content-header><region ng-repeat=\"(id, services) in vm.projects track by id\" heading=\"{{ ::services[0].project }}\"><table ng-if=\"::0 < services.length\" st-table=services class=tables><thead><tr><th st-sort=name class=\"tables__heading tables__heading--sortable services-list__name\">Name</th><th st-sort=product class=\"tables__heading tables__heading--sortable\">Product</th><th st-sort=status class=\"tables__heading tables__heading--sortable tables__heading--centered services-list__status\">Status</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in services track by row.id\"><td class=tables__cell>{{ ::row.name }}</td><td class=tables__cell><product-description product=row.product></product-description></td><td class=\"tables__cell tables__cell--centered\"><status type=\"{{ ::row.status }}\">{{ ::row.status }}</status></td><td class=\"tables__cell tables__cell--actions\"><a ui-sref=\"services.details({serviceId: row.id})\"><img src=images/ic_edit.png alt=\"Edit {{ :: row.name }}\"></a></td></tr></tbody></table><div ng-if=\"::0 === services.length\" class=tables__empty>No services at this time.</div><services-table services=data.services></services-table></region>");
$templateCache.put("app/states/admin/alerts/create/create.html","<alert-form alert-record=vm.alertRecord staff-id={{vm.staffId}} heading=\"Create Alert\" home=vm.home home-params=vm.homeParams alertable-type={{vm.alertableType}} alertable-id={{vm.alertableId}}></alert-form>");
$templateCache.put("app/states/admin/alerts/edit/edit.html","<alert-form alert-record=vm.alertRecord staff-id={{vm.staffId}} heading=\"Edit Alert\" home=vm.home home-params=vm.homeParams alertable-type={{vm.alertableType}} alertable-id={{vm.alertableId}}></alert-form>");
$templateCache.put("app/states/admin/alerts/list/list.html","<content-header short=true><div class=admin-alerts-list__body><span class=content-header__title>Organization Alerts</span></div><div class=admin-alerts-list__aside><a ui-sref=admin.alerts.create class=btn-rounded>Add Organization Alert</a></div></content-header><div><table st-table=vm.alerts class=alerts-table><thead><tr><th class=\"alerts-table__heading alerts-table__heading--padding\"></th><th class=\"alerts-table__heading alerts-table__heading--sortable alerts-table__heading--category\" st-sort=category>Category</th><th class=\"alerts-table__heading alerts-table__heading--sortable alerts-table__heading--status\" st-sort=status>Status</th><th class=\"alerts-table__heading alerts-table__heading--sortable alerts-table__heading--message\" st-sort=message>Message</th><th class=\"alerts-table__heading alerts-table__heading--sortable alerts-table__heading--start-date\" st-sort=start_date>Start Date</th><th class=\"alerts-table__heading alerts-table__heading--sortable alerts-table__heading--end-date\" st-sort=end_date>End Date</th><th class=\"alerts-table__heading alerts-table__heading--actions\">Action</th></tr></thead><tbody><tr class=alerts-table__row ng-repeat=\"row in vm.alerts | filter:{status: \'!ok\'}\"><td class=\"alerts-table__cell alerts-table__cell--padding\"></td><td class=\"alerts-table__cell alerts-table__cell--category\">{{ ::row.category }}</td><td class=\"alerts-table__cell alerts-table__cell--status\"><status type=\"{{ ::row.status }}\">{{ ::row.status }}</status></td><td class=\"alerts-table__cell alerts-table__cell--question\">{{ ::row.message }}</td><td class=\"alerts-table__cell alerts-table__cell--question\">{{ ::row.start_date | date:\'short\' }}</td><td class=\"alerts-table__cell alerts-table__cell--question\">{{ ::row.end_date | date:\'short\' }}</td><td class=\"alerts-table__cell alerts-table__cell--actions\"><a ui-sref=\"admin.alerts.edit({id: row.id})\" class=\"alerts-table__action alerts-table__action--edit\"><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=\"alerts-table__action alerts-table__action--delete\" confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this alert and it\'s content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteAlert(row) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table></div>");
$templateCache.put("app/states/admin/groups/create/create.html","<group-form group=vm.group staff=vm.staff heading=\"Create Group\"></group-form>");
$templateCache.put("app/states/admin/groups/edit/edit.html","<group-form group=vm.group staff=vm.staff heading=\"Edit Group\"></group-form>");
$templateCache.put("app/states/admin/roles/create/create.html","<role-form record=vm.role heading=\"Create Role\"></role-form>");
$templateCache.put("app/states/admin/groups/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Groups</span></div><div class=content-header__aside><a ui-sref=admin.groups.create class=btn-rounded>Add Group</a></div></content-header><div class=admin-groups-list__border><groups-table groups=vm.groups></groups-table></div>");
$templateCache.put("app/states/admin/roles/edit/edit.html","<role-form record=vm.role heading=\"Edit Role\"></role-form>");
$templateCache.put("app/states/admin/roles/list/list.html","<content-header short=true><div class=admin-roles-list__body><span class=content-header__title>Roles</span></div><div class=admin-roles-list__aside><a ui-sref=admin.roles.create class=btn-rounded>Add Role</a></div></content-header><div ng-if=!vm.roles.length><h4>No roles presently exist. Add a new one!</h4></div><div ng-if=vm.roles.length><table st-table=vm.roles class=roles-table><thead><tr><th class=\"roles-table__heading roles-table__heading--padding\"></th><th class=\"roles-table__heading roles-table__heading--sortable\" st-sort=name>Name</th><th class=\"roles-table__heading roles-table__heading--sortable\" st-sort=description>Description</th><th class=\"roles-table__heading roles-table__heading--sortable\" st-sort=permissions>Permissions</th><th class=\"roles-table__heading roles-table__heading--actions\">Action</th></tr></thead><tbody><tr class=roles-table__row ng-repeat=\"row in vm.roles\"><td class=\"roles-table__cell roles-table__cell--padding\"></td><td class=\"roles-table__cell roles-table__cell--name\">{{ ::row.name}}</td><td class=\"roles-table__cell roles-table__cell--description\">{{ ::row.description }}</td><td class=\"roles-table__cell roles-table__cell--permissions\" ng-bind-html=vm.permissionsList(row.permissions)></td><td class=\"roles-table__cell roles-table__cell--actions\"><a ui-sref=\"admin.roles.edit({roleId: row.id})\" class=\"roles-table__action roles-table__action--edit\"><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=\"roles-table__action roles-table__action--delete\" confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this role?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteRole($index) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table></div>");
$templateCache.put("app/states/admin/providers/create/create.html","<provider-form record=vm.provider heading=\"Create Provider\" back-to=admin.providers.list></provider-form>");
$templateCache.put("app/states/admin/providers/edit/edit.html","<provider-form record=vm.provider heading=\"Edit Provider\" back-to=admin.providers.list></provider-form>");
$templateCache.put("app/states/admin/providers/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Providers</span></div><div class=content-header__aside><button class=btn-rounded ng-click=vm.showModal()>Add Provider</button></div></content-header><table ng-if=vm.providers.length class=\"tables tables--bordered\" st-table=vm.providers><thead><tr><th class=\"tables__heading tables__heading--sortable providers-table__name\" st-sort=name>Name</th><th class=\"tables__heading tables__heading--sortable\" st-sort=description>Description</th><th class=\"tables__heading tables__heading--sortable providers-table__type\" st-sort=type>Type</th><th class=\"tables__heading tables__heading--sortable tables__heading--centered providers-table__active\" st-sort=active>Active</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr ng-repeat=\"row in vm.providers track by row.id\"><td class=tables__cell>{{ ::row.name }}</td><td class=tables__cell>{{ ::row.description }}</td><td class=tables__cell>{{ ::row.type }}</td><td class=\"tables__cell tables__cell--centered\"><img ng-if=row.active src=/images/ic_required.png alt=Active title=Active></td><td class=\"tables__cell tables__cell--actions\"><img ng-click=vm.edit(row) class=tables__action src=/images/ic_edit.png alt=Edit></td></tr></tbody></table><div ng-if=!vm.providers.length class=\"tables__empty tables--bordered\">No providers have been added. <button class=btn-link ng-click=vm.showModal()>Add one now.</button></div>");
$templateCache.put("app/states/admin/users/create/create.html","<user-form record=vm.user heading=\"Create User\" back-to=admin.users.list></user-form>");
$templateCache.put("app/states/admin/users/edit/edit.html","<user-form record=vm.user heading=\"Edit User\" back-to=admin.users.list></user-form>");
$templateCache.put("app/states/admin/users/list/list.html","<content-header short=true><div class=admin-users-list__body><span class=content-header__title>Users</span></div><div class=admin-users-list__aside><a ui-sref=admin.users.create class=btn-rounded>Add User</a></div></content-header><table st-table=vm.staff class=\"tables tables--bordered\"><thead><tr><th class=\"tables__heading tables__heading--sortable\" st-sort=first_name>Name</th><th class=\"tables__heading tables__heading--sortable\" st-sort=email>Email</th><th class=\"tables__heading tables__heading--sortable\" st-sort=role>Role</th><th class=tables__heading>Action</th></tr></thead><tbody><tr class=tables__row ng-repeat=\"row in vm.staff\"><td class=\"tables__cell tables__cell--name\">{{ ::row.first_name}} {{ ::row.last_name}}</td><td class=\"tables__cell tables__cell--email\">{{ ::row.email }}</td><td class=\"tables__cell tables__cell--role\">{{ ::row.role }}</td><td class=\"tables__cell tables__cell--actions\"><a ui-sref=\"admin.users.edit({id: row.id})\" class=tables__action><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=\"tables__action tables__action--delete\" confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this user?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteUser($index) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table>");
$templateCache.put("app/states/manage/cms/create/create.html","<content-page-form content-page-record=vm.contentPageRecord heading=\"Create Content Page\" home=vm.home home-params=vm.homeParams></content-page-form>");
$templateCache.put("app/states/manage/cms/edit/edit.html","<content-page-form content-page-record=vm.contentPageRecord heading=\"Edit Content Page\" home=vm.home home-params=vm.homeParams></content-page-form>");
$templateCache.put("app/states/manage/cms/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Content Pages</span></div><div class=content-header__aside><a ui-sref=manage.cms.create class=btn-rounded>Add Content Page</a></div></content-header><table ng-if=\"1 <= vm.pages.length\" st-table=vm.pages class=\"tables tables--bordered\"><thead><tr><th class=tables__heading>Title</th><th class=\"tables__heading tables__heading--centered\">Created</th><th class=\"tables__heading tables__heading--centered\">Updated</th><th class=\"tables__heading tables__heading--actions\">Action</th></tr></thead><tbody><tr class=content-pages-table__row ng-repeat=\"row in vm.pages\"><td class=tables__cell>{{ ::row.title }}</td><td class=\"tables__cell tables__cell--centered\">{{ ::row.created_at | date:\'short\' }}</td><td class=\"tables__cell tables__cell--centered\">{{ ::row.updated_at | date:\'short\' }}</td><td class=\"tables__cell tables__cell--actions\"><a ui-sref=\"manage.cms.edit({id: row.id})\" class=tables__action><img src=/images/ic_edit.png alt=Edit></a> <a href=# class=tables__action confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to remove this content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteContentPage(row) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table><div ng-if=\"0 === vm.pages.length\" class=content-page__empty>No page content at this time.</div>");
$templateCache.put("app/states/manage/motd/edit/edit.html","<form name=vm.form class=form-horizontal role=form novalidate autocomplete=off ng-submit=vm.onSubmit() ng-class=\"{\'show-errors\': vm.showErrors()}\"><content-header short=true><div><span class=\"content-header__title motd-form__title\" ng-bind=::vm.title></span> <span class=motd-form__title-error ng-if=vm.hasErrors()>Please complete required fields in red</span></div></content-header><div class=row><div class=motd-form__body><div class=motd-field><div class=motd-field__aside><label class=content-page-field__label id=content-label>Content</label></div><div class=motd-field__body ng-class=\"{\'has-error\': vm.hasErrors(\'body\')}\"><textarea id=content-page-body ng-model=vm.motd.message name=body class=\"content-page-field__input field__input--textarea field__input--monospaced\" placeholder=\"Specify message of the day here.\" rows=10 aria-labelledby=content-label required></textarea><div class=content-page-field__feedback ng-messages=vm.form.body.$error><div ng-message=required>A page body is required.</div></div></div></div><div class=motd-field><div class=motd-field__aside><label class=motd-field__label>Preview</label></div><div class=motd-field__body><div class=motd-field__body--markdown marked=vm.motd.message></div></div></div></div></div><div class=row><div class=col-sm-7><div class=\"col-sm-offset-3 col-sm-9\"><button type=submit class=\"btn-rounded motd-form__submit\" ng-disabled=vm.hasErrors()>Save</button> <button type=button class=\"btn btn-link motd-form__cancel\" confirmation confirmation-if=vm.form.$dirty confirmation-message=\"You have unsaved changes. Abandon them and leave the page?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Leave\" confirmation-on-ok=vm.backToDash() confirmation-show-cancel=false>Cancel</button></div></div></div></form>");
$templateCache.put("app/states/manage/product-categories/create/create.html","<product-category-form record=vm.productCategory heading=\"Add Product Category\" back-to=^></product-category-form>");
$templateCache.put("app/states/manage/product-categories/edit/edit.html","<product-category-form record=vm.productCategory heading=\"Edit Product Category\" back-to=^></product-category-form>");
$templateCache.put("app/states/manage/product-categories/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Product Categories</span></div><div class=content-header__aside><a ui-sref=manage.product-categories.create class=btn-rounded>Add Product Category</a></div></content-header><div class=manage-product-categories-list__border><product-categories-table product-categories=vm.productCategories></product-categories-table></div>");
$templateCache.put("app/states/manage/products/create/create.html","<product-form record=vm.product back-to=manage.products.list options=vm.options heading=\"Add A Product\" sub-heading=\"{{ ::vm.subHeading }}\"></product-form>");
$templateCache.put("app/states/manage/products/edit/edit.html","<product-form record=vm.product back-to=manage.products.list options=vm.options heading=\"Edit Product\" sub-heading=\"{{ ::vm.subHeading }}\"></product-form>");
$templateCache.put("app/states/manage/products/list/list.html","<content-header short=true><div class=manage-products-list__body><span class=content-header__title>All Products</span></div><div class=manage-products-list__aside><button class=btn-rounded ng-click=vm.showModal()>Add Product</button></div></content-header><div class=manage-products-list__border><products-table products=vm.products product-types=vm.productTypes></products-table></div>");
$templateCache.put("app/states/manage/project-questions/create/create.html","<project-question-form record=vm.projectQuestion heading=\"Add Project Question\" back-to=^></project-question-form>");
$templateCache.put("app/states/manage/project-questions/edit/edit.html","<project-question-form record=vm.projectQuestion heading=\"Edit Project Question\" back-to=^></project-question-form>");
$templateCache.put("app/states/manage/project-questions/list/list.html","<content-header short=true><div class=manage-project-questions-list__body><span class=content-header__title>Project Questions</span></div><div class=manage-project-questions-list__aside><a ui-sref=manage.project-questions.create class=btn-rounded>Add Question</a></div></content-header><div class=row><div class=col-sm-12><table class=project-questions-table><thead><tr><th class=\"project-questions-table__heading project-questions-table__heading--order\">Order</th><th class=\"project-questions-table__heading project-questions-table__heading--question\">Question</th><th class=\"project-questions-table__heading project-questions-table__heading--required\">Required</th><th class=\"project-questions-table__heading project-questions-table__heading--actions\">Action</th></tr></thead><tbody ui-sortable=vm.sortableOptions ng-model=vm.projectQuestions><tr class=project-questions-table__row ng-repeat=\"row in vm.projectQuestions track by row.id\"><td class=\"project-questions-table__cell project-questions-table__cell--order\">{{ $index+1 }}</td><td class=\"project-questions-table__cell project-questions-table__cell--question\">{{ ::row.question }}</td><td class=\"project-questions-table__cell project-questions-table__cell--required\"><img ng-if=::row.required class=project-questions-table__required src=/images/ic_required.png alt=Required title=\"Question is required\"></td><td class=\"project-questions-table__cell project-questions-table__cell--actions\"><a ui-sref=\"manage.project-questions.edit({projectQuestionId: row.id})\" class=\"project-questions-table__action project-questions-table__action--edit\" title=Edit><img src=/images/ic_edit.png alt=Edit></a> <img class=\"project-questions-table__action project-questions-table__action--sort project-questions-table__handle\" src=/images/ic_sort.png title=Sort alt=Sort> <a href=# class=\"project-questions-table__action project-questions-table__action--delete\" title=Delete confirmation confirmation-position=left-center confirmation-message=\"Are you sure you want to delete this question and it\'s content?\" confirmation-ok-style=danger confirmation-ok-text=\"Yes, Delete It\" confirmation-on-ok=vm.deleteQuestion($index) confirmation-show-cancel=false><img src=/images/ic_deletequestion.png alt=Delete></a></td></tr></tbody></table></div></div>");
$templateCache.put("app/states/manage/wizard-questions/create/create.html","<wizard-question-form question=vm.question></wizard-question-form>");
$templateCache.put("app/states/manage/wizard-questions/edit/edit.html","<wizard-question-form question=vm.question heading=\"Edit Wizard Question\"></wizard-question-form>");
$templateCache.put("app/states/manage/wizard-questions/list/list.html","<content-header short=true><div class=content-header__body><span class=content-header__title>Wizard Questions</span></div><div class=content-header__aside><a ui-sref=manage.wizard-questions.create class=btn-rounded>Add Question</a></div></content-header><div class=manage-wizard-list__border><wizard-questions-table questions=vm.questions></wizard-questions-table></div>");
$templateCache.put("app/states/projects/details/alerts/edit/edit.html","<alert-form alert-record=vm.alertRecord staff-id={{vm.staffId}} home=vm.home home-params=vm.homeParams heading=\"Edit Project Alert\" alertable-type={{vm.alertableType}} alertable-id={{vm.alertableId}}></alert-form>");
$templateCache.put("app/states/projects/details/alerts/create/create.html","<alert-form alert-record=vm.alertRecord staff-id={{vm.staffId}} home=vm.home home-params=vm.homeParams heading=\"Create Project Alert\" alertable-type={{vm.alertableType}} alertable-id={{vm.alertableId}}></alert-form>");}]);