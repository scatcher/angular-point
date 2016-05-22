import { IUserPermissionsObject } from '../constants';
/**
 * @ngdoc service
 * @name angularPoint.apUtilityService
 * @description
 * Provides shared utility functionality across the application.
 *
 */
export { convertEffectivePermMask, dateWithinRange, doubleDigit, fromCamelCase, isGuid, registerChange, resolvePermissions, splitIndex, stringifyXML, yyyymmdd };
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
declare function convertEffectivePermMask(permMaskName: string): string;
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
declare function dateWithinRange(startDate: Date, endDate: Date, dateToCheck?: Date): boolean;
/**
 * @ngdoc function
 * @name angularPoint.apUtilityService:doubleDigit
 * @methodOf angularPoint.apUtilityService
 * @description Add a leading zero if a number/string only contains a single character.  So in the case
 * where the number 9 is passed in the string '09' is returned.
 * @param {(number|string)} val A number or string to evaluate.
 * @returns {string} Two digit string.
 */
declare function doubleDigit(val: number | string): string;
/**
 * @ngdoc function
 * @name angularPoint.apUtilityService:fromCamelCase
 * @methodOf angularPoint.apUtilityService
 * @param {string} str String to convert.
 * @description
 * Converts a camel case string into a space delimited string with each word having a capitalized first letter.
 * @returns {string} Humanized string.
 */
declare function fromCamelCase(str: any): string;
declare function isGuid(value: any): boolean;
/**
 * @ngdoc function
 * @name angularPoint.apUtilityService:registerChange
 * @methodOf angularPoint.apUtilityService
 * @description
 * If online and sync is being used, notify all online users that a change has been made.
 * //Todo Break this functionality into FireBase module that can be used if desired.
 * @param {object} model event
 */
declare function registerChange(model: any, changeType: string, listItemId: number): void;
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
declare function resolvePermissions(permissionsMask: any): IUserPermissionsObject;
/**
 * @ngdoc function
 * @name angularPoint.apUtilityService:splitIndex
 * @methodOf angularPoint.apUtilityService
 * @description Split values like 1;#value into id and value.
 * @param {string} str Lookup string from SharePoint.
 * @returns {Lookup} Object with lookupValue and lookupId.
 */
declare function splitIndex(str: string): {
    id: number;
    value: string;
};
/**
 * @ngdoc function
 * @name angularPoint.apUtilityService:stringifyXML
 * @methodOf angularPoint.apUtilityService
 * @description Simple utility to convert an XML object into a string and remove unnecessary whitespace.
 * @param {object} xml XML object.
 * @returns {string} Stringified version of the XML object.
 */
declare function stringifyXML(xml: Element): string;
/**
 * @ngdoc function
 * @name angularPoint.apUtilityService:yyyymmdd
 * @methodOf angularPoint.apUtilityService
 * @description
 * Convert date into a int formatted as yyyymmdd
 * We don't need the time portion of comparison so an int makes this easier to evaluate
 */
declare function yyyymmdd(date: Date): number;
