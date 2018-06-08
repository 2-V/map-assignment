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
    service.newVersion = 0;
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
    if (this.thingIdx){
      return this.things.length > 0 ? this.filter : null;  
      this.version = this.newVersion;
    } else { return null;}
    
  }
  ThingTypesMap.prototype.setCurrentThingType = function(index) {

      this.thingIdx=index;
      this.newVersion += 1;

    console.log("setCurrentThing", this.thingIdx);
    if (this.version < this.newVersion){
      this.getCurrentThing();
      this.version = this.newVersion;
      this.getCurrentThing();
      return this.thingIdx;
    } else { return null;}
    }
  ThingTypesMap.prototype.showThing = function(index) {
    return this.things.length > 0 ? this.things[index] : null;
  }



  })();
