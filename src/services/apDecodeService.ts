/// <reference path="../app.module.ts" />

module ap {
    'use strict';

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
            private apUserFactory: UserFactory, private apFieldService: FieldService, private apXMLListAttributeTypes: XMLListAttributeTypes,
            private apXMLFieldAttributeTypes: XMLFieldAttributeTypes, private apXMLToJSONService: XMLToJSONService) {

        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:checkResponseForErrors
         * @methodOf angularPoint.apDecodeService
         * @description
         * Errors don't always throw correctly from SPServices so this function checks to see if part
         * of the XHR response contains an "errorstring" element.
         * @param {object} responseXML XHR response from the server.
         * @returns {string|null} Returns an error string if present, otherwise returns null.
         */
        checkResponseForErrors(responseXML: XMLDocument): string {
            var error = null;
            /** Look for <errorstring></errorstring> or <ErrorText></ErrorText> for details on any errors */
            var errorElements = ['ErrorText', 'errorstring'];
            _.each(errorElements, (element) => {
                $(responseXML).find(element).each(function() {
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
            var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

            var offset = date.getTimezoneOffset() / 60;
            var hours = date.getHours();

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
            return (rawObject: { [key: string]: any, getCache(): IndexedCache<T>, getQuery(): IQuery<T>, id: number }) => {
                var listItem: T;

                if (indexedCache[rawObject.id]) {
                    //Object already exists in cache so we just need to update properties
                    listItem = indexedCache[rawObject.id];

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
                var pristineValue = _.cloneDeep(rawObject);

                //Allow us to reference the uninstantiated version of this list item
                listItem.getPristine = () => pristineValue;

                return indexedCache[rawObject.id];
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
        extendFieldDefinitionsFromXML(fieldDefinitions: FieldDefinition[], responseXML: XMLDocument): IExtendedFieldDefinition[] {
            var fieldMap = {};

            /** Map all custom fields with keys of the staticName and values = field definition */
            _.each(fieldDefinitions, (field) => {
                if (field.staticName) {
                    fieldMap[field.staticName] = field;
                }
            });

            /** Iterate over each of the field nodes */
            var filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, 'Field');

            _.each(filteredNodes, (xmlField: JQuery) => {
                var staticName = $(xmlField).attr('StaticName');
                var fieldDefinition = fieldMap[staticName];

                /** If we've defined this field then we should extend it */
                if (fieldDefinition) {

                    this.extendObjectWithXMLAttributes(xmlField, fieldDefinition, this.apXMLFieldAttributeTypes);

                    /** Additional processing for Choice fields to include the default value and choices */
                    if (fieldDefinition.objectType === 'Choice' || fieldDefinition.objectType === 'MultiChoice') {
                        fieldDefinition.Choices = [];
                        /** Convert XML Choices object to an array of choices */
                        var xmlChoices = $(xmlField).find('CHOICE');
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
        extendListDefinitionFromXML(list: List, responseXML: XMLDocument): List {
            var service = this;
            $(responseXML).find("List").each(function() {
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
        extendListMetadata(model: Model, responseXML: XMLDocument): void {
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
        extendObjectWithXMLAttributes(xmlObject: JQuery, jsObject?: Object, attributeTypes?: Object): Object {
            var objectToExtend = jsObject || {};
            var attributeMap = attributeTypes || {};
            var xmlAttributes = xmlObject.attributes;

            _.each(xmlAttributes, (attr, attrNum) => {
                var attrName = xmlAttributes[attrNum].name;
                objectToExtend[attrName] = $(xmlObject).attr(attrName);
                if (attributeMap[attrName]) {
                    objectToExtend[attrName] = this.parseStringValue(objectToExtend[attrName], attributeMap[attrName]);
                }
            });
            return objectToExtend;
        }


        jsAttachments(str): string[]|number|string {
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
                var int = parseInt(str);
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
                var thisCalc = str.split(';#');
                // The first value will be the calculated column value type, the second will be the value
                return this.parseStringValue(thisCalc[1], thisCalc[0]);
            }
        }

        jsChoiceMulti(str: string): string[] {
            if (str.length === 0) {
                return [];
            } else {
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

        jsDate(str: string): Date {
            if (!str) {
                return null;
            } else {
                /** Replace dashes with slashes and the "T" deliminator with a space if found */
                var dt = str.split("T")[0] !== str ? str.split("T") : str.split(" ");
                var d = dt[0].split("-");
                var t = dt[1].split(":");
                var t3 = t[2].split("Z");
                return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t3[0]);
            }
        }

        jsFloat(str: string): number {
            if (!str) {
                return str;
            } else {
                return parseFloat(str);
            }
        }

        jsInt(str: string): number {
            if (!str) {
                return str;
            } else {
                return parseInt(str, 10);
            }
        }

        jsLookup(str: string, options?: Object): ILookup {
            if (str.length === 0) {
                return null;
            } else {
                //Send to constructor
                return this.apLookupFactory.create(str, options);
            }
        }

        jsLookupMulti(str: string, options?: Object): ILookup[] {
            if (str.length === 0) {
                return [];
            } else {
                var thisLookupMultiObject = [];
                var thisLookupMulti = str.split(';#');
                for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                    /** Ensure a lookup id is present before attempting to push a new lookup */
                    if (thisLookupMulti[i]) {
                        var thisLookup = this.jsLookup(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
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

        jsString(str: string): string {
            return str;
        }

        jsUser(str: string): IUser {
            if (str.length === 0) {
                return null;
            }
            //Send to constructor
            return this.apUserFactory.create(str);
        }

        jsUserMulti(str: string): IUser[] {
            if (str.length === 0) {
                return [];
            } else {
                var thisUserMultiObject = [];
                var thisUserMulti = str.split(';#');
                for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                    var thisUser = this.jsUser(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
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
        parseFieldVersions(responseXML: XMLDocument, fieldDefinition: FieldDefinition): FieldVersionCollection {
            // var versions = {};
            var xmlVersions = $(responseXML).find('Version');
            var versionCount = xmlVersions.length;
            
            var fieldVersionCollection = new FieldVersionCollection(fieldDefinition);

            _.each(xmlVersions, (xmlVersion, index) => {

                /** Bug in SOAP Web Service returns time in UTC time for version history
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
        parseStringValue(str: string, objectType?: string, options?: { entity: Object; propertyName: string; }): any {

            var unescapedValue = _.unescape(str);

            var colValue;

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
         * @param {boolean} [options.listItemProvider] List item constructor.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * @returns {object} New entity using the factory on the model.
         */
        parseXMLEntity<T extends ListItem<any>>(xmlEntity: JQuery, options: { mapping: FieldDefinition[]; includeAllAttrs?: boolean; listItemProvider?: Function; removeOws?: boolean; target?: IndexedCache<T> }): Object {
            var entity = {};
            var rowAttrs = xmlEntity.attributes;

            /** Bring back all mapped columns, even those with no value */
            _.each(options.mapping, (fieldDefinition) => {
                entity[fieldDefinition.mappedName] = this.apFieldService.getDefaultValueForType(fieldDefinition.objectType);
            });

            /** Parse through the element's attributes */
            _.each(rowAttrs, (attr) => {
                var thisAttrName = attr.name;
                var thisMapping = options.mapping[thisAttrName];
                var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : options.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
                var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
                if (options.includeAllAttrs || thisMapping !== undefined) {
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
         * @param {function} [options.factory=model.factory] Constructor function typically stored on the model.
         * @param {string} [options.filter='z:row'] XML filter string used to find the elements to iterate over.
         * @param {Array} [options.mapping=model.list.mapping] Field definitions, typically stored on the model.
         * @param {Array} [options.target=model.getCache()] Optionally pass in array to update after processing.
         * @returns {Object} Inedexed Cache.
         */
        processListItems<T extends ListItem<any>>(model: Model, query: IQuery<T>, responseXML: XMLDocument, options?: IExecuteQueryOptions): IndexedCache<T> {
            var defaults = {
                factory: model.factory,
                filter: 'z:row',
                mapping: model.list.mapping,
                target: model.getCache()
            };

            var opts: IExecuteQueryOptions = _.assign({}, defaults, options);

            /** Map returned XML to JS objects based on mapping from model */
            var filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, opts.filter);

            /** Prepare constructor for XML entities with references to the query and cached container */
            var listItemProvider = this.createListItemProvider(model, query, opts.target);

            /** Convert XML entities into JS objects and register in cache with listItemProvider, this returns an
             * array of entities but at this point we're not using them because the indexed cache should be more
             * performant. */
            this.xmlToJson(filteredNodes, listItemProvider, opts);

            return opts.target;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:xmlToJson
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
         * "SPXmlToJson" function.
         * @param {array} xmlEntities ["z:rows"] XML rows that need to be parsed.
         * @param {function} listItemProvider Constructor function used to build the list item with references to
         * the query, cached container, and registers each list item in the apCacheService.
         * @param {object} options Options object.
         * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * @param {boolean} [options.listItemProvider] List item constructor.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * be stripped off the field name.
         * @param {array} [options.target] Optional location to push parsed entities.
         * @returns {object[]} An array of JavaScript objects.
         */
        xmlToJson<T extends ListItem<any>>(xmlEntities: JQuery, listItemProvider: (Object) => T, options: IXMLToJsonOptions<T>): T[] {

            var defaults = {
                mapping: {},
                includeAllAttrs: false,
                removeOws: true
            };

            var opts: IXMLToJsonOptions<T> = _.assign({}, defaults, options);
            var parsedEntities = [];

            _.each(xmlEntities, (xmlEntity) => {
                var parsedEntity = this.parseXMLEntity(xmlEntity, opts);
                var instantiatedListItem = listItemProvider(parsedEntity);
                parsedEntities.push(instantiatedListItem);
            });

            return parsedEntities;
        }


    }


    /**********************PRIVATE*********************/



    interface IXMLToJsonOptions<T extends ListItem<any>> extends IExecuteQueryOptions {
        includeAllAttrs?: boolean;
        listItemProvider?: Function;
        mapping: FieldDefinition[];
        removeOws?: boolean;
        target?: IndexedCache<T>;
    }



    angular.module('angularPoint')
        .service('apDecodeService', DecodeService)

}
