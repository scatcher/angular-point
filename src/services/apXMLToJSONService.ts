/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    export class XMLToJSONService {
        static $inject = ['$injector'];

        constructor(private $injector: ng.auto.IInjectorService) {

        }

        /**
         * @ngdoc function
         * @name apXMLToJSONService.filterXMLNodeService
         * @methodOf apXMLToJSONService
         * @param {JQuery|Object} xmlObject Object to parse, can either be a jQuery object or an xml response.
         * @param {string} name Name of node we're looking for.
         * @description
         * This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
         * http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
         * for performance details.
         * @returns {JQuery} Object with jQuery values.
         */
        filterNodes(xmlObject: JQuery | Object, name: string): JQuery {
            //Convert to jQuery object if not already
            var jQueryObject: JQuery = xmlObject instanceof jQuery ? xmlObject : $(xmlObject);

            return jQueryObject.find('*').filter(function() {
                return this.nodeName === name;
            });
        }

        /**
         * @ngdoc function
         * @name apXMLToJSONService.parse
         * @methodOf apXMLToJSONService
         * @param {JQuery|XMLDocument} xmlObject Object to parse, can either be a jQuery object or an xml response.
         * @param {string} name Name of node we're looking for.
         * @description
         * This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
         * http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
         * for performance details.
         * @returns {JQuery} Object with jQuery values.
         */
        parse(xmlNodeSet: JQuery, options?: IParseOptions): Object[]{
            //Need to use injector because apDecode service also relies on this service so we'd otherwise have a circular dependency.
            var apDecodeService = this.$injector.get<DecodeService>('apDecodeService');
            var defaults = {
                includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
                mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
                removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
                sparse: false // If true, empty ("") values will not be returned
            };

            var opts: IParseOptions = _.assign({}, defaults, options);

            var jsonObjectArray = [];

            _.each(xmlNodeSet, (node: JQuery) => {
                var row = {};
                var rowAttrs = node.attributes;

                if (!opts.sparse) {
                    // Bring back all mapped columns, even those with no value
                    _.each(opts.mapping, (column) => row[column.mappedName] = '');
                }

                _.each(rowAttrs, (rowAttribute) => {
                    var attributeName = rowAttribute.name;
                    var columnMapping = opts.mapping[attributeName];
                    var objectName = typeof columnMapping !== "undefined" ? columnMapping.mappedName : opts.removeOws ? attributeName.split("ows_")[1] : attributeName;
                    var objectType = typeof columnMapping !== "undefined" ? columnMapping.objectType : undefined;
                    if (opts.includeAllAttrs || columnMapping !== undefined) {
                        row[objectName] = apDecodeService.parseStringValue(rowAttribute.value, objectType);
                    }
                });

                // Push this item into the JSON Object
                jsonObjectArray.push(row);
            });

            // Return the JSON object
            return jsonObjectArray;

        }
    }

    interface IParseOptions {
        includeAllAttrs?: boolean;
        mapping?: Object;
        removeOws?: boolean;
        sparse?: boolean;
    }

    /**
     * @ngdoc service
     * @name apXMLToJSONService
     * @description
     * This function converts an XML node set into an array of JS objects.
     * This is essentially Marc Anderson's [SPServices](http://spservices.codeplex.com/) SPXmlTOJson function wrapped in
     * an Angular service to make it more modular and allow for testing.
     *
     */
    angular.module('angularPoint')
        .service('apXMLToJSONService', XMLToJSONService);


}
