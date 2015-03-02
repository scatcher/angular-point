'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apXMLToJSONService
 * @description
 * This function converts an XML node set into an array of JS objects.
 * This is essentially Marc Anderson's [SPServices](http://spservices.codeplex.com/) SPXmlTOJson function wrapped in
 * an Angular service to make it more modular and allow for testing.
 *
 */
export default function apXMLToJSONService(_, apDecodeService) {

    this.convertToJson = convertToJson;

    function convertToJson(xmlNodeSet, options) {

        var defaults = {
            mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
            includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
            removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
            sparse: false // If true, empty ("") values will not be returned
        };

        var opts = _.extend({}, defaults, options);

        var jsonObject = [];

        _.each(xmlNodeSet, function (node) {
            var row = {};
            var rowAttrs = node.attributes;

            if (!opts.sparse) {
                // Bring back all mapped columns, even those with no value
                _.each(opts.mapping, function (column) {
                    row[column.mappedName] = '';
                });
            }

            _.each(rowAttrs, function (rowAttribute) {
                var attributeName = rowAttribute.name;
                var columnMapping = opts.mapping[attributeName];
                var objectName = typeof columnMapping !== "undefined" ? columnMapping.mappedName : opts.removeOws ? attributeName.split("ows_")[1] : attributeName;
                var objectType = typeof columnMapping !== "undefined" ? columnMapping.objectType : undefined;
                if (opts.includeAllAttrs || columnMapping !== undefined) {
                    row[objectName] = apDecodeService.parseStringValue(rowAttribute.value, objectType);
                }
            });

            // Push this item into the JSON Object
            jsonObject.push(row);
        });

        // Return the JSON object
        return jsonObject;
    }

}
