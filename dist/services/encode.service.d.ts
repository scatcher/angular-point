import { Lookup, IFieldDefinition, ListItem } from '../factories';
import { IFieldConfigurationObject } from "../factories/field-definition.factory";
export { choiceMultiToString, createValuePair, encodeValue, encodeXml, generateValuePairs, generateViewFieldsXML, stringifySharePointDate, stringifySharePointMultiSelect, wrapNode };
/**
 * Converts an array of selected values into a SharePoint MultiChoice string
 * @param {string[]} arr
 * @returns {string}
 */
declare function choiceMultiToString(choices: string[]): string;
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:createValuePair
 * @methodOf angularPoint.apEncodeService
 * @description
 * Uses a field definition from a model to properly format a value for submission to SharePoint.  Typically
 * used prior to saving a list item, we iterate over each of the non-readonly properties defined in the model
 * for a list item and convert those value into value pairs that we can then hand off to SPServices.
 * @param {object} fieldDefinition The field definition, typically defined in the model.
 * <pre>
 * {
     *  staticName: "Title",
     *  objectType: "Text",
     *  mappedName: "lastName",
     *  readOnly:false
     * }
 * </pre>
 * @param {*} value Current field value.
 * @returns {Array} [fieldName, fieldValue]
 */
declare function createValuePair(fieldDefinition: IFieldDefinition, value: any): [string, string];
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:encodeValue
 * @methodOf angularPoint.apEncodeService
 * @param {string} fieldType One of the valid field types.
 * @param {*} value Value to be encoded.
 * @returns {string} Encoded value ready to be sent to the server.
 */
declare function encodeValue(fieldType: string, value: any): string;
declare function encodeXml(str: string): string;
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:generateValuePairs
 * @methodOf angularPoint.apEncodeService
 * @description
 * Typically used to iterate over the non-readonly field definitions stored in a model and convert a
 * given list item entity into value pairs that we can pass to SPServices for saving.
 * @param {Array} fieldDefinitions Definitions from the model.
 * @param {object} listItem list item that we'll attempt to iterate over to find the properties that we need to
 * save it to SharePoint.
 * @returns {[string, string][]} Value pairs of all non-readonly fields.
 * @example
 * [[fieldName1, fieldValue1], [fieldName2, fieldValue2], ...]
 */
declare function generateValuePairs(fieldDefinitions: IFieldConfigurationObject[], listItem: ListItem<any>): [string, string][];
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:generateViewFieldsXML
 * @methodOf angularPoint.apEncodeService
 * @description
 * Based on defined fields for a given list, generate XML used to query those fields when requesting list data from
 * SharePoint.
 * @param {IFieldDefinition[]} fieldDefinitions Array of field definitions used to generate valid xml for request.
 * @returns {string}
 */
declare function generateViewFieldsXML(fieldDefinitions: IFieldDefinition[]): string;
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:stringifySharePointDate
 * @methodOf angularPoint.apEncodeService
 * @description
 * Converts a JavaScript date into a modified ISO8601 date string using the TimeZone
 * offset for the current user.
 * @example
 * <pre>'2014-05-08T08:12:18Z-07:00'</pre>
 * @param {Date} date Valid JS date.
 * @returns {string} ISO8601 date string.
 */
declare function stringifySharePointDate(date: Date | string): string;
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:stringifySharePointMultiSelect
 * @methodOf angularPoint.apEncodeService
 * @description
 * Turns an array of, typically {lookupId: someId, lookupValue: someValue}, objects into a string
 * of delimited id's that can be passed to SharePoint for a multi select lookup or multi user selection
 * field.  SharePoint doesn't need the lookup values so we only need to pass the ID's back.
 *
 * @param {object[]} multiSelectValue Array of {lookupId: #, lookupValue: 'Some Value'} objects.
 * @param {string} [idProperty='lookupId'] Property name where we'll find the ID value on each of the objects.
 * @param {string} [valueProperty='lookupValue'] Property name where we'll find the value for this object.
 * @returns {string} Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1]
 */
declare function stringifySharePointMultiSelect(multiSelectValue: Lookup<any>[], idProperty?: string, valueProperty?: string): string;
/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:wrapNode
 * @methodOf angularPoint.apEncodeService
 * @param {string} node Node to wrap.
 * @param {string} val Value to be wrapped by xml node
 * @description Wrap an XML node (node) around a value (val)
 * @returns {string}
 */
declare function wrapNode(node: string, val: string | number): string;
