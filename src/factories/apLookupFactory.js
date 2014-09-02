'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apLookupFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
    .factory('apLookupFactory', function (_, $q, apUtilityService) {


        /**
         * @ngdoc function
         * @name Lookup
         * @description
         * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
         * to create an async request for the entity being referenced by the lookup
         * @param {string} s String to split into lookupValue and lookupId
         * @param {object} options Contains a reference to the parent list item and the property name.
         * @param {object} options.entity Reference to parent list item.
         * @param {object} options.propertyName Key on list item object.
         * @constructor
         */
        function Lookup(s, options) {
            var lookup = this;
            var thisLookup = new apUtilityService.SplitIndex(s);
            lookup.lookupId = thisLookup.id;
            lookup.lookupValue = thisLookup.value;
            //TODO Check to see if there's a better way to handle this besides adding a property to the lookup obj
            //lookup._props = function () {
            //    return options;
            //};
        }

        //Todo Look to see if getting this working again has any real value
        //Lookup.prototype = {
        //    getEntity: getEntity,
        //    getProperty: getProperty
        //};

        /**
         * @ngdoc function
         * @name Lookup.getEntity
         * @methodOf Lookup
         * @description
         * Allows us to create a promise that will resolve with the entity referenced in the lookup whenever that list
         * item is registered.
         * @example
         * <pre>
         * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
         *
         * //To get the location entity
         * project.location.getEntity().then(function(entity) {
         *     //Resolves with the full location entity once it's registered in the cache
         *
         *    });
         * </pre>
         * @returns {promise} Resolves with the object the lookup is referencing.
         */
        function getEntity() {
            var self = this;
            var props = self._props();

            if (!props.getEntity) {
                var query = props.getQuery();
                var listItem = query.searchLocalCache(props.entity.id);

                /** Create a new deferred object if this is the first run */
                props.getEntity = $q.defer();
                listItem.getLookupReference(props.propertyName, self.lookupId)
                    .then(function (entity) {
                        props.getEntity.resolve(entity);
                    })
            }
            return props.getEntity.promise;
        }

        /**
         * @ngdoc function
         * @name Lookup.getProperty
         * @methodOf Lookup
         * @description
         * Returns a promise which resolves with the value of a property in the referenced object.
         * @param {string} propertyPath The dot separated propertyPath.
         * @example
         * <pre>
         * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
         *
         * //To get the location.city
         * project.location.getProperty('city').then(function(city) {
         *    //Resolves with the city property from the referenced location entity
         *
         *    });
         * </pre>
         * @returns {promise} Resolves with the value, or undefined if it doesn't exists.
         */
        function getProperty(propertyPath) {
            var self = this;
            var deferred = $q.defer();
            self.getEntity().then(function (entity) {
                deferred.resolve(_.deepGetOwnValue(entity, propertyPath));
            });
            return deferred.promise;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apLookupFactory:create
         * @methodOf angularPoint.apLookupFactory
         * @description
         * Instantiates and returns a new Lookup field.
         */
        var create = function (s, options) {
            return new Lookup(s, options);
        };

        return {
            create: create,
            Lookup: Lookup
        }
    });