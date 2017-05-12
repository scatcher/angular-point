import * as _ from 'lodash';

import { WebServiceOperationConstants as apWebServiceOperationConstants } from '../constants/apWebServiceOperationConstants';
import { UtilityService } from './apUtilityService';
import { CacheService } from './apCacheService';
import { DecodeService } from './apDecodeService';
import { EncodeService } from './apEncodeService';
import { FieldService } from './apFieldService';
import { IndexedCacheFactory, IndexedCache } from '../factories/apIndexedCacheFactory';
import { BasePermissionObject, UserPermissionsObject } from '../constants/apPermissionObject';
import { XMLToJSONService } from './apXMLToJSONService';
import { ChangeService } from './apChangeService';
import { Logger } from './apLogger';
import { ListItem } from '../factories/apListItemFactory';
import { FieldDefinition, XMLFieldDefinition } from '../factories/apFieldFactory';
import { FieldVersionCollection } from '../factories/apListItemVersionFactory';
import { Model } from '../factories/apModelFactory';
import { Query } from '../factories/apQueryFactory';
import { IWorkflowDefinition, XMLGroup, XMLUserProfile } from '../interfaces/index';
import { ENV } from '../angular-point';

export class DataService {
    static $inject = ['$http', '$q', '$timeout', 'apCacheService', 'apChangeService', 'apDecodeService',
        'apDefaultListItemQueryOptions', 'apEncodeService', 'apFieldService', 'apIndexedCacheFactory',
        'apUtilityService', 'apWebServiceOperationConstants', 'apXMLToJSONService', 'SPServices',
        'apBasePermissionObject', 'apLogger'];
    queryForCurrentSite: ng.IPromise<string>;

    constructor(private $http: ng.IHttpService, private $q: ng.IQService, private $timeout: ng.ITimeoutService,
        private apCacheService: CacheService, private apChangeService: ChangeService, private apDecodeService: DecodeService,
        private apDefaultListItemQueryOptions, private apEncodeService: EncodeService, private apFieldService: FieldService,
        private apIndexedCacheFactory: IndexedCacheFactory, private apUtilityService: UtilityService,
        private apWebServiceOperationConstants, private apXMLToJSONService: XMLToJSONService, private SPServices,
        private apBasePermissionObject, private apLogger: Logger) {
    }

