(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .directive("sdThingTypesAuthz", ThingTypesAuthzDirective);

  ThingTypesAuthzDirective.$inject = [];

  function ThingTypesAuthzDirective() {
    var directive = {
        bindToController: true,
        controller: ThingTypeAuthzController,
        controllerAs: "vm",
        restrict: "A",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
      //console.log("ThingTypesAuthzDirective", scope);
    }
  }

  ThingTypeAuthzController.$inject = ["$scope", 
                                  "spa-demo.subjects.ThingTypesAuthz"];
  function ThingTypeAuthzController($scope, ThingTypesAuthz) {
    var vm = this;
    vm.authz={};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem=newItem;

    activate();
    return;
    ////////////
    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
      ThingTypesAuthz.getAuthorizedUser().then(
        function(user){ authzUserItem(item, user); },
        function(user){ authzUserItem(item, user); });
    }

    function authzUserItem(item, user) {
      //console.log("new Item/Authz", item, user);

      vm.authz.authenticated = ThingTypesAuthz.isAuthenticated();
      vm.authz.canQuery      = ThingTypesAuthz.canQuery();
      vm.authz.canCreate     = ThingTypesAuthz.canCreate();
      if (item && item.$promise) {
        vm.authz.canUpdate      = false;
        vm.authz.canDelete      = false;
        vm.authz.canGetDetails  = false;
        vm.authz.canUpdateImage = false;
        vm.authz.canRemoveImage = false;     
        vm.authz.canUpdateThingTypeTypes = false; 
        item.$promise.then(function(){ checkAccess(item); });
      } else {
        checkAccess(item);
      }      
    }

    function checkAccess(item) {
      vm.authz.canUpdate     = ThingTypesAuthz.canUpdate(item);
      vm.authz.canDelete     = ThingTypesAuthz.canDelete(item);
      vm.authz.canGetDetails = ThingTypesAuthz.canGetDetails(item);
      vm.authz.canUpdateImage = ThingTypesAuthz.canUpdateImage(item);
      vm.authz.canRemoveImage = ThingTypesAuthz.canRemoveImage(item);
      vm.authz.canUpdateThingTypeTypes = ThingTypesAuthz.canUpdateThingTypeTypes(item);      
      //console.log("checkAccess", item, vm.authz);
    }

    function canUpdateItem(item) {
      return ThingTypesAuthz.canUpdate(item);
    }    
  }
})();
