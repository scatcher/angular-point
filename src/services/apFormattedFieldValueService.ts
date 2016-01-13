import {Lookup} from '../factories';
import  * as  _ from 'lodash';

var service: FormattedFieldValueServiceClass;

/**
 * @ngdoc service
 * @name angularPoint.apFormattedFieldValueService
 * @description
 * Returns the formatted string value for a field based on field type.
 */
export class FormattedFieldValueServiceClass {
    constructor() {
        service = this;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:getFormattedFieldValue
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {object|array|string|integer|boolean} prop Target that we'd like to stringify.
     * @param {string} [propertyType='String'] Assumes by default that it's already a string.  Most of the normal field
     * types identified in the model field definitions are supported.
     *
     * - Lookup
     * - User
     * - Boolean
     * - DateTime
     * - Integer
     * - Number
     * - Counter
     * - MultiChoice
     * - UserMulti
     * - LookupMulti
     * @param {object} options Optional config.
     * @param {string} [options.delim=', '] Optional delimiter to split concatenated strings.
     * @param {string} [options.dateFormat='short'] Either 'json' which converts a date into ISO8601 or short which default to user locale format.
     * @example
     * <pre>
     *  var project = {
     *    title: 'Super Project',
     *   members: [
     *     { lookupId: 12, lookupValue: 'Joe' },
     *     { lookupId: 19, lookupValue: 'Beth' }
     *   ]
     * };
     *
     * var membersAsString = apFormattedFieldValueService:getFormattedFieldValue({
     *    project.members,
     *    'UserMulti',
     *    { delim: ' | '} //Custom Delimiter
     * });
     *
     * // membersAsString = 'Joe | Beth';
     *
     * </pre>
     * @returns {string} Stringified property on the object based on the field type.
     */
    getFormattedFieldValue(prop: any, propertyType: string = 'String', options: { delim?: string; dateFormat?: string } = {}): string {

        var str: string = '';
        /** Only process if prop is defined */
        if (prop) {
            switch (propertyType) {
                case 'Boolean':
                    str = service.stringifyBoolean(prop);
                    break;
                case 'Calculated': // can be DateTime, Float, or String
                    str = service.stringifyCalc(prop);
                    break;
                case 'Lookup':
                case 'User':
                    str = service.stringifyLookup(prop);
                    break;
                case 'DateTime':
                    str = service.stringifyDate(prop, options.dateFormat);
                    break;
                case 'Integer':
                case 'Number':
                case 'Float':
                case 'Counter':
                    str = service.stringifyNumber(prop);
                    break;
                case 'Currency':
                    str = service.stringifyCurrency(prop);
                    break;
                case 'MultiChoice':
                    str = service.stringifyMultiChoice(prop, options.delim);
                    break;
                case 'UserMulti':
                case 'LookupMulti':
                    str = service.stringifyMultiLookup(prop, options.delim);
                    break;
                default:
                    str = prop;
            }
        }
        return str;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyBoolean
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {boolean} prop Boolean to stringify.
     * @description
     * Returns the stringified boolean if it is set.
     * @returns {string} Stringified boolean.
     */
    stringifyBoolean(prop: boolean): string {
        var str = '';
        if (_.isBoolean(prop)) {
            str = prop.toString();
        }
        return str;
    }

    stringifyCalc(prop: any): string {
        if (prop.length === 0) {
            return '';
        } else if (_.isNumber(prop)) {
            return service.getFormattedFieldValue(prop, 'Number');
        } else if (_.isDate(prop)) {
            return service.getFormattedFieldValue(prop, 'DateTime');
        } else {
            return service.getFormattedFieldValue(prop, 'Text');
        }
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyCurrency
     * @methodOf angularPoint.apFormattedFieldValueService
     * @description
     * Converts a numeric value into a formatted currency string.
     * @param {number} prop Property on object to parse.
     * @returns {string} Stringified currency.
     */
    stringifyCurrency(prop: number): string {
        return (prop).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyDate
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {date} prop Date object.
     * @param {string} dateFormat Either 'json' which converts a date into ISO8601 date string using user locale.
     * @description
     * Returns JSON date.
     * @returns {string} JSON date.
     */
    stringifyDate(prop: Date, dateFormat: string = 'short'): string {
        var str = '';
        if (_.isDate(prop)) {
            let shortDateFormat = {

            }
            str = dateFormat === 'json' ? prop.toJSON() : prop.toLocaleString('en-US');
        }
        return str;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyLookup
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {obj} prop Property on object to parse.
     * @description
     * Returns the property.lookupValue if present.
     * @returns {string} Property.lookupValue.
     */
    stringifyLookup(prop: Lookup<any>): string {
        var str = '';
        if (prop && prop.lookupValue) {
            str = prop.lookupValue;
        }
        return str;
    }


    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyMultiChoice
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {string[]} choices Array of selected choices.
     * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
     * @description
     * Converts an array of strings into a single concatenated string.
     * @returns {string} Concatenated string representation.
     */
    stringifyMultiChoice(choices: string[] = [], delim = '; '): string {
        var str = '';
        _.each(choices, (choice, i) => {
            if (i > 0) {
                str += delim;
            }
            str += choice;
        });
        return str;
    }


    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyMultiLookup
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {object[]} prop Array of lookup objects.
     * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
     * @description
     * Converts an array of selected lookup values into a single concatenated string.
     * @returns {string} Concatenated string representation.
     */
    stringifyMultiLookup(prop: Lookup<any>[], delim: string = '; '): string {
        var str = '';
        _.each(prop, function (val, valIndex) {

            /** Add artificial delim */
            if (valIndex > 0) {
                str += delim;
            }

            str += service.stringifyLookup(val);
        });
        return str;
    }


    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyNumber
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {number} prop Property on object to parse.
     * @description
     * Converts a number to a string representation.
     * @returns {string} Stringified number.
     */
    stringifyNumber(prop: number): string {
        var str = '';
        if (_.isNumber(prop)) {
            str = prop.toString();
        }
        return str;
    }

}

export let FormattedFieldValueService = new FormattedFieldValueServiceClass();
