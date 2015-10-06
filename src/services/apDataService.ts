/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var apDefaultListItemQueryOptions = DefaultListItemQueryOptions;
    var apWebServiceOperationConstants = WebServiceOperationConstants;

    var service: DataService, $q: ng.IQService, $timeout: ng.ITimeoutService, $http: ng.IHttpService, apConfig: IAPConfig,
        apUtilityService: UtilityService, apCacheService: CacheService, apDecodeService: DecodeService,
        apEncodeService: EncodeService, apFieldService: FieldService, apIndexedCacheFactory: IndexedCacheFactory,
        toastr, SPServices, apBasePermissionObject: BasePermissionObject,
        apXMLToJSONService: XMLToJSONService, apChangeService: ChangeService, apLogger: Logger;

    export interface IDataService {
        createListItem<T extends ListItem<any>>(model: Model, listItem: Object, options?: { buildValuePairs: boolean; valuePairs: [string, any][] }): ng.IPromise<T>;
        createItemUrlFromFileRef(fileRefString: string): string;
        deleteAttachment(options: { listItemID: number; url: string; listName: string; }): ng.IPromise<any>;
        deleteListItem(model: Model, listItem: ListItem<any>, options?: { target: IndexedCache<any> }): ng.IPromise<any>;
        executeQuery<T extends ListItem<any>>(model: Model, query: IQuery<T>, options?: IExecuteQueryOptions): ng.IPromise<IndexedCache<T>>
        generateWebServiceUrl(service: string, webURL?: string): ng.IPromise<string>;
        getAvailableWorkflows(fileRefString: string): ng.IPromise<IWorkflowDefinition[]>;
        getCollection(options: { operation: string; userLoginName?: string; groupName?: string; listName?: string; filterNode: string; }): ng.IPromise<Object[]>;
        getCurrentSite(): ng.IPromise<string>;
        getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: IFieldDefinition): ng.IPromise<FieldVersionCollection>
        getGroupCollectionFromUser(login?: string): ng.IPromise<IXMLGroup[]>;
        getList(options: { listName: string }): ng.IPromise<Object>;
        getListFields(options: { listName: string; }): ng.IPromise<IXMLFieldDefinition[]>;
        getUserProfileByName(login?: string): ng.IPromise<IXMLUserProfile>;
        processChangeTokenXML<T extends ListItem<any>>(model: Model, query: IQuery<T>, responseXML: XMLDocument, opts): void;
        processDeletionsSinceToken(responseXML: XMLDocument, indexedCache: IndexedCache<any>): void;
        requestData(opts): ng.IPromise<XMLDocument>;
        retrieveChangeToken(responseXML: XMLDocument): string;
        retrieveListPermissions(responseXML: XMLDocument): IUserPermissionsObject
        serviceWrapper(options): ng.IPromise<any>;
        startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): ng.IPromise<any>;
        updateListItem<T extends ListItem<any>>(model: Model, listItem: T, options): ng.IPromise<T>;
        validateCollectionPayload(opts): boolean;
    }

    export class DataService implements IDataService {
        queryForCurrentSite: ng.IPromise<string>;
        static $inject = ['$http', '$q', '$timeout', 'apCacheService', 'apChangeService', 'apConfig', 'apDecodeService',
            'apDefaultListItemQueryOptions', 'apEncodeService', 'apFieldService', 'apIndexedCacheFactory',
            'apUtilityService', 'apWebServiceOperationConstants', 'apXMLToJSONService', 'SPServices', 'toastr',
            'apBasePermissionObject', 'apLogger'];

        constructor(_$http_, _$q_, _$timeout_, _apCacheService_, _apChangeService_, _apConfig_, _apDecodeService_,
            _apDefaultListItemQueryOptions_, _apEncodeService_, _apFieldService_, _apIndexedCacheFactory_,
            _apUtilityService_, _apWebServiceOperationConstants_, _apXMLToJSONService_, _SPServices_, _toastr_,
            _apBasePermissionObject_, _apLogger_) {
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
            apBasePermissionObject = _apBasePermissionObject_;
            apLogger = _apLogger_;
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
         * @param {object} [options.indexedCache=apIndexedCacheFactory.create({})] Optionally place new item in a specified cache.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        createListItem<T extends ListItem<any>>(model: Model, listItem: Object, options?: ICreateListItemOptions<T>): ng.IPromise<T> {
            var defaults = {
                batchCmd: 'New',
                buildValuePairs: true,
                indexedCache: apIndexedCacheFactory.create({}),
                listName: model.getListId(),
                operation: 'UpdateListItems',
                target: undefined,
                valuePairs: [],
                webURL: model.list.identifyWebURL()
            };

            defaults.target = defaults.indexedCache;

            var opts: ICreateListItemOptions<T> = _.assign({}, defaults, options);

            //Method gets added onto new list item and allows access to parent cache
            opts.getCache = () => opts.indexedCache;

            if (opts.buildValuePairs === true) {
                var editableFields: IFieldDefinition[] = _.where(model.list.fields, { readOnly: false });
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, listItem);
            }


            /** Overload the function then pass anything past the first parameter to the supporting methods */
            return this.serviceWrapper(opts)
                .then((response) => {
                    /** Online this should return an XML object */
                    var indexedCache = apDecodeService.processListItems(model, opts, response, opts);
                    /** Return reference to last listItem in cache because it will have the new highest id */
                    return indexedCache.last()
                });
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
                listName: model.getListId(),
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

            return this.serviceWrapper(opts)
                .then(() => {
                    /** Success */
                    return apCacheService.deleteEntity(opts.listName, listItem.id);
                }, (outcome) => {
                    //In the event of an error, display toast
                    let msg = 'There was an error deleting a list item from ' + model.list.title;
                    toastr.error(msg);

                    return outcome;
                });

        }

        /**
         * @ngdoc function
         * @name DataService.executeQuery
         * @description
         * Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.
         * @param {object} model Reference to the model where the Query resides.
         * @param {object} query Reference to the Query making the call.
         * @param {object} [options] Optional configuration parameters.
         * @param {object} [options.target=model.getCache()] The target destination for returned entities
         * @returns {object} - Key value hash containing all list item id's as keys with the listItem as the value.
         */
        executeQuery<T extends ListItem<any>>(model: Model, query: IQuery<T>, options?: IExecuteQueryOptions): ng.IPromise<IndexedCache<T>> {

            var defaults = {
                target: model.getCache()
            };

            /** Extend defaults **/
            var opts: IExecuteQueryOptions = _.assign({}, defaults, options);

            return this.serviceWrapper(query)
                .then((responseXML) => {
                    if (query.operation === 'GetListItemChangesSinceToken') {
                        this.processChangeTokenXML<T>(model, query, responseXML, opts);
                    }

                    /** Convert the XML into JS objects */
                    var entities = apDecodeService.processListItems<T>(model, query, responseXML, opts);

                    /** Set date time to allow for time based updates */
                    query.lastRun = new Date();

                    return entities;
                });

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
            /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
            var itemUrl = fileRefString.indexOf(': //') > -1 ? fileRefString : this.createItemUrlFromFileRef(fileRefString);

            return this.serviceWrapper({
                operation: 'GetTemplatesForItem',
                item: itemUrl
            })
                .then(function(responseXML) {
                    var workflowTemplates = [];
                    var xmlTemplates = apXMLToJSONService.filterNodes(responseXML, 'WorkflowTemplate');
                    _.each(xmlTemplates, function(xmlTemplate: JQuery) {
                        var template = {
                            name: $(xmlTemplate).attr('Name'),
                            instantiationUrl: $(xmlTemplate).attr('InstantiationUrl'),
                            templateId: '{' + $(xmlTemplate).find('WorkflowTemplateIdSet').attr('TemplateId') + '}'
                        };
                        workflowTemplates.push(template);
                    });
                    return workflowTemplates;
                });
        }

        /**
         * @ngdoc function
         * @name DataService.getCollection
         * @description
         * Used to handle any of the Get[filterNode]Collection calls to SharePoint
         *
         * @param {Object} options - object used to extend payload and needs to include all SPServices required attributes
         * @param {string} options.operation Can be any of the below or any other requests for collections:
         *  - GetAttachmentCollection @requires options.listName & options.ID
         *  - GetGroupCollectionFromSite
         *  - GetGroupCollectionFromUser @requires options.userLoginName
         *  - GetListCollection
         *  - GetUserCollectionFromGroup @requires options.groupName
         *  - GetUserCollectionFromSite
         *  - GetViewCollection @requires options.listName
         * @param {string} options.filterNode Value to iterate over in returned XML
         *         if not provided it's extracted from the name of the operation
         *         ex: Get[User]CollectionFromSite, "User" is used as the filterNode
         * @param {string} [options.groupName] Valid for 'GetUserCollectionFromGroup'
         * @param {string} [options.listName] Valid for 'GetViewCollection' or 'GetAttachmentCollection'
         * @param {string} [options.userLoginName] Valid for 'GetGroupCollectionFromUser'
         * @returns {Promise<object[]>} Promise which when resolved will contain an array of objects representing the
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
        getCollection(options: IGetCollectionOptions): ng.IPromise<Object[]> {
            var defaults = {
                postProcess: processXML
            };
            var opts: IGetCollectionOptions = _.assign({}, defaults, options);

            /** Determine the XML node to iterate over if filterNode isn't provided */
            var filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];

            var deferred = $q.defer();

            /** Convert the xml returned from the server into an array of js objects */
            function processXML(responseXML: XMLDocument) {
                var convertedItems: Object[] = [];
                var filteredNodes = apXMLToJSONService.filterNodes(responseXML, filterNode);
                /** Get attachments only returns the links associated with a list item */
                if (opts.operation === 'GetAttachmentCollection') {
                    /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                    _.each(filteredNodes, (node: JQuery) => convertedItems.push($(node).text()));
                } else {
                    convertedItems = apXMLToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
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

                var soapData = SPServices.SOAPEnvelope.header +
                    "<WebUrlFromPageUrl xmlns='" + SPServices.SCHEMASharePoint + "/soap/' ><pageUrl>" +
                    ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
                    "</pageUrl></WebUrlFromPageUrl>" +
                    SPServices.SOAPEnvelope.footer;

                $http({
                    method: 'POST',
                    url: '/_vti_bin/Webs.asmx',
                    data: soapData,
                    responseType: "document",
                    headers: {
                        "Content-Type": "text/xml;charset='utf-8'"
                    }
                })
                    .then((response) => {
                        /** Success */
                        var errorMsg = apDecodeService.checkResponseForErrors(response.data);
                        if (errorMsg) {
                            this.errorHandler('Failed to get current site.  ' + errorMsg, deferred, soapData);
                        }
                        apConfig.defaultUrl = $(response.data).find("WebUrlFromPageUrlResult").text();
                        deferred.resolve(apConfig.defaultUrl)
                    })
                    .catch((err) => {
                        /** Error */
                        this.errorHandler('Failed to get current site.  ' + err, deferred, soapData);
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
         *        strlistID: model.getListId(),
         *        strlistItemID: listItem.id,
         *        strFieldName: fieldDefinition.staticName
         *    };
         * </pre>
         * @param {object} fieldDefinition Field definition object from the model.
         * @returns {object[]} Promise which resolves with an array of list item changes for the specified field.
         */
        getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: FieldDefinition): ng.IPromise<FieldVersionCollection> {
            var defaults = {
                operation: 'GetVersionCollection'
            };
            var opts = _.assign({}, defaults, options);

            return this.serviceWrapper(opts)
                .then((response) => {
                    /** Parse XML response */
                    var fieldVersionCollection = apDecodeService.parseFieldVersions(response, fieldDefinition);
                    /** Resolve with an array of all field versions */
                    return fieldVersionCollection;
                })
                .catch((err) => {
                    /** Failure */
                    toastr.error('Failed to fetch version history.');
                    return err;
                });
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
            return this.getList(options)
                .then((responseXML) => {
                    var filteredNodes = apXMLToJSONService.filterNodes(responseXML, 'Field');
                    var fields = apXMLToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
                    return fields;
                });
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
            var payload = {
                accountName: undefined,
                operation: 'GetUserProfileByName'
            };
            if (login) {
                payload.accountName = login;
            }

            return this.serviceWrapper(payload)
                .then((responseXML) => {
                    var userProfile = {
                        AccountName: undefined,
                        userLoginName: undefined
                    };
                    //Not formatted like a normal SP response so need to manually parse
                    var filteredNodes = apXMLToJSONService.filterNodes(responseXML, 'PropertyData');
                    _.each(filteredNodes, (node: JQuery) => {
                        var nodeName = apXMLToJSONService.filterNodes(node, 'Name');
                        var nodeValue = apXMLToJSONService.filterNodes(node, 'Value');
                        if (nodeName.length > 0 && nodeValue.length > 0) {
                            userProfile[nodeName.text().trim()] = nodeValue.text().trim();
                        }
                    });

                    /** Optionally specify a necessary prefix that should appear before the user login */
                    userProfile.userLoginName = apConfig.userLoginNamePrefix ?
                        (apConfig.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
                    return userProfile;
                });
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
        processChangeTokenXML<T extends ListItem<any>>(model: Model, query: IQuery<T>, responseXML: XMLDocument, opts): void {
            if (!model.deferredListDefinition) {
                //Extend our local list definition and field definitions with XML
                apDecodeService.extendListMetadata(model, responseXML);

                /**If loaded from local or session cache the list/field definitions won't be extended so ensure we check before
                 * resolving promise verifying list has been extended.  One of the attributes we'd expect to see on all List/Libraries
                 * is "BaseType" */
                if (model.getList().BaseType) {
                    //List successfully extended
                    /** Replace the null placeholder with this resolved promise so we don't have to process in the future and also
                    * don't have to query again if we run Model.extendListMetadata. */
                    model.deferredListDefinition = $q.when(model);
                }
            }

            /** Store token for future web service calls to return changes */
            let changeToken = this.retrieveChangeToken(responseXML);
            if (changeToken) {
                /** Don't update change token if request fails to return a valid response */
                query.changeToken = changeToken;
            }

            /** Update the user permissions for this list */
            var permissions = this.retrieveListPermissions(responseXML);
            if (permissions) {
                model.list.permissions = permissions;
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
            var filteredNodes = apXMLToJSONService.filterNodes(responseXML, 'Id');
            _.each(filteredNodes, (node: JQuery) => {
                /** Check for the type of change */
                var changeType = $(node).attr('ChangeType');

                if (changeType === 'Delete') {
                    var listItemId = parseInt($(node).text(), 10);
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
                    })
                        .then((response) => {
                            // Success Code
                            // Errors can still be resolved without throwing an error so check the XML
                            var errorMsg = apDecodeService.checkResponseForErrors(response.data);
                            if (errorMsg) {
                                // Actuall error but returned with success resonse....thank you SharePoint
                                this.errorHandler(errorMsg, deferred, soapData, response);
                            } else {
                                /** Real success */
                                deferred.resolve(response.data);
                            }
                        })
                        .catch((err) => {
                            // Failure
                            this.errorHandler(err, deferred, soapData);
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
         * @name DataService.retrieveListPermissions
         * @description
         * Returns the text representation of the users permission mask
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {XMLDocument} responseXML XML response from the server.
         */
        retrieveListPermissions(responseXML: XMLDocument): IUserPermissionsObject {
            //Permissions will be a string of Permission names delimited by commas
            //Example: "ViewListItems, AddListItems, EditListItems, DeleteListItems, ...."
            let listPermissions: string = $(responseXML).find('listitems').attr('EffectivePermMask');
            let permissionObject;
            if (_.isString(listPermissions)) {
                let permissionNameArray = listPermissions.split(',');
                permissionObject = new ap.BasePermissionObject();
                //Set each of the identified permission levels to true
                _.each(permissionNameArray, (permission: string) => {
                    //Remove extra spaces
                    let permissionName = permission.trim();
                    //Find the permission level on the permission object that is currently set to false
                    //and set to true
                    permissionObject[permissionName] = true;

                    if (permissionName === 'FullMask') {
                        //User has full rights so set all to true
                        _.each(permissionObject, (propertyValue, propertyName) => {
                            permissionObject[propertyName] = true;
                        })
                    }
                });
            }

            return permissionObject;

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
         * @param {string} [options.filterNode] XML filter string used to find the elements to iterate over.
         * This is typically 'z: row' for list items.
         * @param {Function} [options.postProcess] Method to process responseXML prior to returning.
         * @param {string} [options.webURL] XML filter string used to find the elements to iterate over.
         * @returns {object} Returns a promise which when resolved either returns clean objects parsed by the value
         * in options.filterNode or the raw XML response if a options.filterNode
         *
         *      If options.filterNode is provided, returns XML parsed by node name
         *      Otherwise returns the server response
         */
        serviceWrapper(options: IServiceWrapperOptions): ng.IPromise<any> {
            var defaults = {
                postProcess: processXML,
                webURL: apConfig.defaultUrl
            };
            var opts: IServiceWrapperOptions = _.assign({}, defaults, options);

            /** Convert the xml returned from the server into an array of js objects */
            function processXML(responseXML: Object) {
                if (opts.filterNode) {
                    var filteredNodes = apXMLToJSONService.filterNodes(responseXML, opts.filterNode);
                    return apXMLToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
                } else {
                    return responseXML;
                }
            }

            return this.requestData(opts)
                .then((responseXML) => {
                    /** Success */
                    var data = opts.postProcess(responseXML);
                    return data;
                })
                .catch((err: Error) => {
                    /** Failure */
                    toastr.error('Failed to complete the requested ' + opts.operation + ' operation.');
                    return err;
                });

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
        updateListItem<T extends ListItem<any>>(model: Model, listItem: T, options?: IUpdateListitemOptions): ng.IPromise<T> {
            var defaults = {
                batchCmd: 'Update',
                buildValuePairs: true,
                ID: listItem.id,
                listName: model.getListId(),
                operation: 'UpdateListItems',
                target: listItem.getCache(),
                valuePairs: [],
                webURL: model.list.identifyWebURL()
            },
                opts: { buildValuePairs: boolean; valuePairs: [string, any][]; webURL: string; } = _.assign({}, defaults, options);

            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, { readOnly: false });
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, listItem);
            }

            if (model.list.webURL && !opts.webURL) {
                opts.webURL = model.list.webURL;
            }

            ///** Overload the function then pass anything past the first parameter to the supporting methods */
            //this.serviceWrapper(opts, listItem, model)
            let request = this.serviceWrapper(opts)
                .then(function(response) {
                    var indexedCache = apDecodeService.processListItems(model, listItem.getQuery(), response, opts);
                    /** Return reference to updated listItem  */
                    return indexedCache[listItem.id];
                });

            /** Notify any listeners to expect a change */
            apChangeService.registerListItemUpdate(listItem, opts, request);

            return request;
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

        private errorHandler(errorMsg: string, deferred: ng.IDeferred<any>, soapData: Object, response?: Object) {
            //Log error to any server side logging list
            apLogger.error(errorMsg, {
                json: {
                    request: JSON.stringify(soapData),
                    response: JSON.stringify(response)
                }
            });

            deferred.reject(errorMsg);
        }


    }

    interface ICreateListItemOptions<T extends ListItem<any>> {
        buildValuePairs?: boolean;
        indexedCache?: IndexedCache<T>;
        getCache?: () => IndexedCache<T>;
        valuePairs?: [string, any][];
    }

    export interface IExecuteQueryOptions {
        factory?: Function;
        filter?: string;
        mapping?: IFieldDefinition[];
        target?: IndexedCache<any>;
        [key: string]: any;
    }

    interface IGetCollectionOptions {
        filterNode: string;
        groupName?: string;
        listName?: string;
        operation: string;
        userLoginName?: string;
    }

    interface IServiceWrapperOptions {
        filterNode?: string;
        operation: string;
        postProcess?: (responseXML: Object) => any;
        webURL?: string;
    }

    interface IUpdateListitemOptions {
        buildValuePairs?: boolean;
        valuePairs?: [string, any][];
    }

    interface IGetFieldVersionHistoryOptions {
        operation?: string;
        strFieldName?: string;
        strListID: string;
        strListItemID: number;
        webURL?: string;
    }

    angular
        .module('angularPoint')
        .service('apDataService', DataService);

}
