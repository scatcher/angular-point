
import {Injectable} from "@angular/core";
import {Http, RequestOptions, Request, RequestMethod, Headers} from "@angular/http";
import {Observable} from 'rxjs/Observable';

import {XMLFieldDefinition} from "../factories/field-definition.factory";
import {IXMLGroup, IXMLUserProfile} from "./user-profile.service";
import {checkResponseForErrors, parseFieldVersions, extendListMetadata} from "./decode.service";
import {generateXMLComponents} from "./spservices.service";
import {getHttp} from '../factories/http-provider.factory';
import {
    WebServiceOperationConstants,
    AP_CONFIG,
    BasePermissionObject,
    SCHEMASharePoint,
    IUserPermissionsObject
} from "../constants";
import {LoggerService, xmlToJSONService} from "../services";
import {
    ListItem,
    ListService,
    Query,
    FieldDefinition,
    IFieldDefinition,
    SOAPEnvelope,
    FieldVersionCollection
} from "../factories";

import {each, isString} from 'lodash';


export interface IDataService {
    currentSite$: Observable<string>;
    createItemUrlFromFileRef(fileRefString: string): string;
    generateWebServiceUrl(service: string, webURL: string): string;
    getAvailableWorkflows(fileRefString: string): Observable<IWorkflowDefinition[]>;
    getCollection(options: { operation: string; userLoginName?: string; groupName?: string; listName?: string; filterNode: string; }): Observable<Object[]>;
    getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: FieldDefinition): Observable<FieldVersionCollection>;
    getGroupCollectionFromUser(login?: string): Observable<IXMLGroup[]>;
    getList(options: { listName: string; webURL?: string }): Observable<Object>;
    getListFields(options: {listName: string, webURL?: string}): Observable<XMLFieldDefinition[]>
    getUserProfileByName(login?: string): Observable<IXMLUserProfile>;
    processChangeTokenXML<T extends ListItem<any>>(model: ListService<T>, query: Query<T>, responseXML: Element, opts): void;
    getDeletionIdsSinceToken(responseXML: Element): number[];
    requestData(opts): Observable<Document>;
    retrieveChangeToken(responseXML: Element): string;
    retrieveListPermissions(responseXML: Element): IUserPermissionsObject;
    serviceWrapper(options): Observable<any>;
    startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): Observable<any>;
}

