import * as _ from 'lodash';
import {CacheService} from './apCacheService';
import {LookupFactory, Lookup} from '../factories/apLookupFactory';
import {UserFactory, User} from '../factories/apUserFactory';
import {FieldService} from './apFieldService';
import {IXMLListAttributeTypes} from '../constants/apXMLListAttributeTypes';
import {IXMLFieldAttributeTypes} from '../constants/apXMLFieldAttributeTypes';
import {XMLToJSONService} from './apXMLToJSONService';
import {ListItem, IUninstantiatedExtendedListItem, IUninstantiatedListItem} from '../factories/apListItemFactory';
import {Model} from '../factories/apModelFactory';
import {IQuery, IExecuteQueryOptions} from '../factories/apQueryFactory';
import {IndexedCache} from '../factories/apIndexedCacheFactory';
import {FieldDefinition} from '../factories/apFieldFactory';
import {List, ListFieldMapping} from '../factories/apListFactory';
import {FieldVersionCollection} from '../factories/apListItemVersionFactory';
/**
 * @ngdoc service
 * @name angularPoint.apDecodeService
 * @description
 * Processes the XML received from SharePoint and converts it into JavaScript objects based on predefined field types.
 *
 * @requires angularPoint.apUtilityService
 * @requires angularPoint.apConfig
 * @requires angularPoint.apCacheService
 */
export class DecodeService {
    static $inject = ['apCacheService', 'apLookupFactory', 'apUserFactory', 'apFieldService',
        'apXMLListAttributeTypes', 'apXMLFieldAttributeTypes', 'apXMLToJSONService'];

    constructor(private apCacheService: CacheService, private apLookupFactory: LookupFactory,
                private apUserFactory: UserFactory, private apFieldService: FieldService, private apXMLListAttributeTypes: IXMLListAttributeTypes,
                private apXMLFieldAttributeTypes: IXMLFieldAttributeTypes, private apXMLToJSONService: XMLToJSONService) {

    }

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
    checkResponseForErrors(responseXML: Element | Document): string {
        let error;
        /** Look for <errorstring></errorstring> or <ErrorText></ErrorText> for details on any errors */
        let errorElements = ['ErrorText', 'errorstring'];
        _.each(errorElements, (element) => {
            $(responseXML).find(element).each(function () {
                error = $(this).text();
                /** Break early if found */
                return false;
            });
        });
        return error;
    }

