import {DecodeService} from '../services';
import  _ from 'lodash';

export interface IParseOptions {
    // If true, return all attributes, regardless whether they are in the mapping
    includeAllAttrs?: boolean;
    // columnName: mappedName: "mappedName", objectType: "objectType"
    mapping?: Object;
    // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
    removeOws?: boolean;
    // If true, empty ("") values will not be returned
    sparse?: boolean;
}

export let XMLToJSONService = {

    /**
     * @ngdoc function
     * @name apXMLToJSONService.parse
     * @methodOf apXMLToJSONService
     * @param {Element} xmlNodeSet Object to parse, can either be a jQuery object or an xml response.
     * @param {Object} [options] Optionally override defaults.
     * @returns {Object[]} XML List items converted to JS.
     */
    parse(xmlNodeSet: NodeListOf<Element>, {includeAllAttrs = true, mapping = {}, removeOws = true, sparse = false}: IParseOptions = {}): Object[] {
        let parsedObjects = [];

        _.each(xmlNodeSet, (node: Element) => {
            let row = {};
            let rowAttrs = node.attributes;

            if (!sparse) {
                // Bring back all mapped columns, even those with no value
                _.each(mapping, (column) => row[column.mappedName] = '');
            }

            _.each(rowAttrs, (rowAttribute) => {
                let attributeName = rowAttribute.name;
                let columnMapping = mapping[attributeName];
                let objectName = typeof columnMapping !== 'undefined' ? columnMapping.mappedName : removeOws ? attributeName.split('ows_')[1] : attributeName;
                let objectType = typeof columnMapping !== 'undefined' ? columnMapping.objectType : undefined;
                if (includeAllAttrs || columnMapping !== undefined) {
                    row[objectName] = DecodeService.parseStringValue(rowAttribute.value, objectType);
                }
            });

            // Push this item into the JSON Object
            parsedObjects.push(row);
        });

        // Return the JSON object
        return parsedObjects;

    }
};