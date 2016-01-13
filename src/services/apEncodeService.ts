import {UtilityService} from '../services';
import {Lookup, IFieldDefinition, ListItem} from '../factories';
import  * as  _ from 'lodash';

/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
let xml_special_to_escaped_one_map = {
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
};


export class EncodeServiceClass {
    savedTimeZone;

    /**
     * Converts an array of selected values into a SharePoint MultiChoice string
     * @param {string[]} arr
     * @returns {string}
     */
    choiceMultiToString(choices: string[]): string {
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
    createValuePair(fieldDefinition: IFieldDefinition, value: any): [string, string] {
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
    encodeValue(fieldType: string, value: any): string {
        var str: string = '';
        /** Only process if note empty, undefined, or null.  Allow false. */
        if (value !== '' && !_.isUndefined(value) && !_.isNull(value)) {
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
        if (_.isString(str)) {
            // Ensure we encode before sending to server (replace ", <, >)
            str = this.encodeXml(str);
        }
        return str;
    }

    encodeXml(str: string): string {
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
    generateValuePairs(fieldDefinitions: IFieldDefinition[], listItem: ListItem<any>): [string, string][] {
        let pairs = fieldDefinitions
            .filter((field: IFieldDefinition) => {
                return _.has(listItem, field.mappedName);
            })
            .map((field: IFieldDefinition) => {
                return this.createValuePair(field, listItem[field.mappedName]);
            });
        return pairs;
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
    stringifySharePointDate(date: Date | string): string {
        var jsDate: Date;
        if (!_.isDate(date) && _.isString(date) && date.split('-').length === 3) {
            /** Date string formatted YYYY-MM-DD */
            var dateComponents = date.split('-');
            jsDate = new Date(parseInt(dateComponents[0], 10), parseInt(dateComponents[1], 10) - 1, parseInt(dateComponents[2], 10), 0, 0, 0);
        } else if (!_.isDate(date)) {
            throw new Error('Invalid Date Provided: ' + date.toString());
        } else {
            jsDate = date;
        }

        // return moment(jsDate).format('YYYY-MM-DDTHH:mm:ss[Z]Z')

        var dateString = '';
        dateString += jsDate.getFullYear();
        dateString += '-';
        dateString += UtilityService.doubleDigit(jsDate.getMonth() + 1);
        dateString += '-';
        dateString += UtilityService.doubleDigit(jsDate.getDate());
        dateString += 'T';
        dateString += UtilityService.doubleDigit(jsDate.getHours());
        dateString += ':';
        dateString += UtilityService.doubleDigit(jsDate.getMinutes());
        dateString += ':';
        dateString += UtilityService.doubleDigit(jsDate.getSeconds());
        dateString += 'Z-';

        if (!this.savedTimeZone) {
            /* get difference between UTC time and local time in minutes and convert to hours and
             * store so we only need to do this once  */
            this.savedTimeZone = new Date().getTimezoneOffset() / 60;
        }
        dateString += UtilityService.doubleDigit(this.savedTimeZone);
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
    stringifySharePointMultiSelect(multiSelectValue: Lookup<any>[], idProperty = 'lookupId', valueProperty = 'lookupValue'): string {
        var stringifiedValues = '';
        var idProp = idProperty || 'lookupId';
        var valProp = valueProperty || 'lookupValue';
        _.each(multiSelectValue, function (lookupObject, iteration) {
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
    wrapNode(node: string, val: string|number): string {
        var thisValue = typeof val !== 'undefined' ? val : '';
        return '<' + node + '>' + thisValue + '</' + node + '>';
    }


}

export let EncodeService = new EncodeServiceClass();
