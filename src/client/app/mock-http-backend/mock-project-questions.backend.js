(function() {
  'use strict';

  angular.module('mock')
    .factory('MockProjectQuestion', MockProjectQuestionFactory)
    .run(mock);

  /** @ngInject */
  function mock($httpBackend, MockHelper, MockProjectQuestion) {
    $httpBackend.whenGET(/\/api\/project_questions\/\d+/).respond(getProjectQuestion);
    $httpBackend.whenGET(/\/api\/project_questions(?:\?.+)?/).respond(getProjectQuestions);
    $httpBackend.whenPOST(/\/api\/project_questions/).respond(postProjectQuestion);
    $httpBackend.whenPUT(/\/api\/project_questions\/\d+/).respond(putProjectQuestion);
    $httpBackend.whenDELETE(/\/api\/project_questions\/\d+/).respond(deleteProjectQuestion);

    function getProjectQuestion(method, url, data) {
      var id = url.match(/\/project_questions\/(\d+)/)[1];

      return [200, MockProjectQuestion.getProjectQuestion(parseInt(id)), {}];
    }

    function getProjectQuestions(method, url, data) {
      var parsedUrl = MockHelper.parseURL(url);
      var limit = parsedUrl.searchParams.limit;

      return [200, MockProjectQuestion.getProjectQuestions(limit), {}];
    }

    function postProjectQuestion(method, url, data) {
      return [201, data, {}];
    }

    function putProjectQuestion(method, url, data) {
      var id = url.match(/\/project_questions\/(\d+)/)[1];

      return [204, '', {}];
    }

    function deleteProjectQuestion(method, url, data) {
      var id = url.match(/\/project_questions\/(\d+)/)[1];

      return [204, '', {}];
    }
  }

  /** @ngInject */
  function MockProjectQuestionFactory(lodash) {
    var service = {
      getProjectQuestion: getProjectQuestion,
      getProjectQuestions: getProjectQuestions
    };

    return service;

    function getProjectQuestion(id) {
      return lodash.find(data(), 'id', id);
    }

    function getProjectQuestions(limit) {
      var list = data();

      return list.slice(0, limit);
    }

    function data() {
      var id = 1;

      return [
        {id: id, load_order: id++, required: true, question: 'Quisque dictum, fusce ac, a vivamus pellentesque?'},
        {id: id, load_order: id++, required: true, question: 'Turpis quam, sed purus?'},
        {id: id, load_order: id++, required: false, question: 'Lorem ipsum dolor sit amet, integer mollis, fames ' +
        'velit orci, in eget aliquam?'},
        {id: id, load_order: id++, required: true, question: 'Dictum massa fermentum, inceptos egestas, nostra amet?'},
        {id: id, load_order: id++, required: false, question: 'Et auctor mauris mauris duis, duis massa feugiat ' +
        'scelerisque quis, ligula condimentum cras risus, curabitur suspendisse metus urna et?'},
        {id: id, load_order: id++, required: false, question: 'Aliquet pharetra, mauris et faucibus, lacinia nulla?'},
        {id: id, load_order: id++, required: false, question: 'Nullam nam congue, wisi volutpat sagittis, ' +
        'tortor nibh?'},
        {id: id, load_order: id++, required: true, question: 'At turpis libero?'},
        {id: id, load_order: id++, required: true, question: 'Id voluptatibus viverra orci velit, nonummy donec in ' +
        'mauris eleifend?'},
        {id: id, load_order: id++, required: true, question: 'Pede wisi sodales eget libero, leo luctus mattis ' +
        'vestibulum, eget turpis ante sit volutpat, curabitur sodales nullam vel condimentum?'},
        {id: id, load_order: id++, required: false, question: 'Nulla risus ultrices, porttitor eros in?'},
        {id: id, load_order: id++, required: true, question: 'Vestibulum ligula amet, vivamus egestas?'},
        {id: id, load_order: id++, required: false, question: 'Felis curae vestibulum vivamus senectus, nec vitae ' +
        'egestas erat?'},
        {id: id, load_order: id++, required: true, question: 'Dui libero euismod arcu, varius est vitae eget ' +
        'mollis, pede sem venenatis habitant tempor?'}
      ];
    }
  }
})();
