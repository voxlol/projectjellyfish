'use strict';

var _ = require('lodash');

/**@ngInject*/
function FlashesService($timeout) {
  this.flashes = [];
  this.$timeout = $timeout;
}

FlashesService.prototype.add = function(flash) {
  var self = this;

  if (_.isArray(flash)) {
    return _.each(flash, this.add.bind(this));
  }

  if (_.isString(flash)) {
    flash = {type: 'info', message: flash};
  }

  if ('error' == flash.type) {
    flash.type = 'danger';
  }

  if (flash.timeout) {
    flash.id = _.uniqueId('flash');
    flash.timeout = self.$timeout(function() {
      self.timeout(flash.id);
    }, 10000);
  }

  self.flashes.push(flash);
};

FlashesService.prototype.remove = function(index) {
  var self = this,
    flash = self.flashes[index];

  self.flashes.splice(index, 1);

  if (flash.timeout) {
    self.$timeout.cancel(flash.timeout);
  }
};

FlashesService.prototype.timeout = function(id) {
  var self = this,
    index = _.findIndex(self.flashes, {id: id});

  if (index >= 0) {
    self.flashes.splice(index, 1);
  }
};

FlashesService.prototype.clear = function() {
  var self = this;

  self.flashes.length = 0;
};

module.exports = FlashesService;
