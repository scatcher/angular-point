export default apMockBackend;

class apMockBackend {
    constructor(_, $httpBackend, apCachedXML, apCacheService, apWebServiceService,
                apUtilityService, apEncodeService) {

        var mockId = 10000;

        function getMockId() {
            return mockId++;
        }

        /** Listen for each of the standard services being called and try to return a cached XML response for the
         * operation */
        _.each(apWebServiceService.webServices, function (service) {
            /** Lists has many special cases so don't create generic backend for it */
            if (service !== 'Lists') {
                /** Simple regex to check if the requested endpoint matches the one for this service */
                var regExp = new RegExp('_vti_bin/' + service + '.asmx', 'g');
                $httpBackend.when('POST', regExp)
                    .respond(function (method, url, data) {
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
            .respond(function (method, url, data) {
                var requestXML = $.parseXML(data);
                var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/sharepoint/"]');
                var operation = request[0].nodeName;
                var responseXML;

                switch (operation) {
                    case 'GetListItems':
                        responseXML = getListItems(request);
                        //var rowLimit = $(requestXML).find('rowLimit').text();
                        //if (rowLimit == 1) {
                        //    /** Returns a single entity */
                        //    responseXML = getCachedResponse(operation, 'GetListItemById');
                        //}
                        break;
                    case 'GetList':
                    case 'GetListItemChangesSinceToken':
                        responseXML = getListItemChangesSinceToken(data, request);
                        //responseXML = getNamedListItems(operation, data);
                        break;
                    case 'UpdateListItems':
                        responseXML = updateListItem(request);
                        break;

                    default:
                        responseXML = apCachedXML.operations[operation];
                }
                return responder(responseXML);
            });

        var changeQueue = {};

        var xmlNS = {
            listItems: 'xmlns:s="uuid:BDC6E3F0-6DA3-11d1-A2A3-00AA00C14882" ' +
            'xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882" ' +
            'xmlns:rs="urn:schemas-microsoft-com:rowset" ' +
            'xmlns:z="#RowsetSchema"',
            soap: 'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"'
        };


        function getListItems(request) {
            var zrows = [];
            var rowLimit = $(request).find('rowLimit').text();
            if (rowLimit == 1) {
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
        function getListItemById(request) {
            var match;
            /** Retrieve the list item id */
            var id = $(request).find('Query').find('Value[Type="Number"]').text();
            var rows = getZRows(request);

            /** Attempt to find the requested list item in the cached xml */
            _.each(rows, function (row) {
                if ($(row).attr('ows_ID') == id) {
                    match = row;
                    /** Break loop */
                    return false;
                }
            });

            /** Returns a single entity */
            return match;
        }

        function getZRows(request) {
            var responseXML = getNamedListItems('GetListItems', request);

            var parsedXML = $.parseXML(responseXML);
            return $(parsedXML).SPFilterNode('z:row');
        }

        function convertUpdateRequestToResponse(request, optionalAttributes) {
            var fields = $(request).find('Field');
            var changeObject = {};
            _.each(fields, function (field) {
                var fieldName = $(field).attr('Name');
                var fieldValue = $(field).text();
                changeObject[fieldName] = _.unescape(fieldValue);
            });
            _.extend(changeObject, optionalAttributes);
            return createZRow(changeObject);
        }

        function createZRow(changeObject) {
            var zrow = '<z:row ';
            _.each(changeObject, function (fieldValue, fieldName) {
                zrow += ' ows_' + fieldName + '="' + _.escape(fieldValue) + '"';
            });
            zrow += ' xmlns:z="#RowsetSchema"/>';
            return zrow;
        }

        function updateListItem(request) {

            var zrow,
                updateMethod = request.find('Method'),
                cmd = updateMethod.attr('Cmd');

            switch (cmd) {
            /** Create list item 4 */
                case 'New':
                    var model = getListModel(request);
                    /** Need to create an id so find set it 1 higher than the id of the most recent entity */
                    var lastEntity = model.getCachedEntities().last();
                    var mockId = lastEntity ? lastEntity.id + 1 : getMockId();
                    zrow = convertUpdateRequestToResponse(request, {ID: mockId});
                    registerUpdate(request, zrow);
                    break;
                case 'Update':
                    zrow = convertUpdateRequestToResponse(request);
                    registerUpdate(request, zrow);
                    break;
                case 'Delete':
                    /** No z:row element when deleted */
                    zrow = '';
                    _.each($(request).find('Field'), function (field) {
                        var fieldId = parseInt($(field).text(), 10);
                        registerDeletion(request, fieldId);
                    });
                    break;
            }

            var responseEnvelope = listsResponseEnvelope('UpdateListItems');

            var payload = '' +
                '<Results>' +
                '   <Result ID="1,' + cmd + '">' +
                '       <ErrorCode>0x00000000</ErrorCode>' + zrow +
                '   </Result>' +
                '</Results>';
            var xmlResponse = responseEnvelope.header + payload + responseEnvelope.footer;
            return xmlResponse;
        }


        function getListItemChangesSinceToken(request) {
            var responseXML, responseEnvelope, changeNodes, payload;
            var changeToken = getChangeToken(request);
            var newChangeToken = generateChangeToken(request);
            if (changeToken) {
                /** Subsequent request */
                responseEnvelope = listsResponseEnvelope('GetListItemChangesSinceToken');
                changeNodes = getChangesSinceToken(request, newChangeToken);
                payload = '' +
                '<listitems ' + xmlNS.listItems + '>' +
                changeNodes.changes + ' ' + changeNodes.rsdata +
                '</listitems>';
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
                    payload = '' +
                    '<listitems ' + xmlNS.listItems + '>' +
                    changeNodes.changes + ' ' + changeNodes.rsdata +
                    '</listitems>';
                    responseXML = responseEnvelope.header + payload + responseEnvelope.footer;
                }
            }
            return responseXML;
        }

        function buildRSDataNode(zrows) {

            var rsdata = '<rs:data ItemCount="' + zrows.length + '">';
            _.each(zrows, function (zrow) {
                /** Work with zrows that have been parsed to xml as well as those that are still strings */
                rsdata += typeof zrow === 'object' ? apUtilityService.stringifyXML(zrow) : zrow;
            });
            rsdata += '</rs:data>';
            return rsdata;
        }

        function getChangesSinceToken(request, token) {
            var response = {changes: '', rsdata: ''};
            var model = getListModel(request);
            var changesSinceToken = getChangeTokenCache(request);
            /** Build XML for any list items that have been added or updated */
            response.rsdata = buildRSDataNode(changesSinceToken.pendingUpdates);

            /* Build Changes XML node for entities that have been deleted.  There are other valid changes [Restore] but
             at this point we're only concerned with mocking deleted items */
            response.changes = '<Changes LastChangeToken="' + token + '">';
            if (changesSinceToken.pendingDeletions.length > 0) {
                _.each(changesSinceToken.pendingDeletions, function (listItemId) {
                    response.changes += '<Id ChangeType="Delete" UniqueId="">' + listItemId + '</Id>';
                });
            }
            response.changes += '</Changes>';

            /** Clear out changes for next time */
            changesSinceToken.clear(token);
            return response;
        }

        function registerUpdate(request, zrow) {
            getChangeTokenCache(request).pendingUpdates.push(zrow);
        }

        function registerDeletion(request, id) {
            getChangeTokenCache(request).pendingDeletions.push(id);
        }

        function getChangeTokenCache(request) {
            var model = getListModel(request);
            changeQueue[model.list.guid] =
                changeQueue[model.list.guid] || new ChangeToken(generateChangeToken(request));
            return changeQueue[model.list.guid];
        }

        function ChangeToken(token) {
            var self = this;
            self.token = token;
            self.pendingDeletions = [];
            self.pendingUpdates = [];
            self.clear = function (updatedToken) {
                self.token = updatedToken || '';
                self.pendingDeletions = [];
                self.pendingUpdates = [];
            };
        }

        function registerChangeToken(request, token) {
            var model = getListModel(request);
            changeQueue[model.list.guid] = new ChangeToken(token);
        }

        function generateChangeToken(request) {
            var model = getListModel(request);
            return _.uniqueId(model.list.guid);
        }

        function listsResponseEnvelope(operation) {
            var response = {
                header: '' +
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<soap:Envelope ' + xmlNS.soap + '>' +
                '   <soap:Body>' +
                '       <' + operation + 'Response xmlns="http://schemas.microsoft.com/sharepoint/soap/">' +
                '           <' + operation + 'Result>',
                footer: '' +
                '           </' + operation + 'Result>' +
                '       </' + operation + 'Response>' +
                '   </soap:Body>' +
                '</soap:Envelope>',
                payload: ''
            };
            return response;
        }

        function getListModel(request) {
            /** Find the list id */
            var listGuid = getListId(request);
            /** Check with cache service to see if a list with the matching guid has registered */
            return apCacheService.getModel(listGuid);
        }

        function getListId(request) {
            return getXMLNodeContents(request, 'listName');
        }

        function getChangeToken(request) {
            return getXMLNodeContents(request, 'changeToken');
        }

        function getXMLNodeContents(request, element) {
            var changeToken;
            var changeTokenNode = $(request).find(element);
            if (changeTokenNode.length) {
                changeToken = changeTokenNode.text();
            }
            return changeToken;
        }

        function generateMockListItems(request, quantity) {
            var model = getListModel(request);
            var mockRecords = model.generateMockData({quantity: quantity});
            var zrows = [];
            _.each(mockRecords, function (mockRecord) {
                var changeObject = {};
                /** Generate value pairs for each property on the mock object */
                var valuePairs = apEncodeService.generateValuePairs(model.list.fields, mockRecord);
                /** Create a key/val property for each valuePiar */
                _.each(valuePairs, function (valuePair) {
                    changeObject[valuePair[0]] = valuePair[1];
                });
                zrows.push(createZRow(changeObject));
            });
            return zrows;
        }

        function getNamedListItems(operation, request) {
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

        function getCachedResponse(operation, fileName) {
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


        ///** Listen for each of the standard services being called and try to return a cached XML response for the
        // * operation */
        //_.each(apWebServiceService.webServices, function (service) {
        //    /** Lists has many special cases so don't create generic backend for it */
        //    if (service !== 'Lists') {
        //        /** Simple regex to check if the requested endpoint matches the one for this service */
        //        var regExp = new RegExp('_vti_bin/' + service + '.asmx', 'g');
        //        $httpBackend.when('POST', regExp)
        //            .respond(function (method, url, data) {
        //                var requestXML = $.parseXML(data);
        //                /** Get the xml namespace for the current service */
        //                var soapAction = apWebServiceService.xmlns(service);
        //                var request = $(requestXML).find('[xmlns^="' + soapAction + '"]');
        //                var operation = request[0].nodeName;
        //                var responseXML = apCachedXML.operations[operation];
        //                return responder(responseXML);
        //            });
        //    }
        //});
        //
        //$httpBackend.whenPOST(/Lists.asmx/)
        //    .respond(function (method, url, data) {
        //        var requestXML = $.parseXML(data);
        //        var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/sharepoint/"]');
        //        var operation = request[0].nodeName;
        //        var responseXML;
        //
        //        switch (operation) {
        //            case 'GetListItems':
        //                responseXML = getNamedListItems(operation, data);
        //                var rowLimit = $(requestXML).find('rowLimit').text();
        //                if (rowLimit == 1) {
        //                    /** Returns a single entity */
        //                    responseXML = getCachedResponse(operation, 'GetListItemById');
        //                }
        //                break;
        //            case 'GetListItemChangesSinceToken':
        //                responseXML = getNamedListItems(operation, data);
        //                break;
        //            case 'UpdateListItems':
        //                var updateMethod = request.find('Method');
        //                var cmd = updateMethod.attr('Cmd');
        //                switch (cmd) {
        //                /** Create list item 4 */
        //                    case 'New':
        //                        responseXML = getCachedResponse(operation, 'UpdateListItems_New');
        //                        break;
        //                    case 'Update':
        //                        /** Update List Item 1 with mock.integer=13 */
        //                        responseXML = getCachedResponse(operation, 'UpdateListItems_Update');
        //                        break;
        //                /** Delete list Item 1 */
        //                    case 'Delete':
        //                        responseXML = getCachedResponse(operation, 'UpdateListItems_Delete');
        //                        break;
        //                }
        //                break;
        //
        //            default:
        //                responseXML = apCachedXML.operations[operation];
        //        }
        //        return responder(responseXML);
        //    });
        //
        ////TODO Figure out why this doesn't work when doing unit tests
        //// Don't mock the html views
        ////$httpBackend.when('GET', /\.html$/).passThrough();
        //
        //function getNamedListItems(operation, data) {
        //    var responseXML;
        //    /** Find the list id */
        //    var listGuid = data.split('<listName>')[1].split('</listName>')[0];
        //    /** Check with cache service to see if a list with the matching guid has registered */
        //    var listModel = apCacheService.getModel(listGuid);
        //    if (listModel) {
        //        /** Use the list name in the model to see if we have cached XML */
        //        responseXML = getCachedResponse(operation, listModel.list.title);
        //    }
        //    if (!responseXML) {
        //        /** No cached XML so just use the default operation response */
        //        responseXML = getCachedResponse(operation);
        //    }
        //    return responseXML;
        //}
        //
        //function getCachedResponse(operation, fileName) {
        //    var response;
        //    fileName = fileName || operation;
        //
        //    if (apCachedXML.lists[fileName] && apCachedXML.lists[fileName][operation]) {
        //        response = apCachedXML.lists[fileName][operation];
        //    }
        //    return response;
        //}
        //
        //function responder(responseXML) {
        //    return [200, responseXML];
        //}
    }
}
