(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .service("spa-demo.subjects.thingsearch", Thingsearch);

    Thingsearch.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

    function Thingsearch($resource, APP_CONFIG) {


        var thingResource = $resource(APP_CONFIG.server_url + "/api/thingsearch",{},{
            query: { cache:false, isArray:true }
        });

        var subjectResource = $resource(APP_CONFIG.server_url + "/api/subjects",{},{
            query: { cache:false, isArray:true }
        });

        console.log("Thingsearch Service");

        var service = this;
        service.things = [];
        service.thingId = null;
        service.typ="Restaurant";

        service.isCurrentThingId = isCurrentThingId;
        service.setCurrentThing = setCurrentThing;
        service.relatedImages =[];

        service.search=search;

        search(service.typ);

        return;
        ////////////////

        //returns things with a specific type
        function search(typ) {
            var params=[];
            params["typ"]=typ;
            var result = thingResource.query(params);

            result.$promise.then(
                function(things){
                    service.things=things;
                    console.log("search service", service);
                });
            return result.$promise;
        }

        function isCurrentThingId(thingId) {
            return service.thingId === thingId;
        }

        function setCurrentThing(thingId) {
            service.thingId = thingId;
            var newRelatedImages = [];
            service.relatedImages = [];
            var params = {};
            params["thing_id"] = thingId;
            console.log("relatedImages query params",params);

            var result = subjectResource.query(params);
            result.$promise.then(
                function(subjects) {
                    newRelatedImages=subjects;
                    service.relatedImages = newRelatedImages;
                    console.log("relatedImages",service.relatedImages);
                });
        }


    }

    Thingsearch.prototype.getThings = function() {
        return this.things;
    }


    Thingsearch.prototype.getRelatedImages = function() {
        return this.relatedImages;
    }


})();


