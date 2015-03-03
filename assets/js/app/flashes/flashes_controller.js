'use strict';

/**@ngInject*/
function FlashesController(FlashesService) {
  this.flashes = FlashesService.flashes;

  this.closeFlash = function(index) {
    FlashesService.remove(index);
  };
}

module.exports = FlashesController;
