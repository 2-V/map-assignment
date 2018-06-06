(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdThingTypeSelector", {
      templateUrl: thingTypeSelectorTemplateUrl,
      controller: ThingTypeSelectorController,
      bindings: {
        authz: "<"
      }
    })
    ;

  thingTypeSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingTypeSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_type_selector_html;
  }    

  ThingTypeSelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.authz.Authz",
                                     "spa-demo.subjects.ThingType"];
  function ThingTypeSelectorController($scope, $stateParams, Authz, ThingType) {
    var vm=this;
    vm.filter = "";

    vm.$onInit = function() {
      console.log("ThingTypeSelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                    function(){ 
                      if (!$stateParams.id) {
                        vm.items = ThingType.query();        
                      }
                    });
    }
    return;
    //////////////
    $scope.filter = {};
  }

})();
