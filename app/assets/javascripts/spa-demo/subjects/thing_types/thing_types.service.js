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
  // ThingTypeFactory.prototype.thingTypeClicked = function(index){
  //     var result = [];
  //     console.log("Thing Type Clicked: " + index);

  //     angular.forEach(vm.thingsList, function(ti) {
  //       if(ti.thing_type_id === index) {
  //         result.push(ti);
  //         console.log("Add this Thing: ", ti);
  //       }
  //     });

  //     console.log("ThingTypeClickedResult: ", result);
  //     return result;
  //   }
})();