import { Lookup } from '../factories';
export { getFormattedFieldValue, stringifyBoolean, stringifyCalc, stringifyCurrency, stringifyDate, stringifyLookup, stringifyMultiChoice, stringifyMultiLookup, stringifyNumber };
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
declare function getFormattedFieldValue(prop: any, propertyType?: string, options?: {
    delim?: string;
    dateFormat?: string;
}): string;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyBoolean
 * @methodOf angularPoint.apFormattedFieldValueService
 * @param {boolean} prop Boolean to stringify.
 * @description
 * Returns the stringified boolean if it is set.
 * @returns {string} Stringified boolean.
 */
declare function stringifyBoolean(prop: boolean): string;
declare function stringifyCalc(prop: any): string;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyCurrency
 * @methodOf angularPoint.apFormattedFieldValueService
 * @description
 * Converts a numeric value into a formatted currency string.
 * @param {number} prop Property on object to parse.
 * @returns {string} Stringified currency.
 */
declare function stringifyCurrency(prop: number): string;
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
declare function stringifyDate(prop: Date, dateFormat?: string): string;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyLookup
 * @methodOf angularPoint.apFormattedFieldValueService
 * @param {obj} prop Property on object to parse.
 * @description
 * Returns the property.lookupValue if present.
 * @returns {string} Property.lookupValue.
 */
declare function stringifyLookup(prop: Lookup<any>): string;
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
declare function stringifyMultiChoice(choices?: string[], delim?: string): string;
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
declare function stringifyMultiLookup(prop: Lookup<any>[], delim?: string): string;
/**
 * @ngdoc function
 * @name angularPoint.apFormattedFieldValueService:stringifyNumber
 * @methodOf angularPoint.apFormattedFieldValueService
 * @param {number} prop Property on object to parse.
 * @description
 * Converts a number to a string representation.
 * @returns {string} Stringified number.
 */
declare function stringifyNumber(prop: number): string;
