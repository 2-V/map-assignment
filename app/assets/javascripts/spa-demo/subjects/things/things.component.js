(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdThingEditor", {
      templateUrl: thingEditorTemplateUrl,
      controller: ThingEditorController,
      bindings: {
        authz: "<"
      },
      require: {
        thingsAuthz: "^sdThingsAuthz"
      }      
    })
    .component("sdThingSelector", {
      templateUrl: thingSelectorTemplateUrl,
      controller: ThingSelectorController,
      bindings: {
        authz: "<"
      }
    })
    .component("sdThingSearch", {
          templateUrl: thingSearchTemplateUrl,
          controller: ThingSearchController,
          bindings: {
              authz: "<"
          },
    })
    .component("sdCurrentThingsMap", {
        templateUrl: currentThingsMapTemplateUrl,
        //template: "<div id='map'></div>",
        controller: CurrentThingsMapController,
        bindings: {
            zoom: "@"
        }
    });


  thingEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_editor_html;
  }    
  thingSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_selector_html;
  }
    thingSearchTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingSearchTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.thing_search_html;
    }
    currentThingsMapTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function currentThingsMapTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.currentThingsMap_html;
    }



    ThingEditorController.$inject = ["$scope","$q",
                                   "$state","$stateParams",
                                   "spa-demo.authz.Authz",
                                   "spa-demo.subjects.Thing",
                                   "spa-demo.subjects.ThingImage"];
  function ThingEditorController($scope, $q, $state, $stateParams, 
                                 Authz, Thing, ThingImage) {
    var vm=this;
    vm.create = create;
    vm.clear  = clear;
    vm.update  = update;
    vm.remove  = remove;
    vm.haveDirtyLinks = haveDirtyLinks;
    vm.updateImageLinks = updateImageLinks;

    vm.$onInit = function() {
      //console.log("ThingEditorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                    function(){ 
                      if ($stateParams.id) {
                        reload($stateParams.id); 
                      } else {
                        newResource();
                      }
                    });
    }

    return;
    //////////////
    function newResource() {
      vm.item = new Thing();
      vm.thingsAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(thingId) {
      var itemId = thingId ? thingId : vm.item.id;      
      //console.log("re/loading thing", itemId);
      vm.images = ThingImage.query({thing_id:itemId});
      vm.item = Thing.get({id:itemId});
      vm.thingsAuthz.newItem(vm.item);
      vm.images.$promise.then(
        function(){
          angular.forEach(vm.images, function(ti){
            ti.originalPriority = ti.priority;            
          });                     
        });
      $q.all([vm.item.$promise,vm.images.$promise]).catch(handleError);
    }
    function haveDirtyLinks() {
      for (var i=0; vm.images && i<vm.images.length; i++) {
        var ti=vm.images[i];
        if (ti.toRemove || ti.originalPriority != ti.priority) {
          return true;
        }        
      }
      return false;
    }    

    function create() {      
      vm.item.errors = null;
      vm.item.$save().then(
        function(){
          //console.log("thing created", vm.item);
          $state.go(".",{id:vm.item.id});
        },
        handleError);
    }

    function clear() {
      newResource();
      $state.go(".",{id: null});    
    }

    function update() {      
      vm.item.errors = null;
      var update=vm.item.$update();
      updateImageLinks(update);
    }
    function updateImageLinks(promise) {
      //console.log("updating links to images");
      var promises = [];
      if (promise) { promises.push(promise); }
      angular.forEach(vm.images, function(ti){
        if (ti.toRemove) {
          promises.push(ti.$remove());
        } else if (ti.originalPriority != ti.priority) {          
          promises.push(ti.$update());
        }
      });

      //console.log("waiting for promises", promises);
      $q.all(promises).then(
        function(response){
          //console.log("promise.all response", response); 
          //update button will be disabled when not $dirty
          $scope.thingform.$setPristine();
          reload(); 
        }, 
        handleError);    
    }

    function remove() {      
      vm.item.$remove().then(
        function(){
          //console.log("thing.removed", vm.item);
          clear();
        },
        handleError);
    }

    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.item["errors"]=response.data.errors;          
      } 
      if (!vm.item.errors) {
        vm.item["errors"]={}
        vm.item["errors"]["full_messages"]=[response]; 
      }      
      $scope.thingform.$setPristine();
    }    
  }

  ThingSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.authz.Authz",
                                     "spa-demo.subjects.Thing"];
  function ThingSelectorController($scope, $stateParams, Authz, Thing) {
    var vm=this;

    vm.$onInit = function() {
      //console.log("ThingSelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                    function(){ 
                      if (!$stateParams.id) {
                        vm.items = Thing.query();        
                      }
                    });
    }
    return;
    //////////////
  }

    ThingSearchController.$inject = ["$scope",
        "$stateParams",
        "spa-demo.authz.Authz",
        "spa-demo.subjects.thingsearch",
        "spa-demo.geoloc.geocoder"];
    function ThingSearchController($scope, $stateParams, Authz,thingsearch,geocoder) {
        var vm=this;
        vm.typchoice=["Hotel","Transport","Tour","Museum"];
        vm.typ=vm.typchoice[0];

        vm.thingClicked = thingClicked;
        vm.isCurrentThing = thingsearch.isCurrentThingId;

        vm.search=search;

        vm.$onInit = function() {
            console.log("ThingSearchController-OnInit", $scope);

        }

        vm.$postLink = function() {
            $scope.$watch(
                function() { return thingsearch.getThings(); },
                function(things) { vm.things = things; }
            );
        }


        return;


        function thingClicked(thingId) {
            console.log("ThingSearchController-thingClicked",thingId);
            thingsearch.setCurrentThing(thingId);
        }


        function search(){
            console.log ("search",vm.typ);
            vm.items=thingsearch.search(vm.typ);
        }
    }



    CurrentThingsMapController.$inject = ["$scope", "$q", "$element",
        "spa-demo.geoloc.currentOrigin",
        "spa-demo.geoloc.myLocation",
        "spa-demo.geoloc.Map",
        "spa-demo.subjects.thingsearch",
        "spa-demo.config.APP_CONFIG"];
    function CurrentThingsMapController($scope, $q, $element,
                                          currentOrigin, myLocation, Map,thingsearch,
                                          APP_CONFIG) {
        var vm=this;

        vm.$onInit = function() {
            console.log("CurrentThingsMapController",$scope);
        }
        vm.$postLink = function() {
            var element = $element.find('div')[0];
            getLocation().then(
                function(location){
                    vm.location = location;
                    initializeMap(element, location.position);
                });

            $scope.$watch(
                function(){ return thingsearch.getRelatedImages(); },
                function(images) {
                    vm.images = images;
                    console.log("List of images Changed",vm.images );
                    displaySubjects();
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
            if (!vm.map) { return; }
            vm.map.clearMarkers();
            vm.map.displayOriginMarker(vm.originInfoWindow(vm.location));

            angular.forEach(vm.images, function(ti){
                if (ti.position.lng && ti.position.lat) {
                    displaySubject(ti);
                }
            });
        }

        function displaySubject(ti) {
            var markerOptions = {
                position: {
                    lng: ti.position.lng,
                    lat: ti.position.lat
                },
                thing_id: ti.thing_id,
                image_id: ti.image_id
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

    CurrentThingsMapController.prototype.updateOrigin = function() {
        if (this.map && this.location) {
            this.map.center({
                center: this.location.position
            });
            this.map.displayOriginMarker(this.originInfoWindow(this.location));
        }
    }

    CurrentThingsMapController.prototype.setActiveMarker = function(thing_id, image_id) {
        if (!this.map) {
            return;
        } else if (!thing_id && !image_id) {
            if (this.map.getCurrentMarker().title!=='origin') {
                this.map.setActiveMarker(null);
            }
        } else {
            var markers=this.map.getMarkers();
            for (var i=0; i<markers.length; i++) {
                var marker=markers[i];
                if (marker.thing_id === thing_id && marker.image_id === image_id) {
                    this.map.setActiveMarker(marker);
                    break;
                }
            }
        }
    }

    CurrentThingsMapController.prototype.originInfoWindow = function(location) {
        console.log("originInfo", location);
        var full_address = location ? location.formatted_address : "";
        var lng = location && location.position ? location.position.lng : "";
        var lat = location && location.position ? location.position.lat : "";
        var html = [
            "<div class='origin'>",
            "<div class='full_address'>"+ full_address + "</div>",
            "<div class='position'>",
            "lng: <span class='lng'>"+ lng +"</span>",
            "lat: <span class='lat'>"+ lat +"</span>",
            "</div>",
            "</div>",
        ].join("\n");

        return html;
    }

    CurrentThingsMapController.prototype.thingInfoWindow = function(ti) {
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

    CurrentThingsMapController.prototype.imageInfoWindow = function(ti) {
        console.log("imageInfo", ti);
        var html ="<div class='image-marker-info'><div>";
        html += "<span class='id image_id'>"+ ti.image_id+"</span>";
        if (ti.image_caption) {
            html += "<span class='image-caption'>"+ ti.image_caption + "</span>";
        }
        if (ti.distance) {
            html += "<span class='distance'> ("+ Number(ti.distance).toFixed(1) +" mi)</span>";
        }
        html += "</div><img src='"+ ti.image_content_url+"?width=200'>";
        html += "</div>";
        return html;
    }



























})();
