'use strict';

/**
 * @ngdoc service
 * @name utilityService
 * @description
 * Provides shared utility functionality across the application.
 */
angular.module('angularPoint')
    .service('apUtilityService', function ($q, $log) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /** Extend underscore with a simple helper function */
        _.mixin({
            isDefined: function (value) {
                return !_.isUndefined(value);
            },
            /** Based on functionality in Breeze.js */
            isGuid: function (value) {
                return (typeof value === "string") && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/.test(value);
            }
        });

        /**
         * @ngdoc function
         * @name utilityService.xmlToJson
         * @description
         * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
         * "SPXmlToJson" function.
         * @param {array} rows ["z:rows"] XML rows that need to be parsed.
         * @param {object} options Options object.
         * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * they are in the mapping.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * be stripped off the field name.
         * @returns {Array} An array of JavaScript objects.
         */
        var xmlToJson = function (rows, options) {

            var defaults = {
                mapping: {},
                includeAllAttrs: false,
                removeOws: true
            };

            var deferred = $q.defer();


            var opts = _.extend({}, defaults, options);

            var attrNum;
            var entities = [];

            var processRow = function (item) {
                var row = {};
                var rowAttrs = item.attributes;

                /** Bring back all mapped columns, even those with no value */
                _.each(opts.mapping, function (prop) {
                    row[prop.mappedName] = '';
                });

                // Parse through the element's attributes
                for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
                    var thisAttrName = rowAttrs[attrNum].name;
                    var thisMapping = opts.mapping[thisAttrName];
                    var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : opts.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
                    var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
                    if (opts.includeAllAttrs || thisMapping !== undefined) {
                        row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType, {getQuery: opts.getQuery, entity: row, propertyName: thisObjectName});
                    }
                }
                /** Push the newly created list item into the return array */
                if(_.isFunction(opts.constructor)) {
                    entities.push(opts.constructor(row));
                } else {
                    entities.push(row);
                }
            };

            var callback = function () {
                deferred.resolve(entities);
            };

            batchProcess(rows, processRow, this, callback, 25, 1000);

            return deferred.promise;
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
         *  Float,
         *  Counter,
         *  MultiChoice,
         *  Currency,
         *  Number,
         *  Calc,
         *  JSON,
         *  Text [Default]
         * ]
         * @param {obj} row Reference to the parent list item which can be used by child constructors.
         * @returns {*} The formatted JavaScript value based on field type.
         */
        function attrToJson(value, objectType, options) {

            var colValue;

            switch (objectType) {
                case 'DateTime':
                case 'datetime':	// For calculated columns, stored as datetime;#value
                    // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
                    colValue = dateToJsonObject(value);
                    break;
                case 'Lookup':
                    colValue = lookupToJsonObject(value, options);
                    break;
                case 'User':
                    colValue = userToJsonObject(value);
                    break;
                case 'LookupMulti':
                    colValue = lookupMultiToJsonObject(value, options);
                    break;
                case 'UserMulti':
                    colValue = userMultiToJsonObject(value);
                    break;
                case 'Boolean':
                    colValue = booleanToJsonObject(value);
                    break;
                case 'Integer':
                case 'Counter':
                    colValue = intToJsonObject(value);
                    break;
                case 'Currency':
                case 'Number':
                case 'Float':
                case 'float':	// For calculated columns, stored as float;#value
                    colValue = floatToJsonObject(value);
                    break;
                case 'Calc':
                    colValue = calcToJsonObject(value);
                    break;
                case 'MultiChoice':
                    colValue = choiceMultiToJsonObject(value);
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
            /** Replace dashes with slashes and the "T" deliminator with a space if found */
            return new Date(s.replace(/-/g, '/').replace(/T/i, ' '));
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

        function lookupToJsonObject(s, options) {
            if (s.length === 0) {
                return null;
            } else {
                //Send to constructor
                return new Lookup(s, options);
            }
        }

        function lookupMultiToJsonObject(s, options) {
            if (s.length === 0) {
                return [];
            } else {
                var thisLookupMultiObject = [];
                var thisLookupMulti = s.split(';#');
                for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                    var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
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

        /**
         * @ngdoc function
         * @name Lookup
         * @description
         * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
         * to create an async request for the entity being referenced by the lookup
         * @param {string} s String to split into lookupValue and lookupId
         * @param {object} options Contains a reference to the parent list item and the property name.
         * @param {object} options.entity Reference to parent list item.
         * @param {object} options.propertyName Key on list item object.
         * @constructor
         */
        function Lookup(s, options) {
            var lookup = this;
            var thisLookup = new SplitIndex(s);
            lookup.lookupId = thisLookup.id;
            lookup.lookupValue = thisLookup.value;
            lookup._props = function () {
                return options;
            };
        }

        /**
         * @ngdoc function
         * @name Lookup.getEntity
         * @description
         * Allows us to create a promise that will resolve with the entity referenced in the lookup whenever that list
         * item is registered.
         * @example
         <pre>
         var project = {
            title: 'Project 1',
            location: {
                lookupId: 5,
                lookupValue: 'Some Building'
            }
         };

         //To get the location entity
         project.location.getEntity().then(function(entity) {
             //Resolves with the full location entity once it's registered in the cache

            });
         </pre>
         * @returns {promise} Resolves with the object the lookup is referencing.
         */
        Lookup.prototype.getEntity = function () {
            var self = this;
            var props = self._props();

            if (!props.getEntity) {
                var query = props.getQuery();
                var listItem = query.searchLocalCache(props.entity.id);

                /** Create a new deferred object if this is the first run */
                props.getEntity = $q.defer();
                listItem.getLookupReference(props.propertyName, self.lookupId)
                    .then(function (entity) {
                        props.getEntity.resolve(entity);
                    })
            }
            return props.getEntity.promise;
        };

        /**
         * @ngdoc function
         * @name Lookup.getProperty
         * @description
         * Returns a promise which resolves with the value of a property in the referenced object.
         * @param {string} propertyPath The dot separated propertyPath.
         * @example
         <pre>
         var project = {
            title: 'Project 1',
            location: {
                lookupId: 5,
                lookupValue: 'Some Building'
            }
         };

         //To get the location.city
         project.location.getProperty('city').then(function(city) {
            //Resolves with the city property from the referenced location entity

            });
         </pre>
         * @returns {promise} Resolves with the value, or undefined if it doesn't exists.
         */
        Lookup.prototype.getProperty = function (propertyPath) {
            var self = this;
            var deferred = $q.defer();
            self.getEntity().then(function (entity) {
                deferred.resolve(_.deepGetOwnValue(entity, propertyPath));
            });
            return deferred.promise;
        };

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
         * Add a leading zero if a number/string only contains a single character
         * @param {number|string} val
         * @returns {string} Two digit string.
         */
        function doubleDigit(val) {
            return val > 9 ? val.toString() : '0' + val;
        }

        /**
         * @ngdoc function
         * @name utilityService.stringifySharePointDate
         * @description
         * Converts a JavaScript date into a modified ISO8601 date string using the TimeZone offset for the current user.
         * @example
         <pre>'2014-05-08T08:12:18Z-07:00'</pre>
         * @param {Date} date Valid JS date.
         * @returns {string} ISO8601 date string.
         */
        function stringifySharePointDate(date) {
            if (!_.isDate(date)) {
                return '';
            }
            var self = this;
            var dateString = '';
            dateString += date.getFullYear();
            dateString += '-';
            dateString += doubleDigit(date.getMonth() + 1);
            dateString += '-';
            dateString += doubleDigit(date.getDate());
            dateString += 'T';
            dateString += doubleDigit(date.getHours());
            dateString += ':';
            dateString += doubleDigit(date.getMinutes());
            dateString += ':';
            dateString += doubleDigit(date.getSeconds());
            dateString += 'Z-';

            if (!self.timeZone) {
                //Get difference between UTC time and local time in minutes and convert to hours
                //Store so we only need to do this once
                window.console.log('Calculating');

                self.timeZone = new Date().getTimezoneOffset() / 60;
            }
            dateString += doubleDigit(self.timeZone);
            dateString += ':00';
            return dateString;
        }

        /**
         * @ngdoc function
         * @name utilityService.stringifySharePointMultiSelect
         * @description
         * Turns an array of, typically {lookupId: someId, lookupValue: someValue}, objects into a string
         * of delimited id's that can be passed to SharePoint for a multi select lookup or multi user selection
         * field.  SharePoint doesn't need the lookup values so we only need to pass the ID's back.
         *
         * @param {object[]} multiSelectValue Array of {lookupId: #, lookupValue: 'Some Value'} objects.
         * @param {string} [idProperty='lookupId'] Property name where we'll find the ID value on each of the objects.
         * @returns {string} Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1]
         */
        function stringifySharePointMultiSelect(multiSelectValue, idProperty) {
            var stringifiedValues = '';
            var idProp = idProperty || 'lookupId';
            _.each(multiSelectValue, function (lookupObject, iteration) {
                /** Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1] */
                stringifiedValues += lookupObject[idProp];
                if (iteration < multiSelectValue.length) {
                    stringifiedValues += ';#;#';
                }
            });
            return stringifiedValues;
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
            return parseInt(yyyy + doubleDigit(mm) + doubleDigit(dd));
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

        /**
         * @ngdoc function
         * @name utilityService.batchProcess
         * @description
         * We REALLY don't want to lock the user's browser (blocking the UI thread) while iterating over an array of
         * items and performing some process on them.  This function cuts the process into as many 50ms chunks as are
         * necessary. Based on example found in the following article:
         * [Timed array processing in JavaScript](http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/);
         * @param {Object[]} items The entities that need to be processed.
         * @param {Function} process Reference to the process to be executed for each of the entities.
         * @param {Object} context this
         * @param {Function} [callback] Function to execute when processing is complete.
         * @param {Number} [delay=25] Number of milliseconds to delay between batches.
         * @param {Number} [maxItems=items.length] Maximum number of items to process before pausing.
         * @example
         * <pre>
         * function buildProjectSummary = function() {
         *    var deferred = $q.defer();
         *
         *    // Taken from a fictitious projectsModel.js
         *    projectModel.getAllListItems().then(function(entities) {
         *      var summaryObject = {};
         *      var extendProjectSummary = function(project) {
         *          // Do some process intensive stuff here
         *
         *      };
         *
         *      // Now that we have all of our projects we want to iterate
         *      // over each to create our summary object. The problem is
         *      // this could easily cause the page to hang with a sufficient
         *      // number of entities.
         *      apUtilityService.batchProcess(entities, extendProjectSummary, function() {
         *          // Long running process is complete so resolve promise
         *          deferred.resolve(summaryObject);
         *      }, 25, 1000);
         *    };
         *
         *    return deferred.promise;
         * }
         *
         * </pre>
         */

        function batchProcess(items, process, context, callback, delay, maxItems) {
            var n = items.length,
                delay = delay || 25,
                maxItems = maxItems || n,
                i = 0;

            function chunkTimer() {
                var start = +new Date(),
                    j = i;

                while (i < n && (i - j) < maxItems && (new Date() - start < 50)) {
                    process.call(context, items[i]);
                    i += 1;
                }

                if (i < n) {
                    $log.info("Batch Delayed");
                    setTimeout(chunkTimer, delay);
                }
                else {
                    callback(items);
                }
            }
            chunkTimer();
        }

        return {
            attrToJson: attrToJson,
            batchProcess: batchProcess,
            dateWithinRange: dateWithinRange,
            fromCamelCase: fromCamelCase,
            lookupToJsonObject: lookupToJsonObject,
            SplitIndex: SplitIndex,
            stringifySharePointDate: stringifySharePointDate,
            stringifySharePointMultiSelect: stringifySharePointMultiSelect,
            toCamelCase: toCamelCase,
            xmlToJson: xmlToJson
        };
    });