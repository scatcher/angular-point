import {getDefaultValueForType} from './field.service';
import {
    FieldVersionCollection,
    IFieldDefinition,
    ListItem,
    Lookup,
    ListService,
    User
} from '../factories';
import {IListFieldMapping} from '../factories/list-service.factory';
import {XMLListAttributeTypes, XMLFieldAttributeTypes} from '../constants';
import {each, unescape, cloneDeep, map} from 'lodash';


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
export {
    checkResponseForErrors,
    convertUTCDateToLocalDate,
    extendFieldDefinitionsFromXML,
    extendListDefinitionFromXML,
    extendListMetadata,
    extendObjectWithXMLAttributes,
    jsAttachments,
    jsBoolean,
    jsCalc,
    jsChoiceMulti,
    jsDate,
    jsFloat,
    jsInt,
    jsLookup,
    jsLookupMulti,
    jsObject,
    jsString,
    jsUser,
    jsUserMulti,
    locateListItemNodes,
    parseFieldVersions,
    parseStringValue,
    parseXmlEntity,
    processListItems
    // IXMLToJsonOptions
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
function checkResponseForErrors(responseXML: Document): string {
    /** Look for <errorstring></errorstring> or <ErrorText></ErrorText> for details on any errors */
    for (let element of ['ErrorText', 'errorstring']) {
        let matchingElements = responseXML.getElementsByTagName(element);

        if (matchingElements[0]) {
            /** Break early if found */
            return matchingElements[0].textContent;
        }
    }
    return undefined;
}

/** Converts UTC date to a localized date
 * Taken from: http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
 */
function convertUTCDateToLocalDate(date: Date): Date {
    let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    let offset = date.getTimezoneOffset() / 60;
    let hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
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
function extendFieldDefinitionsFromXML(fieldDefinitions: IFieldDefinition[], responseXML: Element): IFieldDefinition[] {
    let fieldMap = {};

    /** Map all custom fields with keys of the staticName and values = field definition */
    for (let field of fieldDefinitions) {
        if (field.staticName) {
            fieldMap[field.staticName] = field;
        }
    }

    /** Iterate over each of the field nodes */
    let filteredNodes = responseXML.getElementsByTagName('Field');

    each(filteredNodes, xmlField => {
        let staticName = xmlField.getAttribute('StaticName');
        let fieldDefinition = fieldMap[staticName];

        /** If we've defined this field then we should extend it */
        if (fieldDefinition) {

            extendObjectWithXMLAttributes(xmlField, fieldDefinition, XMLFieldAttributeTypes);

            /** Additional processing for Choice fields to include the default value and choices */
            if (fieldDefinition.objectType === 'Choice' || fieldDefinition.objectType === 'MultiChoice') {
                fieldDefinition.Choices = [];
                /** Convert XML Choices object to an array of choices */
                let xmlChoices = xmlField.getElementsByTagName('CHOICE');
                each(xmlChoices, (xmlChoice: Element) => {
                    fieldDefinition.Choices.push(xmlChoice.textContent);
                });
                let defaultVal = xmlField.getElementsByTagName('Default');
                fieldDefinition.Default = defaultVal[0] ? defaultVal[0].textContent : undefined;
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
 * Takes the XML response from a web service call and extends the listService definition in the listService
 * with additional field metadata.  Important to note that all properties will coming from the XML start
 * with a capital letter.
 * @param {object} listService listService
 * @param {object} responseXML XML response from the server.
 * @returns {object} Extended listService object.
 */
function extendListDefinitionFromXML(listService: ListService<any>, responseXML: Element): ListService<any> {
    let service = this;
    let listElements = responseXML.getElementsByTagName('List');
    each(listElements, (element: Element) => {
        service.extendObjectWithXMLAttributes(element, listService, XMLListAttributeTypes);
    });
    return listService;
}

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
function extendListMetadata(listService: ListService<any>, responseXML: Element): void {
    extendListDefinitionFromXML(listService, responseXML);
    extendFieldDefinitionsFromXML(listService.fields, responseXML);
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
function extendObjectWithXMLAttributes(xmlObject: Element, jsObject?: Object, attributeTypes?: Object): Object {
    let objectToExtend = jsObject || {};
    let attributeMap = attributeTypes || {};
    let xmlAttributes = xmlObject.attributes;

    each(xmlAttributes, (attr, attrNum) => {
        let attrName = xmlAttributes[attrNum].name;
        objectToExtend[attrName] = xmlObject.getAttribute(attrName);
        if (attributeMap[attrName]) {
            objectToExtend[attrName] = parseStringValue(objectToExtend[attrName], attributeMap[attrName]);
        }
    });
    return objectToExtend;
}


function jsAttachments(str): string[] | number | string {
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
    if (str.length > 0 && !isNaN(str)) {
        /** Value is a number current stored as a string */
        let int = parseInt(str, 10);
        if (int > 0) {
            return int;
        } else {
            return '';
        }
    } else {
        /** Split into an array of attachment URLs */
        return jsChoiceMulti(str);
    }
}

function jsBoolean(str: string): boolean {
    /** SharePoint uses different string representations for booleans in different places so account for each */
    return str === '1' || str === 'True' || str === 'TRUE';
}

function jsCalc(str: string): any {
    if (str.length === 0) {
        return null;
    } else {
        let thisCalc = str.split(';#');
        // The first value will be the calculated column value type, the second will be the value
        return parseStringValue(thisCalc[1], thisCalc[0]);
    }
}

function jsChoiceMulti(str: string): string[] {
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

function jsDate(str: string): Date {
    if (!str) {
        return null;
    } else {
        /** Replace dashes with slashes and the "T" deliminator with a space if found */
        let dt = str.split('T')[0] !== str ? str.split('T') : str.split(' ');
        let d = dt[0].split('-');
        let t = dt[1].split(':');
        let t3 = t[2].split('Z');
        return new Date(parseInt(d[0], 10), (parseInt(d[1], 10) - 1), parseInt(d[2], 10), parseInt(t[0], 10), parseInt(t[1], 10), parseInt(t3[0], 10));
    }
}

function jsFloat(str: string): number | any {
    if (!str) {
        return str;
    } else {
        return parseFloat(str);
    }
}

function jsInt(str: string): number | any {
    if (!str) {
        return str;
    } else {
        return parseInt(str, 10);
    }
}

function jsLookup(str: string): Lookup<any> {
    if (str.length === 0) {
        return null;
    } else {
        //Send to constructor
        return new Lookup(str);
    }
}

function jsLookupMulti(str: string): Lookup<any>[] {
    if (str.length === 0) {
        return [];
    } else {
        let thisLookupMultiObject = [];
        let thisLookupMulti = str.split(';#');
        for (let i = 0; i < thisLookupMulti.length; i = i + 2) {
            /** Ensure a lookup id is present before attempting to push a new lookup */
            if (thisLookupMulti[i]) {
                let thisLookup = jsLookup(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1]);
                thisLookupMultiObject.push(thisLookup);
            }
        }
        return thisLookupMultiObject;
    }
}

function jsObject(str: string): Object {
    if (!str) {
        return str;
    } else {
        /** Ensure JSON is valid and if not throw error with additional detail */
        let json = null;
        try {
            json = JSON.parse(str);
        } catch (err) {
            console.error('Invalid JSON: ', str);
        }
        return json;
    }
}

function jsString(str: string): string {
    return str;
}

function jsUser(str: string): User {
    if (str.length === 0) {
        return null;
    }
    //Send to constructor
    return new User(str);
}

function jsUserMulti(str: string): User[] {
    if (str.length === 0) {
        return [];
    } else {
        let thisUserMultiObject = [];
        let thisUserMulti = str.split(';#');
        for (let i = 0; i < thisUserMulti.length; i = i + 2) {
            let thisUser = jsUser(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
            thisUserMultiObject.push(thisUser);
        }
        return thisUserMultiObject;
    }
}

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
function locateListItemNodes(responseXML: Element): NodeListOf<Element> {
    /** Looking for "<z:row" elements, which is under the xmlns:z namespace and element would then be "row"
     * We can't find using normal getElementsByTagName method so we need to include the namespace*/
    const rowNS = '#RowsetSchema';
    const rowElement = 'row';

    /** Map returned XML to JS objects based on mapping from model */
    return responseXML.getElementsByTagNameNS(rowNS, rowElement);
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
function parseFieldVersions(responseXML: Element, fieldDefinition: IFieldDefinition): FieldVersionCollection {
    let xmlVersions = responseXML.getElementsByTagName('Version');
    let versionCount = xmlVersions.length;

    let fieldVersionCollection = new FieldVersionCollection(fieldDefinition);

    each(xmlVersions, (xmlVersion, index) => {

        /** Bug in SOAP Web Service returns time in UTC time for version history
         *  Details: https://spservices.codeplex.com/discussions/391879
         */
        let utcDate = parseStringValue(xmlVersion.getAttribute('Modified'), 'DateTime');

        /** Parse the xml and create a representation of the version as a js object */
        let editor = parseStringValue(xmlVersion.getAttribute('Editor'), 'User');
        /** Turn the SharePoint formatted date into a valid date object */
        let modified = convertUTCDateToLocalDate(utcDate);
        /** Properly format field based on definition from model */
        let value = parseStringValue(xmlVersion.getAttribute(fieldDefinition.staticName), fieldDefinition.objectType);
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
 * @returns {*} The newly instantiated JavaScript value based on field type.
 */
function parseStringValue(str: string, objectType?: string): any {

    let unescapedValue = unescape(str);

    let colValue;

    switch (objectType) {
        case 'Attachments':
            colValue = jsAttachments(unescapedValue);
            break;
        case 'Boolean':
            colValue = jsBoolean(unescapedValue);
            break;
        case 'Calculated': // Formatted like type;#value so we break it apart and then pass back in to format correctly
            colValue = jsCalc(unescapedValue);
            break;
        case 'datetime': // For calculated columns, stored as datetime;#value
        case 'DateTime':
            // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
            colValue = jsDate(unescapedValue);
            break;
        case 'Lookup':
            colValue = jsLookup(unescapedValue);
            break;
        case 'User':
            colValue = jsUser(unescapedValue);
            break;
        case 'LookupMulti':
            colValue = jsLookupMulti(unescapedValue);
            break;
        case 'UserMulti':
            colValue = jsUserMulti(unescapedValue);
            break;
        case 'Integer':
        case 'Counter': // Only really used for the ID field
            colValue = jsInt(unescapedValue);
            break;
        case 'Number':
        case 'Currency':
        case 'float': // For calculated columns, stored as float;#value
        case 'Float':
            colValue = jsFloat(unescapedValue);
            break;
        case 'MultiChoice':
            colValue = jsChoiceMulti(unescapedValue);
            break;
        case 'JSON': // Not a true SharePoint field type but acts as a decorator for Note
            colValue = jsObject(unescapedValue);
            break;
        case 'Choice':
        case 'HTML':
        case 'Note':
        default:
            // All other objectTypes will be simple strings
            colValue = jsString(unescapedValue);
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
 * @returns {object} New entity using the factory on the model.
 */
function parseXmlEntity<T extends ListItem<any>>(xmlEntity: Element, mapping: IListFieldMapping) {
    let entity = {};
    let rowAttrs = xmlEntity.attributes;

    /** Bring back all mapped columns, even those with no value */
    each(mapping, (fieldDefinition) => {
        entity[fieldDefinition.mappedName] = getDefaultValueForType(fieldDefinition.objectType);
    });

    /** Parse through the element's attributes */
    each(rowAttrs, (attr) => {
        let thisAttrName = attr.name;
        let thisMapping = mapping[thisAttrName];
        if (thisMapping !== undefined) {
            let thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : thisAttrName.split('ows_')[1];
            let thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;

            entity[thisObjectName] = parseStringValue(attr.value, thisObjectType);
        }

    });
    return entity;
}

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
function processListItems<T extends ListItem<any>>(responseXML: Element, mapping: IListFieldMapping, listService: ListService<T>): T[] {

    /** Locate all "<z:row ..." elements in xml */
    let filteredNodes = locateListItemNodes(responseXML);

    /** Convert XML entities into JS objects */
    let parsedEntities = map(filteredNodes, xmlEntity => parseXmlEntity(xmlEntity, mapping));

    /** Instantiate each list item with factory on listService and add to cache */
    let listItems = parsedEntities.map((rawListItemObject: {getPristine?: any, getListService?: any}) => {

        //Store the value instead of just a reference to the original object
        let pristineValue = cloneDeep(rawListItemObject);

        // let listItem = new listService.factory(rawListItemObject, listService, ...listService.factoryProviders);
        /**
         * @ngdoc function
         * @name ListItem.getPristine
         * @description
         * Allow us to reference the uninstantiated version of this list item.  Reference set
         * via angularPoint.apDecodeService:createListItemProvider.
         */
        rawListItemObject.getPristine = () => pristineValue;

        /**
         * @ngdoc function
         * @name ListItem.getListService
         * @description
         * Allow us to reference the parent list service directly from a list item.
         */
        rawListItemObject.getListService = () => listService;
        
        
        // listItem.getPristine = () => pristineValue;
        let listItem = listService.factory(rawListItemObject);
        
        return listItem;

    });

    return listItems;
}
