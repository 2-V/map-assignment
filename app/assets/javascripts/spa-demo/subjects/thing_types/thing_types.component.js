(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdThingTypeSelector", {
      templateUrl: thingTypeSelectorTemplateUrl,
      controller: ThingTypeSelectorController
    });
    

  thingTypeSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingTypeSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_type_selector_html;
  }   


  ThingTypeSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.subjects.ThingType",
                                     "spa-demo.subjects.Thing",
                                     "spa-demo.subjects.thingTypesMap"];
  function ThingTypeSelectorController($scope, $stateParams, ThingType, Thing, thingTypesMap) {
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
      
      console.log("Thing Type Clicked: " + index);
      thingTypesMap.setCurrentThingType(index);
    }
  }
  
  
})();
