(function(){
  "use strict"; 

  angular
  .module("spa-demo.subjects")
  .component("sdThingTypeList", {
      templateUrl: thingTypeListTemplateUrl,
      controller: ThingTypeListController
    });

  thingTypeListTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingTypeListTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_thing_types_html;
  }     
ThingTypeListController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.subjects.thingTypesMap"];
  function ThingTypeListController($scope, $stateParams, thingTypesMap) {
    var vm=this;


    vm.$onInit = function() {
      console.log("CurrentThingTypeListController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return thingTypesMap.getCurrentThing(); }, 
        function(things) { vm.things = things; }
      );
    }   
    return;
    ///////////
    function thingClicked(index){
      
      console.log("Thing Type Clicked: " + index);
      thingTypesMap.showThing(index);
    }
  }
})();