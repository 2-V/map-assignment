(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ThingTypesAuthz", ThingTypesAuthzFactory);

  ThingTypesAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                "spa-demo.authz.BasePolicy"];
  function ThingTypesAuthzFactory(Authz, BasePolicy) {
    function ThingTypesAuthz() {
      BasePolicy.call(this, "ThingType");
    }
      //start with base class prototype definitions
    ThingTypesAuthz.prototype = Object.create(BasePolicy.prototype);
    ThingTypesAuthz.constructor = ThingTypesAuthz;


      //override and add additional methods
    ThingTypesAuthz.prototype.canQuery=function() {
      //console.log("ThingTypesAuthz.canQuery");
      return Authz.isAuthenticated();
    };

      //add custom definitions
    ThingTypesAuthz.prototype.canAddImage=function(thingType) {
        return Authz.isMember(thingType);
    };
    ThingTypesAuthz.prototype.canUpdateImage=function(thingType) {
        return Authz.isOrganizer(thingType)
    };
    ThingTypesAuthz.prototype.canRemoveImage=function(thingType) {
        return Authz.isOrganizer(thingType) || Authz.isAdmin();
    };
    ThingTypesAuthz.prototype.canUpdateThingTypeTypes=function(thingType) {
        return Authz.isOrganizer(thingType);
    };
    
    return new ThingTypesAuthz();
  }
})();