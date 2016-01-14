import {WebServiceOperationConstants, APConfig, BasePermissionObject, SCHEMASharePoint, SOAPEnvelope, IUserPermissionsObject} from '../constants';
import {DecodeService, SPServices, LoggerService, XMLToJSONService} from '../services';
import {ListItem, Model, Query, IndexedCache, FieldDefinition, IFieldDefinition, FieldVersionCollection} from '../factories';
import {Http, RequestOptions, Request, RequestMethod, Headers} from 'angular2/http';
import {XMLFieldDefinition} from '../factories/apFieldFactory';
import {Promise} from 'es6-promise';
import {IWorkflowDefinition, IXMLGroup, IXMLUserProfile} from '../interfaces/main';
import  _ from 'lodash';
import {Injectable} from "angular2/core";

@Injectable()
export interface IDataService {
    createItemUrlFromFileRef(fileRefString: string): string;
    generateWebServiceUrl(service: string, webURL?: string): Promise<string>;
    getAvailableWorkflows(fileRefString: string): Promise<IWorkflowDefinition[]>;
    getCollection(options: { operation: string; userLoginName?: string; groupName?: string; listName?: string; filterNode: string; }): Promise<Object[]>;
    getCurrentSite(): Promise<string>;
    getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: FieldDefinition): Promise<FieldVersionCollection>;
    getGroupCollectionFromUser(login?: string): Promise<IXMLGroup[]>;
    getList(options: { listName: string; webURL?: string }): Promise<Object>;
    getListFields(options: { listName: string; webURL?: string }): Promise<FieldDefinition[]>;
    getUserProfileByName(login?: string): Promise<IXMLUserProfile>;
    processChangeTokenXML<T extends ListItem<any>>(model: Model, query: Query<T>, responseXML: Document, opts): void;
    processDeletionsSinceToken(responseXML: Document, indexedCache: IndexedCache<any>): void;
    requestData(opts): Promise<Document>;
    retrieveChangeToken(responseXML: Document): string;
    retrieveListPermissions(responseXML: Document): IUserPermissionsObject;
    serviceWrapper(options): Promise<any>;
    startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): Promise<any>;
    validateCollectionPayload(opts): boolean;
}

interface IWorkflowInitiationConfiguration extends IServiceWrapperOptions {
    item: string;
    fileRef: string;
}
export class DataServiceClass implements IDataService {
    queryForCurrentSite: Promise<string>;
    constructor(private http: Http){}

    createItemUrlFromFileRef(fileRefString: string): string {
        return window.location.protocol + '//' + window.location.hostname + '/' + fileRefString;
    }

