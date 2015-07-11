/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var service: DataService, $q: ng.IQService, $timeout, $http: ng.IHttpService, apConfig: IAPConfig,
        apUtilityService: UtilityService, apCacheService: CacheService, apDecodeService: DecodeService,
        apEncodeService: EncodeService, apFieldService: FieldService, apIndexedCacheFactory: IndexedCacheFactory,
        toastr, SPServices, apDefaultListItemQueryOptions, apWebServiceOperationConstants, apXMLToJSONService,
        apChangeService: ChangeService;

    export interface IDataService {
        createListItem<T>(model: Model, listItem: Object, options?: { buildValuePairs: boolean; valuePairs: [string, any][] }): ng.IPromise<ListItem<T>>;
        createItemUrlFromFileRef(fileRefString: string): string;
        deleteAttachment(options: { listItemID: number; url: string; listName: string; }): ng.IPromise<any>;
        deleteListItem(model: Model, listItem: ListItem<any>, options?: { target: IndexedCache<any> }): ng.IPromise<any>;
        executeQuery<T>(model: Model, query: IQuery<T>, options?: { target: IndexedCache<T>; }): ng.IPromise<IndexedCache<T>>;
        generateWebServiceUrl(service: string, webURL?: string): ng.IPromise<string>;
        getAvailableWorkflows(fileRefString: string): ng.IPromise<IWorkflowDefinition[]>;
        getCollection(options: { operation: string; userLoginName?: string; groupName?: string; listName?: string; filterNode: string; }): ng.IPromise<Object[]>;
        getCurrentSite(): ng.IPromise<string>;
        getFieldVersionHistory<T>(options: { operation?: string; webURL?: string; strListID: string; strListItemID: number; strFieldName?: string; }, fieldDefinition: IFieldDefinition): ng.IPromise<ap.IListItemVersion<T>[]>;
        getGroupCollectionFromUser(login?: string): ng.IPromise<IXMLGroup[]>;
        getList(options: { listName: string }): ng.IPromise<Object>;
        getListFields(options: { listName: string; }): ng.IPromise<IXMLFieldDefinition[]>;
        getUserProfileByName(login?: string): ng.IPromise<IXMLUserProfile>;
        processChangeTokenXML<T>(model: Model, query: IQuery<T>, responseXML: XMLDocument, opts): void;
        processDeletionsSinceToken(responseXML: XMLDocument, indexedCache: IndexedCache<any>): void;
        requestData(opts): ng.IPromise<XMLDocument>;
        retrieveChangeToken(responseXML: XMLDocument): string;
        retrievePermMask(responseXML: XMLDocument): string;
        serviceWrapper(options): ng.IPromise<any>;
        startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): ng.IPromise<any>;
        updateListItem<T>(model: Model, listItem: ListItem<T>, options): ng.IPromise<ListItem<T>>;
        validateCollectionPayload(opts): boolean;
    }

    export class DataService implements IDataService {
        queryForCurrentSite: ng.IPromise<string>;
        static $inject = ['$http', '$q', '$timeout', 'apCacheService', 'apChangeService', 'apConfig', 'apDecodeService',
            'apDefaultListItemQueryOptions', 'apEncodeService', 'apFieldService', 'apIndexedCacheFactory',
            'apUtilityService', 'apWebServiceOperationConstants', 'apXMLToJSONService', 'SPServices', 'toastr' ];

        constructor(_$http_, _$q_, _$timeout_, _apCacheService_, _apChangeService_, _apConfig_, _apDecodeService_,
                    _apDefaultListItemQueryOptions_, _apEncodeService_, _apFieldService_, _apIndexedCacheFactory_,
                    _apUtilityService_, _apWebServiceOperationConstants_, _apXMLToJSONService_, _SPServices_, _toastr_) {
            service = this;

            $http = _$http_;
            $q = _$q_;
            $timeout = _$timeout_;
            apCacheService = _apCacheService_;
            apChangeService = _apChangeService_;
            apConfig = _apConfig_;
            apDecodeService = _apDecodeService_;
            apDefaultListItemQueryOptions = _apDefaultListItemQueryOptions_;
            apEncodeService = _apEncodeService_;
            apFieldService = _apFieldService_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;
            apUtilityService = _apUtilityService_;
            apWebServiceOperationConstants = _apWebServiceOperationConstants_;
            apXMLToJSONService = _apXMLToJSONService_;
            SPServices = _SPServices_;
            toastr = _toastr_;
        }

        /**
         * @ngdoc function
         * @name DataService.createListItem
         * @description
         * Creates a new list item for the provided model.
         * @param {object} model Reference to the entities model.
         * @param {object} listItem JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        createListItem<T>(model: Model, listItem: Object, options?: { buildValuePairs: boolean; valuePairs: [string, any][] }): ng.IPromise<ListItem<T>> {
            var defaults = {
                batchCmd: 'New',
                buildValuePairs: true,
                indexedCache: apIndexedCacheFactory.create({}),
                listName: model.list.getListId(),
                operation: 'UpdateListItems',
                target: undefined,
                valuePairs: [],
                webURL: model.list.identifyWebURL()
            },
                deferred = $q.defer();

            defaults.target = defaults.indexedCache;
            var opts: { buildValuePairs: boolean; valuePairs: [string, any][]; getCache(): IndexedCache<T>; indexedCache: IndexedCache<T> }
                = _.assign({}, defaults, options);

            if (opts.buildValuePairs === true) {
                var editableFields: IFieldDefinition[] = _.where(model.list.fields, { readOnly: false });
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, listItem);
            }

            opts.getCache = () => opts.indexedCache;

            /** Overload the function then pass anything past the first parameter to the supporting methods */
            this.serviceWrapper(opts)
                .then((response) => {
                /** Online this should return an XML object */
                var indexedCache = apDecodeService.processListItems(model, opts, response, opts);
                /** Return reference to last listItem in cache because it will have the new highest id */
                deferred.resolve(indexedCache.last());
            }, (err) => {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        createItemUrlFromFileRef(fileRefString: string): string {
            return window.location.protocol + '//' + window.location.hostname + '/' + fileRefString;
        }


        /**
         * @ngdoc function
         * @name DataService.deleteAttachment
         * @description
         * Deletes and attachment on a list item.  Most commonly used by ListItem.deleteAttachment which is shown
         * in the example.
         *
         * @param {object} options Configuration parameters.
         * @param {string} options.listItemId ID of the list item with the attachment.
         * @param {string} options.url Requires the URL for the attachment we want to delete.
         * @param {string} options.listName Best option is the GUID of the list.
         * <pre>'{37388A98-534C-4A28-BFFA-22429276897B}'</pre>
         *
         * @returns {object} Promise which resolves with the updated attachment collection.
         *
         * @example
         * <pre>
         * ListItem.prototype.deleteAttachment = function (url) {
         *    var listItem = this;
         *    return DataService.deleteAttachment({
         *        listItemId: listItem.id,
         *        url: url,
         *        listName: listItem.getModel().list.getListId()
         *    });
         * };
         * </pre>
         */
        deleteAttachment(options: { listItemID: number; url: string; listName: string; }): ng.IPromise<any> {
            var defaults = {
                operation: 'DeleteAttachment',
                filterNode: 'Field'
            };

            var opts = _.assign({}, defaults, options);

            return this.serviceWrapper(opts);
        }

        /**
         * @ngdoc function
         * @name DataService.deleteListItem
         * @description
         * Typically called directly from a list item, removes the list item from SharePoint
         * and the local cache.
         * @param {object} model Reference to the entities model.
         * @param {object} listItem JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {Array} [options.target=item.getCache()] Optional location to search through and remove the
         * local cached copy.
         * @returns {object} Promise which resolves when the operation is complete.  Nothing of importance is returned.
         */
        deleteListItem(model: Model, listItem: ListItem<any>, options?: { target: IndexedCache<any> }): ng.IPromise<any> {
            var defaults = {
                target: _.isFunction(listItem.getCache) ? listItem.getCache() : model.getCache(),
                operation: 'UpdateListItems',
                listName: model.list.getListId(),
                batchCmd: 'Delete',
                ID: listItem.id,
                webURL: model.list.identifyWebURL()
            };

            var opts = _.assign({}, defaults, options);

            /** Check to see if list item or document because documents need the FileRef as well as id to delete */
            if (listItem.fileRef && listItem.fileRef.lookupValue) {
                var fileExtension = listItem.fileRef.lookupValue.split('.').pop();
                if (isNaN(fileExtension)) {
                    /** File extension instead of numeric extension so it's a document
                     * @Example
                     * Document: "Site/library/file.csv"
                     * List Item: "Site/List/5_.000"
                     * */
                    opts.valuePairs = [['FileRef', listItem.fileRef.lookupValue]];

                }
            }

            var deferred = $q.defer();

            this.serviceWrapper(opts)
                .then(() => {
                /** Success */
                apCacheService.deleteEntity(opts.listName, listItem.id);
                deferred.resolve();
            }, (outcome) => {
                    //In the event of an error, display toast
                    toastr.error('There was an error deleting a list item from ' + model.list.title);
                    deferred.reject(outcome);
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.executeQuery
         * @description
         * Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.
         * @param {object} model Reference to the model where the Query resides.
         * @param {object} query Reference to the Query making the call.
         * @param {object} [options] Optional configuration parameters.
         * @param {Array} [options.target=model.getCache()] The target destination for returned entities
         * @returns {object} - Key value hash containing all list item id's as keys with the listItem as the value.
         */
        executeQuery<T>(model: Model, query: IQuery<T>, options?: { target: IndexedCache<T>; }): ng.IPromise<IndexedCache<T>> {

            var defaults = {
                target: model.getCache()
            };

            var deferred = $q.defer();

            /** Extend defaults **/
            var opts = _.assign({}, defaults, options);

            this.serviceWrapper(query)
                .then((response) => {
                if (query.operation === 'GetListItemChangesSinceToken') {
                    this.processChangeTokenXML<T>(model, query, response, opts);
                }

                /** Convert the XML into JS objects */
                var entities = apDecodeService.processListItems(model, query, response, opts);
                deferred.resolve(entities);

                /** Set date time to allow for time based updates */
                query.lastRun = new Date();
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.generateWebServiceUrl
         * @description
         * Builds the appropriate SharePoint resource URL.  If a URL isn't provided and it hasn't already been cached
         * we make a call to the server to find the root URL.  All future requests will then use this cached value.
         * @param {string} service The name of the service the SOAP operation is using.
         * @param {string} [webURL] Optionally provide the URL so we don't need to make a call to the server.
         * @returns {promise} Resolves with the url for the service.
         */
        generateWebServiceUrl(service: string, webURL?: string): ng.IPromise<string> {
            var ajaxURL = "_vti_bin/" + service + ".asmx",
                deferred = $q.defer();

            if (webURL) {
                ajaxURL = webURL.charAt(webURL.length - 1) === '/' ?
                    webURL + ajaxURL : webURL + '/' + ajaxURL;
                deferred.resolve(ajaxURL);
            } else {
                this.getCurrentSite().then((thisSite) => {
                    ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === '/') ? ajaxURL : ('/' + ajaxURL));
                    deferred.resolve(ajaxURL);
                });
            }
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.getAvailableWorkflows
         * @description
         * Given a list item or document, return an array of all available workflows.  This is used in combination with
         * DataService.startWorkflow because it requires the template GUID for the target workflow.
         * @example
         * <pre>
         * DataService.getAvailableWorkflows(listItem.fileRef.lookupValue)
         *     .then(function(templateArray) {
         *          ....templateArray = [{
         *              "name": "WidgetApproval",
         *              "instantiationUrl": "https: //sharepoint.mycompany.com/_layouts/IniWrkflIP.aspx?List=fc17890e-8c0…311-cea9-40d1-a183-6edde9333815}&Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}",
         *              "templateId": "59062311-cea9-40d1-a183-6edde9333815"
         *          }]
         *     });
         * </pre>
         * @param {string} fileRefString Relative or static url referencing the item.
         * @returns {object} Resolves with an array of objects defining each of the available workflows for the item.
         */
        getAvailableWorkflows(fileRefString: string): ng.IPromise<IWorkflowDefinition[]> {
            var deferred = $q.defer();
            /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
            var itemUrl = fileRefString.indexOf(': //') > -1 ? fileRefString : this.createItemUrlFromFileRef(fileRefString);

            this.serviceWrapper({
                operation: 'GetTemplatesForItem',
                item: itemUrl
            }).then(function(responseXML) {
                var workflowTemplates = [];
                var xmlTemplates = $(responseXML).SPFilterNode('WorkflowTemplate');
                _.each(xmlTemplates, function(xmlTemplate) {
                    var template = {
                        name: $(xmlTemplate).attr('Name'),
                        instantiationUrl: $(xmlTemplate).attr('InstantiationUrl'),
                        templateId: '{' + $(xmlTemplate).find('WorkflowTemplateIdSet').attr('TemplateId') + '}'
                    };
                    workflowTemplates.push(template);
                });
                deferred.resolve(workflowTemplates);
            });


            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.getCollection
         * @description
         * Used to handle any of the Get[filterNode]Collection calls to SharePoint
         *
         * @param {Object} options - object used to extend payload and needs to include all SPServices required attributes
         * @param {string} [options.operation] GetUserCollectionFromSite
         * @param {string} [options.operation] GetGroupCollectionFromSite
         * @param {string} [options.operation] GetGroupCollectionFromUser @requires options.userLoginName
         * @param {string} [options.operation] GetUserCollectionFromGroup @requires options.groupName
         * @param {string} [options.operation] GetListCollection
         * @param {string} [options.operation] GetViewCollection @requires options.listName
         * @param {string} [options.operation] GetAttachmentCollection @requires options.listName & options.ID
         * @param {string} [options.filterNode] - Value to iterate over in returned XML
         *         if not provided it's extracted from the name of the operation
         *         ex: Get[User]CollectionFromSite, "User" is used as the filterNode
         *
         * @returns {object[]} Promise which when resolved will contain an array of objects representing the
         * requested collection.
         *
         * @example
         * <pre>
         * DataService.getCollection({
         *        operation: "GetGroupCollectionFromUser",
         *        userLoginName: $scope.state.selectedUser.LoginName
         *        }).then(function (response) {
         *            postProcessFunction(response);
         *       });
         * </pre>
         */
        getCollection(options: { operation: string; userLoginName?: string; groupName?: string; listName?: string; filterNode: string; }): ng.IPromise<Object[]> {
            var defaults = {
                postProcess: processXML
            };
            var opts = _.assign({}, defaults, options);

            /** Determine the XML node to iterate over if filterNode isn't provided */
            var filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];

            var deferred = $q.defer();

            /** Convert the xml returned from the server into an array of js objects */
            function processXML(serverResponse) {
                var convertedItems = [];
                /** Get attachments only returns the links associated with a list item */
                if (opts.operation === 'GetAttachmentCollection') {
                    /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                    $(serverResponse).SPFilterNode(filterNode).each(function() {
                        convertedItems.push($(this).text());
                    });
                } else {
                    var nodes = $(serverResponse).SPFilterNode(filterNode);
                    convertedItems = apXMLToJSONService.parse(nodes, { includeAllAttrs: true, removeOws: false });
                }
                return convertedItems;
            }

            var validPayload = this.validateCollectionPayload(opts);
            if (validPayload) {
                this.serviceWrapper(opts)
                    .then((response) => {
                    deferred.resolve(response);
                });
            } else {
                toastr.error('Invalid payload: ', opts);
                deferred.reject();
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.getCurrentSite
         * @description
         * Requests and caches the root url for the current site.  It caches the response so any future calls receive
         * the cached promise.
         * @returns {promise} Resolves with the current site root url.
         */
        getCurrentSite(): ng.IPromise<string> {
            var deferred = $q.defer();
            //var self = this.getCurrentSite;
            if (!this.queryForCurrentSite) {
                /** We only want to run this once so cache the promise the first time and just reference it in the future */
                this.queryForCurrentSite = deferred.promise;

                var msg = SPServices.SOAPEnvelope.header +
                    "<WebUrlFromPageUrl xmlns='" + SPServices.SCHEMASharePoint + "/soap/' ><pageUrl>" +
                    ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
                    "</pageUrl></WebUrlFromPageUrl>" +
                    SPServices.SOAPEnvelope.footer;

                $http({
                    method: 'POST',
                    url: '/_vti_bin/Webs.asmx',
                    data: msg,
                    responseType: "document",
                    headers: {
                        "Content-Type": "text/xml;charset='utf-8'"
                    }
                }).then((response) => {
                    /** Success */
                    apConfig.defaultUrl = $(response.data).find("WebUrlFromPageUrlResult").text();
                    deferred.resolve(apConfig.defaultUrl)
                }, (response) => {
                        /** Error */
                        var error = apDecodeService.checkResponseForErrors(response.data);
                        deferred.reject(error);
                    });
            }
            return this.queryForCurrentSite;
        }

        /**
         * @ngdoc function
         * @name DataService.getFieldVersionHistory
         * @description
         * Returns the version history for a field in a list item.
         * @param {object} options Configuration object passed to SPServices.
         * <pre>
         * var options = {
         *        operation: 'GetVersionCollection',
         *        webURL: apConfig.defaultUrl,
         *        strlistID: model.list.getListId(),
         *        strlistItemID: listItem.id,
         *        strFieldName: fieldDefinition.staticName
         *    };
         * </pre>
         * @param {object} fieldDefinition Field definition object from the model.
         * @returns {object[]} Promise which resolves with an array of list item changes for the specified field.
         */
        getFieldVersionHistory<T>(options: { operation?: string; webURL?: string; strListID: string; strListItemID: number; strFieldName?: string; }, fieldDefinition: IFieldDefinition): ng.IPromise<ap.IListItemVersion<T>[]> {
            var defaults = {
                operation: 'GetVersionCollection'
            };
            var opts = _.assign({}, defaults, options);

            var deferred = $q.defer();

            this.serviceWrapper(opts)
                .then((response) => {
                /** Parse XML response */
                var versions = apDecodeService.parseFieldVersions(response, fieldDefinition);
                /** Resolve with an array of all field versions */
                deferred.resolve(versions);
            }, (outcome) => {
                    /** Failure */
                    toastr.error('Failed to fetch version history.');
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.getGroupCollectionFromUser
         * @description
         * Fetches an array of group names the user is a member of.  If no user is provided we use the current user.
         * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
         * @returns {string[]} Promise which resolves with the array of groups the user belongs to.
         */
        getGroupCollectionFromUser(login?: string): ng.IPromise<IXMLGroup[]> {
            /** Create a new deferred object if not already defined */
            var deferred = $q.defer();
            var getGroupCollection = (userLoginName) => {
                this.serviceWrapper({
                    operation: 'GetGroupCollectionFromUser',
                    userLoginName: userLoginName,
                    filterNode: 'Group'
                }).then((groupCollection: IXMLGroup[]) => deferred.resolve(groupCollection));
            };

            if (!login) {
                /** No login name provided so lookup profile for current user */
                this.getUserProfileByName()
                    .then((userProfile) => getGroupCollection(userProfile.userLoginName));
            } else {
                getGroupCollection(login);
            }
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.getList
         * @description
         * Returns all list details including field and list config.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {object} Promise which resolves with an object defining field and list config.
         */
        getList(options: { listName: string }): ng.IPromise<Object> {
            var defaults = {
                operation: 'GetList'
            };

            var opts = _.assign({}, defaults, options);
            return this.serviceWrapper(opts);
        }

        /**
         * @ngdoc function
         * @name DataService.getListFields
         * @description
         * Returns field definitions for a specified list.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {Promise} Promise which resolves with an array of field definitions for the list.
         */
        getListFields(options: { listName: string; }): ng.IPromise<IXMLFieldDefinition[]> {
            var deferred = $q.defer();
            this.getList(options)
                .then((responseXml) => {
                var nodes = $(responseXml).SPFilterNode('Field');
                var fields = apXMLToJSONService.parse(nodes, { includeAllAttrs: true, removeOws: false });
                deferred.resolve(fields);
            });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.getUserProfile
         * @description
         * Returns the profile for an optional user, but defaults the the current user if one isn't provided.
         * Pull user profile info and parse into a profile object
         * http: //spservices.codeplex.com/wikipage?title=GetUserProfileByName
         * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
         * @returns {object} Promise which resolves with the requested user profile.
         */
        getUserProfileByName(login?: string): ng.IPromise<IXMLUserProfile> {
            var deferred = $q.defer();
            var payload = {
                accountName: undefined,
                operation: 'GetUserProfileByName'
            };
            if (login) {
                payload.accountName = login;
            }

            this.serviceWrapper(payload)
                .then((serverResponse) => {
                var userProfile = {
                    AccountName: undefined,
                    userLoginName: undefined
                };
                //Not formatted like a normal SP response so need to manually parse
                $(serverResponse).SPFilterNode('PropertyData').each(function() {
                    var nodeName = $(this).SPFilterNode('Name');
                    var nodeValue = $(this).SPFilterNode('Value');
                    if (nodeName.length > 0 && nodeValue.length > 0) {
                        userProfile[nodeName.text().trim()] = nodeValue.text().trim();
                    }
                });
                /** Optionally specify a necessary prefix that should appear before the user login */
                userProfile.userLoginName = apConfig.userLoginNamePrefix ?
                    (apConfig.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
                deferred.resolve(userProfile);
            });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.processChangeTokenXML
         * @description
         * The initial call to GetListItemChangesSinceToken also includes the field definitions for the
         * list so extend the existing field definitions and list defined in the model.  After that, store
         * the change token and make any changes to the user's permissions for the list.
         * @param {Model} model List model.
         * @param {IQuery} query Valid query object.
         * @param {XMLDocument} responseXML XML response from the server.
         * @param {object} opts Config options built up along the way.
         */
        processChangeTokenXML<T>(model: Model, query: IQuery<T>, responseXML: XMLDocument, opts): void {
            if (!model.deferredListDefinition) {
                var deferred = $q.defer();

                /** Replace the null placeholder with this promise so we don't have to process in the future and also
                 * don't have to query again if we run Model.extendListMetadata. */
                model.deferredListDefinition = deferred.promise;

                /** Immediately resolve because there's no need to perform any async actions */
                deferred.resolve(model);
                apDecodeService.extendListMetadata(model, responseXML);
            }

            /** Store token for future web service calls to return changes */
            query.changeToken = this.retrieveChangeToken(responseXML);

            /** Update the user permissions for this list */
            var effectivePermissionMask = this.retrievePermMask(responseXML);
            if (effectivePermissionMask) {
                model.list.effectivePermMask = effectivePermissionMask;
            }

            /** Change token query includes deleted items as well so we need to process them separately */
            this.processDeletionsSinceToken(responseXML, opts.target);
        }

        /**
         * @ngdoc function
         * @name DataService.processDeletionsSinceToken
         * @description
         * GetListItemChangesSinceToken returns items that have been added as well as deleted so we need
         * to remove the deleted items from the local cache.
         * @param {XMLDocument} responseXML XML response from the server.
         * @param {Object} indexedCache Cached object of key value pairs.
         */
        processDeletionsSinceToken(responseXML: XMLDocument, indexedCache: IndexedCache<any>): void {
            /** Remove any locally cached entities that were deleted from the server */
            $(responseXML).SPFilterNode('Id').each(function() {
                /** Check for the type of change */
                var changeType = $(this).attr('ChangeType');

                if (changeType === 'Delete') {
                    var listItemId = parseInt($(this).text(), 10);
                    /** Remove from local data array */
                    indexedCache.removeEntity(listItemId);
                }
            });
        }

        /**
         * @ngdoc function
         * @name DataService.requestData
         * @description
         * The primary function that handles all communication with the server.  This is very low level and isn't
         * intended to be called directly.
         * @param {object} opts Payload object containing the details of the request.
         * @returns {promise} Promise that resolves with the server response.
         */
        requestData(opts): ng.IPromise<XMLDocument> {
            var deferred = $q.defer();

            var soapData = SPServices.generateXMLComponents(opts);
            var service = apWebServiceOperationConstants[opts.operation][0];
            this.generateWebServiceUrl(service, opts.webURL)
                .then((url) => {
                $http.post(url, soapData.msg, {
                    responseType: "document",
                    headers: {
                        "Content-Type": "text/xml;charset='utf-8'",
                        SOAPAction: () => soapData.SOAPAction ? soapData.SOAPAction : null
                    },
                    transformResponse: (data, headersGetter) => {
                        if (_.isString(data)) {
                            data = $.parseXML(data);
                        }
                        return data;
                    }
                }).then((response) => {
                    /** Success */
                    /** Errors can still be resolved without throwing an error so check the XML */
                    var error = apDecodeService.checkResponseForErrors(response.data);
                    if (error) {
                        console.error(error, opts);
                        deferred.reject(error);
                    } else {
                        deferred.resolve(response.data);
                    }
                }, (response) => {
                        /** Failure */
                        var error = apDecodeService.checkResponseForErrors(response.data);
                        console.error(response.statusText, opts);
                        deferred.reject(response.statusText + ': ' + error);
                    });
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.retrieveChangeToken
         * @description
         * Returns the change token from the xml response of a GetListItemChangesSinceToken query
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {XMLDocument} responseXML XML response from the server.
         */
        retrieveChangeToken(responseXML: XMLDocument): string {
            return $(responseXML).find('Changes').attr('LastChangeToken');
        }

        /**
         * @ngdoc function
         * @name DataService.retrievePermMask
         * @description
         * Returns the text representation of the users permission mask
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {XMLDocument} responseXML XML response from the server.
         */
        retrievePermMask(responseXML: XMLDocument): string {
            return $(responseXML).find('listitems').attr('EffectivePermMask');
        }

        /**
         * @ngdoc function
         * @name DataService.serviceWrapper
         * @description
         * Generic wrapper for any SPServices web service call.  The big benefit to this function is it allows us
         * to continue to use the $q promise model throughout the application instead of using the promise
         * implementation used in SPServices so we have a more consistent experience.
         * Check http: //spservices.codeplex.com/documentation for details on expected parameters for each operation.
         *
         * @param {object} options Payload params that is directly passed to SPServices.
         * @param {string} [options.webURL] XML filter string used to find the elements to iterate over.
         * @param {string} [options.filterNode] XML filter string used to find the elements to iterate over.
         * This is typically 'z: row' for list items.
         * @returns {object} Returns a promise which when resolved either returns clean objects parsed by the value
         * in options.filterNode or the raw XML response if a options.filterNode
         *
         *      If options.filterNode is provided, returns XML parsed by node name
         *      Otherwise returns the server response
         */
        serviceWrapper(options): ng.IPromise<any> {
            var defaults = {
                postProcess: processXML,
                webURL: apConfig.defaultUrl
            };
            var opts = _.assign({}, defaults, options);
            var deferred = $q.defer();

            /** Convert the xml returned from the server into an array of js objects */
            function processXML(serverResponse) {
                if (opts.filterNode) {
                    var nodes = $(serverResponse).SPFilterNode(opts.filterNode);
                    return apXMLToJSONService.parse(nodes, { includeAllAttrs: true, removeOws: false });
                } else {
                    return serverResponse;
                }
            }

            this.requestData(opts)
                .then((response) => {
                /** Failure */
                var data = opts.postProcess(response);
                deferred.resolve(data);
            }, (response) => {
                    /** Failure */
                    toastr.error('Failed to complete the requested ' + opts.operation + ' operation.');
                    deferred.reject(response);
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name DataService.startWorkflow
         * @description
         * Initiate a workflow for a given list item or document.  You can view additional info at
         * [StartWorkflow](http: //spservices.codeplex.com/wikipage?title=StartWorkflow&referringTitle=Workflow).
         * @param {object} options Configuration options.
         * @param {string} options.item Full fileRef for the given list item/document.
         * @param {string} options.templateId The workflow template GUID.  You can use dataService.getAvailableWorkflows
         * to locate to appropriate one.
         * @param {string} [options.workflowParameters='<root />'] Optionally provide paramaters to the workflow.
         * @param {string} [options.fileRef] Optionally pass in the relative fileRef of an listItem and then we can
         * convert it to options.item.
         * @returns {object} Deferred object that resolves once complete.
         * @example
         * <pre>
         * DataService.startWorkflow({
         *     item: "https: //server/site/Lists/item" + idData + "_.000",
         *     templateId: "{c29c1291-a25c-47d7-9345-8fb1de2a1fa3}",
         *     workflowParameters: "<Data><monthName>" + txtBox.value + "</monthName></Data>",
         *   ...}).then(function() {
         *       //Success
         *   }, function(err) {
         *       //Error
         *   })
         * </pre>
         */
        startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): ng.IPromise<any> {
            var defaults = {
                operation: 'StartWorkflow',
                item: '',
                fileRef: '',
                templateId: '',
                workflowParameters: '<root />'
            },
                opts: { item: string; fileRef: string; } = _.assign({}, defaults, options);

            /** We have the relative file reference but we need to create the fully qualified reference */
            if (!opts.item && opts.fileRef) {
                opts.item = this.createItemUrlFromFileRef(opts.fileRef);
            }

            return this.serviceWrapper(opts);

        }

        /**
         * @ngdoc function
         * @name DataService.updateListItem
         * @description
         * Updates an existing list item.
         * @param {object} model Reference to the entities model.
         * @param {object} listItem JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        updateListItem<T>(model: Model, listItem: ListItem<T>, options): ng.IPromise<ListItem<T>> {
            var defaults = {
                batchCmd: 'Update',
                buildValuePairs: true,
                ID: listItem.id,
                listName: model.list.getListId(),
                operation: 'UpdateListItems',
                target: listItem.getCache(),
                valuePairs: [],
                webURL: model.list.identifyWebURL()
            },
                deferred = $q.defer(),
                opts: { buildValuePairs: boolean; valuePairs: [string, any][]; webURL: string; } = _.assign({}, defaults, options);

            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, { readOnly: false });
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, listItem);
            }

            if (model.list.webURL && !opts.webURL) {
                opts.webURL = model.list.webURL;
            }

            /** Notify any listeners to expect a change */
            apChangeService.registerListItemUpdate(listItem, opts, deferred.promise);

            ///** Overload the function then pass anything past the first parameter to the supporting methods */
            //this.serviceWrapper(opts, listItem, model)
            this.serviceWrapper(opts)
                .then(function(response) {
                var indexedCache = apDecodeService.processListItems(model, listItem.getQuery(), response, opts);
                /** Return reference to updated listItem  */
                deferred.resolve(indexedCache[listItem.id]);
            }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        /**
         * @description
         * Simply verifies that all components of the payload are present.
         * @param {object} opts Payload config.
         * @returns {boolean} Collection is valid.
         */
        validateCollectionPayload(opts): boolean {
            var validPayload = true;
            var verifyParams = (params) => {
                _.each(params, (param) => {
                    if (!opts[param]) {
                        toastr.error('options' + param + ' is required to complete this operation');
                        validPayload = false;
                    }
                });
            };

            //Verify all required params are included
            switch (opts.operation) {
                case 'GetGroupCollectionFromUser':
                    verifyParams(['userLoginName']);
                    break;
                case 'GetUserCollectionFromGroup':
                    verifyParams(['groupName']);
                    break;
                case 'GetViewCollection':
                    verifyParams(['listName']);
                    break;
                case 'GetAttachmentCollection':
                    verifyParams(['listName', 'ID']);
                    break;
            }
            return validPayload;
        }


    }


    angular
        .module('angularPoint')
        .service('apDataService', DataService);

}