    createItemUrlFromFileRef(fileRefString: string): string {
        return window.location.protocol + '//' + window.location.hostname + '/' + fileRefString;
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
        let ajaxURL = '_vti_bin/' + service + '.asmx',
            deferred = this.$q.defer();

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
         *              "instantiationUrl": "https: //sharepoint.mycompany.com/_layouts/
         *                 IniWrkflIP.aspx?List=fc17890e-8c0…311-cea9-40d1-a183-6edde9333815}&Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}",
         *              "templateId": "59062311-cea9-40d1-a183-6edde9333815"
         *          }]
     *     });
     * </pre>
     * @param {string} fileRefString Relative or static url referencing the item.
     * @returns {object} Resolves with an array of objects defining each of the available workflows for the item.
     */
    getAvailableWorkflows(fileRefString: string): ng.IPromise<IWorkflowDefinition[]> {
        /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
        let itemUrl = fileRefString.indexOf(': //') > -1 ? fileRefString : this.createItemUrlFromFileRef(fileRefString);

        return this.serviceWrapper({
            operation: 'GetTemplatesForItem',
            item: itemUrl
        }).then((responseXML) => {
            let workflowTemplates = [];
            let xmlTemplates = this.apXMLToJSONService.filterNodes(responseXML, 'WorkflowTemplate');
            _.each(xmlTemplates, (xmlTemplate: Element) => {
                const template = {
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
    getCollection(options: GetCollectionOptions): ng.IPromise<Object[]> {

        /** Determine the XML node to iterate over if filterNode isn't provided */
        let filterNode = options.filterNode || options.operation.split('Get')[1].split('Collection')[0];

        const defaults = {
            /**
             * Default XML parser - convert the xml returned from the server into an array of js objects
             */
            postProcess: (responseXML: Element) => {
                let convertedItems = [];
                const filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, filterNode);
                /** Get attachments only returns the links associated with a list item */
                if (options.operation && options.operation === 'GetAttachmentCollection') {
                    /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                    _.each(filteredNodes, (node: Element) => convertedItems.push($(node).text()));
                } else {
                    convertedItems = this.apXMLToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
                }
                return convertedItems;
            }
        };

        let opts: GetCollectionOptions = _.assign({}, defaults, options);

        let deferred = this.$q.defer();

        let validPayload = this.validateCollectionPayload(opts);

        if (validPayload) {
            this.serviceWrapper(opts)
                .then((response) => {
                    deferred.resolve(response);
                }, (err) => deferred.reject(err));
        } else {
            deferred.reject(`Invalid payload for ${opts.operation} request.`);
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
        let deferred = this.$q.defer();

        if (!this.queryForCurrentSite) {
            /** We only want to run this once so cache the promise the first time and just reference it in the future */
            this.queryForCurrentSite = deferred.promise;

            let soapData = this.SPServices.SOAPEnvelope.header +
                `<WebUrlFromPageUrl xmlns="` + this.SPServices.SCHEMASharePoint + `/soap/" ><pageUrl>` +
                ((location.href.indexOf('?') > 0) ? location.href.substr(0, location.href.indexOf('?')) : location.href) +
                '</pageUrl></WebUrlFromPageUrl>' +
                this.SPServices.SOAPEnvelope.footer;

            this.$http({
                method: 'POST',
                url: '/_vti_bin/Webs.asmx',
                data: soapData,
                responseType: 'document',
                headers: {
                    'Content-Type': 'text/xml;charset="utf-8"'
                }
            })
                .then((response) => {
                    /** Success */
                    let errorMsg = this.apDecodeService.checkResponseForErrors(<any>response.data);
                    if (errorMsg) {
                        this.errorHandler('Failed to get current site.  ' + errorMsg, deferred, soapData);
                    }
                    // environment.site = $(response.data).find("WebUrlFromPageUrlResult").text();
                    deferred.resolve(ENV.site);
                }, (err) => {
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
     * let options = {
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
    getFieldVersionHistory<T extends ListItem<any>>(
        options: GetFieldVersionHistoryOptions,
        fieldDefinition: FieldDefinition
    ): ng.IPromise<FieldVersionCollection> {

        let defaults = {
            operation: 'GetVersionCollection'
        };
        let opts = _.assign({}, defaults, options);

        return this.serviceWrapper(opts)
            .then((response) => {
                /** Parse XML response */
                let fieldVersionCollection = this.apDecodeService.parseFieldVersions(response, fieldDefinition);
                /** Resolve with an array of all field versions */
                return fieldVersionCollection;
            }, (err) => {
                /** Failure */
                throw new Error(`Failed to fetch version history. Error: ${err}`);
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
    getGroupCollectionFromUser(login?: string): ng.IPromise<XMLGroup[]> {
        /** Create a new deferred object if not already defined */
        let deferred = this.$q.defer();
        let getGroupCollection = (userLoginName) => {
            this.serviceWrapper({
                operation: 'GetGroupCollectionFromUser',
                userLoginName: userLoginName,
                filterNode: 'Group'
            }).then((groupCollection: XMLGroup[]) => deferred.resolve(groupCollection));
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
     * @param {string} [options.webURL] URL to the site containing the list if differnt from primary data site in apConfig.
     * @returns {object} Promise which resolves with an object defining field and list config.
     */
    getList(options: { listName: string, webURL?: string }): ng.IPromise<Object> {
        let defaults = {
            operation: 'GetList'
        };

        let opts: { operation: string; listName: string; webURL?: string } = _.assign({}, defaults, options);
        return this.serviceWrapper(opts);
    }

    /**
     * @ngdoc function
     * @name DataService.getListFields
     * @description
     * Returns field definitions for a specified list.
     * @param {object} options Configuration parameters.
     * @param {string} options.listName GUID of the list.
     * @param {string} [options.webURL] URL to the site containing the list if differnt from primary data site in apConfig.
     * @returns {Promise} Promise which resolves with an array of field definitions for the list.
     */
    getListFields(options: { listName: string; webURL?: string }): ng.IPromise<XMLFieldDefinition[]> {
        return this.getList(options)
            .then((responseXML: Element) => {
                let filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, 'Field');
                let fields = this.apXMLToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
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
    getUserProfileByName(login?: string): ng.IPromise<XMLUserProfile> {
        let payload = {
            accountName: undefined,
            operation: 'GetUserProfileByName'
        };
        if (login) {
            payload.accountName = login;
        }

        return this.serviceWrapper(payload)
            .then((responseXML) => {
                let userProfile = {
                    AccountName: undefined,
                    userLoginName: undefined
                };
                // Not formatted like a normal SP response so need to manually parse
                let filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, 'PropertyData');
                _.each(filteredNodes, (node: Element) => {
                    let nodeName = node.getElementsByTagName('Name')[0];
                    let nodeValue = node.getElementsByTagName('Value')[0];

                    if (nodeName && nodeValue) {
                        userProfile[nodeName.textContent.trim()] = nodeValue.textContent.trim();
                    }
                });

                /** Optionally specify a necessary prefix that should appear before the user login */
                userProfile.userLoginName = ENV.userLoginNamePrefix ?
                    (ENV.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
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
     * @param {Element} responseXML XML response from the server.
     * @param {IndexedCache<T>} cache Cache to process in order to handle deletions.
     */
    processChangeTokenXML<T extends ListItem<any>>(model: Model, query: Query<T>, responseXML: Element, cache: IndexedCache<T>): void {
        if (!model.deferredListDefinition) {
            // Extend our local list definition and field definitions with XML
            this.apDecodeService.extendListMetadata(model, responseXML);

            /**If loaded from local or session cache the list/field definitions won't be extended so ensure we check before
             * resolving promise verifying list has been extended.  One of the attributes we'd expect to see on all List/Libraries
             * is "BaseType" */
            if (model.getList().BaseType) {
                // List successfully extended
                /** Replace the null placeholder with this resolved promise so we don't have to process in the future and also
                 * don't have to query again if we run Model.extendListMetadata. */
                model.deferredListDefinition = this.$q.when(model);
            }
        }

        /** Store token for future web service calls to return changes */
        let changeToken = this.retrieveChangeToken(responseXML);
        if (changeToken) {
            /** Don't update change token if request fails to return a valid response */
            query.changeToken = changeToken;
        }

        /** Update the user permissions for this list */
        let permissions = this.retrieveListPermissions(responseXML);
        if (permissions) {
            model.list.permissions = permissions;
        }

        /** Change token query includes deleted items as well so we need to process them separately */
        this.processDeletionsSinceToken(responseXML, cache);
    }

    /**
     * @ngdoc function
     * @name DataService.processDeletionsSinceToken
     * @description
     * GetListItemChangesSinceToken returns items that have been added as well as deleted so we need
     * to remove the deleted items from the local cache.
     * @param {Element} responseXML XML response from the server.
     * @param {Object} cache Cached object of key value pairs.
     */
    processDeletionsSinceToken(responseXML: Element, cache: IndexedCache<any>): void {
        /** Remove any locally cached entities that were deleted from the server */
        let filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, 'Id');
        _.each(filteredNodes, (node: Element) => {
            /** Check for the type of change */
            let changeType = $(node).attr('ChangeType');

            if (changeType === 'Delete') {
                let listItemId = parseInt($(node).text(), 10);
                /** Remove from local data array */
                cache.delete(listItemId);
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
    requestData(opts): ng.IPromise<Element> {
        let deferred = this.$q.defer();
        let soapData = this.SPServices.generateXMLComponents(opts);
        let service = apWebServiceOperationConstants[opts.operation][0];

        this.generateWebServiceUrl(service, opts.webURL)
            .then((url) => {
                this.$http.post(url, soapData.msg, {
                    responseType: 'text',
                    // responseType: "document",
                    headers: {
                        'Content-Type': `text/xml;charset="utf-8"`,
                        SOAPAction: () => soapData.SOAPAction ? soapData.SOAPAction : null
                    },
                    // transformResponse: (data, headersGetter) => {
                    //     // if (_.isString(data)) {
                    //     //     data = $.parseXML(data);
                    //     // }
                    //     return jQuery.parseXML(data);
                    // }
                })
                    .then((response: any) => {

                        const parser = new DOMParser();
                        const responseXML = parser.parseFromString(response.data, 'text/xml');

                        // Success Code
                        // Errors can still be resolved without throwing an error so check the XML
                        let errorMsg = this.apDecodeService.checkResponseForErrors(responseXML);
                        // let errorMsg = apDecodeService.checkResponseForErrors(<any>response.data);
                        if (errorMsg) {
                            // Actuall error but returned with success resonse....thank you SharePoint
                            this.errorHandler(errorMsg, deferred, soapData, response);
                        } else {
                            /** Real success */
                            deferred.resolve(responseXML);
                            // deferred.resolve(response.data);
                        }
                    }, (err) => {
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
     * @param {Element} responseXML XML response from the server.
     */
    retrieveChangeToken(responseXML: Element): string {
        return $(responseXML).find('Changes').attr('LastChangeToken');
    }

    /**
     * @ngdoc function
     * @name DataService.retrieveListPermissions
     * @description
     * Returns the text representation of the users permission mask
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Element} responseXML XML response from the server.
     */
    retrieveListPermissions(responseXML: Element): UserPermissionsObject {
        // Permissions will be a string of Permission names delimited by commas
        // Example: "ViewListItems, AddListItems, EditListItems, DeleteListItems, ...."
        let listPermissions: string = $(responseXML).find('listitems').attr('EffectivePermMask');
        let permissionObject;
        if (_.isString(listPermissions)) {
            let permissionNameArray = listPermissions.split(',');
            permissionObject = new BasePermissionObject();
            // Set each of the identified permission levels to true
            _.each(permissionNameArray, (permission: string) => {
                // Remove extra spaces
                let permissionName = permission.trim();
                // Find the permission level on the permission object that is currently set to false
                // and set to true
                permissionObject[permissionName] = true;

                if (permissionName === 'FullMask') {
                    // User has full rights so set all to true
                    _.each(permissionObject, (propertyValue, propertyName) => {
                        permissionObject[propertyName] = true;
                    });
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
    serviceWrapper(options: ServiceWrapperOptions): ng.IPromise<any> {

        const defaults = {
            postProcess: (responseXML: Element) => {
                if (options.filterNode) {
                    const filteredNodes = this.apXMLToJSONService.filterNodes(responseXML, options.filterNode);
                    return this.apXMLToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
                } else {
                    return responseXML;
                }
            },
            webURL: ENV.site
        };

        const opts: ServiceWrapperOptions = _.assign({}, defaults, options);

        /** Convert the xml returned from the server into an array of js objects */

        return this.requestData(opts)
            .then((responseXML) => {
                /** Success */
                return opts.postProcess(responseXML);
            }, (err: Error) => {
                /** Failure */
                return err + '  Failed to complete the requested ' + opts.operation + ' operation.';
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
        let defaults = {
            operation: 'StartWorkflow',
            item: '',
            fileRef: '',
            templateId: '',
            workflowParameters: '<root />'
        };
        let opts: { item: string; fileRef: string; } = _.assign({}, defaults, options);

        /** We have the relative file reference but we need to create the fully qualified reference */
        if (!opts.item && opts.fileRef) {
            opts.item = this.createItemUrlFromFileRef(opts.fileRef);
        }

        return this.serviceWrapper(<any>opts);
    }

    /**
     * @description
     * Simply verifies that all components of the payload are present.
     * @param {object} opts Payload config.
     * @returns {boolean} Collection is valid.
     */
    validateCollectionPayload(opts): boolean {
        let validPayload = true;
        let verifyParams = (params) => {
            _.each(params, (param) => {
                if (!opts[param]) {
                    console.warn('options' + param + ' is required to complete this operation');
                    validPayload = false;
                }
            });
        };

        // Verify all required params are included
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
        // Log error to any server side logging list
        this.apLogger.error(errorMsg, {
            json: {
                request: JSON.stringify(soapData),
                response: JSON.stringify(response)
            }
        });

        deferred.reject(errorMsg);
    }

}

export interface GetCollectionOptions {
    filterNode?: string;
    ID?: number;
    groupName?: string;
    listName?: string;
    operation: string;
    userLoginName?: string;
    webURL?: string;
}

export interface ServiceWrapperOptions {
    filterNode?: string;
    listItemID?: number;
    operation: string;
    postProcess?: (responseXML: Object) => any;
    webURL?: string;
    [key: string]: any;
}

export interface GetFieldVersionHistoryOptions {
    operation?: string;
    strFieldName?: string;
    strlistID: string;  // correct case
    strlistItemID: number; // correct case
    webURL?: string;
}

