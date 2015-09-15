/* jshint -W117, -W030 */
describe('404', function() {
  beforeEach(function() {
    module('app.states');
  });

  describe('route', function() {
    var views = {
      four0four: 'app/states/errors/four0four/four0four.html'
    };

    beforeEach(function() {
      bard.inject('$location', '$rootScope', '$state', '$templateCache');
    });

    it('should map /404 route to 404 View template', function() {
      expect($state.get('errors.four0four').templateUrl).to.equal(views.four0four);
    });

    it('should work with $state.go', function() {
      $state.go('errors.four0four');
      $rootScope.$apply();
      expect($state.is('errors.four0four')).to.equal(true);
    });

    it('should route /invalid to the otherwise (404) route', function() {
      $location.path('/invalid');
      $rootScope.$apply();
      expect($state.current.templateUrl).to.equal(views.four0four);
    });
  });
});