    /**
     * @ngdoc function
     * @name apDataService.generateWebServiceUrl
     * @description
     * Builds the appropriate SharePoint resource URL.  If a URL isn't provided and it hasn't already been cached
     * we make a call to the server to find the root URL.  All future requests will then use this cached value.
     * @param {string} service The name of the service the SOAP operation is using.
     * @param {string} [webURL] Optionally provide the URL so we don't need to make a call to the server.
     * @returns {promise} Resolves with the url for the service.
     */
    generateWebServiceUrl(service: string, webURL?: string): Promise<string> {
        let ajaxURL = `_vti_bin/${service}.asmx`;
        let promise = new Promise((resolve, reject) => {
            if (webURL) {
                ajaxURL = webURL.charAt(webURL.length - 1) === '/' ?
                webURL + ajaxURL : webURL + '/' + ajaxURL;
                resolve(ajaxURL);
            } else {
                this.getCurrentSite().then((thisSite) => {
                    ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === '/') ? ajaxURL : ('/' + ajaxURL));
                    resolve(ajaxURL);
                });
            }
        });

        return promise;
    }

    /**
     * @ngdoc function
     * @name apDataService.getAvailableWorkflows
     * @description
     * Given a list item or document, return an array of all available workflows.  This is used in combination with
     * apDataService.startWorkflow because it requires the template GUID for the target workflow.
     * @example
     * <pre>
     * apDataService.getAvailableWorkflows(listItem.fileRef.lookupValue)
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
    getAvailableWorkflows(fileRefString: string): Promise<IWorkflowDefinition[]> {
        /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
        let itemUrl = fileRefString.indexOf(': //') > -1 ? fileRefString : this.createItemUrlFromFileRef(fileRefString);

        return this.serviceWrapper({
                operation: 'GetTemplatesForItem',
                item: itemUrl
            })
            .then(function (responseXML: Document) {
                let workflowTemplates = [];
                let xmlTemplates = responseXML.getElementsByTagName('WorkflowTemplate');
                _.each(xmlTemplates, (el: Element) => {
                    let workflowTemplateId = el.getElementsByTagName('WorkflowTemplateIdSet')[0].getAttribute('TemplateId');
                    let template = {
                        name: el.getAttribute('Name'),
                        instantiationUrl: el.getAttribute('InstantiationUrl'),
                        templateId: '{' + workflowTemplateId + '}'
                    };
                    workflowTemplates.push(template);
                });
                return workflowTemplates;
            });
    }

    /**
     * @ngdoc function
     * @name apDataService.getCollection
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
    getCollection(options: IGetCollectionOptions): Promise<Object[]> {
        let defaults = {
            postProcess: processXML
        };
        let opts: IGetCollectionOptions = Object.assign({}, defaults, options);

        /** Determine the XML node to iterate over if filterNode isn't provided */
        let filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];

        /** Convert the xml returned from the server into an array of js objects */
        function processXML(responseXML: Document) {
            let convertedItems: Object[] = [];
            let filteredNodes = responseXML.getElementsByTagName(filterNode);
            /** Get attachments only returns the links associated with a list item */
            if (opts.operation === 'GetAttachmentCollection') {
                /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                _.each(filteredNodes, (node: Element) => {
                    convertedItems.push(node.textContent);
                });
            } else {
                convertedItems = XMLToJSONService.parse(filteredNodes, {includeAllAttrs: true, removeOws: false});
            }
            return convertedItems;
        }

        let promise = new Promise((resolve, reject) => {
            let validPayload = this.validateCollectionPayload(opts);
            if (validPayload) {
                this.serviceWrapper(opts)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((err) => reject(err));
            } else {
                reject(`Invalid payload for ${opts.operation} request.`);
            }
        });

        return promise;
    }

    /**
     * @ngdoc function
     * @name apDataService.getCurrentSite
     * @description
     * Requests and caches the root url for the current site.  It caches the response so any future calls receive
     * the cached promise.
     * @returns {promise} Resolves with the current site root url.
     */
    getCurrentSite(): Promise<string> {

        if (!this.queryForCurrentSite) {

            let promise = new Promise((resolve, reject) => {
                /** We only want to run this once so cache the promise the first time and just reference it in the future */
                this.queryForCurrentSite = promise;
                let soapEnvelope = new SOAPEnvelope();

                let soapData = soapEnvelope.header +
                    `<WebUrlFromPageUrl xmlns="${SCHEMASharePoint}/soap/" ><pageUrl>` +
                    ((location.href.indexOf('?') > 0) ? location.href.substr(0, location.href.indexOf('?')) : location.href) +
                    `</pageUrl></WebUrlFromPageUrl>` +
                    soapEnvelope.footer;

                let headers = new Headers({'Content-Type': `text/xml;charset='utf-8'`});

                let options = new RequestOptions({
                    method: RequestMethod.Post,
                    url: '/_vti_bin/Webs.asmx',
                    body: soapData,
                    headers
                });

                let request = new Request(options);

                this.http.request(request)
                    .toPromise()
                    .then((data) => {

                        let parser = new DOMParser();
                        let responseXML = parser.parseFromString(data.text(), 'application/xml');

                        /** Success */
                        let errorMsg = DecodeService.checkResponseForErrors(responseXML);
                        if (errorMsg) {
                            errorHandler('Failed to get current site.  ' + errorMsg, reject, soapData);
                        }

                        let defaultUrl = responseXML.getElementsByTagName('WebUrlFromPageUrlResult');
                        if (!defaultUrl[0]) {
                            throw new Error('Invalid XML returned, missing "WebUrlFromPageUrlResult" element.');
                        }
                        APConfig.defaultUrl = defaultUrl[0].textContent;
                        resolve(APConfig.defaultUrl);
                    })
                    .catch((err) => {
                        /** Error */
                        errorHandler('Failed to get current site.  ' + err, reject, soapData);
                    });
                //Http.request('/_vti_bin/Webs.asmx', soapData, {
                //        responseType: 'document',
                //        headers: {
                //            'Content-Type': `text/xml;charset='utf-8'`
                //        }
                //    })
                //    .then(({data}: {data: Element}) => { //Use destructure response because we only care about data
                //        /** Success */
                //        let errorMsg = DecodeService.checkResponseForErrors(data);
                //        if (errorMsg) {
                //            errorHandler('Failed to get current site.  ' + errorMsg, reject, soapData);
                //        }
                //
                //        let defaultUrl = data.getElementsByTagName('WebUrlFromPageUrlResult');
                //        if (!defaultUrl[0]) {
                //            throw new Error('Invalid XML returned, missing "WebUrlFromPageUrlResult" element.');
                //        }
                //        APConfig.defaultUrl = defaultUrl[0].textContent;
                //        resolve(APConfig.defaultUrl);
                //    })
                //    .catch((err) => {
                //        /** Error */
                //        errorHandler('Failed to get current site.  ' + err, reject, soapData);
                //    });
            });
        }
        return this.queryForCurrentSite;
    }

    /**
     * @ngdoc function
     * @name apDataService.getFieldVersionHistory
     * @description
     * Returns the version history for a field in a list item.
     * @param {object} options Configuration object passed to SPServices.
     * <pre>
     * let options = {
     *        operation: 'GetVersionCollection',
     *        webURL: APConfig.defaultUrl,
     *        strlistID: model.getListId(),
     *        strlistItemID: listItem.id,
     *        strFieldName: fieldDefinition.staticName
     *    };
     * </pre>
     * @param {object} fieldDefinition Field definition object from the model.
     * @returns {object[]} Promise which resolves with an array of list item changes for the specified field.
     */
    getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: IFieldDefinition): Promise<FieldVersionCollection> {
        let defaults = {
            operation: 'GetVersionCollection'
        };
        let opts = Object.assign({}, defaults, options);

        return this.serviceWrapper(opts)
            .then((response) => {
                /** Parse XML response */
                let fieldVersionCollection = DecodeService.parseFieldVersions(response, fieldDefinition);
                /** Resolve with an array of all field versions */
                return fieldVersionCollection;
            })
            .catch((err) => {
                /** Failure */
                return `Failed to fetch version history. Error: ${err}`;
            });
    }

    /**
     * @ngdoc function
     * @name apDataService.getGroupCollectionFromUser
     * @description
     * Fetches an array of group names the user is a member of.  If no user is provided we use the current user.
     * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
     * @returns {string[]} Promise which resolves with the array of groups the user belongs to.
     */
    getGroupCollectionFromUser(login?: string): Promise<IXMLGroup[]> {
        let promise = new Promise((resolve, reject) => {
            /** Create a new deferred object if not already defined */

            let getGroupCollection = (userLoginName) => {
                this.serviceWrapper({
                        operation: 'GetGroupCollectionFromUser',
                        userLoginName: userLoginName,
                        filterNode: 'Group'
                    })
                    .then((groupCollection: IXMLGroup[]) => resolve(groupCollection))
                    .catch(err => reject(err));
            };

            if (!login) {
                /** No login name provided so lookup profile for current user */
                this.getUserProfileByName()
                    .then((userProfile) => getGroupCollection(userProfile.userLoginName));
            } else {
                getGroupCollection(login);
            }
        });
        return promise;
    }

    /**
     * @ngdoc function
     * @name apDataService.getList
     * @description
     * Returns all list details including field and list config.
     * @param {object} options Configuration parameters.
     * @param {string} options.listName GUID of the list.
     * @param {string} [options.webURL] URL to the site containing the list if differnt from primary data site in APConfig.
     * @returns {object} Promise which resolves with an object defining field and list config.
     */
    getList({ listName, webURL = undefined }): Promise<Object> {

        // let opts: { operation: string; listName: string; webURL?: string} = Object.assign({}, defaults, options);
        return this.serviceWrapper({
            operation: 'GetList',
            listName,
            webURL
        });
    }

    /**
     * @ngdoc function
     * @name apDataService.getListFields
     * @description
     * Returns field definitions for a specified list.
     * @param {object} options Configuration parameters.
     * @param {string} options.listName GUID of the list.
     * @param {string} [options.webURL] URL to the site containing the list if differnt from primary data site in APConfig.
     * @returns {Promise} Promise which resolves with an array of field definitions for the list.
     */
    getListFields({ listName, webURL = undefined }): Promise<XMLFieldDefinition[]> {
        return this.getList({listName, webURL})
            .then((responseXML: Document) => {
                let filteredNodes = responseXML.getElementsByTagName('Field');
                let fields = XMLToJSONService.parse(filteredNodes, {includeAllAttrs: true, removeOws: false});
                return fields;
            });
    }

    /**
     * @ngdoc function
     * @name apDataService.getUserProfile
     * @description
     * Returns the profile for an optional user, but defaults the the current user if one isn't provided.
     * Pull user profile info and parse into a profile object
     * http: //spservices.codeplex.com/wikipage?title=GetUserProfileByName
     * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
     * @returns {object} Promise which resolves with the requested user profile.
     */
    getUserProfileByName(login?: string): Promise<IXMLUserProfile> {
        let payload = {
            accountName: undefined,
            operation: 'GetUserProfileByName'
        };
        if (login) {
            payload.accountName = login;
        }

        return this.serviceWrapper(payload)
            .then((responseXML: Document) => {
                let userProfile = {
                    AccountName: undefined,
                    userLoginName: undefined
                };
                // not formatted like a normal SP response so need to manually parse
                let filteredNodes = responseXML.getElementsByTagName('PropertyData');

                _.each(filteredNodes, (node: Element) => {
                    let nodeName = responseXML.getElementsByTagName('Name');
                    let nodeValue = responseXML.getElementsByTagName('Value');
                    if (nodeName.length > 0 && nodeValue.length > 0) {
                        userProfile[nodeName[0].textContent.trim()] = nodeValue[0].textContent.trim();
                    }
                });

                /** Optionally specify a necessary prefix that should appear before the user login */
                userProfile.userLoginName = APConfig.userLoginNamePrefix ?
                    (APConfig.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
                return userProfile;
            });
    }

    /**
     * @ngdoc function
     * @name apDataService.processChangeTokenXML
     * @description
     * The initial call to GetListItemChangesSinceToken also includes the field definitions for the
     * list so extend the existing field definitions and list defined in the model.  After that, store
     * the change token and make any changes to the user's permissions for the list.
     * @param {Model} model List model.
     * @param {Query} query Valid query object.
     * @param {Document} responseXML XML response from the server.
     * @param {IndexedCache<T>} cache Cache to process in order to handle deletions.
     */
    processChangeTokenXML<T extends ListItem<any>>(model: Model, query: Query<T>, responseXML: Document, cache: IndexedCache<T>): void {
        if (!model.deferredListDefinition) {
            // extend our local list definition and field definitions with XML
            DecodeService.extendListMetadata(model, responseXML);

            /**If loaded from local or session cache the list/field definitions won't be extended so ensure we check before
             * resolving promise verifying list has been extended.  One of the attributes we'd expect to see on all List/Libraries
             * is "BaseType" */
            let list = model.getList();
            if (list && list.hasOwnProperty('BaseType')) {
                // list successfully extended
                /* Replace the null placeholder with this resolved promise so we don't have to process in the future and also
                 * don't have to query again if we run Model.extendListMetadata. */
                model.deferredListDefinition = Promise.resolve(model);
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
     * @name apDataService.processDeletionsSinceToken
     * @description
     * GetListItemChangesSinceToken returns items that have been added as well as deleted so we need
     * to remove the deleted items from the local cache.
     * @param {Document} responseXML XML response from the server.
     * @param {Object} cache Cached object of key value pairs.
     */
    processDeletionsSinceToken(responseXML: Document, cache: IndexedCache<any>): void {
        /** Remove any locally cached entities that were deleted from the server */
        let filteredNodes = responseXML.getElementsByTagName('Id');
        _.each(filteredNodes, (node: Element) => {
            /** Check for the type of change */
            let changeType = node.getAttribute('ChangeType');

            if (changeType === 'Delete') {
                let listItemId = parseInt(node.textContent, 10);
                /** Remove from local data array */
                cache.delete(listItemId);
            }
        });
    }

    /**
     * @ngdoc function
     * @name apDataService.requestData
     * @description
     * The primary function that handles all communication with the server.  This is very low level and isn't
     * intended to be called directly.
     * @param {object} opts Payload object containing the details of the request.
     * @returns {promise} Promise that resolves with the server response.
     */
    requestData(opts): Promise<Document> {
        let soapData = SPServices.generateXMLComponents(opts);
        let service = WebServiceOperationConstants[opts.operation][0];

        let promise = new Promise((resolve, reject) => {

            this.generateWebServiceUrl(service, opts.webURL)
                .then((url) => {
                    let headers = new Headers({
                        'Content-Type': `text/xml;charset='utf-8'`,
                        SOAPAction: () => soapData.SOAPAction ? soapData.SOAPAction : null
                    });

                    let options = new RequestOptions({
                        method: RequestMethod.Post,
                        url,
                        body: soapData.msg,
                        headers
                    });

                    let request = new Request(options);

                    //Http.post(url, soapData.msg, {
                    //        responseType: 'document',
                    //        headers: {
                    //            'Content-Type': `text/xml;charset='utf-8'`,
                    //            SOAPAction: () => soapData.SOAPAction ? soapData.SOAPAction : null
                    //        },
                    //        transformResponse: (data) => {
                    //            if (_.isString(data)) {
                    //                let parser = new DOMParser();
                    //                data = parser.parseFromString(data, 'text/xml');
                    //            }
                    //            return data;
                    //        }
                    //    })
                    this.http.request(request)
                        .toPromise()
                        .then((data) => { //Returns object and all we care about is the data property
                            let parser = new DOMParser();
                            let responseXML = parser.parseFromString(data.text(), 'application/xml');

                            // Success Code
                            // Errors can still be resolved without throwing an error so check the XML
                            let errorMsg = DecodeService.checkResponseForErrors(responseXML);
                            if (errorMsg) {
                                // Actual error but returned with success status....thank you SharePoint
                                errorHandler(errorMsg, reject, soapData, responseXML);
                            } else {
                                /** Real success */
                                resolve(responseXML);
                            }
                        })
                        .catch((err) => {
                            // Failure
                            errorHandler(err, reject, soapData);
                        });
                });
        });

        return promise;
    }

    /**
     * @ngdoc function
     * @name apDataService.retrieveChangeToken
     * @description
     * Returns the change token from the xml response of a GetListItemChangesSinceToken query
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Document} responseXML XML response from the server.
     */
    retrieveChangeToken(responseXML: Document): string {
        let changeToken: string;
        let changeTokenElement = responseXML.getElementsByTagName('Changes');
        if (changeTokenElement[0]) {
            changeToken = changeTokenElement[0].getAttribute('LastChangeToken');
        }
        return changeToken;
    }

    /**
     * @ngdoc function
     * @name apDataService.retrieveListPermissions
     * @description
     * Returns the text representation of the users permission mask
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Document} responseXML XML response from the server.
     */
    retrieveListPermissions(responseXML: Document): IUserPermissionsObject {
        //Permissions will be a string of Permission names delimited by commas
        //Example: "ViewListItems, AddListItems, EditListItems, DeleteListItems, ...."
        let listItemsContainer = responseXML.getElementsByTagName('listitems');
        let listPermissions = listItemsContainer[0] ? listItemsContainer[0].getAttribute('EffectivePermMask') : undefined;
        let permissionObject;
        if (_.isString(listPermissions)) {
            let permissionNameArray = listPermissions.split(',');
            permissionObject = new BasePermissionObject();
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
                    });
                }
            });
        }

        return permissionObject;

    }

    /**
     * @ngdoc function
     * @name apDataService.serviceWrapper
     * @description
     * Generic wrapper for any SPServices web service call.  The big benefit to this function is it allows us
     * to use ES6 Promises throughout the application instead of using the promise
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
    serviceWrapper(options: IServiceWrapperOptions): Promise<any> {
        let defaults = {
            postProcess: processXML,
            webURL: APConfig.defaultUrl
        };
        let opts: IServiceWrapperOptions = Object.assign({}, defaults, options);

        /** Convert the xml returned from the server into an array of js objects */
        function processXML(responseXML: Document) {
            if (opts.filterNode) {
                let filteredNodes = responseXML.getElementsByTagName(opts.filterNode);
                return XMLToJSONService.parse(filteredNodes, {includeAllAttrs: true, removeOws: false});
            } else {
                return responseXML;
            }
        }

        return this.requestData(opts)
            .then((responseXML) => {
                /** Success */
                return opts.postProcess(responseXML);
            })
            .catch((err: Error) => {
                /** Failure */
                return err + '  Failed to complete the requested ' + opts.operation + ' operation.';
            });

    }

    /**
     * @ngdoc function
     * @name apDataService.startWorkflow
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
    startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): Promise<any> {
        let defaults = {
            operation: 'StartWorkflow',
            item: '',
            fileRef: '',
            templateId: '',
            workflowParameters: '<root />'
        };
        let opts: IWorkflowInitiationConfiguration = Object.assign({}, defaults, options);

        /** We have the relative file reference but we need to create the fully qualified reference */
        if (!opts.item && opts.fileRef) {
            opts.item = this.createItemUrlFromFileRef(opts.fileRef);
        }

        return this.serviceWrapper(opts);
    }

    /**
     * @description
     * Simply verifies that all components of the payload are present.
     * @param {object} opts Payload config.
     * @returns {boolean} Collection is valid.
     */
    validateCollectionPayload(opts): boolean {
        let validPayload = true;
        let verifyParams = (params: string[]) => {
            _.each(params, (param: string) => {
                if (!opts[param]) {
                    console.warn('options' + param + ' is required to complete this operation');
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

export let DataService = new DataServiceClass();

function errorHandler(errorMsg: string, reject: (string) => void, soapData: Object, response?: Object) {
    //Log error to any server side logging list
    LoggerService.error(errorMsg, {
        json: {
            request: JSON.stringify(soapData, null, 2),
            response: JSON.stringify(response, null, 2)
        }
    });

    reject(errorMsg);
}

export interface IGetCollectionOptions {
    filterNode: string;
    ID?: number;
    groupName?: string;
    listName?: string;
    operation: string;
    userLoginName?: string;
    webURL?: string;
}

export interface IServiceWrapperOptions {
    filterNode?: string;
    listItemID?: number;
    operation: string;
    postProcess?: (responseXML: Object) => any;
    webURL?: string;
    [key: string]: any;
}

interface IUpdateListitemOptions {
    buildValuePairs?: boolean;
    valuePairs?: [string, any][];
}

export interface IGetFieldVersionHistoryOptions {
    operation?: string;
    strFieldName?: string;
    strListID: string;
    strListItemID: number;
    webURL?: string;
}

