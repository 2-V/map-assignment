(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdThingTypeSelector", {
      templateUrl: thingTypeSelectorTemplateUrl,
      controller: ThingTypeSelectorController
    })
    .component("sdThingTypeList", {
      templateUrl: thingTypeListTemplateUrl,
      controller: ThingTypeListController
    });

  thingTypeSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingTypeSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_type_selector_html;
  }   
  thingTypeListTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingTypeListTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_type_list_html;
  }     

  ThingTypeSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.subjects.ThingType",
                                     "spa-demo.subjects.Thing"];
  function ThingTypeSelectorController($scope, $stateParams, ThingType, Thing) {
    var vm=this;
    vm.filter = "";
    vm.items = ThingType.query(); 
    vm.thingsList = Thing.query();
    vm.thingTypeClicked = thingTypeClicked;

    vm.$onInit = function() {
      console.log("ThingTypeSelectorController",$scope);
    }
    return;
    //////////////
    function thingTypeClicked(index){
      var result = [];
      console.log("Thing Type Clicked: " + index);

      angular.forEach(vm.thingsList, function(ti) {
        if(ti.thing_type_id === index) {
          result.push(ti);
          console.log("Add this Thing: ", ti);
        }
      });

      console.log("ThingTypeClickedResult: ", result);
      return result;
    }
  }
  ThingTypeListController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.subjects.ThingType",
                                     "spa-demo.subjects.Thing",
                                     "spa-demo.subjects.currentSubjects"];
  function ThingTypeListController($scope, $stateParams, ThingType, Thing, currentSubjects) {
    var vm=this;


    vm.$onInit = function() {
      console.log("CurrentThingTypeListController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentSubjects.getThings(); }, 
        function(things){
          vm.things = things;
        }
      );
    }
    return;
  }
  
})();
