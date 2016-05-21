declare const fieldTypes: {
    Text: {
        defaultValue: string;
    };
    Note: {
        defaultValue: string;
    };
    Boolean: {
        defaultValue: any;
    };
    Calculated: {
        defaultValue: any;
    };
    Choice: {
        defaultValue: string;
    };
    Counter: {
        defaultValue: any;
    };
    Currency: {
        defaultValue: any;
    };
    DateTime: {
        defaultValue: any;
    };
    Integer: {
        defaultValue: any;
    };
    JSON: {
        defaultValue: string;
    };
    Lookup: {
        defaultValue: string;
    };
    LookupMulti: {
        defaultValue: any[];
    };
    Mask: {
        defaultValue: string;
    };
    Attachments: {
        defaultValue: any[];
    };
    MultiChoice: {
        defaultValue: any[];
    };
    User: {
        defaultValue: string;
    };
    UserMulti: {
        defaultValue: any[];
    };
};
/**
 * @ngdoc service
 * @name angularPoint.apFieldService
 * @description
 * Handles the mapping of the various types of fields used within a SharePoint list
 */
export { fieldTypes, getDefaultValueForType, getDefinition, resolveValueForEffectivePermMask };
/**
 * @ngdoc function
 * @name angularPoint.apFieldService:getDefaultValueForType
 * @methodOf angularPoint.apFieldService
 * @description
 * Returns the empty value expected for a field type
 * @param {string} fieldType Type of field.
 * @returns {*} Default value based on field type.
 */
declare function getDefaultValueForType(fieldType: string): any;
/**
 * Returns an object defining a specific field type
 * @param {string} fieldType
 * @returns {object} fieldTypeDefinition
 */
declare function getDefinition(fieldType: any): any;
/**
 * @ngdoc function
 * @name angularPoint.apFieldService:getMockData
 * @methodOf angularPoint.apFieldService
 * @description
 * Can return mock data appropriate for the field type, by default it dynamically generates data but
 * the staticValue param will instead return a hard coded type specific value
 *
 * @requires ChanceJS to produce dynamic data.
 * https://github.com/victorquinn/chancejs
 * @param {string} fieldType Field type from the field definition.
 * @param {object} [options] Optional params.
 * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
 * @returns {*} mockData
 */
/**
 * @ngdoc function
 * @name angularPoint.apFieldService:mockPermMask
 * @methodOf angularPoint.apFieldService
 * @description
 * Defaults to a full mask but allows simulation of each of main permission levels
 * @param {object} [options] Options container.
 * @param {string} [options.permissionLevel=FullMask] Optional mask.
 * @returns {string} Values for mask.
 */
/**
 * @ngdoc function
 * @name angularPoint.apFieldService:resolveValueForEffectivePermMask
 * @methodOf angularPoint.apFieldService
 * @description
 * Takes the name of a permission mask and returns a permission value which can then be used
 * to generate a permission object using modelService.resolvePermissions(outputfromthis)
 * @param {string} perMask Options:
 *  - AddListItems
 *  - EditListItems
 *  - DeleteListItems
 *  - ApproveItems
 *  - FullMask
 *  - ViewListItems
 * @returns {string} value
 */
declare function resolveValueForEffectivePermMask(perMask: any): any;
