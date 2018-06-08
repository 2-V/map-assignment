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
                                          "spa-demo.subjects.thingTypesMap",
                                          "spa-demo.config.APP_CONFIG"];
  function ThingTypesMapController($scope, $q, $element, 
                                        currentOrigin, myLocation, Map, Thing, ThingType, thingTypesMap,
                                        APP_CONFIG) {
    var vm=this;
    vm.things = Thing.query;
    vm.filter = [];

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
      $scope.$watch(
        function(){ return thingTypesMap.getThings(); }, 
        function(things) { 
          vm.things = things; 
          console.log("DisplaySubjects: " + vm.things);
          displaySubjects(); 
        });
      $scope.$watch(
        function(){ return thingTypesMap.showThing()},
        function(index) {
          console.log("things: ", vm.things);
          console.log("thingShow: ", vm.things[index]);
          displaySubjects(index);
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

    function displaySubjects(index){
      
      if (!vm.map) { return; }
      vm.map.clearMarkers();
      vm.map.displayOriginMarker(vm.originInfoWindow(vm.location));
      
        console.log("DisplaySubject: ", vm.things[index]);
        if (index){
          displaySubject(vm.things[index]);
        }
        

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
    if (this.map && this.location) {
      this.map.center({ 
        center: this.location.position
      });
      this.map.displayOriginMarker(this.originInfoWindow(this.location));
    }
  }

  ThingTypesMapController.prototype.setActiveMarker = function(thing_id, image_id) {
    //...
  }

  ThingTypesMapController.prototype.originInfoWindow = function(location) {
    //...
  }
  ThingTypesMapController.prototype.thingInfoWindow = function(ti) {
    console.log("thingInfo", ti);
    var html ="<div class='thing-marker-info'><div>";
      html += "<span class='id ti_id'>"+ ti.id+"</span>";
      html += "<span class='id thing_id'>"+ ti.thing_id+"</span>";
      html += "<span class='id image_id'>"+ ti.image_id+"</span>";
      html += "<span class='thing-name'>"+ ti.thing_name + "</span>";
      if (ti.image_caption) {
        html += "<span class='image-caption'> ("+ ti.image_caption + ")</span>";      
      }
      if (ti.distance) {
        html += "<span class='distance'> ("+ Number(ti.distance).toFixed(1) +" mi)</span>";
      }
      html += "</div><img src='"+ ti.image_content_url+"?width=200'>";
      html += "</div>";
    return html;
  }
  ThingTypesMapController.prototype.imageInfoWindow = function(ti) {
    //...
  }


})();