/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var $filter;

    /**
     * @ngdoc service
     * @name angularPoint.apFormattedFieldValueService
     * @description
     * Returns the formatted string value for a field based on field type.
     */
    export class FormattedFieldValueService {
        getFormattedFieldValue = getFormattedFieldValue;
        stringifyBoolean = stringifyBoolean;
        stringifyCalc = stringifyCalc;
        stringifyCurrency = stringifyCurrency;
        stringifyDate = stringifyDate;
        stringifyLookup = stringifyLookup;
        stringifyMultiChoice = stringifyMultiChoice;
        stringifyMultiLookup = stringifyMultiLookup;
        stringifyNumber = stringifyNumber;

        constructor($injector) {
            $filter = $injector.get('$filter');
        }
    }

    /**==================PRIVATE==================*/

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
     * @param {string} [options.dateFormat='short'] Either 'json' which converts a date into ISO8601 date string
     * or a mask for the angular date filter.
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
    function getFormattedFieldValue(prop: any, propertyType = 'String', options?: { delim: string; dateFormat: string }): string {
        var defaults = {
            delim: ', ',
            dateFormat: 'short'
        },
            opts = _.extend({}, defaults, options);

        var str: string = '';
        /** Only process if prop is defined */
        if (prop) {
            switch (propertyType) {
                case 'Boolean':
                    str = stringifyBoolean(prop);
                    break;
                case 'Calculated': // Can be DateTime, Float, or String
                    str = stringifyCalc(prop);
                    break;
                case 'Lookup':
                case 'User':
                    str = stringifyLookup(prop);
                    break;
                case 'DateTime':
                    str = stringifyDate(prop, opts.dateFormat);
                    break;
                case 'Integer':
                case 'Number':
                case 'Float':
                case 'Counter':
                    str = stringifyNumber(prop);
                    break;
                case 'Currency':
                    str = stringifyCurrency(prop);
                    break;
                case 'MultiChoice':
                    str = stringifyMultiChoice(prop, opts.delim);
                    break;
                case 'UserMulti':
                case 'LookupMulti':
                    str = stringifyMultiLookup(prop, opts.delim);
                    break;
                default:
                    str = prop;
            }
        }
        return str;
    }

    function stringifyCalc(prop: any): string {
        if (prop.length === 0) {
            return '';
        } else if (_.isNumber(prop)) {
            return getFormattedFieldValue(prop, 'Number');
        } else if (_.isDate(prop)) {
            return getFormattedFieldValue(prop, 'DateTime');
        } else {
            return getFormattedFieldValue(prop, 'Text');
        }
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
    function stringifyNumber(prop: number): string {
        var str = '';
        if (_.isNumber(prop)) {
            str = prop.toString();
        }
        return str;
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
    function stringifyCurrency(prop: number): string {
        return $filter('currency')(prop, '$');
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
    function stringifyLookup(prop: ILookup): string {
        var str = '';
        if (prop && prop.lookupValue) {
            str = prop.lookupValue;
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
    function stringifyBoolean(prop: boolean): string {
        var str = '';
        if (_.isBoolean(prop)) {
            str = prop.toString();
        }
        return str;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyDate
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {date} prop Date object.
     * @param {string} dateFormat Either 'json' which converts a date into ISO8601 date string or a mask for
     * the angular date filter.
     * @description
     * Returns JSON date.
     * @returns {string} JSON date.
     */
    function stringifyDate(prop: Date, dateFormat: string): string {
        var str = '';
        if (_.isDate(prop)) {
            str = dateFormat === 'json' ? prop.toJSON() : $filter('date')(prop, dateFormat);
        }
        return str;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apFormattedFieldValueService:stringifyMultiChoice
     * @methodOf angularPoint.apFormattedFieldValueService
     * @param {string[]} prop Array of selected choices.
     * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
     * @description
     * Converts an array of strings into a single concatenated string.
     * @returns {string} Concatenated string representation.
     */
    function stringifyMultiChoice(prop: string[], delim = '; '): string {
        var str = '';
        _.each(prop, function(choice, i) {
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
    function stringifyMultiLookup(prop: ILookup[], delim = '; '): string {
        var str = '';
        _.each(prop, function(val, valIndex) {

            /** Add artificial delim */
            if (valIndex > 0) {
                str += delim;
            }

            str += stringifyLookup(val);
        });
        return str;
    }

    angular
        .module('angularPoint')
        .service('apFormattedFieldValueService', FormattedFieldValueService);


}
