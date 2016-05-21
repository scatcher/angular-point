"use strict";
var field_service_1 = require('./field.service');
var factories_1 = require('../factories');
var constants_1 = require('../constants');
var lodash_1 = require('lodash');
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
function checkResponseForErrors(responseXML) {
    /** Look for <errorstring></errorstring> or <ErrorText></ErrorText> for details on any errors */
    for (var _i = 0, _a = ['ErrorText', 'errorstring']; _i < _a.length; _i++) {
        var element = _a[_i];
        var matchingElements = responseXML.getElementsByTagName(element);
        if (matchingElements[0]) {
            /** Break early if found */
            return matchingElements[0].textContent;
        }
    }
    return undefined;
}
exports.checkResponseForErrors = checkResponseForErrors;
/** Converts UTC date to a localized date
 * Taken from: http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
 */
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;
}
exports.convertUTCDateToLocalDate = convertUTCDateToLocalDate;
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
function extendFieldDefinitionsFromXML(fieldDefinitions, responseXML) {
    var fieldMap = {};
    /** Map all custom fields with keys of the staticName and values = field definition */
    for (var _i = 0, fieldDefinitions_1 = fieldDefinitions; _i < fieldDefinitions_1.length; _i++) {
        var field = fieldDefinitions_1[_i];
        if (field.staticName) {
            fieldMap[field.staticName] = field;
        }
    }
    /** Iterate over each of the field nodes */
    var filteredNodes = responseXML.getElementsByTagName('Field');
    lodash_1.each(filteredNodes, function (xmlField) {
        var staticName = xmlField.getAttribute('StaticName');
        var fieldDefinition = fieldMap[staticName];
        /** If we've defined this field then we should extend it */
        if (fieldDefinition) {
            extendObjectWithXMLAttributes(xmlField, fieldDefinition, constants_1.XMLFieldAttributeTypes);
            /** Additional processing for Choice fields to include the default value and choices */
            if (fieldDefinition.objectType === 'Choice' || fieldDefinition.objectType === 'MultiChoice') {
                fieldDefinition.Choices = [];
                /** Convert XML Choices object to an array of choices */
                var xmlChoices = xmlField.getElementsByTagName('CHOICE');
                lodash_1.each(xmlChoices, function (xmlChoice) {
                    fieldDefinition.Choices.push(xmlChoice.textContent);
                });
                var defaultVal = xmlField.getElementsByTagName('Default');
                fieldDefinition.Default = defaultVal[0] ? defaultVal[0].textContent : undefined;
            }
        }
    });
    return fieldDefinitions;
}
exports.extendFieldDefinitionsFromXML = extendFieldDefinitionsFromXML;
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
function extendListDefinitionFromXML(listService, responseXML) {
    var service = this;
    var listElements = responseXML.getElementsByTagName('List');
    lodash_1.each(listElements, function (element) {
        service.extendObjectWithXMLAttributes(element, listService, constants_1.XMLListAttributeTypes);
    });
    return listService;
}
exports.extendListDefinitionFromXML = extendListDefinitionFromXML;
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
function extendListMetadata(listService, responseXML) {
    extendListDefinitionFromXML(listService, responseXML);
    extendFieldDefinitionsFromXML(listService.fields, responseXML);
}
exports.extendListMetadata = extendListMetadata;
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
function extendObjectWithXMLAttributes(xmlObject, jsObject, attributeTypes) {
    var objectToExtend = jsObject || {};
    var attributeMap = attributeTypes || {};
    var xmlAttributes = xmlObject.attributes;
    lodash_1.each(xmlAttributes, function (attr, attrNum) {
        var attrName = xmlAttributes[attrNum].name;
        objectToExtend[attrName] = xmlObject.getAttribute(attrName);
        if (attributeMap[attrName]) {
            objectToExtend[attrName] = parseStringValue(objectToExtend[attrName], attributeMap[attrName]);
        }
    });
    return objectToExtend;
}
exports.extendObjectWithXMLAttributes = extendObjectWithXMLAttributes;
function jsAttachments(str) {
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
        var int = parseInt(str, 10);
        if (int > 0) {
            return int;
        }
        else {
            return '';
        }
    }
    else {
        /** Split into an array of attachment URLs */
        return jsChoiceMulti(str);
    }
}
exports.jsAttachments = jsAttachments;
function jsBoolean(str) {
    /** SharePoint uses different string representations for booleans in different places so account for each */
    return str === '1' || str === 'True' || str === 'TRUE';
}
exports.jsBoolean = jsBoolean;
function jsCalc(str) {
    if (str.length === 0) {
        return null;
    }
    else {
        var thisCalc = str.split(';#');
        // The first value will be the calculated column value type, the second will be the value
        return parseStringValue(thisCalc[1], thisCalc[0]);
    }
}
exports.jsCalc = jsCalc;
function jsChoiceMulti(str) {
    if (str.length === 0) {
        return [];
    }
    else {
        var thisChoiceMultiObject = [];
        var thisChoiceMulti = str.split(';#');
        for (var i = 0; i < thisChoiceMulti.length; i++) {
            if (thisChoiceMulti[i].length !== 0) {
                thisChoiceMultiObject.push(thisChoiceMulti[i]);
            }
        }
        return thisChoiceMultiObject;
    }
}
exports.jsChoiceMulti = jsChoiceMulti;
function jsDate(str) {
    if (!str) {
        return null;
    }
    else {
        /** Replace dashes with slashes and the "T" deliminator with a space if found */
        var dt = str.split('T')[0] !== str ? str.split('T') : str.split(' ');
        var d = dt[0].split('-');
        var t = dt[1].split(':');
        var t3 = t[2].split('Z');
        return new Date(parseInt(d[0], 10), (parseInt(d[1], 10) - 1), parseInt(d[2], 10), parseInt(t[0], 10), parseInt(t[1], 10), parseInt(t3[0], 10));
    }
}
exports.jsDate = jsDate;
function jsFloat(str) {
    if (!str) {
        return str;
    }
    else {
        return parseFloat(str);
    }
}
exports.jsFloat = jsFloat;
function jsInt(str) {
    if (!str) {
        return str;
    }
    else {
        return parseInt(str, 10);
    }
}
exports.jsInt = jsInt;
function jsLookup(str) {
    if (str.length === 0) {
        return null;
    }
    else {
        //Send to constructor
        return new factories_1.Lookup(str);
    }
}
exports.jsLookup = jsLookup;
function jsLookupMulti(str) {
    if (str.length === 0) {
        return [];
    }
    else {
        var thisLookupMultiObject = [];
        var thisLookupMulti = str.split(';#');
        for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
            /** Ensure a lookup id is present before attempting to push a new lookup */
            if (thisLookupMulti[i]) {
                var thisLookup = jsLookup(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1]);
                thisLookupMultiObject.push(thisLookup);
            }
        }
        return thisLookupMultiObject;
    }
}
exports.jsLookupMulti = jsLookupMulti;
function jsObject(str) {
    if (!str) {
        return str;
    }
    else {
        /** Ensure JSON is valid and if not throw error with additional detail */
        var json = null;
        try {
            json = JSON.parse(str);
        }
        catch (err) {
            console.error('Invalid JSON: ', str);
        }
        return json;
    }
}
exports.jsObject = jsObject;
function jsString(str) {
    return str;
}
exports.jsString = jsString;
function jsUser(str) {
    if (str.length === 0) {
        return null;
    }
    //Send to constructor
    return new factories_1.User(str);
}
exports.jsUser = jsUser;
function jsUserMulti(str) {
    if (str.length === 0) {
        return [];
    }
    else {
        var thisUserMultiObject = [];
        var thisUserMulti = str.split(';#');
        for (var i = 0; i < thisUserMulti.length; i = i + 2) {
            var thisUser = jsUser(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
            thisUserMultiObject.push(thisUser);
        }
        return thisUserMultiObject;
    }
}
exports.jsUserMulti = jsUserMulti;
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
function locateListItemNodes(responseXML) {
    /** Looking for "<z:row" elements, which is under the xmlns:z namespace and element would then be "row"
     * We can't find using normal getElementsByTagName method so we need to include the namespace*/
    var rowNS = '#RowsetSchema';
    var rowElement = 'row';
    /** Map returned XML to JS objects based on mapping from model */
    return responseXML.getElementsByTagNameNS(rowNS, rowElement);
}
exports.locateListItemNodes = locateListItemNodes;
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
function parseFieldVersions(responseXML, fieldDefinition) {
    var xmlVersions = responseXML.getElementsByTagName('Version');
    var versionCount = xmlVersions.length;
    var fieldVersionCollection = new factories_1.FieldVersionCollection(fieldDefinition);
    lodash_1.each(xmlVersions, function (xmlVersion, index) {
        /** Bug in SOAP Web Service returns time in UTC time for version history
         *  Details: https://spservices.codeplex.com/discussions/391879
         */
        var utcDate = parseStringValue(xmlVersion.getAttribute('Modified'), 'DateTime');
        /** Parse the xml and create a representation of the version as a js object */
        var editor = parseStringValue(xmlVersion.getAttribute('Editor'), 'User');
        /** Turn the SharePoint formatted date into a valid date object */
        var modified = convertUTCDateToLocalDate(utcDate);
        /** Properly format field based on definition from model */
        var value = parseStringValue(xmlVersion.getAttribute(fieldDefinition.staticName), fieldDefinition.objectType);
        var version = versionCount - index;
        /** Add each distict version to the version collection */
        fieldVersionCollection.addVersion(editor, modified, value, version);
    });
    return fieldVersionCollection;
}
exports.parseFieldVersions = parseFieldVersions;
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
function parseStringValue(str, objectType) {
    var unescapedValue = lodash_1.unescape(str);
    var colValue;
    switch (objectType) {
        case 'Attachments':
            colValue = jsAttachments(unescapedValue);
            break;
        case 'Boolean':
            colValue = jsBoolean(unescapedValue);
            break;
        case 'Calculated':
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
        case 'Counter':
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
        case 'JSON':
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
exports.parseStringValue = parseStringValue;
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
function parseXmlEntity(xmlEntity, mapping) {
    var entity = {};
    var rowAttrs = xmlEntity.attributes;
    /** Bring back all mapped columns, even those with no value */
    lodash_1.each(mapping, function (fieldDefinition) {
        entity[fieldDefinition.mappedName] = field_service_1.getDefaultValueForType(fieldDefinition.objectType);
    });
    /** Parse through the element's attributes */
    lodash_1.each(rowAttrs, function (attr) {
        var thisAttrName = attr.name;
        var thisMapping = mapping[thisAttrName];
        if (thisMapping !== undefined) {
            var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : thisAttrName.split('ows_')[1];
            var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
            entity[thisObjectName] = parseStringValue(attr.value, thisObjectType);
        }
    });
    return entity;
}
exports.parseXmlEntity = parseXmlEntity;
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
function processListItems(responseXML, mapping, listService) {
    /** Locate all "<z:row ..." elements in xml */
    var filteredNodes = locateListItemNodes(responseXML);
    /** Convert XML entities into JS objects */
    var parsedEntities = lodash_1.map(filteredNodes, function (xmlEntity) { return parseXmlEntity(xmlEntity, mapping); });
    /** Instantiate each list item with factory on listService and add to cache */
    var listItems = parsedEntities.map(function (rawListItemObject) {
        //Store the value instead of just a reference to the original object
        var pristineValue = lodash_1.cloneDeep(rawListItemObject);
        // let listItem = new listService.factory(rawListItemObject, listService, ...listService.factoryProviders);
        /**
         * @ngdoc function
         * @name ListItem.getPristine
         * @description
         * Allow us to reference the uninstantiated version of this list item.  Reference set
         * via angularPoint.apDecodeService:createListItemProvider.
         */
        rawListItemObject.getPristine = function () { return pristineValue; };
        /**
         * @ngdoc function
         * @name ListItem.getListService
         * @description
         * Allow us to reference the parent list service directly from a list item.
         */
        rawListItemObject.getListService = function () { return listService; };
        // listItem.getPristine = () => pristineValue;
        var listItem = listService.factory(rawListItemObject);
        return listItem;
    });
    return listItems;
}
exports.processListItems = processListItems;
//# sourceMappingURL=decode.service.js.map