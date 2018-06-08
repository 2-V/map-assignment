(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdThingTypesMap", {
      template: "<div id='map'></div>",
      controller: ThingTypesMapController,
      bindings: {
        zoom: "@"
      }
    });

  ThingTypesMapController.$inject = ["$scope", "$q", "$element",
                                          "spa-demo.geoloc.currentOrigin",
                                          "spa-demo.geoloc.myLocation",
                                          "spa-demo.geoloc.Map",
                                          "spa-demo.subjects.Thing",
                                          "spa-demo.subjects.ThingType",
                                          "spa-demo.config.APP_CONFIG"];
  function ThingTypesMapController($scope, $q, $element, 
                                        currentOrigin, myLocation, Map, Thing, ThingType,
                                        APP_CONFIG) {
    var vm=this;

    vm.$onInit = function() {
      console.log("ThingTypesMapController",$scope);
    }
    vm.$postLink = function() {
      var element = $element.find('div')[0];
      getLocation().then(
        function(location){
          vm.location = location;
          initializeMap(element, location.position);
        });
      
    }

    return;
    //////////////
    function getLocation() {
      var deferred = $q.defer();

      //use current address if set
      var location = currentOrigin.getLocation();
      if (!location) {
        //try my location next
        myLocation.getCurrentLocation().then(
          function(location){
            deferred.resolve(location);
          },
          function(){
            deferred.resolve({ position: APP_CONFIG.default_position});
          });
      } else {
        deferred.resolve(location);
      }

      return deferred.promise;
    }

    function initializeMap(element, position) {
      vm.map = new Map(element, {
        center: position,        
        zoom: vm.zoom || 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      displaySubjects();
    }

    function displaySubjects(){
      vm.map.clearMarkers();
      vm.map.displayOriginMarker(vm.originInfoWindow(vm.location));

      angular.forEach(vm.things, function(ti){
        displaySubject(ti);
      });
    }

    function displaySubject(ti) {
      var markerOptions = {
        position: {
          lng: ti.position.lng,
          lat: ti.position.lat
        }
      };
      if (ti.thing_id && ti.priority===0) {
        markerOptions.title = ti.thing_name;
        markerOptions.icon = APP_CONFIG.thing_marker;
        markerOptions.content = vm.thingInfoWindow(ti);
      } else if (ti.thing_id) {
        markerOptions.title = ti.thing_name;
        markerOptions.icon = APP_CONFIG.secondary_marker;
        markerOptions.content = vm.thingInfoWindow(ti);
      } else {
        markerOptions.title = ti.image_caption;
        markerOptions.icon = APP_CONFIG.orphan_marker;
        markerOptions.content = vm.imageInfoWindow(ti);
      }
      vm.map.displayMarker(markerOptions);  
    }
  }

  ThingTypesMapController.prototype.updateOrigin = function() {
    //...
  }

  ThingTypesMapController.prototype.setActiveMarker = function(thing_id, image_id) {
    //...
  }

  ThingTypesMapController.prototype.originInfoWindow = function(location) {
    //...
  }
  ThingTypesMapController.prototype.thingInfoWindow = function(ti) {
    //...
  }
  ThingTypesMapController.prototype.imageInfoWindow = function(ti) {
    //...
  }


})();