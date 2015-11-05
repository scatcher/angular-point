/// <reference path="../../typings/ap.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

module ap.test {
    'use strict';

    export interface ICachedXML {
        lists: {
            [key: string]: { //List Item GUID
                //Each list can have cached response for each type of call
                GetListItemChangesSinceToken?: string;
                GetListItems?: string;
            }
        }
        operations: { //Common Cached Requests
            AddAttachment?: string;
            DeleteAttachment?: string;
            GenericEmpty?: string;
            GetAttachmentCollection?: string;
            GetGroupCollectionFromSite?: string;
            GetGroupCollectionFromUser?: string;
            GetList?: string;
            GetListCollection?: string;
            GetTemplatesForItem?: string;
            GetUserCollectionFromGroup?: string;
            GetUserCollectionFromSite?: string;
            GetUserProfileByName?: string;
            GetVersionCollection?: string;
            GetView?: string;
            GetWorkflowDataForItem?: string;
            StartWorkflow?: string;
            UpdateListItems?: string;
            WebUrlFromPageUrl?: string;
        }
    }

    class ModelChangeQueue {
        pendingDeletions = [];
        pendingUpdates = [];
        constructor(private token: string) { }
        clear(updatedToken: string) {
            this.token = updatedToken || '';
            this.pendingDeletions = [];
            this.pendingUpdates = [];
        }
    }

    var activeEntities: { [key: number]: ListItem<any> } = {}, //{ listItem.id: ListItem, ...}
        changeQueue: { [key: string]: ModelChangeQueue } = {},
        mockId = 10000,
        xmlNS = {
            listItems: `xmlns:s="uuid:BDC6E3F0-6DA3-11d1-A2A3-00AA00C14882" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" xmlns:rs="urn:schemas-microsoft-com:rowset" xmlns:z="#RowsetSchema"`,
            soap: `xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"`
        };


    function getMockId() {
        return mockId++;
    }

