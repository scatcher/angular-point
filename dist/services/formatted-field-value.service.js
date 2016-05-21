"use strict";
var lodash_1 = require('lodash');
/**
 * @ngdoc service
 * @name angularPoint.apFormattedFieldValueService
 * @description
 * Returns the formatted string value for a field based on field type.
 */
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
function getFormattedFieldValue(prop, propertyType, options) {
    if (propertyType === void 0) { propertyType = 'String'; }
    if (options === void 0) { options = {}; }
    var str = '';
    /** Only process if prop is defined */
    if (prop) {
        switch (propertyType) {
            case 'Boolean':
                str = stringifyBoolean(prop);
                break;
            case 'Calculated':
                str = stringifyCalc(prop);
                break;
            case 'Lookup':
            case 'User':
                str = stringifyLookup(prop);
                break;
            case 'DateTime':
                str = stringifyDate(prop, options.dateFormat);
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
                str = stringifyMultiChoice(prop, options.delim);
                break;
            case 'UserMulti':
            case 'LookupMulti':
                str = stringifyMultiLookup(prop, options.delim);
                break;
            default:
                str = prop;
        }
    }
    return str;
}
exports.getFormattedFieldValue = getFormattedFieldValue;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyBoolean
 * @methodOf angularPoint.apFormattedFieldValueService
 * @param {boolean} prop Boolean to stringify.
 * @description
 * Returns the stringified boolean if it is set.
 * @returns {string} Stringified boolean.
 */
function stringifyBoolean(prop) {
    var str = '';
    if (lodash_1.isBoolean(prop)) {
        str = prop.toString();
    }
    return str;
}
exports.stringifyBoolean = stringifyBoolean;
function stringifyCalc(prop) {
    if (prop.length === 0) {
        return '';
    }
    else if (lodash_1.isNumber(prop)) {
        return getFormattedFieldValue(prop, 'Number');
    }
    else if (lodash_1.isDate(prop)) {
        return getFormattedFieldValue(prop, 'DateTime');
    }
    else {
        return getFormattedFieldValue(prop, 'Text');
    }
}
exports.stringifyCalc = stringifyCalc;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyCurrency
 * @methodOf angularPoint.apFormattedFieldValueService
 * @description
 * Converts a numeric value into a formatted currency string.
 * @param {number} prop Property on object to parse.
 * @returns {string} Stringified currency.
 */
function stringifyCurrency(prop) {
    return (prop).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
exports.stringifyCurrency = stringifyCurrency;
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
function stringifyDate(prop, dateFormat) {
    if (dateFormat === void 0) { dateFormat = 'short'; }
    var str = '';
    if (lodash_1.isDate(prop)) {
        str = dateFormat === 'json' ? prop.toJSON() : prop.toLocaleString('en-US');
    }
    return str;
}
exports.stringifyDate = stringifyDate;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyLookup
 * @methodOf angularPoint.apFormattedFieldValueService
 * @param {obj} prop Property on object to parse.
 * @description
 * Returns the property.lookupValue if present.
 * @returns {string} Property.lookupValue.
 */
function stringifyLookup(prop) {
    var str = '';
    if (prop && prop.lookupValue) {
        str = prop.lookupValue;
    }
    return str;
}
exports.stringifyLookup = stringifyLookup;
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
function stringifyMultiChoice(choices, delim) {
    if (choices === void 0) { choices = []; }
    if (delim === void 0) { delim = '; '; }
    var str = '';
    lodash_1.each(choices, function (choice, i) {
        if (i > 0) {
            str += delim;
        }
        str += choice;
    });
    return str;
}
exports.stringifyMultiChoice = stringifyMultiChoice;
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
function stringifyMultiLookup(prop, delim) {
    if (delim === void 0) { delim = '; '; }
    var str = '';
    lodash_1.each(prop, function (val, valIndex) {
        /** Add artificial delim */
        if (valIndex > 0) {
            str += delim;
        }
        str += stringifyLookup(val);
    });
    return str;
}
exports.stringifyMultiLookup = stringifyMultiLookup;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyNumber
 * @methodOf angularPoint.apFormattedFieldValueService
 * @param {number} prop Property on object to parse.
 * @description
 * Converts a number to a string representation.
 * @returns {string} Stringified number.
 */
function stringifyNumber(prop) {
    var str = '';
    if (lodash_1.isNumber(prop)) {
        str = prop.toString();
    }
    return str;
}
exports.stringifyNumber = stringifyNumber;
//# sourceMappingURL=formatted-field-value.service.js.map