"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require('rxjs/Observable');
var decode_service_1 = require("./decode.service");
var spservices_service_1 = require("./spservices.service");
var http_provider_factory_1 = require('../factories/http-provider.factory');
var constants_1 = require("../constants");
var services_1 = require("../services");
var factories_1 = require("../factories");
var lodash_1 = require('lodash');
var DataService = (function () {
    function DataService(http) {
        var _this = this;
        // Cold observable that turns hot at first subscription
        this.currentSite$ = Observable_1.Observable.create(function (observer) {
            var soapEnvelope = new factories_1.SOAPEnvelope();
            var soapData = soapEnvelope.header +
                ("<WebUrlFromPageUrl xmlns=\"" + constants_1.SCHEMASharePoint + "/soap/\" ><pageUrl>") +
                ((location.href.indexOf('?') > 0) ? location.href.substr(0, location.href.indexOf('?')) : location.href) +
                "</pageUrl></WebUrlFromPageUrl>" +
                soapEnvelope.footer;
            var headers = new http_1.Headers({ 'Content-Type': "text/xml;charset='utf-8'" });
            var options = new http_1.RequestOptions({
                method: http_1.RequestMethod.Post,
                url: '/_vti_bin/Webs.asmx',
                body: soapData,
                headers: headers
            });
            var requestOptions = new http_1.Request(options);
            _this.http
                .request(requestOptions)
                .map(function (response) {
                var parser = new DOMParser();
                var responseXML = parser.parseFromString(response.text(), 'application/xml');
                /** Success */
                var errorMsg = decode_service_1.checkResponseForErrors(responseXML);
                if (errorMsg) {
                    errorHandler('Failed to get current site.  ' + errorMsg, soapData);
                }
                var defaultUrl = responseXML.getElementsByTagName('WebUrlFromPageUrlResult');
                if (!defaultUrl[0]) {
                    throw new Error('Invalid XML returned, missing "WebUrlFromPageUrlResult" element.');
                }
                return defaultUrl[0].textContent;
            })
                .subscribe(function (url) {
                constants_1.AP_CONFIG.defaultUrl = url;
                observer.next(url);
                observer.complete();
            }, function (err) {
                /** Error */
                errorHandler('Failed to get current site.  ' + err, soapData);
            });
        });
        /*
         * Mock Http service is only available in development environment
         */
        this.http = http_provider_factory_1.getHttp(http);
        // this.http = mockHttp || http;
    }
    DataService.prototype.createItemUrlFromFileRef = function (fileRefString) {
        return window.location.protocol + '//' + window.location.hostname + '/' + fileRefString;
    };
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
    DataService.prototype.generateWebServiceUrl = function (service, webURL) {
        var ajaxURL = "_vti_bin/" + service + ".asmx";
        return webURL.charAt(webURL.length - 1) === '/' ?
            webURL + ajaxURL : webURL + '/' + ajaxURL;
    };
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
    DataService.prototype.getAvailableWorkflows = function (fileRefString) {
        /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
        var itemUrl = fileRefString.includes(': //') ? fileRefString : this.createItemUrlFromFileRef(fileRefString);
        return this
            .serviceWrapper({
            operation: 'GetTemplatesForItem',
            item: itemUrl
        })
            .map(function (responseXML) {
            var workflowTemplates = [];
            var xmlTemplates = responseXML.getElementsByTagName('WorkflowTemplate');
            lodash_1.each(xmlTemplates, function (el) {
                var workflowTemplateId = el.getElementsByTagName('WorkflowTemplateIdSet')[0].getAttribute('TemplateId');
                var template = {
                    name: el.getAttribute('Name'),
                    instantiationUrl: el.getAttribute('InstantiationUrl'),
                    templateId: '{' + workflowTemplateId + '}'
                };
                workflowTemplates.push(template);
            });
            return workflowTemplates;
        });
    };
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
    DataService.prototype.getCollection = function (options) {
        var defaults = {
            postProcess: processColectionXML
        };
        var opts = Object.assign({}, defaults, options);
        /** Determine the XML node to iterate over if filterNode isn't provided */
        var filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];
        /** Convert the xml returned from the server into an array of js objects */
        function processColectionXML(responseXML) {
            var convertedItems = [];
            var filteredNodes = responseXML.getElementsByTagName(filterNode);
            /** Get attachments only returns the links associated with a list item */
            if (opts.operation === 'GetAttachmentCollection') {
                /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                lodash_1.each(filteredNodes, function (node) {
                    convertedItems.push(node.textContent);
                });
            }
            else {
                convertedItems = services_1.xmlToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
            }
            return convertedItems;
        }
        return this.serviceWrapper(opts);
    };
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
    DataService.prototype.getFieldVersionHistory = function (options, fieldDefinition) {
        var defaults = {
            operation: 'GetVersionCollection'
        };
        var opts = Object.assign({}, defaults, options);
        return this.serviceWrapper(opts)
            .map(function (response) {
            /** Parse XML response */
            var fieldVersionCollection = decode_service_1.parseFieldVersions(response, fieldDefinition);
            /** Resolve with an array of all field versions */
            return fieldVersionCollection;
        });
        // .catch(err => `Failed to fetch version history. Error: ${err}`);
    };
    /**
     * @ngdoc function
     * @name DataService.getGroupCollectionFromUser
     * @description
     * Fetches an array of group names the currentPerson is a member of.  If no currentPerson is provided we use the current currentPerson.
     * @param {string} [login=CurrentUser] Optional param of another currentPerson's login to return the profile for.
     * @returns {Observable<string[]>} Observable which resolves with the array of groups the currentPerson belongs to.
     */
    DataService.prototype.getGroupCollectionFromUser = function (login) {
        var _this = this;
        if (!login) {
            /** No login name provided so lookup profile for current currentPerson */
            return this.getUserProfileByName()
                .map(function (userProfile) {
                return _this.serviceWrapper({
                    operation: 'GetGroupCollectionFromUser',
                    userLoginName: userProfile.userLoginName,
                    filterNode: 'Group'
                });
            })
                .flatMap(function (groupCollection) { return groupCollection; });
        }
        else {
            return this.serviceWrapper({
                operation: 'GetGroupCollectionFromUser',
                userLoginName: login,
                filterNode: 'Group'
            });
        }
    };
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
    DataService.prototype.getList = function (_a) {
        var listName = _a.listName, _b = _a.webURL, webURL = _b === void 0 ? undefined : _b;
        return this.serviceWrapper({
            operation: 'GetList',
            listName: listName,
            webURL: webURL
        });
    };
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
    DataService.prototype.getListFields = function (_a) {
        var listName = _a.listName, _b = _a.webURL, webURL = _b === void 0 ? undefined : _b;
        return this.getList({ listName: listName, webURL: webURL })
            .map(function (responseXML) {
            var filteredNodes = responseXML.getElementsByTagName('Field');
            var fields = services_1.xmlToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
            return fields;
        });
    };
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
    DataService.prototype.getUserProfileByName = function (login) {
        var payload = {
            accountName: undefined,
            operation: 'GetUserProfileByName'
        };
        if (login) {
            payload.accountName = login;
        }
        return this.serviceWrapper(payload)
            .map(function (responseXML) {
            var userProfile = {
                AccountName: undefined,
                userLoginName: undefined
            };
            // not formatted like a normal SP response so need to manually parse
            var filteredNodes = responseXML.getElementsByTagName('PropertyData');
            lodash_1.each(filteredNodes, function (node) {
                var nodeName = node.getElementsByTagName('Name');
                var nodeValue = node.getElementsByTagName('Value');
                if (nodeName.length > 0 && nodeValue.length > 0) {
                    userProfile[nodeName[0].textContent.trim()] = nodeValue[0].textContent.trim();
                }
            });
            /** Optionally specify a necessary prefix that should appear before the currentPerson login */
            userProfile.userLoginName = constants_1.AP_CONFIG.userLoginNamePrefix ?
                (constants_1.AP_CONFIG.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
            return userProfile;
        });
    };
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
    DataService.prototype.processChangeTokenXML = function (listService, query, responseXML) {
        if (!listService.listDefinitionExtended) {
            // extend our local list definition and field definitions with XML
            decode_service_1.extendListMetadata(listService, responseXML);
            /**If loaded from local or session cache the list/field definitions won't be extended so ensure we check before
             * resolving observable verifying list has been extended.  One of the attributes we'd expect to see on all List/Libraries
             * is "BaseType" */
            if (listService && listService.hasOwnProperty('BaseType')) {
                // list successfully extended
                listService.listDefinitionExtended = Observable_1.Observable.create(listService);
            }
        }
        /** Store token for future web service calls to return changes */
        var changeToken = this.retrieveChangeToken(responseXML);
        if (changeToken) {
            /** Don't update change token if request fails to return a valid response */
            query.changeToken = changeToken;
        }
        /** Update the currentPerson permissions for this list */
        var permissions = this.retrieveListPermissions(responseXML);
        if (permissions) {
            listService.permissions = permissions;
        }
        /** Change token query includes deleted items as well so we need to process them separately */
        var deletedListItems = this.getDeletionIdsSinceToken(responseXML);
        /** Broadcast the id of any deleted list items to any subscribers */
        deletedListItems.forEach(function (listItemId) { return listService.changeTokenDeletions.next(listItemId); });
    };
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
    DataService.prototype.getDeletionIdsSinceToken = function (responseXML) {
        /** Remove any locally cached entities that were deleted from the server */
        var filteredNodes = responseXML.getElementsByTagName('Id');
        var deletedListItems = [];
        lodash_1.each(filteredNodes, function (node) {
            /** Check for the type of change */
            var changeType = node.getAttribute('ChangeType');
            if (changeType === 'Delete') {
                var listItemId = parseInt(node.textContent, 10);
                deletedListItems.push(listItemId);
            }
        });
        return deletedListItems;
    };
    /**
     * @ngdoc function
     * @name DataService.requestData
     * @description
     * The primary function that handles all communication with the server.  This is very low level and isn't
     * intended to be called directly.
     * @param {object} opts Payload object containing the details of the request.
     * @returns {Observable<Document>} Observable that resolves with the server response.
     */
    DataService.prototype.requestData = function (opts) {
        if (!opts.operation || !opts.webURL) {
            throw new Error('Unable to identify web service URL without a valid operation and Web URL');
        }
        var soapData = spservices_service_1.generateXMLComponents(opts);
        var service = constants_1.WebServiceOperationConstants[opts.operation][0];
        var webServiceUrl = this.generateWebServiceUrl(service, opts.webURL);
        var rawHeaders = { 'Content-Type': "text/xml;charset='utf-8'" };
        if (soapData.SOAPAction) {
            rawHeaders.SOAPAction = soapData.SOAPAction;
        }
        var headers = new http_1.Headers(rawHeaders);
        var options = new http_1.RequestOptions({
            headers: headers
        });
        var request = new http_1.Request(options);
        return this.http.post(webServiceUrl, soapData.msg, request)
            .retry(2)
            .map(function (response) {
            var parser = new DOMParser();
            var responseXML = parser.parseFromString(response.text(), 'application/xml');
            // Success Code
            // Errors can still be resolved without throwing an error so check the XML
            var errorMsg = decode_service_1.checkResponseForErrors(responseXML);
            if (errorMsg) {
                // Actual error but returned with success status....thank you SharePoint
                errorHandler(errorMsg, soapData, responseXML);
            }
            /** Real success */
            return responseXML;
        });
    };
    /**
     * @ngdoc function
     * @name DataService.retrieveChangeToken
     * @description
     * Returns the change token from the xml response of a GetListItemChangesSinceToken query
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Element} responseXML XML response from the server.
     */
    DataService.prototype.retrieveChangeToken = function (responseXML) {
        var changeToken;
        var changeTokenElement = responseXML.getElementsByTagName('Changes');
        if (changeTokenElement[0]) {
            changeToken = changeTokenElement[0].getAttribute('LastChangeToken');
        }
        return changeToken;
    };
    /**
     * @ngdoc function
     * @name DataService.retrieveListPermissions
     * @description
     * Returns the text representation of the users permission mask
     * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
     * @param {Element} responseXML XML response from the server.
     */
    DataService.prototype.retrieveListPermissions = function (responseXML) {
        //Permissions will be a string of Permission names delimited by commas
        //Example: "ViewListItems, AddListItems, EditListItems, DeleteListItems, ...."
        var listItemsContainer = responseXML.getElementsByTagName('listitems');
        var listPermissions = listItemsContainer[0] ? listItemsContainer[0].getAttribute('EffectivePermMask') : undefined;
        var permissionObject;
        if (lodash_1.isString(listPermissions)) {
            var permissionNameArray = listPermissions.split(',');
            permissionObject = new constants_1.BasePermissionObject();
            //Set each of the identified permission levels to true
            lodash_1.each(permissionNameArray, function (permission) {
                //Remove extra spaces
                var permissionName = permission.trim();
                //Find the permission level on the permission object that is currently set to false
                //and set to true
                permissionObject[permissionName] = true;
                if (permissionName === 'FullMask') {
                    //User has full rights so set all to true
                    lodash_1.each(permissionObject, function (propertyValue, propertyName) {
                        permissionObject[propertyName] = true;
                    });
                }
            });
        }
        return permissionObject;
    };
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
    DataService.prototype.serviceWrapper = function (options) {
        var defaults = {
            postProcess: processXML,
            webURL: constants_1.AP_CONFIG.defaultUrl
        };
        var opts = Object.assign({}, defaults, options);
        /** Convert the xml returned from the server into an array of js objects */
        function processXML(responseXML) {
            if (opts.filterNode) {
                var filteredNodes = responseXML.getElementsByTagName(opts.filterNode);
                return services_1.xmlToJSONService.parse(filteredNodes, { includeAllAttrs: true, removeOws: false });
            }
            else {
                return responseXML;
            }
        }
        return this.requestData(opts)
            .map(function (responseXML) {
            /** Success */
            return opts.postProcess(responseXML);
        });
    };
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
    DataService.prototype.startWorkflow = function (options) {
        var defaults = {
            operation: 'StartWorkflow',
            item: '',
            fileRef: '',
            templateId: '',
            workflowParameters: '<root />'
        };
        var opts = Object.assign({}, defaults, options);
        /** We have the relative file reference but we need to create the fully qualified reference */
        if (!opts.item && opts.fileRef) {
            opts.item = this.createItemUrlFromFileRef(opts.fileRef);
        }
        return this.serviceWrapper(opts);
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
function errorHandler(errorMsg, soapData, response) {
    //Log error to any server side logging list
    services_1.LoggerService.error(errorMsg, {
        json: {
            request: JSON.stringify(soapData, null, 2),
            response: JSON.stringify(response, null, 2)
        }
    });
    throw new Error(errorMsg);
}
//# sourceMappingURL=dataservice.service.js.map