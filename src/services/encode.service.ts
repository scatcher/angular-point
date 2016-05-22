import {doubleDigit} from './utility.service';
import {Lookup, IFieldDefinition, ListItem} from '../factories';
import {IFieldConfigurationObject} from "../factories/field-definition.factory";
import {isUndefined, isNull, isString, has, isDate, each} from 'lodash';

let savedTimeZone: number;

/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
const xml_special_to_escaped_one_map = {
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
};

export {
    choiceMultiToString,
    createValuePair,
    encodeValue,
    encodeXml,
    generateValuePairs,
    generateViewFieldsXML,
    stringifySharePointDate,
    stringifySharePointMultiSelect,
    wrapNode
}

/**
 * Converts an array of selected values into a SharePoint MultiChoice string
 * @param {string[]} arr
 * @returns {string}
 */
function choiceMultiToString(choices: string[]): string {
    var str = '';
    var delim = ';#';

    if (choices.length > 0) {
        /** String is required to begin with deliminator */
        str += delim;

        /** Append each item in the supplied array followed by deliminator */
        for (let choice of choices) {
            str += choice + delim;
        }

    }
    return str;
}

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
function createValuePair(fieldDefinition: IFieldDefinition, value: any): [string, string] {
    var encodedValue = this.encodeValue(fieldDefinition.objectType, value);
    return [fieldDefinition.staticName, encodedValue];
}

/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:encodeValue
 * @methodOf angularPoint.apEncodeService
 * @param {string} fieldType One of the valid field types.
 * @param {*} value Value to be encoded.
 * @returns {string} Encoded value ready to be sent to the server.
 */
function encodeValue(fieldType: string, value: any): string {
    var str: string = '';
    /** Only process if note empty, undefined, or null.  Allow false. */
    if (value !== '' && !isUndefined(value) && !isNull(value)) {
        switch (fieldType) {
            case 'Lookup':
            case 'User':
                if (value.lookupId) {
                    /** Only include lookupValue if defined */
                    str = value.lookupId + ';#' + (value.lookupValue || '');
                }
                break;
            case 'LookupMulti':
            case 'UserMulti':
                str = this.stringifySharePointMultiSelect(value, 'lookupId');
                break;
            case 'MultiChoice':
                str = this.choiceMultiToString(value);
                break;
            case 'Boolean':
                str = value ? '1' : '0';
                break;
            case 'DateTime':
                // a string date in ISO8601 format, e.g., '2013-05-08T01:20:29Z-05:00'
                str = this.stringifySharePointDate(value);
                break;
            case 'JSON':
                str = JSON.stringify(value);
                break;
            case 'HTML':
            case 'Note':
            default:
                str = value;
        }
    }
    if (isString(str)) {
        // Ensure we encode before sending to server (replace ", <, >)
        str = this.encodeXml(str);
    }
    return str;
}

function encodeXml(str: string): string {
    return str.replace(/([\&"<>])/g, function (str, item) {
        return xml_special_to_escaped_one_map[item];
    });
}

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
function generateValuePairs(fieldDefinitions: IFieldConfigurationObject[], listItem: ListItem<any>): [string, string][] {
    let pairs = fieldDefinitions
        .filter((field: IFieldDefinition) => {
            return has(listItem, field.mappedName);
        })
        .map((field: IFieldDefinition) => {
            return this.createValuePair(field, listItem[field.mappedName]);
        });
    return pairs;
}

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
function generateViewFieldsXML(fieldDefinitions: IFieldDefinition[]): string {

    /** Open viewFields */
    let viewFields = '<ViewFields>';

    for(let field of fieldDefinitions) {
        viewFields += `<FieldRef Name="${field.staticName}"/>`;
    }

    /** Close viewFields */
    viewFields += '</ViewFields>';
    return viewFields
}

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
function stringifySharePointDate(date: Date | string): string {
    var jsDate: Date;
    if (!isDate(date) && isString(date) && date.split('-').length === 3) {
        /** Date string formatted YYYY-MM-DD */
        var dateComponents = date.split('-');
        jsDate = new Date(parseInt(dateComponents[0], 10), parseInt(dateComponents[1], 10) - 1, parseInt(dateComponents[2], 10), 0, 0, 0);
    } else if (!isDate(date)) {
        throw new Error('Invalid Date Provided: ' + date.toString());
    } else {
        jsDate = date;
    }
    
    var dateString = '';
    dateString += jsDate.getFullYear();
    dateString += '-';
    dateString += doubleDigit(jsDate.getMonth() + 1);
    dateString += '-';
    dateString += doubleDigit(jsDate.getDate());
    dateString += 'T';
    dateString += doubleDigit(jsDate.getHours());
    dateString += ':';
    dateString += doubleDigit(jsDate.getMinutes());
    dateString += ':';
    dateString += doubleDigit(jsDate.getSeconds());
    dateString += 'Z-';

    if (!savedTimeZone) {
        /* get difference between UTC time and local time in minutes and convert to hours and
         * store so we only need to do this once  */
        savedTimeZone = new Date().getTimezoneOffset() / 60;
    }
    dateString += doubleDigit(savedTimeZone);
    dateString += ':00';
    return dateString;
}

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
function stringifySharePointMultiSelect(multiSelectValue: Lookup<any>[], idProperty = 'lookupId', valueProperty = 'lookupValue'): string {
    var stringifiedValues = '';
    var idProp = idProperty || 'lookupId';
    var valProp = valueProperty || 'lookupValue';
    each(multiSelectValue, function (lookupObject, iteration) {
        /** Need to format string of id's in following format [ID0];#[VAL0];#[ID1];#[VAL1] */
        stringifiedValues += lookupObject[idProp] + ';#' + (lookupObject[valProp] || '');
        /** Append delim after all but last because we don't want trailing ';#' at end of string */
        if (iteration < (multiSelectValue.length - 1)) {
            stringifiedValues += ';#';
        }
    });
    return stringifiedValues;
}

/**
 * @ngdoc function
 * @name angularPoint.apEncodeService:wrapNode
 * @methodOf angularPoint.apEncodeService
 * @param {string} node Node to wrap.
 * @param {string} val Value to be wrapped by xml node
 * @description Wrap an XML node (node) around a value (val)
 * @returns {string}
 */
function wrapNode(node: string, val: string|number): string {
    var thisValue = typeof val !== 'undefined' ? val : '';
    return '<' + node + '>' + thisValue + '</' + node + '>';
}
