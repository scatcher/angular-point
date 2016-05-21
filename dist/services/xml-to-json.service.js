"use strict";
var decode_service_1 = require('../services/decode.service');
var lodash_1 = require('lodash');
var xmlToJSONService = {
    /**
     * @ngdoc function
     * @name apXMLToJSONService.parse
     * @methodOf apXMLToJSONService
     * @param {Element} xmlNodeSet Object to parse, can either be a jQuery object or an xml response.
     * @param {Object} [options] Optionally override defaults.
     * @returns {Object[]} XML List items converted to JS.
     */
    parse: function (xmlNodeSet, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.includeAllAttrs, includeAllAttrs = _c === void 0 ? true : _c, _d = _b.mapping, mapping = _d === void 0 ? {} : _d, _e = _b.removeOws, removeOws = _e === void 0 ? true : _e, _f = _b.sparse, sparse = _f === void 0 ? false : _f;
        var parsedObjects = [];
        lodash_1.each(xmlNodeSet, function (node) {
            var row = {};
            var rowAttrs = node.attributes;
            if (!sparse) {
                // Bring back all mapped columns, even those with no value
                lodash_1.each(mapping, function (column) { return row[column.mappedName] = ''; });
            }
            lodash_1.each(rowAttrs, function (rowAttribute) {
                var attributeName = rowAttribute.name;
                var columnMapping = mapping[attributeName];
                var objectName = typeof columnMapping !== 'undefined' ? columnMapping.mappedName : removeOws ? attributeName.split('ows_')[1] : attributeName;
                var objectType = typeof columnMapping !== 'undefined' ? columnMapping.objectType : undefined;
                if (includeAllAttrs || columnMapping !== undefined) {
                    row[objectName] = decode_service_1.parseStringValue(rowAttribute.value, objectType);
                }
            });
            // Push this item into the JSON Object
            parsedObjects.push(row);
        });
        // Return the JSON object
        return parsedObjects;
    }
};
exports.xmlToJSONService = xmlToJSONService;
//# sourceMappingURL=xml-to-json.service.js.map