@Injectable()
export class DataService implements IDataService {
    // Cold observable that turns hot at first subscription
    currentSite$: Observable<string> = Observable.create(observer => {
        let soapEnvelope = new SOAPEnvelope();
        let soapData = soapEnvelope.header +
            `<WebUrlFromPageUrl xmlns="${SCHEMASharePoint}/soap/" ><pageUrl>` +
            ((location.href.indexOf('?') > 0) ? location.href.substr(0, location.href.indexOf('?')) : location.href) +
            `</pageUrl></WebUrlFromPageUrl>` +
            soapEnvelope.footer;

        let headers = new Headers({ 'Content-Type': `text/xml;charset='utf-8'` });

        let options = new RequestOptions({
            method: RequestMethod.Post,
            url: '/_vti_bin/Webs.asmx',
            body: soapData,
            headers
        });

        let requestOptions = new Request(options);

        this.http
            .request(requestOptions)
            .map(response => {
                let parser = new DOMParser();
                let responseXML = parser.parseFromString(response.text(), 'application/xml');

                /** Success */
                let errorMsg = checkResponseForErrors(responseXML);
                if (errorMsg) {
                    errorHandler('Failed to get current site.  ' + errorMsg, soapData);
                }

                let defaultUrl = responseXML.getElementsByTagName('WebUrlFromPageUrlResult');
                if (!defaultUrl[0]) {
                    throw new Error('Invalid XML returned, missing "WebUrlFromPageUrlResult" element.');
                }
                return defaultUrl[0].textContent;
            })
            .subscribe(url => {
                AP_CONFIG.defaultUrl = url;
                observer.next(url);
                observer.complete();
            }, err => {
                /** Error */
                errorHandler('Failed to get current site.  ' + err, soapData);
            });

    });
    http: Http;
    constructor(http: Http) {
        /*
         * Mock Http service is only available in development environment
         */
        this.http = getHttp(http);
        // this.http = mockHttp || http;
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
     * @param {string} webURL Provide the URL so we don't need to make a call to the server.
     * @returns {string} Resolves with the url for the service.
     */
    generateWebServiceUrl(service: string, webURL: string): string {
        let ajaxURL = `_vti_bin/${service}.asmx`;
        return webURL.charAt(webURL.length - 1) === '/' ?
            webURL + ajaxURL : webURL + '/' + ajaxURL;
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
     *     .subscribe(function(templateArray) {
     *          ....templateArray = [{
     *              "name": "WidgetApproval",
     *              "instantiationUrl": "https: //sharepoint.mycompany.com/_layouts/IniWrkflIP.aspx?List=fc17890e-8c0…311-cea9-40d1-a183-6edde9333815}&Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}",
     *              "templateId": "59062311-cea9-40d1-a183-6edde9333815"
     *          }]
     *     });
     * </pre>
     * @param {string} fileRefString Relative or static url referencing the item.
     * @returns {Observable<IWorkflowDefinition[]} Resolves with an array of objects defining each of the available workflows for the item.
     */
    getAvailableWorkflows(fileRefString: string): Observable<IWorkflowDefinition[]> {
        /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
        let itemUrl = fileRefString.includes(': //') ? fileRefString : this.createItemUrlFromFileRef(fileRefString);

        return this
            .serviceWrapper({
                operation: 'GetTemplatesForItem',
                item: itemUrl
            })
            .map((responseXML: Element) => {
                let workflowTemplates = [];
                let xmlTemplates = responseXML.getElementsByTagName('WorkflowTemplate');
                each(xmlTemplates, (el: Element) => {
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
     * @returns {Observable<object[]>} Observable which when resolved will contain an array of objects representing the
     * requested collection.
     *
     * @example
     * <pre>
     * DataService.getCollection({
     *        operation: "GetGroupCollectionFromUser",
     *        userLoginName: $scope.state.selectedUser.LoginName
     *        }).subscribe(response => {
     *            postProcessFunction(response);
     *       });
     * </pre>
     */
    getCollection(options: IGetCollectionOptions): Observable<Object[]> {
        let defaults = {
            postProcess: processColectionXML
        };
        let opts: IGetCollectionOptions = Object.assign({}, defaults, options);

        /** Determine the XML node to iterate over if filterNode isn't provided */
        let filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];

        /** Convert the xml returned from the server into an array of js objects */
        function processColectionXML(responseXML: Element) {
            let convertedItems: Object[] = [];
            let filteredNodes = responseXML.getElementsByTagName(filterNode);
            /** Get attachments only returns the links associated with a list item */
            if (opts.operation === 'GetAttachmentCollection') {
                /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                each(filteredNodes, (node: Element) => {
                    convertedItems.push(node.textContent);
                });
            } else {
                convertedItems = xmlToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
            }
            return convertedItems;
        }

        return this.serviceWrapper(opts);

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
     *        webURL: AP_CONFIG.defaultUrl,
     *        strlistID: model.getListId(),
     *        strlistItemID: listItem.id,
     *        strFieldName: fieldDefinition.staticName
     *    };
     * </pre>
     * @param {object} fieldDefinition Field definition object from the model.
     * @returns {Observable<object[]>} Observable which resolves with an array of list item changes for the specified field.
     */
    getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions,
        fieldDefinition: IFieldDefinition): Observable<FieldVersionCollection> {
        let defaults = {
            operation: 'GetVersionCollection'
        };
        let opts = Object.assign({}, defaults, options);

        return this.serviceWrapper(opts)
            .map(response => {
                /** Parse XML response */
                let fieldVersionCollection = parseFieldVersions(response, fieldDefinition);
                /** Resolve with an array of all field versions */
                return fieldVersionCollection;
            });
        // .catch(err => `Failed to fetch version history. Error: ${err}`);
    }

    /**
     * @ngdoc function
     * @name DataService.getGroupCollectionFromUser
     * @description
     * Fetches an array of group names the currentPerson is a member of.  If no currentPerson is provided we use the current currentPerson.
     * @param {string} [login=CurrentUser] Optional param of another currentPerson's login to return the profile for.
     * @returns {Observable<string[]>} Observable which resolves with the array of groups the currentPerson belongs to.
     */
    getGroupCollectionFromUser(login?: string): Observable<IXMLGroup[]> {

        if (!login) {
            /** No login name provided so lookup profile for current currentPerson */
            return this.getUserProfileByName()
                .map(userProfile => {
                    return this.serviceWrapper({
                        operation: 'GetGroupCollectionFromUser',
                        userLoginName: userProfile.userLoginName,
                        filterNode: 'Group'
                    })
                })
                .flatMap(groupCollection => groupCollection);

        } else {
            return this.serviceWrapper({
                operation: 'GetGroupCollectionFromUser',
                userLoginName: login,
                filterNode: 'Group'
            })
        }

    }

    /**
     * @ngdoc function
     * @name DataService.getList
     * @description
     * Returns all list details including field and list config.
     * @param {object} options Configuration parameters.
     * @param {string} options.listName GUID of the list.
     * @param {string} [options.webURL] URL to the site containing the list if differnt from primary data site in APConfig.
     * @returns {Observable<Object>} Observable which resolves with an object defining field and list config.
     */
    getList({listName, webURL = undefined}): Observable<Object> {
        return this.serviceWrapper({
            operation: 'GetList',
            listName,
            webURL
        });
    }

    /**
     * @ngdoc function
     * @name DataService.getListFields
     * @description
     * Returns field definitions for a specified list.
     * @param {object} options Configuration parameters.
     * @param {string} options.listName GUID of the list.
     * @param {string} [options.webURL] URL to the site containing the list if differnt from primary data site in APConfig.
     * @returns {Observable<XMLFieldDefinition[]>} Observable which resolves with an array of field definitions for the list.
     */
    getListFields({listName, webURL = undefined}): Observable<XMLFieldDefinition[]> {
        return this.getList({ listName, webURL })
            .map((responseXML: Element) => {
                let filteredNodes = responseXML.getElementsByTagName('Field');
                let fields = xmlToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
                return fields;
            });
    }

    /**
     * @ngdoc function
     * @name DataService.getUserProfile
     * @description
     * Returns the profile for an optional user, but defaults the the current user if one isn't provided.
     * Pull user profile info and parse into a profile object
     * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
     * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
     * @returns {Observable<IXMLUserProfile>} Observable which resolves with the requested user profile.
     */
    getUserProfileByName(login?: string): Observable<IXMLUserProfile> {
        let payload = {
            accountName: undefined,
            operation: 'GetUserProfileByName'
        };
        if (login) {
            payload.accountName = login;
        }

        return this.serviceWrapper(payload)
            .map((responseXML: Element) => {
                let userProfile = {
                    AccountName: undefined,
                    userLoginName: undefined
                };
                // not formatted like a normal SP response so need to manually parse
                let filteredNodes = responseXML.getElementsByTagName('PropertyData');
                each(filteredNodes, (node: Element) => {
                    let nodeName = node.getElementsByTagName('Name');
                    let nodeValue = node.getElementsByTagName('Value');

                    if (nodeName.length > 0 && nodeValue.length > 0) {
                        userProfile[nodeName[0].textContent.trim()] = nodeValue[0].textContent.trim();
                    }
                });

                /** Optionally specify a necessary prefix that should appear before the currentPerson login */
                userProfile.userLoginName = AP_CONFIG.userLoginNamePrefix ?
                    (AP_CONFIG.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
                return userProfile;
            });
    }

    /**
     * @ngdoc function
     * @name DataService.processChangeTokenXML
     * @description
     * The initial call to GetListItemChangesSinceToken also includes the field definitions for the
     * list so extend the existing field definitions and list defined in the listService.  After that, store
     * the change token and make any changes to the currentPerson's permissions for the list.
     * @param {ListService} listService List listService.
     * @param {Query} query Valid query object.
     * @param {Element} responseXML XML response from the server.
     * @param {T[]} cache Cache to process in order to handle deletions.
     */
    processChangeTokenXML<T extends ListItem<any>>(listService: ListService<T>, query: Query<T>, responseXML: Element): void {
        if (!listService.listDefinitionExtended) {
            // extend our local list definition and field definitions with XML
            extendListMetadata(listService, responseXML);

            /**If loaded from local or session cache the list/field definitions won't be extended so ensure we check before
             * resolving observable verifying list has been extended.  One of the attributes we'd expect to see on all List/Libraries
             * is "BaseType" */
            if (listService && listService.hasOwnProperty('BaseType')) {
                // list successfully extended
                listService.listDefinitionExtended = Observable.create(listService);
            }
        }

        /** Store token for future web service calls to return changes */
        let changeToken = this.retrieveChangeToken(responseXML);
        if (changeToken) {
            /** Don't update change token if request fails to return a valid response */
            query.changeToken = changeToken;
        }

        /** Update the currentPerson permissions for this list */
        let permissions = this.retrieveListPermissions(responseXML);
        if (permissions) {
            listService.permissions = permissions;
        }

        /** Change token query includes deleted items as well so we need to process them separately */
        let deletedListItems = this.getDeletionIdsSinceToken(responseXML);
        /** Broadcast the id of any deleted list items to any subscribers */
        deletedListItems.forEach((listItemId: number) => listService.changeTokenDeletions.next(listItemId));
    }

    /**
     * @ngdoc function
     * @name DataService.getDeletionIdsSinceToken
     * @description
     * GetListItemChangesSinceToken returns items that have been added as well as deleted.  This returns an
     * array with ID's of any list items that have been deleted since any previous requests
     * to remove the deleted items from the local map.
     * @param {Element} responseXML XML response from the server.
     * @param {Object} map Cached object of key value pairs.
     */
    getDeletionIdsSinceToken(responseXML: Element): number[] {
        /** Remove any locally cached entities that were deleted from the server */
        let filteredNodes = responseXML.getElementsByTagName('Id');
        let deletedListItems = [];
        each(filteredNodes, (node: Element) => {
            /** Check for the type of change */
            let changeType = node.getAttribute('ChangeType');

            if (changeType === 'Delete') {
                let listItemId = parseInt(node.textContent, 10);
                deletedListItems.push(listItemId);
            }
        });
        return deletedListItems;
    }

    /**
     * @ngdoc function
     * @name DataService.requestData
     * @description
     * The primary function that handles all communication with the server.  This is very low level and isn't
     * intended to be called directly.
     * @param {object} opts Payload object containing the details of the request.
     * @returns {Observable<Document>} Observable that resolves with the server response.
     */
    requestData(opts: IRequestDataOptions): Observable<Document> {
        if (!opts.operation || !opts.webURL) {
            throw new Error('Unable to identify web service URL without a valid operation and Web URL');
        }
        let soapData = generateXMLComponents(opts);
        let service = WebServiceOperationConstants[opts.operation][0];
        let webServiceUrl = this.generateWebServiceUrl(service, opts.webURL);

        let rawHeaders = <{ 'Content-Type': string; SOAPAction?: string; }>{ 'Content-Type': `text/xml;charset='utf-8'` };

        if (soapData.SOAPAction) {
            rawHeaders.SOAPAction = soapData.SOAPAction;
        }
        let headers = new Headers(rawHeaders);

        let options = new RequestOptions({
            headers
        });

        let request = new Request(options);
        return this.http.post(webServiceUrl, soapData.msg, request)
            //Try an additional time in case of initial error
            .retry(2)
            //Convert response to XML
            .map((response) => {
                let parser = new DOMParser();
                let responseXML = parser.parseFromString(response.text(), 'application/xml');

                // Success Code
                // Errors can still be resolved without throwing an error so check the XML
                let errorMsg = checkResponseForErrors(responseXML);
                if (errorMsg) {
                    // Actual error but returned with success status....thank you SharePoint
                    errorHandler(errorMsg, soapData, responseXML);
                }

                /** Real success */
                return responseXML;
            });

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
        let changeToken: string;
        let changeTokenElement = responseXML.getElementsByTagName('Changes');
        if (changeTokenElement[0]) {
            changeToken = changeTokenElement[0].getAttribute('LastChangeToken');
        }
        return changeToken;
    }

    /**
     * @ngdoc function
     * @name DataService.retrieveListPermissions
     * @description
     * Returns the text representation of the users permission mask
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Element} responseXML XML response from the server.
     */
    retrieveListPermissions(responseXML: Element): IUserPermissionsObject {
        //Permissions will be a string of Permission names delimited by commas
        //Example: "ViewListItems, AddListItems, EditListItems, DeleteListItems, ...."
        let listItemsContainer = responseXML.getElementsByTagName('listitems');
        let listPermissions = listItemsContainer[0] ? listItemsContainer[0].getAttribute('EffectivePermMask') : undefined;
        let permissionObject;
        if (isString(listPermissions)) {
            let permissionNameArray = listPermissions.split(',');
            permissionObject = new BasePermissionObject();
            //Set each of the identified permission levels to true
            each(permissionNameArray, (permission: string) => {
                //Remove extra spaces
                let permissionName = permission.trim();
                //Find the permission level on the permission object that is currently set to false
                //and set to true
                permissionObject[permissionName] = true;

                if (permissionName === 'FullMask') {
                    //User has full rights so set all to true
                    each(permissionObject, (propertyValue, propertyName) => {
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
     * to use Observables throughout the application instead of using the promise
     * implementation used in SPServices so we have a more consistent experience.
     * Check http: //spservices.codeplex.com/documentation for details on expected parameters for each operation.
     *
     * @param {object} options Payload params that is directly passed to SPServices.
     * @param {string} [options.filterNode] XML filter string used to find the elements to iterate over.
     * This is typically 'z: row' for list items.
     * @param {Function} [options.postProcess] Method to process responseXML prior to returning.
     * @param {string} [options.webURL] Provide a web url if requesting data from a site different from the hosting site.
     * @returns {Observable<any>} Returns an Observable which when resolved either returns clean objects parsed by the value
     * in options.filterNode or the raw XML response if a options.filterNode
     *
     *      If options.filterNode is provided, returns XML parsed by node name
     *      Otherwise returns the server response
     */
    serviceWrapper(options: IServiceWrapperOptions): Observable<any> {
        let defaults = {
            postProcess: processXML,
            webURL: AP_CONFIG.defaultUrl
        };
        let opts: IServiceWrapperOptions = Object.assign({}, defaults, options);

        /** Convert the xml returned from the server into an array of js objects */
        function processXML(responseXML: Element): any {
            if (opts.filterNode) {
                let filteredNodes = responseXML.getElementsByTagName(opts.filterNode);
                return xmlToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
            } else {
                return responseXML;
            }
        }

        return this.requestData(<any>opts)
            .map(responseXML => {
                /** Success */
                return opts.postProcess(responseXML);
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
     * @returns {Observable<string>} Response if there is one.
     * @example
     * <pre>
     *  DataService.startWorkflow({
     *     item: "https: //server/site/Lists/item" + idData + "_.000",
     *     templateId: "{c29c1291-a25c-47d7-9345-8fb1de2a1fa3}",
     *     workflowParameters: "<Data><monthName>" + txtBox.value + "</monthName></Data>",
     *      ...
     *   })
     *   .subscribe(result => {
     *       //Success doesn't return anything but a confirmation that it started
     *   }, err => {
     *       //Error
     *   })
     * </pre>
     */
    startWorkflow(options: { item: string; templateId: string; workflowParameters?: string; fileRef?: string; }): Observable<string> {
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

}

function errorHandler(errorMsg: string, soapData: Object, response?: Object) {
    //Log error to any server side logging list
    LoggerService.error(errorMsg, {
        json: {
            request: JSON.stringify(soapData, null, 2),
            response: JSON.stringify(response, null, 2)
        }
    });

    throw new Error(errorMsg);
}

export interface IGetCollectionOptions {
    filterNode?: string;
    ID?: number;
    groupName?: string;
    listName?: string;
    operation: string;
    userLoginName?: string;
    webURL?: string;
}

export interface IRequestDataOptions {
    operation: string;
    webURL: string;
    [key: string]: any;
}

export interface IServiceWrapperOptions {
    filterNode?: string;
    listItemID?: number;
    operation: string;
    postProcess?: (responseXML: Object) => any;
    webURL?: string;
    [key: string]: any;
}

export interface IGetFieldVersionHistoryOptions {
    operation?: string;
    strFieldName?: string;
    strlistID: string;
    strlistItemID: number;
    webURL?: string;
}

export interface IWorkflowDefinition {
    instantiationUrl: string;
    name: string;
    templateId: string;
}

interface IWorkflowInitiationConfiguration extends IServiceWrapperOptions {
    item: string;
    fileRef: string;
}
