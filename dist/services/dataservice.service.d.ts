import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { XMLFieldDefinition } from "../factories/field-definition.factory";
import { IXMLGroup, IXMLUserProfile } from "./user-profile.service";
import { IUserPermissionsObject } from "../constants";
import { ListItem, ListService, Query, FieldDefinition, IFieldDefinition, FieldVersionCollection } from "../factories";
export interface IDataService {
    currentSite$: Observable<string>;
    createItemUrlFromFileRef(fileRefString: string): string;
    generateWebServiceUrl(service: string, webURL: string): string;
    getAvailableWorkflows(fileRefString: string): Observable<IWorkflowDefinition[]>;
    getCollection(options: {
        operation: string;
        userLoginName?: string;
        groupName?: string;
        listName?: string;
        filterNode: string;
    }): Observable<Object[]>;
    getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: FieldDefinition): Observable<FieldVersionCollection>;
    getGroupCollectionFromUser(login?: string): Observable<IXMLGroup[]>;
    getList(options: {
        listName: string;
        webURL?: string;
    }): Observable<Object>;
    getListFields(options: {
        listName: string;
        webURL?: string;
    }): Observable<XMLFieldDefinition[]>;
    getUserProfileByName(login?: string): Observable<IXMLUserProfile>;
    processChangeTokenXML<T extends ListItem<any>>(model: ListService<T>, query: Query<T>, responseXML: Element, opts: any): void;
    getDeletionIdsSinceToken(responseXML: Element): number[];
    requestData(opts: any): Observable<Document>;
    retrieveChangeToken(responseXML: Element): string;
    retrieveListPermissions(responseXML: Element): IUserPermissionsObject;
    serviceWrapper(options: any): Observable<any>;
    startWorkflow(options: {
        item: string;
        templateId: string;
        workflowParameters?: string;
        fileRef?: string;
    }): Observable<any>;
}
export declare class DataService implements IDataService {
    currentSite$: Observable<string>;
    http: Http;
    constructor(http: Http);
    createItemUrlFromFileRef(fileRefString: string): string;
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
    generateWebServiceUrl(service: string, webURL: string): string;
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
    getAvailableWorkflows(fileRefString: string): Observable<IWorkflowDefinition[]>;
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
    getCollection(options: IGetCollectionOptions): Observable<Object[]>;
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
    getFieldVersionHistory<T extends ListItem<any>>(options: IGetFieldVersionHistoryOptions, fieldDefinition: IFieldDefinition): Observable<FieldVersionCollection>;
    /**
     * @ngdoc function
     * @name DataService.getGroupCollectionFromUser
     * @description
     * Fetches an array of group names the currentPerson is a member of.  If no currentPerson is provided we use the current currentPerson.
     * @param {string} [login=CurrentUser] Optional param of another currentPerson's login to return the profile for.
     * @returns {Observable<string[]>} Observable which resolves with the array of groups the currentPerson belongs to.
     */
    getGroupCollectionFromUser(login?: string): Observable<IXMLGroup[]>;
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
    getList({listName, webURL}: {
        listName: any;
        webURL?: any;
    }): Observable<Object>;
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
    getListFields({listName, webURL}: {
        listName: any;
        webURL?: any;
    }): Observable<XMLFieldDefinition[]>;
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
    getUserProfileByName(login?: string): Observable<IXMLUserProfile>;
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
    processChangeTokenXML<T extends ListItem<any>>(listService: ListService<T>, query: Query<T>, responseXML: Element): void;
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
    getDeletionIdsSinceToken(responseXML: Element): number[];
    /**
     * @ngdoc function
     * @name DataService.requestData
     * @description
     * The primary function that handles all communication with the server.  This is very low level and isn't
     * intended to be called directly.
     * @param {object} opts Payload object containing the details of the request.
     * @returns {Observable<Document>} Observable that resolves with the server response.
     */
    requestData(opts: IRequestDataOptions): Observable<Document>;
    /**
     * @ngdoc function
     * @name DataService.retrieveChangeToken
     * @description
     * Returns the change token from the xml response of a GetListItemChangesSinceToken query
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Element} responseXML XML response from the server.
     */
    retrieveChangeToken(responseXML: Element): string;
    /**
     * @ngdoc function
     * @name DataService.retrieveListPermissions
     * @description
     * Returns the text representation of the users permission mask
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Element} responseXML XML response from the server.
     */
    retrieveListPermissions(responseXML: Element): IUserPermissionsObject;
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
    serviceWrapper(options: IServiceWrapperOptions): Observable<any>;
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
    startWorkflow(options: {
        item: string;
        templateId: string;
        workflowParameters?: string;
        fileRef?: string;
    }): Observable<string>;
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
