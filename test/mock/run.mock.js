'use strict';

angular.module('angularPoint')
    .run(function (_, $httpBackend, apCachedXML, apCacheService, apWebServiceService) {

        /** Listen for each of the standard services being called and try to return a cached XML response for the
         * operation */
        _.each(apWebServiceService.webServices, function (service) {
            /** Lists has many special cases so don't create generic backend for it */
            if(service !== 'Lists') {
                /** Simple regex to check if the requested endpoint matches the one for this service */
                var regExp = new RegExp('_vti_bin/' + service + '.asmx', 'g');
                $httpBackend.when('POST', regExp)
                    .respond(function (method, url, data) {
                        var requestXML = $.parseXML(data);
                        /** Get the xml namespace for the current service */
                        var soapAction = apWebServiceService.xmlns(service);
                        var request = $(requestXML).find('[xmlns^="' + soapAction + '"]');
                        var operation = request[0].nodeName;
                        var responseXML = getCachedResponse(operation);
                        return responder(responseXML);
                    });
            }
        });

        $httpBackend.whenPOST('/test/_vti_bin/Lists.asmx')
            .respond(function (method, url, data) {
                var requestXML = $.parseXML(data);
                var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/sharepoint/"]');
                var operation = request[0].nodeName;
                var responseXML;

                switch (operation) {
                    case 'GetListItems':
                        responseXML = getNamedListItems(operation, data);
                        var rowLimit = $(requestXML).find('rowLimit').text();
                        if (rowLimit == 1) {
                            /** Returns a single entity */
                            responseXML = getCachedResponse(operation, 'GetListItemById');
                        }
                        break;
                    case 'GetListItemChangesSinceToken':
                        responseXML = getNamedListItems(operation, data);
                        break;
                    case 'UpdateListItems':
                        var updateMethod = request.find('Method');
                        var cmd = updateMethod.attr('Cmd');
                        switch (cmd) {
                        /** Create list item 4 */
                            case 'New':
                                responseXML = getCachedResponse(operation, 'UpdateListItems_New');
                                break;
                            case 'Update':
                                /** Update List Item 1 with mock.integer=13 */
                                responseXML = getCachedResponse(operation, 'UpdateListItems_Update');
                                break;
                        /** Delete list Item 1 */
                            case 'Delete':
                                responseXML = getCachedResponse(operation, 'UpdateListItems_Delete');
                                break;
                        }
                        break;

                    default:
                        responseXML = getCachedResponse(operation);
                }
                return responder(responseXML);
            });

        function getNamedListItems(operation, data) {
            var responseXML;
            /** Find the list id */
            var listGuid = data.split('<listName>')[1].split('</listName>')[0];
            /** Check with cache service to see if a list with the matching guid has registered */
            var listModel = apCacheService.getModel(listGuid);
            if (listModel) {
                /** Use the list name in the model to see if we have cached XML */
                responseXML = getCachedResponse(operation, listModel.list.title);
            }
            if (!responseXML) {
                /** No cached XML so just use the default operation response */
                responseXML = getCachedResponse(operation);
            }
            return responseXML;
        }

        function getCachedResponse(operation, fileName) {
            var response;
            fileName = fileName || operation;
            if (apCachedXML[operation] && apCachedXML[operation][fileName]) {
                response = apCachedXML[operation][fileName];
            }
            return response;
        }

        function responder(responseXML) {
            return [200, responseXML];
        }


    });

//$httpBackend.whenPOST('/_vti_bin/Webs.asmx')
//    .respond(function (method, url, data) {
//        var requestXML = $.parseXML(data);
//        var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/"]');
//        var operation = request[0].nodeName;
//        var responseXML = getCachedResponse(operation);
//        return responder(responseXML);
//    });

//$httpBackend.whenPOST('/test/_vti_bin/UserProfileService.asmx')
//    .respond(function (method, url, data) {
//        var requestXML = $.parseXML(data);
//        var request = $(requestXML).find('[xmlns^="http://microsoft.com/"]');
//        var operation = request[0].nodeName;
//        var responseXML;
//
//        responseXML = getCachedResponse(operation);
//        return responder(responseXML);
//    });
//
//$httpBackend.whenPOST('/test/_vti_bin/usergroup.asmx')
//    .respond(function (method, url, data) {
//        var requestXML = $.parseXML(data);
//        var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/"]');
//        var operation = request[0].nodeName;
//        var responseXML;
//
//        responseXML = getCachedResponse(operation);
//        return responder(responseXML);
//    });

//$httpBackend.whenPOST('/test/_vti_bin/Views.asmx')
//    .respond(function (method, url, data) {
//        console.info(typeof data);
//        var requestXML = $.parseXML(data);
//        var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/"]');
//        var operation = request[0].nodeName;
//        var responseXML;
//        responseXML = getCachedResponse(operation);
//        return responder(responseXML);
//    });


