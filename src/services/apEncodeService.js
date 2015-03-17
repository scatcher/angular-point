'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apEncodeService
 * @description
 * Processes JavaScript objects and converts them to a format SharePoint expects.
 *
 * @requires angularPoint.apConfig
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .factory('apEncodeService', function (_, apConfig, apUtilityService, SPServices) {

        return {
            choiceMultiToString: choiceMultiToString,
            createValuePair: createValuePair,
            encodeValue: encodeValue,
            generateValuePairs: generateValuePairs,
            stringifySharePointDate: stringifySharePointDate,
            stringifySharePointMultiSelect: stringifySharePointMultiSelect

        };

        /**
         * Converts an array of selected values into a SharePoint MultiChoice string
         * @param {string[]} arr
         * @returns {string}
         */
        function choiceMultiToString(arr) {
            var str = '';
            var delim = ';#';

            if (arr.length > 0) {
                /** String is required to begin with deliminator */
                str += delim;

                /** Append each item in the supplied array followed by deliminator */
                _.each(arr, function (choice) {
                    str += choice + delim;
                });
            }
            return str;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:generateValuePairs
         * @methodOf angularPoint.apEncodeService
         * @description
         * Typically used to iterate over the non-readonly field definitions stored in a model and convert a
         * given list item entity into value pairs that we can pass to SPServices for saving.
         * @param {Array} fieldDefinitions Definitions from the model.
         * @param {object} item list item that we'll attempt to iterate over to find the properties that we need to
         * save it to SharePoint.
         * @returns {Array[]} Value pairs of all non-readonly fields. [[fieldName, fieldValue]]
         */
        function generateValuePairs(fieldDefinitions, item) {
            var pairs = [];
            _.each(fieldDefinitions, function (field) {
                /** Check to see if item contains data for this field */
                if (_.has(item, field.mappedName)) {
                    pairs.push(createValuePair(field, item[field.mappedName]));
                }
            });
            return pairs;
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
        function createValuePair(fieldDefinition, value) {
            var encodedValue = encodeValue(fieldDefinition.objectType, value);
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
        function encodeValue(fieldType, value) {
            var str = '';
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
                        str = stringifySharePointMultiSelect(value, 'lookupId');
                        break;
                    case 'MultiChoice':
                        str = choiceMultiToString(value);
                        break;
                    case 'Boolean':
                        str = value ? 1 : 0;
                        break;
                    case 'DateTime':
                        //A string date in ISO8601 format, e.g., '2013-05-08T01:20:29Z-05:00'
                        str = stringifySharePointDate(value);
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
                /** Ensure we encode before sending to server (replace ", <, >)*/
                str = SPServices.encodeXml(str);
            }
            return str;
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
        function stringifySharePointDate(date) {
            if (!_.isDate(date) && _.isString(date) && date.split('-').length === 3) {
                /** Date string formatted YYYY-MM-DD */
                var dateComponents = date.split('-');
                date = new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2], 0, 0, 0);
            } else if (!_.isDate(date)) {
                throw new Error('Invalid Date Provided: ' + value.toString());
            }

            var self = stringifySharePointDate;
            var dateString = '';
            dateString += date.getFullYear();
            dateString += '-';
            dateString += apUtilityService.doubleDigit(date.getMonth() + 1);
            dateString += '-';
            dateString += apUtilityService.doubleDigit(date.getDate());
            dateString += 'T';
            dateString += apUtilityService.doubleDigit(date.getHours());
            dateString += ':';
            dateString += apUtilityService.doubleDigit(date.getMinutes());
            dateString += ':';
            dateString += apUtilityService.doubleDigit(date.getSeconds());
            dateString += 'Z-';

            if (!self.timeZone) {
                //Get difference between UTC time and local time in minutes and convert to hours
                //Store so we only need to do this once
                self.timeZone = new Date().getTimezoneOffset() / 60;
            }
            dateString += apUtilityService.doubleDigit(self.timeZone);
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
        function stringifySharePointMultiSelect(multiSelectValue, idProperty, valueProperty) {
            var stringifiedValues = '';
            var idProp = idProperty || 'lookupId';
            var valProp = valueProperty || 'lookupValue';
            _.each(multiSelectValue, function (lookupObject, iteration) {
                /** Need to format string of id's in following format [ID0];#[VAL0];#[ID1];#[VAL1];# */
                stringifiedValues += lookupObject[idProp] + ';#' + (lookupObject[valProp] || '');
                if (iteration < multiSelectValue.length) {
                    stringifiedValues += ';#';
                }
            });
            return stringifiedValues;
        }

    });
