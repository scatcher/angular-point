"use strict";
var constants_1 = require('../constants');
var serviceDefinitions = {
    Alerts: {
        action: constants_1.SCHEMASharePoint + '/soap/2002/1/alerts/',
        xmlns: constants_1.SCHEMASharePoint + '/soap/2002/1/alerts/'
    },
    Meetings: {
        action: constants_1.SCHEMASharePoint + '/soap/meetings/',
        xmlns: constants_1.SCHEMASharePoint + '/soap/meetings/'
    },
    Permissions: {
        action: constants_1.SCHEMASharePoint + '/soap/directory/',
        xmlns: constants_1.SCHEMASharePoint + '/soap/directory/'
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
        xmlns: constants_1.SCHEMASharePoint + '/diagnostics/'
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
        action: constants_1.SCHEMASharePoint + '/taxonomy/soap/',
        xmlns: constants_1.SCHEMASharePoint + '/taxonomy/soap/'
    },
    usergroup: {
        action: constants_1.SCHEMASharePoint + '/soap/directory/',
        xmlns: constants_1.SCHEMASharePoint + '/soap/directory/'
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
        action: constants_1.SCHEMASharePoint + '/soap/workflow/',
        xmlns: constants_1.SCHEMASharePoint + '/soap/workflow/'
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
exports.webServices = webServices;
function action(service) {
    return serviceDefinitions[service] ? serviceDefinitions[service].action : constants_1.SCHEMASharePoint + '/soap/';
}
exports.action = action;
function xmlns(service) {
    return serviceDefinitions[service] ? serviceDefinitions[service].xmlns : constants_1.SCHEMASharePoint + '/soap/';
}
exports.xmlns = xmlns;
//# sourceMappingURL=web-service-schemas.constant.js.map