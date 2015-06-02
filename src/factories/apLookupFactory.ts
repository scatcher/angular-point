/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var $q, apUtilityService;

    export interface ILookup {
        lookupValue: string;
        lookupId: number;
    }

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
    export class Lookup implements ILookup{
        lookupId:number;
        lookupValue:string;

        constructor(s, options) {
            var lookup = this;
            var thisLookup = new apUtilityService.SplitIndex(s);
            lookup.lookupId = thisLookup.id;
            lookup.lookupValue = thisLookup.value || '';
        }
    }


    export class LookupFactory {
        Lookup = Lookup;
        constructor($injector) {
            $q = $injector.get('$q');
            apUtilityService = $injector.get('apUtilityService');
        }

        /**
         * @ngdoc function
         * @name angularPoint.apLookupFactory:create
         * @methodOf angularPoint.apLookupFactory
         * @description
         * Instantiates and returns a new Lookup field.
         */
        create(s, options) {
            return new Lookup(s, options);
        }
    }

    /**
     * @ngdoc function
     * @name angularPoint.apLookupFactory
     * @description
     * Tools to assist with the creation of CAML queries.
     *
     */
    angular.module('angularPoint')
        .service('apLookupFactory', LookupFactory);


}
