(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ThingType", ThingTypeFactory);

  ThingTypeFactory.$inject = ["$resource","spa-demo.config.APP_CONFIG"];
  function ThingTypeFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/thing_types/:id",
        { id: '@id'},
        { update: {method:"PUT"} }
      );
    return service;
  }
})();