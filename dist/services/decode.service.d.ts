import { FieldVersionCollection, IFieldDefinition, ListItem, Lookup, ListService, User } from '../factories';
import { IListFieldMapping } from '../factories/list-service.factory';
/**
 * @ngdoc service
 * @name angularPoint.apDecodeService
 * @description
 * Processes the XML received from SharePoint and converts it into JavaScript objects based on predefined field types.
 *
 * @requires angularPoint.apUtilityService
 * @requires angularPoint.apConfig
 * @requires angularPoint.CacheService
 */
export { checkResponseForErrors, convertUTCDateToLocalDate, extendFieldDefinitionsFromXML, extendListDefinitionFromXML, extendListMetadata, extendObjectWithXMLAttributes, jsAttachments, jsBoolean, jsCalc, jsChoiceMulti, jsDate, jsFloat, jsInt, jsLookup, jsLookupMulti, jsObject, jsString, jsUser, jsUserMulti, locateListItemNodes, parseFieldVersions, parseStringValue, parseXmlEntity, processListItems };
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:checkResponseForErrors
 * @methodOf angularPoint.apDecodeService
 * @description
 * Errors don't always throw correctly from SPServices so this function checks to see if part
 * of the XHR response contains an "errorstring" element.
 * @param {object} responseXML XHR response from the server.
 * @returns {string} Returns an error string if present.
 */
declare function checkResponseForErrors(responseXML: Document): string;
/** Converts UTC date to a localized date
 * Taken from: http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
 */
declare function convertUTCDateToLocalDate(date: Date): Date;
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:extendFieldDefinitionsFromXML
 * @methodOf angularPoint.apDecodeService
 * @description
 * Takes the XML response from a web service call and extends any field definitions in the model
 * with additional field metadata.  Important to note that all properties will coming from the XML start
 * with a capital letter.
 * @param {object[]} fieldDefinitions Field definitions from the model.
 * @param {object} responseXML XML response from the server.
 */
declare function extendFieldDefinitionsFromXML(fieldDefinitions: IFieldDefinition[], responseXML: Element): IFieldDefinition[];
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:extendListDefinitionFromXML
 * @methodOf angularPoint.apDecodeService
 * @description
 * Takes the XML response from a web service call and extends the listService definition in the listService
 * with additional field metadata.  Important to note that all properties will coming from the XML start
 * with a capital letter.
 * @param {object} listService listService
 * @param {object} responseXML XML response from the server.
 * @returns {object} Extended listService object.
 */
declare function extendListDefinitionFromXML(listService: ListService<any>, responseXML: Element): ListService<any>;
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:extendListMetadata
 * @methodOf angularPoint.apDecodeService
 * @description
 * Convenience method that extends the list definition and the field definitions from an xml list response
 * from the server.  Can be used specifically with GetListItemsSinceToken and GetList operations.
 * @param {object} listSer ListService for a given list.
 * @param {object} responseXML XML response from the server.
 */
declare function extendListMetadata(listService: ListService<any>, responseXML: Element): void;
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:extendObjectWithXMLAttributes
 * @methodOf angularPoint.apDecodeService
 * @description
 * Takes an XML element and copies all attributes over to a given JS object with corresponding values.  If
 * no JS Object is provided, it extends an empty object and returns it.  If an attributeTypes object is provided
 * we parse each of the defined field so they are typed correctly instead of being a simple string.
 * Note: Properties are not necessarily CAMLCase.
 * @param {object} xmlObject An XML element.
 * @param {object} [jsObject={}] An optional JS Object to extend XML attributes to.
 * @param {object} [attributeTypes={}] Key/Val object with keys being the name of the field and val being the
 * type of field.
 * @returns {object} JS Object
 */
declare function extendObjectWithXMLAttributes(xmlObject: Element, jsObject?: Object, attributeTypes?: Object): Object;
declare function jsAttachments(str: any): string[] | number | string;
declare function jsBoolean(str: string): boolean;
declare function jsCalc(str: string): any;
declare function jsChoiceMulti(str: string): string[];
declare function jsDate(str: string): Date;
declare function jsFloat(str: string): number | any;
declare function jsInt(str: string): number | any;
declare function jsLookup(str: string): Lookup<any>;
declare function jsLookupMulti(str: string): Lookup<any>[];
declare function jsObject(str: string): Object;
declare function jsString(str: string): string;
declare function jsUser(str: string): User;
declare function jsUserMulti(str: string): User[];
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:locateListItemNodes
 * @methodOf angularPoint.apDecodeService
 * @description
 * Takes an XML response from SharePoint and finds all "<z:row ..." elements which represent each list item.
 *
 * @param {Element} responseXML Returned XML from web service call.
 * @returns {NodeListOf<Element>} Array of <z:row elements.
 */
declare function locateListItemNodes(responseXML: Element): NodeListOf<Element>;
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:parseFieldVersions
 * @methodOf angularPoint.apDecodeService
 * @description
 * Takes an XML response from SharePoint webservice and returns an array of field versions.
 *
 * @param {xml} responseXML Returned XML from web service call.
 * @param {object} fieldDefinition Field definition from the model.
 *
 * @returns {FieldVersionCollection} FieldVersionCollection object with all versions included.
 */
declare function parseFieldVersions(responseXML: Element, fieldDefinition: IFieldDefinition): FieldVersionCollection;
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:parseStringValue
 * @methodOf angularPoint.apDecodeService
 * @description
 * Converts a SharePoint string representation of a field into the correctly formatted JavaScript version
 * based on object type.  A majority of this code is directly taken from Marc Anderson's incredible
 * [SPServices](http://spservices.codeplex.com/) project but it needed some minor tweaking to work here.
 * @param {string} str SharePoint string representing the value.
 * @param {string} [objectType='Text'] The type based on field definition.  See
 * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
 * @returns {*} The newly instantiated JavaScript value based on field type.
 */
declare function parseStringValue(str: string, objectType?: string): any;
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:parseXMLEntity
 * @methodOf angularPoint.apDecodeService
 * @description
 * Convert an XML list item into a JS object using the fields defined in the model for the given list item.
 * @param {object} xmlEntity XML Object.
 * @param {object} options Configuration options.
 * @param {string} options.mapping Mapping of fields we'd like to extend on our JS object.
 * @returns {object} New entity using the factory on the model.
 */
declare function parseXmlEntity<T extends ListItem<any>>(xmlEntity: Element, mapping: IListFieldMapping): {};
/**
 * @ngdoc function
 * @name angularPoint.apDecodeService:processListItems
 * @methodOf angularPoint.apDecodeService
 * @description
 * Converts xml <z:row elements into JS objects based on field mapping found in list service and finally instantiates
 * newly created list items with list service factory.
 * @param {xml} responseXML XML respose from SOAP web service.
 * @param {IListFieldMapping} mapping Field definitions, typically stored on the listService.
 * @param {ListService} listService Allow list items to reference parent list service directly.
 * @returns {Object} Inedexed Cache.
 */
declare function processListItems<T extends ListItem<any>>(responseXML: Element, mapping: IListFieldMapping, listService: ListService<T>): T[];
