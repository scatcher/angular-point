import { auto } from 'angular';
import * as _ from 'lodash';
import { DecodeService } from './apDecodeService';


/**
 * @ngdoc service
 * @name apXMLToJSONService
 * @description
 * This function converts an XML node set into an array of JS objects.
 * This is essentially Marc Anderson's [SPServices](http://spservices.codeplex.com/) SPXmlTOJson function wrapped in
 * an Angular service to make it more modular and allow for testing.
 *
 */
export class XMLToJSONService {
    static $inject = ['$injector'];

    constructor(private $injector: auto.IInjectorService) {

    }

    /**
     * @ngdoc function
     * @name apXMLToJSONService.filterXMLNodeService
     * @methodOf apXMLToJSONService
     * @param {Element} xmlObject Object to parse, can either be a jQuery object or an xml response.
     * @param {string} name Name of node we're looking for.
     * @description
     * This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
     * http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
     * for performance details.
     * @returns {NodeList} List of fltered nodes.
     */
    filterNodes(xmlObject: Element, name: string): NodeList {

        if (name.indexOf(':') > -1) {
            // Something like z:row so need to filter for namespace
            const tagName = name.split(':')[1]; // "row"
            return xmlObject.getElementsByTagNameNS('*', tagName);
        } else {
            // Normal tag
            return xmlObject.getElementsByTagName(name);
        }
        // Convert to jQuery object if not already
        // const jQueryObject: JQuery = xmlObject instanceof jQuery ? xmlObject : jQuery(xmlObject);

        // return jQueryObject.find('*').filter(function () {
        // return xmlObject.getElementsByTagName(name);
        // return xmlObject.find('*').filter(function () {
        //     // If jQuery parsed as HTML the nodeName will be in all caps and we need lower case
        //     return this.nodeName.toLowerCase() === name;
        // });
    }

    /**
     * @ngdoc function
     * @name apXMLToJSONService.parse
     * @methodOf apXMLToJSONService
     * @param {Element} xmlNodeSet Object to parse, can either be a jQuery object or an xml response.
     * @param {IParseOptions} [options] Override defaults.
     * @description
     * This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
     * http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
     * for performance details.
     * @returns {Object[]} Object with jQuery values.
     */
    parse(xmlNodeSet: NodeList, options?: IParseOptions): Object[] {
        // Need to use injector because apDecode service also relies on this service so we'd otherwise have a circular dependency.
        const apDecodeService = this.$injector.get<DecodeService>('apDecodeService');
        const defaults = {
            includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
            mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
            removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
            sparse: false // If true, empty ("") values will not be returned
        };

        const opts: IParseOptions = _.assign({}, defaults, options);

        const jsonObjectArray = [];

        _.each(xmlNodeSet, (node: Element | any) => {
            const row = {};
            const rowAttrs = node.attributes;

            if (!opts.sparse) {
                // Bring back all mapped columns, even those with no value
                _.each(opts.mapping, (column) => row[column.mappedName] = '');
            }

            _.each(rowAttrs, (rowAttribute) => {
                const attributeName = rowAttribute.name;
                const columnMapping = opts.mapping[attributeName];

                const objectName = typeof columnMapping !== 'undefined' ?
                    columnMapping.mappedName : opts.removeOws ? attributeName.split('ows_')[1] : attributeName;

                const objectType = typeof columnMapping !== 'undefined' ? columnMapping.objectType : undefined;

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

export interface IParseOptions {
    includeAllAttrs?: boolean;
    mapping?: Object;
    removeOws?: boolean;
    sparse?: boolean;
}



