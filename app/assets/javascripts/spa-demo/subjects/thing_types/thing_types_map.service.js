(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .service("spa-demo.subjects.thingTypesMap", ThingTypesMap);

  ThingTypesMap.$inject = ["$rootScope","$q",
                             "$resource",
                             "spa-demo.geoloc.currentOrigin",
                             "spa-demo.config.APP_CONFIG"];

  function ThingTypesMap($rootScope, $q, $resource, currentOrigin, APP_CONFIG) {
    var subjectsResource = $resource(APP_CONFIG.server_url + "/api/things/:id",
      {id: '@id'}
    );
    var service = this;

    //refresh();
    $rootScope.$watch(function(){ return currentOrigin.getVersion(); });
    return;
    ////////////////


    
  }



  })();
