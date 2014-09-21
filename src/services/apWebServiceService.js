'use strict';

//  apWebServiceOperationConstants.OpName = [WebService, needs_SOAPAction];
//      OpName              The name of the Web Service operation -> These names are unique
//      WebService          The name of the WebService this operation belongs to
//      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the setRequestHeaderfunction.
//                          true if the operation does a write, else false
angular.module('angularPoint')
    .service('apWebServiceService', function() {
        var SCHEMASharePoint = "http://schemas.microsoft.com/sharepoint";
        var serviceDefinitions = {
            Alerts: {
                action: SCHEMASharePoint + '/soap/2002/1/alerts/',
                xmlns: SCHEMASharePoint + '/soap/2002/1/alerts/'
            },
            Meetings: {
                action: SCHEMASharePoint + '/soap/meetings/',
                xmlns: SCHEMASharePoint + '/soap/meetings/'
            },
            Permissions: {
                action: SCHEMASharePoint + '/soap/directory/',
                xmlns: SCHEMASharePoint + '/soap/directory/'
            },
            PublishedLinksService: {
                action: 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/',
                xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/'
            },
            Search: {
                action: 'urn:Microsoft.Search/',
                xmlns: 'urn:Microsoft.Search'
            },
            SharePointDiagnostics: {
                action: 'http://schemas.microsoft.com/sharepoint/diagnostics/',
                xmlns: SCHEMASharePoint + '/diagnostics/'
            },
            SocialDataService: {
                action: 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/',
                xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService'
            },
            SpellCheck: {
                action: 'http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck',
                xmlns: 'http://schemas.microsoft.com/sharepoint/publishing/spelling/'
            },
            TaxonomyClientService: {
                action: SCHEMASharePoint + '/taxonomy/soap/',
                xmlns: SCHEMASharePoint + '/taxonomy/soap/'
            },
            usergroup: {
                action: SCHEMASharePoint + '/soap/directory/',
                xmlns: SCHEMASharePoint + '/soap/directory/'
            },
            UserProfileService: {
                action: 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/',
                xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService'
            },
            WebPartPages: {
                action: 'http://microsoft.com/sharepoint/webpartpages/',
                xmlns: 'http://microsoft.com/sharepoint/webpartpages'
            },
            Workflow: {
                action: SCHEMASharePoint + '/soap/workflow/',
                xmlns: SCHEMASharePoint + '/soap/workflow/'
            }
        };

        var webServices = [
            'Alerts',
            'Authentication',
            'Copy',
            'Forms',
            'Lists',
            'Meetings',
            'People',
            'Permissions',
            'PublishedLinksService',
            'Search',
            'SharePointDiagnostics',
            'SiteData',
            'Sites',
            'SocialDataService',
            'SpellCheck',
            'TaxonomyClientService',
            'usergroup',
            'UserProfileService',
            'Versions',
            'Views',
            'WebPartPages',
            'Webs',
            'Workflow'
        ];

        return {
            action: action,
            webServices: webServices,
            xmlns: xmlns
        };

        function action(service) {
            return serviceDefinitions[service] ? serviceDefinitions[service].action : SCHEMASharePoint + '/soap/';
        }
        function xmlns(service) {
            return serviceDefinitions[service] ? serviceDefinitions[service].xmlns : SCHEMASharePoint + '/soap/';
        }

    });
