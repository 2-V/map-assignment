(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .service("spa-demo.subjects.thingTypesMap", ThingTypesMap);

  ThingTypesMap.$inject = ["$rootScope","$q", "$filter",
                             "$resource",
                             "spa-demo.geoloc.currentOrigin",
                             "spa-demo.subjects.Thing",
                             "spa-demo.config.APP_CONFIG"];

  function ThingTypesMap($rootScope, $q, $filter, $resource, currentOrigin, Thing, APP_CONFIG) {
    
    var service = this;
    service.version = 0;
    service.things = Thing.query();

    //refresh();
    // $rootScope.$watch(function(){ return currentOrigin.getVersion(); }, refresh);
    return;
    ////////////////
    function refresh() {
      console.log("Refresh");
      // if(!index){
      //   var result = service.things;
      // } else {
      //   var result = [];
      //   angular.forEach(service.things, function(ti){ 
      //     if(ti.thing_type_id === index) {
      //       result.push(ti);
      //     }
      //   });
      // }

      // console.log("GetThingsResult: ", result);
      // service.things = result;
      return;
    } 
  }
  ThingTypesMap.prototype.getThings = function() {
    // console.log("getThingsFired: ", this.things);
    return this.things;
  }
  ThingTypesMap.prototype.getCurrentThing = function() {
    var idx = [this.thingIdx];
    this.filter = this.things.filter(function(itm){
      return idx.indexOf(itm.thing_type_id) > -1;
    });

    console.log("FilteredThings: ", this.filter);
    return this.things.length > 0 ? this.filter : null;
  }
  ThingTypesMap.prototype.setCurrentThingType = function(index) {

      this.thingIdx=index;

    console.log("setCurrentThing", this.thingIdx);
    this.getCurrentThing();
    return this.thingIdx;
  }



  })();
