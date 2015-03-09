'use strict';

var _ = require('lodash');

/**@ngInject*/
function FlashesService($timeout) {
  var self = this;

  this.flashes = [];

  function timeoutFlash(id) {
    var index = _.findIndex(self.flashes, {id: id});

    if (index >= 0) {
      self.flashes.splice(index, 1);
    }
  }

  this.add = function(flash) {
    if (_.isArray(flash)) {
      return _.each(flash, this.add.bind(this));
    }

    if (_.isString(flash)) {
      flash = {type: 'info', message: flash};
    }

    if ('error' == flash.type) {
      flash.type = 'danger';
    }

    if ('success' == flash.type){
        flash.type = 'success';
    }

    if (flash.timeout) {
      flash.id = _.uniqueId('flash');
      flash.timeout = $timeout(function() {
        timeoutFlash(flash.id);
      }, 10000);
    }

    self.flashes.push(flash);
  };

  this.remove = function(index) {
    var flash = self.flashes[index];

    self.flashes.splice(index, 1);

    if (flash.timeout) {
      $timeout.cancel(flash.timeout);
    }
  };

  this.clear = function() {
    self.flashes.length = 0;
  };
}

module.exports = FlashesService;
