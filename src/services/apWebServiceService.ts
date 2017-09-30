const SCHEMASharePoint = 'http://schemas.microsoft.com/sharepoint';
const serviceDefinitions = {
    Alerts: {
        action: SCHEMASharePoint + '/soap/2002/1/alerts/',
        xmlns: SCHEMASharePoint + '/soap/2002/1/alerts/',
    },
    Meetings: {
        action: SCHEMASharePoint + '/soap/meetings/',
        xmlns: SCHEMASharePoint + '/soap/meetings/',
    },
    Permissions: {
        action: SCHEMASharePoint + '/soap/directory/',
        xmlns: SCHEMASharePoint + '/soap/directory/',
    },
    PublishedLinksService: {
        action: 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/',
        xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/',
    },
    Search: {
        action: 'urn:Microsoft.Search/',
        xmlns: 'urn:Microsoft.Search',
    },
    SharePointDiagnostics: {
        action: 'http://schemas.microsoft.com/sharepoint/diagnostics/',
        xmlns: SCHEMASharePoint + '/diagnostics/',
    },
    SocialDataService: {
        action: 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/',
        xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService',
    },
    SpellCheck: {
        action: 'http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck',
        xmlns: 'http://schemas.microsoft.com/sharepoint/publishing/spelling/',
    },
    TaxonomyClientService: {
        action: SCHEMASharePoint + '/taxonomy/soap/',
        xmlns: SCHEMASharePoint + '/taxonomy/soap/',
    },
    usergroup: {
        action: SCHEMASharePoint + '/soap/directory/',
        xmlns: SCHEMASharePoint + '/soap/directory/',
    },
    UserProfileService: {
        action: 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/',
        xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService',
    },
    WebPartPages: {
        action: 'http://microsoft.com/sharepoint/webpartpages/',
        xmlns: 'http://microsoft.com/sharepoint/webpartpages',
    },
    Workflow: {
        action: SCHEMASharePoint + '/soap/workflow/',
        xmlns: SCHEMASharePoint + '/soap/workflow/',
    },
};

export class WebServiceService {
    webServices = [
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
        'Workflow',
    ];
    action(service) {
        return serviceDefinitions[service] ? serviceDefinitions[service].action : SCHEMASharePoint + '/soap/';
    }
    xmlns(service) {
        return serviceDefinitions[service] ? serviceDefinitions[service].xmlns : SCHEMASharePoint + '/soap/';
    }
}
