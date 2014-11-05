'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apUtilityService
 * @description
 * Provides shared utility functionality across the application.
 *
 * @requires angularPoint.apConfig
 */
angular.module('angularPoint')
    .factory('apUtilityService', function ($q, _, apConfig, $timeout) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /** Extend underscore with a simple helper function */
        _.mixin({
            isDefined: function (value) {
                return !_.isUndefined(value);
            },
            /** Based on functionality in Breeze.js */
            isGuid: function (value) {
                return (typeof value === "string") && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/
                        .test(value);
            }
        });


        return {
            batchProcess: batchProcess,
            convertEffectivePermMask: convertEffectivePermMask,
            dateWithinRange: dateWithinRange,
            doubleDigit: doubleDigit,
            fromCamelCase: fromCamelCase,
            registerChange: registerChange,
            resolvePermissions: resolvePermissions,
            SplitIndex: SplitIndex,
            stringifyXML:stringifyXML,
            toCamelCase: toCamelCase,
            yyyymmdd: yyyymmdd
        };



        /**
         * Add a leading zero if a number/string only contains a single character
         * @param {number|string} val
         * @returns {string} Two digit string.
         */
        function doubleDigit(val) {
            if (typeof val === 'number') {
                return val > 9 ? val.toString() : '0' + val;
            } else {
                return doubleDigit(parseInt(val));
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:yyyymmdd
         * @methodOf angularPoint.apUtilityService
         * @description
         * Convert date into a int formatted as yyyymmdd
         * We don't need the time portion of comparison so an int makes this easier to evaluate
         */
        function yyyymmdd(date) {
            var yyyy = date.getFullYear();
            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            /** Add leading 0's to month and day if necessary */
            return parseInt(yyyy + doubleDigit(mm) + doubleDigit(dd));
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:dateWithinRange
         * @methodOf angularPoint.apUtilityService
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
         * @name angularPoint.apUtilityService:batchProcess
         * @methodOf angularPoint.apUtilityService
         * @description
         * We REALLY don't want to lock the user's browser (blocking the UI thread) while iterating over an array of
         * entities and performing some process on them.  This function cuts the process into as many 50ms chunks as are
         * necessary. Based on example found in the following article:
         * [Timed array processing in JavaScript](http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/);
         * @param {Object[]} entities The entities that need to be processed.
         * @param {Function} process Reference to the process to be executed for each of the entities.
         * @param {Object} context this
         * @param {Number} [delay=25] Number of milliseconds to delay between batches.
         * @param {Number} [maxItems=entities.length] Maximum number of entities to process before pausing.
         * @returns {Object} Promise
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

        function batchProcess(entities, process, context, delay, maxItems) {
            var itemCount = entities.length,
                batchCount = 0,
                chunkMax = maxItems || itemCount,
                delay = delay || 25,
                index = 0,
                deferred = $q.defer();

            function chunkTimer() {
                batchCount++;
                var start = +new Date(),
                    chunkIndex = index;

                while (index < itemCount && (index - chunkIndex) < chunkMax && (new Date() - start < 100)) {
                    process.call(context, entities[index], index, batchCount);
                    index += 1;
                }

                if (index < itemCount) {
                    $timeout(chunkTimer, delay);
                }
                else {
                    deferred.resolve(entities);
                }
            }

            chunkTimer();

            return deferred.promise;
        }


        //function batchProcess(items, process, context, delay, maxItems) {
        //    var n = items.length,
        //        delay = delay || 25,
        //        maxItems = maxItems || n,
        //        i = 0,
        //        deferred = $q.defer();
        //
        //    chunkTimer(i, n, deferred, items, process, context, delay, maxItems);
        //    return deferred.promise;
        //}
        //
        //function chunkTimer(i, n, deferred, items, process, context, delay, maxItems) {
        //    var start = +new Date(),
        //        j = i;
        //
        //    while (i < n && (i - j) < maxItems && (new Date() - start < 100)) {
        //        process.call(context, items[i]);
        //        i += 1;
        //    }
        //
        //    if (i < n) {
        //        setTimeout(function () {
        //            chunkTimer(j, n, deferred, items, process, context, delay, maxItems);
        //        }, delay);
        //    }
        //    else {
        //        deferred.resolve(items);
        //    }
        //}

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:resolvePermissions
         * @methodOf angularPoint.apUtilityService
         * @param {string} permissionsMask The WSS Rights Mask is an 8-byte, unsigned integer that specifies
         * the rights that can be assigned to a user or site group. This bit mask can have zero or more flags set.
         * @description
         * Converts permMask into something usable to determine permission level for current user.  Typically used
         * directly from a list item.  See ListItem.resolvePermissions.
         *
         * <h3>Additional Info</h3>
         *
         * -   [PermMask in SharePoint DVWPs](http://sympmarc.com/2009/02/03/permmask-in-sharepoint-dvwps/)
         * -   [$().SPServices.SPLookupAddNew and security trimming](http://spservices.codeplex.com/discussions/208708)
         *
         * @returns {object} Object with properties for each permission level identifying if current user has rights (true || false)
         * @example
         * <pre>
         * var perm = apUtilityService.resolvePermissions('0x0000000000000010');
         * </pre>
         * Example of what the returned object would look like
         * for a site admin.
         * <pre>
         * perm = {
         *    "ViewListItems":true,
         *    "AddListItems":true,
         *    "EditListItems":true,
         *    "DeleteListItems":true,
         *    "ApproveItems":true,
         *    "OpenItems":true,
         *    "ViewVersions":true,
         *    "DeleteVersions":true,
         *    "CancelCheckout":true,
         *    "PersonalViews":true,
         *    "ManageLists":true,
         *    "ViewFormPages":true,
         *    "Open":true,
         *    "ViewPages":true,
         *    "AddAndCustomizePages":true,
         *    "ApplyThemeAndBorder":true,
         *    "ApplyStyleSheets":true,
         *    "ViewUsageData":true,
         *    "CreateSSCSite":true,
         *    "ManageSubwebs":true,
         *    "CreateGroups":true,
         *    "ManagePermissions":true,
         *    "BrowseDirectories":true,
         *    "BrowseUserInfo":true,
         *    "AddDelPrivateWebParts":true,
         *    "UpdatePersonalWebParts":true,
         *    "ManageWeb":true,
         *    "UseRemoteAPIs":true,
         *    "ManageAlerts":true,
         *    "CreateAlerts":true,
         *    "EditMyUserInfo":true,
         *    "EnumeratePermissions":true,
         *    "FullMask":true
         * }
         * </pre>
         */
        function resolvePermissions(permissionsMask) {
            var permissionSet = {};
            permissionSet.ViewListItems = (1 & permissionsMask) > 0;
            permissionSet.AddListItems = (2 & permissionsMask) > 0;
            permissionSet.EditListItems = (4 & permissionsMask) > 0;
            permissionSet.DeleteListItems = (8 & permissionsMask) > 0;
            permissionSet.ApproveItems = (16 & permissionsMask) > 0;
            permissionSet.OpenItems = (32 & permissionsMask) > 0;
            permissionSet.ViewVersions = (64 & permissionsMask) > 0;
            permissionSet.DeleteVersions = (128 & permissionsMask) > 0;
            permissionSet.CancelCheckout = (256 & permissionsMask) > 0;
            permissionSet.PersonalViews = (512 & permissionsMask) > 0;

            permissionSet.ManageLists = (2048 & permissionsMask) > 0;
            permissionSet.ViewFormPages = (4096 & permissionsMask) > 0;

            permissionSet.Open = (permissionsMask & 65536) > 0;
            permissionSet.ViewPages = (permissionsMask & 131072) > 0;
            permissionSet.AddAndCustomizePages = (permissionsMask & 262144) > 0;
            permissionSet.ApplyThemeAndBorder = (permissionsMask & 524288) > 0;
            permissionSet.ApplyStyleSheets = (1048576 & permissionsMask) > 0;
            permissionSet.ViewUsageData = (permissionsMask & 2097152) > 0;
            permissionSet.CreateSSCSite = (permissionsMask & 4194314) > 0;
            permissionSet.ManageSubwebs = (permissionsMask & 8388608) > 0;
            permissionSet.CreateGroups = (permissionsMask & 16777216) > 0;
            permissionSet.ManagePermissions = (permissionsMask & 33554432) > 0;
            permissionSet.BrowseDirectories = (permissionsMask & 67108864) > 0;
            permissionSet.BrowseUserInfo = (permissionsMask & 134217728) > 0;
            permissionSet.AddDelPrivateWebParts = (permissionsMask & 268435456) > 0;
            permissionSet.UpdatePersonalWebParts = (permissionsMask & 536870912) > 0;
            permissionSet.ManageWeb = (permissionsMask & 1073741824) > 0;
            permissionSet.UseRemoteAPIs = (permissionsMask & 137438953472) > 0;
            permissionSet.ManageAlerts = (permissionsMask & 274877906944) > 0;
            permissionSet.CreateAlerts = (permissionsMask & 549755813888) > 0;
            permissionSet.EditMyUserInfo = (permissionsMask & 1099511627776) > 0;
            permissionSet.EnumeratePermissions = (permissionsMask & 4611686018427387904) > 0;
            permissionSet.FullMask = (permissionsMask == 9223372036854775807);

            /**
             * Full Mask only resolves correctly for the Full Mask level
             * so in that case, set everything to true
             */
            if (permissionSet.FullMask) {
                _.each(permissionSet, function (perm, key) {
                    permissionSet[key] = true;
                });
            }

            return permissionSet;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:convertEffectivePermMask
         * @methodOf angularPoint.apUtilityService
         * @description
         * GetListItemsSinceToken operation returns the list element with an EffectivePermMask attribute which is the
         * name of the PermissionMask.  We then need to convert the name into an actual mask so this function contains
         * the known permission names with their masks.  If a provided mask name is found, the cooresponding mask
         * is returned.  Otherwise returns null.  [MSDN Source](http://msdn.microsoft.com/en-us/library/jj575178(v=office.12).aspx)
         * @param {string} permMaskName Permission mask name.
         * @returns {string|null} Return the mask for the name.
         */
        function convertEffectivePermMask(permMaskName) {
            var permissionMask = null;

            var permissions = {
                //General
                EmptyMask: '0x0000000000000000',
                FullMask: '0x7FFFFFFFFFFFFFFF',

                //List and document permissions
                ViewListItems: '0x0000000000000001',
                AddListItems: '',
                EditListItems: '0x0000000000000004',
                DeleteListItems: '0x0000000000000008',
                ApproveItems: '0x0000000000000010',
                OpenItems: '0x0000000000000020',
                ViewVersions: '0x0000000000000040',
                DeleteVersions: '0x0000000000000080',
                CancelCheckout: '0x0000000000000100',
                ManagePersonalViews: '0x0000000000000200',
                ManageLists: '0x0000000000000800',
                ViewFormPages: '0x0000000000001000',

                //Web level permissions
                Open: '0x0000000000010000',
                ViewPages: '0x0000000000020000',
                AddAndCustomizePages: '0x0000000000040000',
                ApplyThemeAndBorder: '0x0000000000080000',
                ApplyStyleSheets: '0x0000000000100000',
                ViewUsageData: '0x0000000000200000',
                CreateSSCSite: '0x0000000000400000',
                ManageSubwebs: '0x0000000000800000',
                CreateGroups: '0x0000000001000000',
                ManagePermissions: '0x0000000002000000',
                BrowseDirectories: '0x0000000004000000',
                BrowseUserInfo: '0x0000000008000000',
                AddDelPrivateWebParts: '0x0000000010000000',
                UpdatePersonalWebParts: '0x0000000020000000',
                ManageWeb: '0x0000000040000000',
                UseClientIntegration: '0x0000001000000000',
                UseRemoteAPIs: '0x0000002000000000',
                ManageAlerts: '0x0000004000000000',
                CreateAlerts: '0x0000008000000000',
                EditMyUserInfo: '0x0000010000000000',

                //Special Permissions
                EnumeratePermissions: '0x4000000000000000'
            };

            if(permissions[permMaskName]) {
                permissionMask = permissions[permMaskName];
            }
            return permissionMask;
        }

        function toCamelCase(s) {
            return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:fromCamelCase
         * @methodOf angularPoint.apUtilityService
         * @param {string} s String to convert.
         * @description
         * Converts a camel case string into a space delimited string with each word having a capitalized first letter.
         * @returns {string} Humanized string.
         */
        function fromCamelCase(s) {
            // insert a space before all caps
            return s.replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) {
                    return str.toUpperCase();
                });
        }

        // Split values like 1;#value into id and value
        function SplitIndex(s) {
            var spl = s.split(';#');
            this.id = parseInt(spl[0], 10);
            this.value = spl[1];
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:stringifyXML
         * @methodOf angularPoint.apUtilityService
         * @description Simple utility to convert an XML object into a string and remove unnecessary whitespace.
         * @param {object} xml XML object.
         * @returns {string} Stringified version of the XML object.
         */
        function stringifyXML(xml) {
            var str;

            if(_.isObject(xml)) {
                str = xmlToString(xml).replace(/\s+/g, ' ');
            } else if(_.isString(xml)) {
                str = xml;
            }
            return str;
        }

        function xmlToString(xmlData) {
            var xmlString;
            if(typeof XMLSerializer !== 'undefined') {
                /** Modern Browsers */
                xmlString = (new XMLSerializer()).serializeToString(xmlData);
            } else {
                /** Old versions of IE */
                xmlString = xmlData.xml;
            }
            return xmlString;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:registerChange
         * @methodOf angularPoint.apUtilityService
         * @description
         * If online and sync is being used, notify all online users that a change has been made.
         * //Todo Break this functionality into FireBase module that can be used if desired.
         * @param {object} model event
         */
        function registerChange(model) {
            /** Disabled this functionality until I can spend the necessary time to test */
            //if (!apConfig.offline && model.sync && _.isFunction(model.sync.registerChange)) {
            //    /** Register change after successful update */
            //    model.sync.registerChange();
            //}
        }
    });