    export class MockBackend {
        constructor($httpBackend: ng.IHttpBackendService, apCachedXML: ICachedXML, apCacheService: CacheService, apWebServiceService: WebServiceService,
            apUtilityService: UtilityService, $injector: ng.auto.IInjectorService, apEncodeService: EncodeService, apChangeService: ChangeService,
            apXMLToJSONService: XMLToJSONService) {



            /** Listen for each of the standard services being called and try to return a cached XML response for the
             * operation */
            _.each(apWebServiceService.webServices, function(service) {
                /** Lists has many special cases so don't create generic backend for it */
                if (service !== 'Lists') {
                    $httpBackend.whenPOST(function routeMatcher(url) {
                        return url.indexOf('bin/' + service + '.asmx') > -1;
                    })
                        .respond(function(method, url, data) {
                            var requestXML = $.parseXML(data);
                            /** Get the xml namespace for the current service */
                            var soapAction = apWebServiceService.xmlns(service);
                            var request = $(requestXML).find('[xmlns^="' + soapAction + '"]');
                            var operation = request[0].nodeName;
                            var responseXML = apCachedXML.operations[operation];
                            return responder(responseXML);
                        });
                }
            });

            $httpBackend.whenPOST(/Lists.asmx/)
                .respond(function(method: string, url: string, data: string) {
                    var requestXML = $.parseXML(data);
                    var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/sharepoint/"]');
                    var operation = request[0].nodeName;
                    var responseXML;

                    switch (operation) {
                        case 'GetListItems':
                            responseXML = getListItems(request);
                            break;
                        case 'GetList':
                        case 'GetListItemChangesSinceToken':
                            responseXML = getListItemChangesSinceToken(data, request);
                            break;
                        case 'UpdateListItems':
                            responseXML = updateListItem(request);
                            break;

                        default:
                            responseXML = apCachedXML.operations[operation];
                    }
                    return responder(responseXML);
                });


            apChangeService.subscribeToUpdates(function ChangeCallback(entity: ListItem<any>, options, promise) {
                activeEntities[entity.id] = entity;
            });





            /////////////////////////// PRIVATE ////////////////////////////////


            function getListItems(request: JQuery) {
                var zrows = [];
                var rowLimit = $(request).find('rowLimit').text();
                if (rowLimit === "1") {
                    var zrow = getListItemById(request);
                    if (!zrow) {
                        /** A match wasn't found so return a mock */
                        zrow = generateMockListItems(request, 1)[0];
                    }
                    zrows.push(zrow);
                } else {
                    zrows = getZRows(request);
                }

                var responseEnvelope = listsResponseEnvelope('GetListItems');
                var payload = '<listitems ' + xmlNS.listItems + '>' + buildRSDataNode(zrows) + '</listitems>';

                return responseEnvelope.header + payload + responseEnvelope.footer;
            }

            /**
             * @ngdoc function
             * @name getListItemById
             * @description
             * Attempts to retrieve an xml zrow from cached xml.
             * @param {xml} request XML Request.
             * @returns {xml} zrow
             */
            function getListItemById(request: JQuery): JQuery {
                var match;
                /** Retrieve the list item id */
                var id = $(request).find('Query').find('Value[Type="Number"]').text();
                var rows = getZRows(request);

                /** Attempt to find the requested list item in the cached xml */
                _.each(rows, function(row) {
                    if ($(row).attr('ows_ID') == id) {
                        match = row;
                        /** Break loop */
                        return false;
                    }
                });

                /** Returns a single entity */
                return match;
            }

            function getZRows(request: JQuery): JQuery {
                var responseXML = getNamedListItems('GetListItems', request);

                var parsedXML = $.parseXML(responseXML);
                return apXMLToJSONService.filterNodes(parsedXML, 'z:row');
            }

            function convertUpdateRequestToResponse(request: JQuery, optionalAttributes): string {
                var fields = $(request).find('Field');
                var changeObject = {};
                _.each(fields, function(field: JQuery) {
                    var fieldName = $(field).attr('Name');
                    var fieldValue = $(field).text();
                    changeObject[fieldName] = _.unescape(fieldValue);
                });
                _.extend(changeObject, optionalAttributes);
                return createZRow(changeObject);
            }

            function createZRow(changeObject: Object): string {
                var zrow = '<z:row ';
                _.each(changeObject, function(fieldValue: string, fieldName: string) {
                    zrow += ' ows_' + fieldName + '="' + _.escape(fieldValue) + '"';
                });
                zrow += ' xmlns:z="#RowsetSchema"/>';
                return zrow;
            }

            function getMockUser(): ap.IUser {
                var mockUser = { lookupId: 100, lookupValue: 'Joe User' };

                try {
                    mockUser = $injector.get('mockUser');
                } catch (err) {
                    //Oh well, we tried to see if a default mock user was specified.
                }
                return mockUser;
            }

            function updateListItem(request: JQuery): string {

                var zrow,
                    overrides,
                    updateMethod = request.find('Method'),
                    cmd = updateMethod.attr('Cmd');

                switch (cmd) {
                    /** Create list item */
                    case 'New':
                        var model = getListModel(request);
                        /** Need to create an id so find set it 1 higher than the id of the most recent entity */
                        var lastEntity = model.getCachedEntities().last();
                        var mockId = lastEntity ? lastEntity.id + 1 : getMockId();

                        //Mock Fields that would be set upon list item creation
                        overrides = {
                            ID: mockId,
                            Modified: apEncodeService.encodeValue('DateTime', new Date()),
                            Created: apEncodeService.encodeValue('DateTime', new Date()),
                            Author: apEncodeService.encodeValue('User', getMockUser()),
                            Editor: apEncodeService.encodeValue('User', getMockUser()),
                            PermMask: '0x7fffffffffffffff',
                            UniqueId: mockId + ';#{11FF840D-9CE1-4961-B7FD-51B9DF07706B}',
                            FileRef: mockId + ';#sitecollection/site/ListName/' + mockId + '_.000'
                        }

                        zrow = convertUpdateRequestToResponse(request, overrides);
                        registerUpdate(request, zrow);
                        break;
                    case 'Update':
                        var listItemStrId = $(request).find('Field[Name="ID"]').text();
                        //Retrieve the JS Object that is attempting to update
                        var activeEntity = activeEntities[listItemStrId];

                        //Mock fields that would be updated when a list item is update
                        overrides = {
                            Modified: apEncodeService.encodeValue('DateTime', new Date()),
                            Editor: apEncodeService.encodeValue('User', getMockUser()),
                            Version: activeEntity.version ? activeEntity.version + 1 : 2
                        };
                        
                        var fieldDefinitions = activeEntity.getList().fields;
                        var valuePairs = apEncodeService.generateValuePairs(fieldDefinitions, activeEntity);
                        var encodedValues = {};
                        _.each(valuePairs, function(pair) {
                            encodedValues[pair[0]] = pair[1];
                        });

                        var opts = _.extend({}, encodedValues, overrides);

                        zrow = convertUpdateRequestToResponse(request, opts);
                        registerUpdate(request, zrow);

                        //Cleanup
                        delete activeEntities[listItemStrId];
                        break;
                    case 'Delete':
                        /** No z:row element when deleted */
                        zrow = '';
                        _.each($(request).find('Field'), function(field) {
                            var fieldId = parseInt($(field).text(), 10);
                            registerDeletion(request, fieldId);
                        });
                        break;
                }

                var responseEnvelope = listsResponseEnvelope('UpdateListItems');

                var payload = `<Results><Result ID="1,${cmd}"><ErrorCode>0x00000000</ErrorCode>${zrow}</Result></Results>`;
                var xmlResponse = responseEnvelope.header + payload + responseEnvelope.footer;
                return xmlResponse;
            }


            function getListItemChangesSinceToken(data: string, request: JQuery): string {
                var responseXML, responseEnvelope, changeNodes, payload;
                var changeToken = getChangeToken(request);
                var newChangeToken = generateChangeToken(request);
                if (changeToken) {
                    /** Follow on request */
                    responseEnvelope = listsResponseEnvelope('GetListItemChangesSinceToken');
                    changeNodes = getChangesSinceToken(request, newChangeToken);
                    payload = `<listitems ${xmlNS.listItems}> ${changeNodes.changes} ${changeNodes.rsdata}</listitems>`;
                    responseXML = responseEnvelope.header + payload + responseEnvelope.footer;
                } else {
                    var model = getListModel(request);
                    registerChangeToken(request, newChangeToken);
                    /** Initial request so register this token */
                    if (apCachedXML.lists[model.list.title] && apCachedXML.lists[model.list.title].GetListItemChangesSinceToken) {
                        /** Use Cached XML */
                        responseXML = apCachedXML.lists[model.list.title].GetListItemChangesSinceToken;
                    } else {
                        /** Generate mocks if no cached XML is found */
                        responseEnvelope = listsResponseEnvelope('GetListItemChangesSinceToken');
                        /** Add mocked items to change queue */
                        changeQueue[model.list.guid].pendingUpdates = generateMockListItems(request, 10);
                        changeNodes = getChangesSinceToken(request, newChangeToken);
                        payload = `<listitems ${xmlNS.listItems}>${changeNodes.changes} ${changeNodes.rsdata}</listitems>`;
                        responseXML = responseEnvelope.header + payload + responseEnvelope.footer;
                    }
                }
                return responseXML;
            }

            function buildRSDataNode(zrows: JQuery[]): string {

                var rsdata = '<rs:data ItemCount="' + zrows.length + '">';
                _.each(zrows, function(zrow: JQuery) {
                    /** Work with zrows that have been parsed to xml as well as those that are still strings */
                    rsdata += typeof zrow === 'object' ? apUtilityService.stringifyXML(zrow) : zrow;
                });
                rsdata += '</rs:data>';
                return rsdata;
            }

            function getChangesSinceToken(request: JQuery, token: string): { changes: string; rsdata: string; } {
                var response = { changes: '', rsdata: '' };
                var model = getListModel(request);
                var changesSinceToken = getChangeTokenCache(request);
                /** Build XML for any list items that have been added or updated */
                response.rsdata = buildRSDataNode(changesSinceToken.pendingUpdates);

                /* Build Changes XML node for entities that have been deleted.  There are other valid changes [Restore] but
                 at this point we're only concerned with mocking deleted items */
                response.changes = '<Changes LastChangeToken="' + token + '">';
                if (changesSinceToken.pendingDeletions.length > 0) {
                    _.each(changesSinceToken.pendingDeletions, function(listItemId) {
                        response.changes += '<Id ChangeType="Delete" UniqueId="">' + listItemId + '</Id>';
                    });
                }
                response.changes += '</Changes>';

                /** Clear out changes for next time */
                changesSinceToken.clear(token);
                return response;
            }

            function registerUpdate(request: JQuery, zrow: JQuery): void {
                getChangeTokenCache(request).pendingUpdates.push(zrow);
            }

            function registerDeletion(request: JQuery, id: number): void {
                getChangeTokenCache(request).pendingDeletions.push(id);
            }

            function getChangeTokenCache(request: JQuery) {
                var model = getListModel(request);
                changeQueue[model.list.guid] =
                changeQueue[model.list.guid] || new ModelChangeQueue(generateChangeToken(request));
                return changeQueue[model.list.guid];
            }

            function registerChangeToken(request: JQuery, token: string): void {
                var model = getListModel(request);
                changeQueue[model.list.guid] = new ModelChangeQueue(token);
            }

            function generateChangeToken(request: JQuery): string {
                var model = getListModel(request);
                return _.uniqueId(model ? model.list.guid : '');
            }

            function listsResponseEnvelope(operation: string): { footer: string; header: string; payload: string; } {
                var response = {
                    footer: `</${operation}Result></${operation}Response></soap:Body></soap:Envelope>`,
                    header: `<?xml version="1.0" encoding="utf-8"?><soap:Envelope ${xmlNS.soap}><soap:Body>
                        <${operation}Response xmlns="http://schemas.microsoft.com/sharepoint/soap/"><${operation}Result>`,
                    payload: ''
                };
                return response;
            }

            function getListModel(request: JQuery): Model {
                /** Find the list id */
                var listGuid = getListId(request);
                /** Check with cache service to see if a list with the matching guid has registered */
                return apCacheService.getModel(listGuid);
            }

            function getListId(request: JQuery): string {
                return getXMLNodeContents(request, 'listName');
            }

            function getChangeToken(request: JQuery): string {
                return getXMLNodeContents(request, 'changeToken');
            }

            function getXMLNodeContents(request: JQuery, element): string {
                var changeToken;
                var changeTokenNode = $(request).find(element);
                if (changeTokenNode.length) {
                    changeToken = changeTokenNode.text();
                }
                return changeToken;
            }

            function generateMockListItems(request: JQuery, quantity: number): JQuery[] {
                var model = getListModel(request);
                var mockRecords = model.generateMockData({ quantity: quantity });
                var zrows = [];
                _.each(mockRecords, function(mockRecord) {
                    var changeObject = {};
                    /** Generate value pairs for each property on the mock object */
                    var valuePairs = apEncodeService.generateValuePairs(model.list.fields, mockRecord);
                    /** Create a key/val property for each valuePiar */
                    _.each(valuePairs, function(valuePair) {
                        changeObject[valuePair[0]] = valuePair[1];
                    });
                    zrows.push(createZRow(changeObject));
                });
                return zrows;
            }

            function getNamedListItems(operation: string, request: JQuery): string {
                var responseXML;
                /** Check with cache service to see if a list with the matching guid has registered */
                var listModel = getListModel(request);
                if (listModel) {
                    /** Use the list name in the model to see if we have cached XML */
                    responseXML = getCachedResponse(operation, listModel.list.title);
                }
                if (!responseXML) {
                    console.info('No Cached Data Found For ' + listModel.list.title);
                    /** No cached XML so just use the default operation response */
                    responseXML = getCachedResponse(operation);
                }
                return responseXML;
            }

            function getCachedResponse(operation: string, fileName?: string): string {
                var response;
                fileName = fileName || operation;

                if (apCachedXML.lists[fileName] && apCachedXML.lists[fileName][operation]) {
                    response = apCachedXML.lists[fileName][operation];
                } else if (_.keys(apCachedXML.lists[fileName]).length > 0) {
                    /** The exact operation we'd looking for isn't found but there's another there so we'll try that */
                    response = apCachedXML.lists[fileName][_.keys(apCachedXML.lists[fileName])[0]];
                }
                return response;
            }

            function responder(responseXML) {
                return [200, responseXML];
            }


        }
    }

    angular.module('angularPoint')
        .run(MockBackend);

}