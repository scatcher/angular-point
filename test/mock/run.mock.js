'use strict';

angular.module('angularPoint')
    .run(function ($httpBackend, offlineXML) {

        /** Mock response for apDataService.getCurrentSite */
        $httpBackend.whenPOST('/_vti_bin/Webs.asmx')
            .respond(function (method, url, data) {
                return [200, offlineXML.WebUrlFromPageUrl];
            });

        $httpBackend.whenPOST('/test/_vti_bin/Lists.asmx')
            .respond(function (method, url, data) {
                var requestXML = $.parseXML(data);
                var request = $(requestXML).find('[xmlns^="http://schemas.microsoft.com/sharepoint/"]');
                var operation = request[0].nodeName;
                var responseXML;

                switch(operation) {
                    case 'UpdateListItems':
                        var method = request.find('Method');
                        var cmd = method.attr('Cmd');
                        switch(cmd) {
                            case 'New':
                                responseXML = offlineXML.GetListItemChangesSinceToken_Add;
                                break;
                        }
                        break;
                    default:
                        if(offlineXML[operation]) {
                            responseXML = offlineXML[operation];
                        }
                }
                return [200, responseXML];
            });




    });