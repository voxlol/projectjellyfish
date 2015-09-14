/* jshint -W117, -W030 */
describe('Marketplace', function() {
  beforeEach(function() {
    module('app.states', bard.fakeToastr);
    bard.inject('$location', '$rootScope', '$state', '$templateCache');
    bard.inject('$q', 'SessionService', '$httpBackend');
  });

  beforeEach(function() {
    SessionService.create({
      id: 1,
      email: 'foo@bar.com',
      role: 'user'
    });
    $httpBackend.when('GET', /product_categories/).respond([]);
    $httpBackend.when('GET', /products/).respond([]);
  });

  describe('route', function() {
    var views = {
      marketplace: 'app/states/marketplace/marketplace.html'
    };

    it('should work with $state.go', function() {
      $state.go('marketplace');
      $rootScope.$apply();
      expect($state.is('marketplace')).to.equal(true);
    });
  });

  describe('navigation', function() {
    beforeEach(function() {
      bard.inject('navigationHelper', '$rootScope');
    });

    it('should exist in the sidebar', function() {
      expect(navigationHelper.sidebarItems('marketplace')).to.be.defined;
    });
  });

  describe('controller', function() {
    var controller;

    beforeEach(function() {
      bard.inject('$controller', '$log', '$state', '$rootScope');
      controller = $controller($state.get('marketplace').controller);
      $rootScope.$apply();
    });

    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

    describe('after activate', function() {
      it('should have title of Marketplace', function() {
        expect(controller.title).to.equal('Marketplace');
      });

      it('should have logged "Activated Marketplace"', function() {
        expect($log.info.logs).to.match(/Activated Marketplace/);
      });
    });
  });
});
