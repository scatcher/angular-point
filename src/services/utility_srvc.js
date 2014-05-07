'use strict';

/**
 * @ngdoc service
 * @name utilityService
 * @description
 * Provides shared utility functionality across the application.
 */
angular.module('angularPoint')
    .service('utilityService', function () {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /** Extend underscore with a simple helper function */
        _.mixin({
            isDefined: function (value) {
                return !_.isUndefined(value);
            }
        });

        /**
         * @ngdoc function
         * @name utilityService.xmlToJson
         * @description
         * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
         * "SPXmlToJson" function.
         * @param {array} rows ["z:rows"] XML rows that need to be parsed.
         * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * they are in the mapping.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * be stripped off the field name.
         * @returns {Array} An array of JavaScript objects.
         */
        var xmlToJson = function (rows, options) {

            var opt = $.extend({}, {
                mapping: {},
                includeAllAttrs: false,
                removeOws: true
            }, options);

            var attrNum;
            var jsonObject = [];

            _.each(rows, function (item) {
                var row = {};
                var rowAttrs = item.attributes;

                // Bring back all mapped columns, even those with no value
                _.each(opt.mapping, function (prop) {
                    row[prop.mappedName] = '';
                });

                // Parse through the element's attributes
                for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
                    var thisAttrName = rowAttrs[attrNum].name;
                    var thisMapping = opt.mapping[thisAttrName];
                    var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
                    var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
                    if (opt.includeAllAttrs || thisMapping !== undefined) {
                        row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType);
                    }
                }
                // Push this item into the JSON Object
                jsonObject.push(row);

            });

            // Return the JSON object
            return jsonObject;
        };

        /**
         * @ngdoc function
         * @name utilityService.attrToJson
         * @description
         * Converts a SharePoint string representation of a field into the correctly formatted JavaScript version
         * based on object type.
         * @param {string} value SharePoint string.
         * @param {string} [objectType='Text'] The type based on field definition.
         * Options:[
         *  DateTime,
         *  Lookup,
         *  User,
         *  LookupMulti,
         *  UserMulti,
         *  Boolean,
         *  Integer,
         *  Counter,
         *  MultiChoice,
         *  Currency,
         *  Number,
         *  Calc,
         *  JSON,
         *  Text [Default]
         * ]
         * @returns {*} The formatted JavaScript value based on field type.
         */
        function attrToJson(value, objectType) {

            var colValue;

            switch (objectType) {
                case 'DateTime':
                case 'datetime':	// For calculated columns, stored as datetime;#value
                    // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
                    colValue = dateToJsonObject(value);
                    break;
                case 'Lookup':
                    colValue = lookupToJsonObject(value);
                    break;
                case 'User':
                    colValue = userToJsonObject(value);
                    break;
                case 'LookupMulti':
                    colValue = lookupMultiToJsonObject(value);
                    break;
                case 'UserMulti':
                    colValue = userMultiToJsonObject(value);
                    break;
                case 'Boolean':
                    colValue = booleanToJsonObject(value);
                    break;
                case 'Integer':
                    colValue = intToJsonObject(value);
                    break;
                case 'Counter':
                    colValue = intToJsonObject(value);
                    break;
                case 'MultiChoice':
                    colValue = choiceMultiToJsonObject(value);
                    break;
                case 'Currency':
                case 'Number':
                case 'float':	// For calculated columns, stored as float;#value
                    colValue = floatToJsonObject(value);
                    break;
                case 'Calc':
                    colValue = calcToJsonObject(value);
                    break;
                case 'JSON':
                    colValue = parseJSON(value);
                    break;
                default:
                    // All other objectTypes will be simple strings
                    colValue = stringToJsonObject(value);
                    break;
            }
            return colValue;
        }

        function parseJSON(s) {
            return JSON.parse(s);
        }

        function stringToJsonObject(s) {
            return s;
        }

        function intToJsonObject(s) {
            return parseInt(s, 10);
        }

        function floatToJsonObject(s) {
            return parseFloat(s);
        }

        function booleanToJsonObject(s) {
            return (s === '0' || s === 'False') ? false : true;
        }

        function dateToJsonObject(s) {
            return new Date(s.replace(/-/g, '/'));
        }

        function userToJsonObject(s) {
            if (s.length === 0) {
                return null;
            }
            //Send to constructor
            return new User(s);
        }

        function userMultiToJsonObject(s) {
            if (s.length === 0) {
                return null;
            } else {
                var thisUserMultiObject = [];
                var thisUserMulti = s.split(';#');
                for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                    var thisUser = userToJsonObject(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
                    thisUserMultiObject.push(thisUser);
                }
                return thisUserMultiObject;
            }
        }

        function lookupToJsonObject(s) {
            if (s.length === 0) {
                return null;
            } else {
                //Send to constructor
                return new Lookup(s);
            }
        }

        function lookupMultiToJsonObject(s) {
            if (s.length === 0) {
                return [];
            } else {
                var thisLookupMultiObject = [];
                var thisLookupMulti = s.split(';#');
                for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                    var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1]);
                    thisLookupMultiObject.push(thisLookup);
                }
                return thisLookupMultiObject;
            }
        }

        function choiceMultiToJsonObject(s) {
            if (s.length === 0) {
                return [];
            } else {
                var thisChoiceMultiObject = [];
                var thisChoiceMulti = s.split(';#');
                for (var i = 0; i < thisChoiceMulti.length; i++) {
                    if (thisChoiceMulti[i].length !== 0) {
                        thisChoiceMultiObject.push(thisChoiceMulti[i]);
                    }
                }
                return thisChoiceMultiObject;
            }
        }

        function calcToJsonObject(s) {
            if (s.length === 0) {
                return null;
            } else {
                var thisCalc = s.split(';#');
                // The first value will be the calculated column value type, the second will be the value
                return attrToJson(thisCalc[1], thisCalc[0]);
            }
        }

        function htmlToJsonObject(s) {
            return _.unescape(s);
        }

        // Split values like 1;#value into id and value
        function SplitIndex(s) {
            var spl = s.split(';#');
            this.id = parseInt(spl[0], 10);
            this.value = spl[1];
        }

        function toCamelCase(s) {
            return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }

        function fromCamelCase(s) {
            // insert a space before all caps
            s.replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) {
                    return str.toUpperCase();
                });
        }

        /**Constructors for user and lookup fields*/
        /**Allows for easier distinction when debugging if object type is shown as either Lookup or User**/
        function Lookup(s) {
            var thisLookup = new SplitIndex(s);
            this.lookupId = thisLookup.id;
            this.lookupValue = thisLookup.value;
        }

        function User(s) {
            var self = this;
            var thisUser = new SplitIndex(s);

            var thisUserExpanded = thisUser.value.split(',#');
            if (thisUserExpanded.length === 1) {
                //Standard user columns only return a id,#value pair
                self.lookupId = thisUser.id;
                self.lookupValue = thisUser.value;
            } else {
                //Allow for case where user adds additional properties when setting up field
                self.lookupId = thisUser.id;
                self.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
                self.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
                self.email = thisUserExpanded[2].replace(/(,,)/g, ',');
                self.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
                self.title = thisUserExpanded[4].replace(/(,,)/g, ',');
            }
        }

        /**
         * @ngdoc function
         * @name utilityService.yyyymmdd
         * @description
         * Convert date into a int formatted as yyyymmdd
         * We don't need the time portion of comparison so an int makes this easier to evaluate
         */
        function yyyymmdd(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            /** Add leading 0's to month and day if necessary */
            return parseInt(yyyy + (mm[1] ? mm : '0' + mm[0]) + (dd[1] ? dd : '0' + dd[0]));
        }

        /**
         * @ngdoc function
         * @name utilityService.dateWithinRange
         * @description
         * Converts dates into yyyymmdd formatted ints and evaluates to determine if the dateToCheck
         * falls within the date range provided
         * @param {Date} startDate Starting date.
         * @param {Date} endDate Ending date.
         * @param {Date} [dateToCheck=new Date()] Defaults to the current date.
         * @returns {boolean} Does the date fall within the range?
         */
        function dateWithinRange(startDate, endDate, dateToCheck) {
            /** Ensure both a start and end date are provided **/
            if (!startDate || !endDate) {
                return false;
            }

            /** Use the current date as the default if one isn't provided */
            dateToCheck = dateToCheck || new Date();

            /** Create an int representation of each of the dates */
            var startInt = yyyymmdd(startDate);
            var endInt = yyyymmdd(endDate);
            var dateToCheckInt = yyyymmdd(dateToCheck);

            return startInt <= dateToCheckInt && dateToCheckInt <= endInt;
        }

        return {
            attrToJson: attrToJson,
            dateWithinRange: dateWithinRange,
            fromCamelCase: fromCamelCase,
            lookupToJsonObject: lookupToJsonObject,
            SplitIndex: SplitIndex,
            toCamelCase: toCamelCase,
            xmlToJson: xmlToJson
        };
    });