    /** Converts UTC date to a localized date
     * Taken from: http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
     * */
    convertUTCDateToLocalDate(date: Date): Date {
        let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        let offset = date.getTimezoneOffset() / 60;
        let hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:createListItemProvider
     * @methodOf angularPoint.apDecodeService
     * @description
     * The initial constructor for a list item that references the array where the entity exists and the
     * query used to fetch the entity.  From there it extends the entity using the factory defined in the
     * model for the list item.
     * @param {object} model Reference to the model for the list item.
     * @param {object} query Reference to the query object used to retrieve the entity.
     * @param {object} indexedCache Location where we'll be pushing the new entity.
     * @returns {Function} Returns a function that takes the new list item while keeping model, query,
     * and container in scope for future reference.
     */
    createListItemProvider<T extends ListItem<any>>(model: Model, query: IQuery<T>, indexedCache: IndexedCache<T>): (rawObject: Object) => T {
        return (rawObject: IUninstantiatedExtendedListItem<T>) => {
            let listItem: T;

            if (indexedCache.has(rawObject.id)) {
                //Object already exists in cache so we just need to update properties
                listItem = indexedCache.get(rawObject.id);

                //Call constructor on original list item to perform any initialization logic again
                listItem.constructor(rawObject);

            } else {
                //Creating a new List Item

                /** Create Reference to the indexed cache */
                rawObject.getCache = () => indexedCache;

                /** Allow us to reference the originating query that generated this object */
                rawObject.getQuery = () => query;

                listItem = new model.factory<T>(rawObject);

                /** Register in global application listItem cache */
                this.apCacheService.registerEntity<T>(listItem, indexedCache);
            }

            //Store the value instead of just a reference to the original object
            let pristineValue = _.cloneDeep(rawObject);

            /**
             * @ngdoc function
             * @name ListItem.getPristine
             * @description
             * Allow us to reference the uninstantiated version of this list item.  Reference set
             * via angularPoint.apDecodeService:createListItemProvider.
             */
            listItem.getPristine = () => pristineValue;

            return indexedCache.get(rawObject.id);
        }
    }

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
    extendFieldDefinitionsFromXML(fieldDefinitions: FieldDefinition[], responseXML: Element): FieldDefinition[] {
        let fieldMap = {};

        /** Map all custom fields with keys of the staticName and values = field definition */
        _.each(fieldDefinitions, (field) => {
            if (field.staticName) {
                fieldMap[field.staticName] = field;
            }
        });

        /** Iterate over each of the field nodes */
        let filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, 'Field');

        _.each(filteredNodes, (xmlField: Element) => {
            let staticName = $(xmlField).attr('StaticName');
            let fieldDefinition = fieldMap[staticName];

            /** If we've defined this field then we should extend it */
            if (fieldDefinition) {

                this.extendObjectWithXMLAttributes(xmlField, fieldDefinition, this.apXMLFieldAttributeTypes);

                /** Additional processing for Choice fields to include the default value and choices */
                if (fieldDefinition.objectType === 'Choice' || fieldDefinition.objectType === 'MultiChoice') {
                    fieldDefinition.Choices = [];
                    /** Convert XML Choices object to an array of choices */
                    let xmlChoices = $(xmlField).find('CHOICE');
                    _.each(xmlChoices, (xmlChoice) => {
                        fieldDefinition.Choices.push($(xmlChoice).text());
                    });
                    fieldDefinition.Default = $(xmlField).find('Default').text();
                }
            }
        });

        return fieldDefinitions;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:extendListDefinitionFromXML
     * @methodOf angularPoint.apDecodeService
     * @description
     * Takes the XML response from a web service call and extends the list definition in the model
     * with additional field metadata.  Important to note that all properties will coming from the XML start
     * with a capital letter.
     * @param {object} list model.list
     * @param {object} responseXML XML response from the server.
     * @returns {object} Extended list object.
     */
    extendListDefinitionFromXML(list: List, responseXML: Element): List {
        let service = this;
        $(responseXML).find("List").each(function () {
            service.extendObjectWithXMLAttributes(this, list, service.apXMLListAttributeTypes);
        });
        return list;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:extendListMetadata
     * @methodOf angularPoint.apDecodeService
     * @description
     * Convenience method that extends the list definition and the field definitions from an xml list response
     * from the server.  Can be used specifically with GetListItemsSinceToken and GetList operations.
     * @param {object} model Model for a given list.
     * @param {object} responseXML XML response from the server.
     */
    extendListMetadata(model: Model, responseXML: Element): void {
        this.extendListDefinitionFromXML(model.list, responseXML);
        this.extendFieldDefinitionsFromXML(model.list.fields, responseXML);
    }

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
    extendObjectWithXMLAttributes(xmlObject: Element, jsObject?: Object, attributeTypes?: Object): Object {
        let objectToExtend = jsObject || {};
        let attributeMap = attributeTypes || {};
        let xmlAttributes = xmlObject.attributes;

        _.each(xmlAttributes, (attr, attrNum) => {
            let attrName = xmlAttributes[attrNum].name;
            objectToExtend[attrName] = $(xmlObject).attr(attrName);
            if (attributeMap[attrName]) {
                objectToExtend[attrName] = this.parseStringValue(objectToExtend[attrName], attributeMap[attrName]);
            }
        });
        return objectToExtend;
    }


    jsAttachments(str): string[] | number | string {
        /* Depending on CAMLQueryOptions Config an attachment can be formatted in 1 of the below 3 ways:
         1. {number} The number of attachments for a given list item.
         CAMLQueryOptions
         <IncludeAttachmentUrls>FALSE</IncludeAttachmentUrls>
         <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>

         Example
         ows_Attachments="2"

         2. {string}
         CAMLQueryOptions
         <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>
         <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>

         Format
         ;#[ListUrl]/Attachments/[ListItemId]/[FileName];#

         Example:
         ows_Attachments=";#https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx;#"

         //Todo Check to see if there is any value in this option
         3. {string} NOTE: We don't currently handle this format.
         CAMLQueryOptions
         <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>
         <IncludeAttachmentVersion>TRUE</IncludeAttachmentVersion>

         Format
         ;#[ListUrl]/Attachments/[ListItemId]/[FileName];#[AttachmentGUID],[Version Number];#

         Example:
         ows_Attachments=";#https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx;#{4378D394-8601-480D-ABD0-0A0505E726FB},1;#"
         */
        if (!isNaN(str)) {
            /** Value is a number current stored as a string */
            let int = parseInt(str);
            if (int > 0) {
                return int;
            } else {
                return '';
            }
        } else {
            /** Split into an array of attachment URLs */
            return this.jsChoiceMulti(str);
        }
    }

    jsBoolean(str: string): boolean {
        /** SharePoint uses different string representations for booleans in different places so account for each */
        return str === '1' || str === 'True' || str === 'TRUE';
    }

    jsCalc(str: string): any {
        if (str.length === 0) {
            return null;
        } else {
            let thisCalc = str.split(';#');
            // The first value will be the calculated column value type, the second will be the value
            return this.parseStringValue(thisCalc[1], thisCalc[0]);
        }
    }

    jsChoiceMulti(str: string): string[] {
        if (str.length === 0) {
            return [];
        } else {
            let thisChoiceMultiObject = [];
            let thisChoiceMulti = str.split(';#');
            for (let i = 0; i < thisChoiceMulti.length; i++) {
                if (thisChoiceMulti[i].length !== 0) {
                    thisChoiceMultiObject.push(thisChoiceMulti[i]);
                }
            }
            return thisChoiceMultiObject;
        }
    }

    jsDate(str: string): Date {
        if (!str) {
            return null;
        } else {
            /** Replace dashes with slashes and the "T" deliminator with a space if found */
            let dt = str.split("T")[0] !== str ? str.split("T") : str.split(" ");
            let d = dt[0].split("-");
            let t = dt[1].split(":");
            let t3 = t[2].split("Z");
            return new Date(<any> d[0], (<any>d[1] - 1), <any>d[2], <any>t[0], <any>t[1], <any>t3[0]);
        }
    }

    jsFloat(str: string): number {
        if (!str) {
            return <any>str;
        } else {
            return parseFloat(str);
        }
    }

    jsInt(str: string): number {
        if (!str) {
            return <any>str;
        } else {
            return parseInt(str, 10);
        }
    }

    jsLookup(str: string, options?: Object): Lookup<any> {
        if (str.length === 0) {
            return null;
        } else {
            //Send to constructor
            return this.apLookupFactory.create(str, options);
        }
    }

    jsLookupMulti(str: string, options?: Object): Lookup<any>[] {
        if (str.length === 0) {
            return [];
        } else {
            let thisLookupMultiObject = [];
            let thisLookupMulti = str.split(';#');
            for (let i = 0; i < thisLookupMulti.length; i = i + 2) {
                /** Ensure a lookup id is present before attempting to push a new lookup */
                if (thisLookupMulti[i]) {
                    let thisLookup = this.jsLookup(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
                    thisLookupMultiObject.push(thisLookup);
                }
            }
            return thisLookupMultiObject;
        }
    }

    jsObject(str: string): Object {
        if (!str) {
            return str;
        } else {
            /** Ensure JSON is valid and if not throw error with additional detail */
            let json = null;
            try {
                json = JSON.parse(str);
            }
            catch (err) {
                console.error('Invalid JSON: ', str);
            }
            return json;
        }
    }

    jsString(str: string): string {
        return str;
    }

    jsUser(str: string): User {
        if (str.length === 0) {
            return null;
        }
        //Send to constructor
        return this.apUserFactory.create(str);
    }

    jsUserMulti(str: string): User[] {
        if (str.length === 0) {
            return [];
        } else {
            let thisUserMultiObject = [];
            let thisUserMulti = str.split(';#');
            for (let i = 0; i < thisUserMulti.length; i = i + 2) {
                let thisUser = this.jsUser(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
                thisUserMultiObject.push(thisUser);
            }
            return thisUserMultiObject;
        }
    }

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
    parseFieldVersions(responseXML: Element, fieldDefinition: FieldDefinition): FieldVersionCollection {
        // let versions = {};
        let xmlVersions = $(responseXML).find('Version');
        let versionCount = xmlVersions.length;

        let fieldVersionCollection = new FieldVersionCollection(fieldDefinition);

        _.each(xmlVersions, (xmlVersion, index) => {

            /** Bug in SOAP Web SPServicesCore returns time in UTC time for version history
             *  Details: https://spservices.codeplex.com/discussions/391879
             */
            let utcDate = this.parseStringValue($(xmlVersion).attr('Modified'), 'DateTime');

            /** Parse the xml and create a representation of the version as a js object */
            let editor = this.parseStringValue($(xmlVersion).attr('Editor'), 'User');
            /** Turn the SharePoint formatted date into a valid date object */
            let modified = this.convertUTCDateToLocalDate(utcDate);
            /** Properly format field based on definition from model */
            let value = this.parseStringValue($(xmlVersion).attr(fieldDefinition.staticName), fieldDefinition.objectType);
            let version = versionCount - index;

            /** Add each distict version to the version collection */
            fieldVersionCollection.addVersion(editor, modified, value, version);

        });

        return fieldVersionCollection;
    }

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
     * @param {object} [options] Options to pass to the object constructor.
     * @param {object} [options.entity] Reference to the parent list item which can be used by child constructors.
     * @param {object} [options.propertyName] Name of property on the list item.
     * @returns {*} The newly instantiated JavaScript value based on field type.
     */
    parseStringValue(str: string, objectType?: string, options?: {entity: Object; propertyName: string;}): any {

        let unescapedValue = _.unescape(str);

        let colValue;

        switch (objectType) {
            case 'Attachments':
                colValue = this.jsAttachments(unescapedValue);
                break;
            case 'Boolean':
                colValue = this.jsBoolean(unescapedValue);
                break;
            case 'Calculated': // Formatted like type;#value so we break it apart and then pass back in to format correctly
                colValue = this.jsCalc(unescapedValue);
                break;
            case 'datetime': // For calculated columns, stored as datetime;#value
            case 'DateTime':
                // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
                colValue = this.jsDate(unescapedValue);
                break;
            case 'Lookup':
                colValue = this.jsLookup(unescapedValue, options);
                break;
            case 'User':
                colValue = this.jsUser(unescapedValue);
                break;
            case 'LookupMulti':
                colValue = this.jsLookupMulti(unescapedValue, options);
                break;
            case 'UserMulti':
                colValue = this.jsUserMulti(unescapedValue);
                break;
            case 'Integer':
            case 'Counter': // Only really used for the ID field
                colValue = this.jsInt(unescapedValue);
                break;
            case 'Number':
            case 'Currency':
            case 'float': // For calculated columns, stored as float;#value
            case 'Float':
                colValue = this.jsFloat(unescapedValue);
                break;
            case 'MultiChoice':
                colValue = this.jsChoiceMulti(unescapedValue);
                break;
            case 'JSON': // Not a true SharePoint field type but acts as a decorator for Note
                colValue = this.jsObject(unescapedValue);
                break;
            case 'Choice':
            case 'HTML':
            case 'Note':
            default:
                // All other objectTypes will be simple strings
                colValue = this.jsString(unescapedValue);
                break;
        }
        return colValue;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:parseXMLEntity
     * @methodOf angularPoint.apDecodeService
     * @description
     * Convert an XML list item into a JS object using the fields defined in the model for the given list item.
     * @param {object} xmlEntity XML Object.
     * @param {object} options Configuration options.
     * @param {string} options.mapping Mapping of fields we'd like to extend on our JS object.
     * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
     * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will be removed.
     * @returns {object} New entity using the factory on the model.
     */
    parseXmlEntity<T extends ListItem<any>>(xmlEntity: Element, {mapping, includeAllAttrs = false, removeOws = true}: IParseXmlEntityOptions) {
        let entity = {};
        let rowAttrs = xmlEntity.attributes;

        /** Bring back all mapped columns, even those with no value */
        _.each(mapping, (fieldDefinition) => {
            entity[fieldDefinition.mappedName] = this.apFieldService.getDefaultValueForType(fieldDefinition.objectType);
        });

        /** Parse through the element's attributes */
        _.each(rowAttrs, (attr) => {
            let thisAttrName = attr.name;
            let thisMapping = mapping[thisAttrName];
            let thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
            let thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
            if (includeAllAttrs || thisMapping !== undefined) {
                entity[thisObjectName] = this.parseStringValue(attr.value, thisObjectType, {
                    entity: entity,
                    propertyName: thisObjectName
                });
            }

        });
        return entity;
    }


    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:processListItems
     * @methodOf angularPoint.apDecodeService
     * @description
     * Post processing of data after returning list items from server.  Returns a promise that resolves with
     * the processed entities.  Promise allows us to batch conversions of large lists to prevent ui slowdowns.
     * @param {object} model Reference to allow updating of model.
     * @param {object} query Reference to the query responsible for requesting entities.
     * @param {xml} responseXML Resolved promise from SPServices web service call.
     * @param {object} [options] Optional configuration object.
     * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
     * they are mapped.
     * @param {string} [options.filter='z:row'] XML filter string used to find the elements to iterate over.
     * @param {Array} [options.mapping=model.list.mapping] Field definitions, typically stored on the model.
     * @param {Array} [options.target=model.getCache()] Optionally pass in an Indexed Cache instead of using the defaul cache.
     * @returns {Object} Inedexed Cache.
     */
    processListItems<T extends ListItem<any>>(model: Model, query: IQuery<T>, responseXML: Element, {
        includeAllAttrs = false,
        filter = 'z:row',
        mapping = model.list.mapping,
        target = model.getCache<T>()
    } = {}): IndexedCache<T> {

        /** Map returned XML to JS objects based on mapping from model */
        let filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, filter);

        /** Prepare constructor for XML entities with references to the query and cached container */
        let listItemProvider = this.createListItemProvider<T>(model, query, target);

        /** Convert XML entities into JS objects */
        let parsedEntities = this.xmlToJson(filteredNodes, {mapping, includeAllAttrs});

        /** Instantiate each list list item with factory on model and add to cache */
        _.each(parsedEntities, (rawListItemObject: IUninstantiatedListItem) => {
            listItemProvider(rawListItemObject);
        });

        return target;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:xmlToJson
     * @methodOf angularPoint.apDecodeService
     * @description
     * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
     * "SPXmlToJson" function.
     * @param {array} xmlEntities ["z:rows"] XML rows that need to be parsed.
     * @param {object} options Options object.
     * @param {IListFieldMapping} options.mapping [columnName: "mappedName", objectType: "objectType"]
     * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
     * they are mapped.
     * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
     * be stripped off the field name.
     * @returns {object[]} An array of JavaScript objects.
     */
    xmlToJson<T extends ListItem<any>>(xmlEntities: Element | NodeList | any, {
        mapping,
        includeAllAttrs = false,
        removeOws = true
    }: IXMLToJsonOptions<T>): Object[] {
        let parseOptions = {mapping, includeAllAttrs, removeOws}
        return _.map(xmlEntities, (xmlEntity: Element) => {
            return this.parseXmlEntity(xmlEntity, parseOptions);
        });
    }

}


/**********************PRIVATE*********************/


export interface IXMLToJsonOptions<T extends ListItem<any>> extends IExecuteQueryOptions {
    includeAllAttrs?: boolean;
    listItemProvider?: Function;
    mapping: ListFieldMapping;
    removeOws?: boolean;
    target?: IndexedCache<T>;
}

export interface IParseXmlEntityOptions {
    mapping: ListFieldMapping;
    includeAllAttrs?: boolean;
    removeOws?: boolean;
}

interface IProcessListItemsOptions<T extends ListItem<any>> {
    includeAllAttrs?: boolean;
    filter?: string;
    mapping: ListFieldMapping;
    target?: IndexedCache<T>
}


