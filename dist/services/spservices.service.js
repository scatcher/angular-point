"use strict";
var constants_1 = require('../constants');
var encode_service_1 = require('../services/encode.service');
var soap_envelope_factory_1 = require('../factories/soap-envelope.factory');
var lodash_1 = require('lodash');
var queryService = 'http://microsoft.com/webservices/OfficeServer/QueryService';
/**
 * @ngdoc service
 * @name angularPoint.SPServices
 * @description
 * This is just a trimmed down version of Marc Anderson's awesome [SPServices](http://spservices.codeplex.com/) library.
 * We're primarily looking for the ability to create the SOAP envelope and let AngularJS's $http service handle all
 * communication with the server.
 *
 */
function generateXMLComponents(options) {
    var i = 0; // Generic loop counter
    var encodeOptionList = ['listName', 'description']; // Used to encode options which may contain special characters
    // Defaults added as a function in our library means that the caller can override the defaults
    // for their session by calling this function.  Each operation requires a different set of options;
    // we allow for all in a standardized way.
    var defaults = new constants_1.SPServicesDefaults();
    /** Key/Value mapping of SharePoint properties to SPServices properties */
    var mapping = [
        ['query', 'CAMLQuery'],
        ['viewFields', 'CAMLViewFields'],
        ['rowLimit', 'CAMLRowLimit'],
        ['queryOptions', 'CAMLQueryOptions'],
        ['listItemID', 'ID']
    ];
    /** Ensure the SharePoint properties are available prior to extending with defaults */
    for (var _i = 0, mapping_1 = mapping; _i < mapping_1.length; _i++) {
        var map = mapping_1[_i];
        if (options[map[0]] && !options[map[1]]) {
            /** Ensure SPServices properties are added in the event the true property name is used */
            options[map[1]] = options[map[0]];
        }
    }
    var soapEnvelope = new soap_envelope_factory_1.SOAPEnvelope();
    var SOAPAction;
    // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
    var opt = Object.assign({}, defaults, options);
    // Encode options which may contain special character, esp. ampersand
    for (var _a = 0, encodeOptionList_1 = encodeOptionList; _a < encodeOptionList_1.length; _a++) {
        var optionName = encodeOptionList_1[_a];
        if (lodash_1.isString(opt[optionName])) {
            opt[optionName] = encode_service_1.encodeXml(opt[optionName]);
        }
    }
    var service = constants_1.WebServiceOperationConstants[opt.operation][0];
    // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
    soapEnvelope.opheader = "<" + opt.operation + " xmlns=\"" + constants_1.xmlns(service) + "\" >";
    SOAPAction = constants_1.action(service);
    // Add the operation to the SOAPAction and opfooter
    SOAPAction += opt.operation;
    soapEnvelope.opfooter = "</" + opt.operation + ">";
    // Each operation requires a different set of values.  This switch statement sets them up in the soapEnvelope.payload.
    switch (opt.operation) {
        // ALERT OPERATIONS
        case 'GetAlerts':
            break;
        case 'DeleteAlerts':
            soapEnvelope.payload += '<IDs>';
            for (i = 0; i < opt.IDs.length; i++) {
                soapEnvelope.payload += encode_service_1.wrapNode('string', opt.IDs[i]);
            }
            soapEnvelope.payload += '</IDs>';
            break;
        // AUTHENTICATION OPERATIONS
        case 'Mode':
            break;
        case 'Login':
            soapEnvelope.addToPayload(opt, ['username', 'password']);
            break;
        // COPY OPERATIONS
        case 'CopyIntoItems':
            soapEnvelope.addToPayload(opt, ['SourceUrl']);
            soapEnvelope.payload += '<DestinationUrls>';
            for (i = 0; i < opt.DestinationUrls.length; i++) {
                soapEnvelope.payload += encode_service_1.wrapNode('string', opt.DestinationUrls[i]);
            }
            soapEnvelope.payload += '</DestinationUrls>';
            soapEnvelope.addToPayload(opt, ['Fields', 'Stream', 'Results']);
            break;
        case 'CopyIntoItemsLocal':
            soapEnvelope.addToPayload(opt, ['SourceUrl']);
            soapEnvelope.payload += '<DestinationUrls>';
            for (i = 0; i < opt.DestinationUrls.length; i++) {
                soapEnvelope.payload += encode_service_1.wrapNode('string', opt.DestinationUrls[i]);
            }
            soapEnvelope.payload += '</DestinationUrls>';
            break;
        case 'GetItem':
            soapEnvelope.addToPayload(opt, ['Url', 'Fields', 'Stream']);
            break;
        // FORM OPERATIONS
        case 'GetForm':
            soapEnvelope.addToPayload(opt, ['listName', 'formUrl']);
            break;
        case 'GetFormCollection':
            soapEnvelope.addToPayload(opt, ['listName']);
            break;
        // LIST OPERATIONS
        case 'AddAttachment':
            soapEnvelope.addToPayload(opt, ['listName', 'listItemID', 'fileName', 'attachment']);
            break;
        case 'AddDiscussionBoardItem':
            soapEnvelope.addToPayload(opt, ['listName', 'message']);
            break;
        case 'AddList':
            soapEnvelope.addToPayload(opt, ['listName', 'description', 'templateID']);
            break;
        case 'AddListFromFeature':
            soapEnvelope.addToPayload(opt, ['listName', 'description', 'featureID', 'templateID']);
            break;
        case 'ApplyContentTypeToList':
            soapEnvelope.addToPayload(opt, ['webUrl', 'contentTypeId', 'listName']);
            break;
        case 'CheckInFile':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'comment', 'CheckinType']);
            break;
        case 'CheckOutFile':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'checkoutToLocal', 'lastmodified']);
            break;
        case 'CreateContentType':
            soapEnvelope.addToPayload(opt, ['listName', 'displayName', 'parentType', 'fields', 'contentTypeProperties', 'addToView']);
            break;
        case 'DeleteAttachment':
            soapEnvelope.addToPayload(opt, ['listName', 'listItemID', 'url']);
            break;
        case 'DeleteContentType':
            soapEnvelope.addToPayload(opt, ['listName', 'contentTypeId']);
            break;
        case 'DeleteContentTypeXmlDocument':
            soapEnvelope.addToPayload(opt, ['listName', 'contentTypeId', 'documentUri']);
            break;
        case 'DeleteList':
            soapEnvelope.addToPayload(opt, ['listName']);
            break;
        case 'GetAttachmentCollection':
            soapEnvelope.addToPayload(opt, ['listName', ['listItemID', 'ID']]);
            break;
        case 'GetList':
            soapEnvelope.addToPayload(opt, ['listName']);
            break;
        case 'GetListAndView':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName']);
            break;
        case 'GetListCollection':
            break;
        case 'GetListContentType':
            soapEnvelope.addToPayload(opt, ['listName', 'contentTypeId']);
            break;
        case 'GetListContentTypes':
            soapEnvelope.addToPayload(opt, ['listName']);
            break;
        case 'GetListItems':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName',
                ['query', 'CAMLQuery'],
                ['viewFields', 'CAMLViewFields'],
                ['rowLimit', 'CAMLRowLimit'],
                ['queryOptions', 'CAMLQueryOptions']
            ]);
            break;
        case 'GetListItemChanges':
            soapEnvelope.addToPayload(opt, ['listName', 'viewFields', 'since', 'contains']);
            break;
        case 'GetListItemChangesSinceToken':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName',
                ['query', 'CAMLQuery'],
                ['viewFields', 'CAMLViewFields'],
                ['rowLimit', 'CAMLRowLimit'],
                ['queryOptions', 'CAMLQueryOptions'],
                {
                    name: 'changeToken',
                    sendNull: false
                },
                {
                    name: 'contains',
                    sendNull: false
                }
            ]);
            break;
        case 'GetVersionCollection':
            soapEnvelope.addToPayload(opt, ['strlistID', 'strlistItemID', 'strFieldName']);
            break;
        case 'UndoCheckOut':
            soapEnvelope.addToPayload(opt, ['pageUrl']);
            break;
        case 'UpdateContentType':
            soapEnvelope.addToPayload(opt, ['listName', 'contentTypeId', 'contentTypeProperties', 'newFields', 'updateFields', 'deleteFields', 'addToView']);
            break;
        case 'UpdateContentTypesXmlDocument':
            soapEnvelope.addToPayload(opt, ['listName', 'newDocument']);
            break;
        case 'UpdateContentTypeXmlDocument':
            soapEnvelope.addToPayload(opt, ['listName', 'contentTypeId', 'newDocument']);
            break;
        case 'UpdateList':
            soapEnvelope.addToPayload(opt, ['listName', 'listProperties', 'newFields', 'updateFields', 'deleteFields', 'listVersion']);
            break;
        case 'UpdateListItems':
            soapEnvelope.addToPayload(opt, ['listName']);
            if (typeof opt.updates !== 'undefined' && opt.updates.length > 0) {
                soapEnvelope.addToPayload(opt, ['updates']);
            }
            else {
                soapEnvelope.payload += "<updates><Batch OnError=\"Continue\"><Method ID=\"1\" Cmd=\"" + opt.batchCmd + "\">";
                if (opt.valuePairs) {
                    for (var _b = 0, _c = opt.valuePairs; _b < _c.length; _b++) {
                        var valuePair = _c[_b];
                        soapEnvelope.payload += "<Field Name=\"" + valuePair[0] + "\">" + escapeColumnValue(valuePair[1]) + "</Field>";
                    }
                }
                if (opt.batchCmd !== 'New') {
                    soapEnvelope.payload += "<Field Name=\"ID\">" + opt.ID + "</Field>";
                }
                soapEnvelope.payload += '</Method></Batch></updates>';
            }
            break;
        // MEETINGS OPERATIONS
        case 'AddMeeting':
            soapEnvelope.addToPayload(opt, ['organizerEmail', 'uid', 'sequence', 'utcDateStamp', 'title', 'location', 'utcDateStart', 'utcDateEnd', 'nonGregorian']);
            break;
        case 'CreateWorkspace':
            soapEnvelope.addToPayload(opt, ['title', 'templateName', 'lcid', 'timeZoneInformation']);
            break;
        case 'RemoveMeeting':
            soapEnvelope.addToPayload(opt, ['recurrenceId', 'uid', 'sequence', 'utcDateStamp', 'cancelMeeting']);
            break;
        case 'SetWorkspaceTitle':
            soapEnvelope.addToPayload(opt, ['title']);
            break;
        // PEOPLE OPERATIONS
        case 'ResolvePrincipals':
            soapEnvelope.addToPayload(opt, ['principalKeys', 'principalType', 'addToUserInfoList']);
            break;
        case 'SearchPrincipals':
            soapEnvelope.addToPayload(opt, ['searchText', 'maxResults', 'principalType']);
            break;
        // PERMISSION OPERATIONS
        case 'AddPermission':
            soapEnvelope.addToPayload(opt, ['objectName', 'objectType', 'permissionIdentifier', 'permissionType', 'permissionMask']);
            break;
        case 'AddPermissionCollection':
            soapEnvelope.addToPayload(opt, ['objectName', 'objectType', 'permissionsInfoXml']);
            break;
        case 'GetPermissionCollection':
            soapEnvelope.addToPayload(opt, ['objectName', 'objectType']);
            break;
        case 'RemovePermission':
            soapEnvelope.addToPayload(opt, ['objectName', 'objectType', 'permissionIdentifier', 'permissionType']);
            break;
        case 'RemovePermissionCollection':
            soapEnvelope.addToPayload(opt, ['objectName', 'objectType', 'memberIdsXml']);
            break;
        case 'UpdatePermission':
            soapEnvelope.addToPayload(opt, ['objectName', 'objectType', 'permissionIdentifier', 'permissionType', 'permissionMask']);
            break;
        // PUBLISHEDLINKSSERVICE OPERATIONS
        case 'GetLinks':
            break;
        // SEARCH OPERATIONS
        case 'GetPortalSearchInfo':
            soapEnvelope.opheader = getQueryServiceHeader(opt.operation);
            SOAPAction = getQueryServiceAction(opt.operation);
            break;
        case 'GetQuerySuggestions':
            soapEnvelope.opheader = getQueryServiceHeader(opt.operation);
            SOAPAction = getQueryServiceAction(opt.operation);
            soapEnvelope.payload += encode_service_1.wrapNode('queryXml', encode_service_1.encodeXml(opt.queryXml));
            break;
        case 'GetSearchMetadata':
            soapEnvelope.opheader = getQueryServiceHeader(opt.operation);
            SOAPAction = getQueryServiceAction(opt.operation);
            break;
        case 'Query':
            soapEnvelope.payload += encode_service_1.wrapNode('queryXml', encode_service_1.encodeXml(opt.queryXml));
            break;
        case 'QueryEx':
            soapEnvelope.opheader = getQueryServiceHeader(opt.operation);
            SOAPAction = getQueryServiceAction(opt.operation);
            soapEnvelope.payload += encode_service_1.wrapNode('queryXml', encode_service_1.encodeXml(opt.queryXml));
            break;
        case 'Registration':
            soapEnvelope.payload += encode_service_1.wrapNode('registrationXml', encode_service_1.encodeXml(opt.registrationXml));
            break;
        case 'Status':
            break;
        // SHAREPOINTDIAGNOSTICS OPERATIONS
        case 'SendClientScriptErrorReport':
            soapEnvelope.addToPayload(opt, ['message', 'file', 'line', 'client', 'stack', 'team', 'originalFile']);
            break;
        // SITEDATA OPERATIONS
        case 'EnumerateFolder':
            soapEnvelope.addToPayload(opt, ['strFolderUrl']);
            break;
        case 'GetAttachments':
            soapEnvelope.addToPayload(opt, ['strListName', 'strItemId']);
            break;
        case 'SiteDataGetList':
            soapEnvelope.addToPayload(opt, ['strListName']);
            // Because this operation has a name which duplicates the Lists WS, need to handle
            soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
            break;
        case 'SiteDataGetListCollection':
            // Because this operation has a name which duplicates the Lists WS, need to handle
            soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
            break;
        case 'SiteDataGetSite':
            // Because this operation has a name which duplicates the Lists WS, need to handle
            soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
            break;
        case 'SiteDataGetSiteUrl':
            soapEnvelope.addToPayload(opt, ['Url']);
            // Because this operation has a name which duplicates the Lists WS, need to handle
            soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
            break;
        case 'SiteDataGetWeb':
            // Because this operation has a name which duplicates the Lists WS, need to handle
            soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
            break;
        // SITES OPERATIONS
        case 'CreateWeb':
            soapEnvelope.addToPayload(opt, ['url', 'title', 'description', 'templateName', 'language', 'languageSpecified',
                'locale', 'localeSpecified', 'collationLocale', 'collationLocaleSpecified', 'uniquePermissions',
                'uniquePermissionsSpecified', 'anonymous', 'anonymousSpecified', 'presence', 'presenceSpecified'
            ]);
            break;
        case 'DeleteWeb':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'GetSite':
            soapEnvelope.addToPayload(opt, ['SiteUrl']);
            break;
        case 'GetSiteTemplates':
            soapEnvelope.addToPayload(opt, ['LCID', 'TemplateList']);
            break;
        // SOCIALDATASERVICE OPERATIONS
        case 'AddComment':
            soapEnvelope.addToPayload(opt, ['url', 'comment', 'isHighPriority', 'title']);
            break;
        case 'AddTag':
            soapEnvelope.addToPayload(opt, ['url', 'termID', 'title', 'isPrivate']);
            break;
        case 'AddTagByKeyword':
            soapEnvelope.addToPayload(opt, ['url', 'keyword', 'title', 'isPrivate']);
            break;
        case 'CountCommentsOfUser':
            soapEnvelope.addToPayload(opt, ['userAccountName']);
            break;
        case 'CountCommentsOfUserOnUrl':
            soapEnvelope.addToPayload(opt, ['userAccountName', 'url']);
            break;
        case 'CountCommentsOnUrl':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'CountRatingsOnUrl':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'CountTagsOfUser':
            soapEnvelope.addToPayload(opt, ['userAccountName']);
            break;
        case 'DeleteComment':
            soapEnvelope.addToPayload(opt, ['url', 'lastModifiedTime']);
            break;
        case 'DeleteRating':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'DeleteTag':
            soapEnvelope.addToPayload(opt, ['url', 'termID']);
            break;
        case 'DeleteTagByKeyword':
            soapEnvelope.addToPayload(opt, ['url', 'keyword']);
            break;
        case 'DeleteTags':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'GetAllTagTerms':
            soapEnvelope.addToPayload(opt, ['maximumItemsToReturn']);
            break;
        case 'GetAllTagTermsForUrlFolder':
            soapEnvelope.addToPayload(opt, ['urlFolder', 'maximumItemsToReturn']);
            break;
        case 'GetAllTagUrls':
            soapEnvelope.addToPayload(opt, ['termID']);
            break;
        case 'GetAllTagUrlsByKeyword':
            soapEnvelope.addToPayload(opt, ['keyword']);
            break;
        case 'GetCommentsOfUser':
            soapEnvelope.addToPayload(opt, ['userAccountName', 'maximumItemsToReturn', 'startIndex']);
            break;
        case 'GetCommentsOfUserOnUrl':
            soapEnvelope.addToPayload(opt, ['userAccountName', 'url']);
            break;
        case 'GetCommentsOnUrl':
            soapEnvelope.addToPayload(opt, ['url', 'maximumItemsToReturn', 'startIndex']);
            if (typeof opt.excludeItemsTime !== 'undefined' && opt.excludeItemsTime.length > 0) {
                soapEnvelope.payload += encode_service_1.wrapNode('excludeItemsTime', opt.excludeItemsTime);
            }
            break;
        case 'GetRatingAverageOnUrl':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'GetRatingOfUserOnUrl':
            soapEnvelope.addToPayload(opt, ['userAccountName', 'url']);
            break;
        case 'GetRatingOnUrl':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'GetRatingsOfUser':
            soapEnvelope.addToPayload(opt, ['userAccountName']);
            break;
        case 'GetRatingsOnUrl':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'GetSocialDataForFullReplication':
            soapEnvelope.addToPayload(opt, ['userAccountName']);
            break;
        case 'GetTags':
            soapEnvelope.addToPayload(opt, ['url']);
            break;
        case 'GetTagsOfUser':
            soapEnvelope.addToPayload(opt, ['userAccountName', 'maximumItemsToReturn', 'startIndex']);
            break;
        case 'GetTagTerms':
            soapEnvelope.addToPayload(opt, ['maximumItemsToReturn']);
            break;
        case 'GetTagTermsOfUser':
            soapEnvelope.addToPayload(opt, ['userAccountName', 'maximumItemsToReturn']);
            break;
        case 'GetTagTermsOnUrl':
            soapEnvelope.addToPayload(opt, ['url', 'maximumItemsToReturn']);
            break;
        case 'GetTagUrls':
            soapEnvelope.addToPayload(opt, ['termID']);
            break;
        case 'GetTagUrlsByKeyword':
            soapEnvelope.addToPayload(opt, ['keyword']);
            break;
        case 'GetTagUrlsOfUser':
            soapEnvelope.addToPayload(opt, ['termID', 'userAccountName']);
            break;
        case 'GetTagUrlsOfUserByKeyword':
            soapEnvelope.addToPayload(opt, ['keyword', 'userAccountName']);
            break;
        case 'SetRating':
            soapEnvelope.addToPayload(opt, ['url', 'rating', 'title', 'analysisDataEntry']);
            break;
        case 'UpdateComment':
            soapEnvelope.addToPayload(opt, ['url', 'lastModifiedTime', 'comment', 'isHighPriority']);
            break;
        // SPELLCHECK OPERATIONS
        case 'SpellCheck':
            soapEnvelope.addToPayload(opt, ['chunksToSpell', 'declaredLanguage', 'useLad']);
            break;
        // TAXONOMY OPERATIONS
        case 'AddTerms':
            soapEnvelope.addToPayload(opt, ['sharedServiceId', 'termSetId', 'lcid', 'newTerms']);
            break;
        case 'GetChildTermsInTerm':
            soapEnvelope.addToPayload(opt, ['sspId', 'lcid', 'termId', 'termSetId']);
            break;
        case 'GetChildTermsInTermSet':
            soapEnvelope.addToPayload(opt, ['sspId', 'lcid', 'termSetId']);
            break;
        case 'GetKeywordTermsByGuids':
            soapEnvelope.addToPayload(opt, ['termIds', 'lcid']);
            break;
        case 'GetTermsByLabel':
            soapEnvelope.addToPayload(opt, ['label', 'lcid', 'matchOption', 'resultCollectionSize', 'termIds', 'addIfNotFound']);
            break;
        case 'GetTermSets':
            soapEnvelope.addToPayload(opt, ['sharedServiceId', 'termSetId', 'lcid', 'clientTimeStamps', 'clientVersions']);
            break;
        // USERS AND GROUPS OPERATIONS
        case 'AddGroup':
            soapEnvelope.addToPayload(opt, ['groupName', 'ownerIdentifier', 'ownerType', 'defaultUserLoginName', 'description']);
            break;
        case 'AddGroupToRole':
            soapEnvelope.addToPayload(opt, ['groupName', 'roleName']);
            break;
        case 'AddRole':
            soapEnvelope.addToPayload(opt, ['roleName', 'description', 'permissionMask']);
            break;
        case 'AddRoleDef':
            soapEnvelope.addToPayload(opt, ['roleName', 'description', 'permissionMask']);
            break;
        case 'AddUserCollectionToGroup':
            soapEnvelope.addToPayload(opt, ['groupName', 'usersInfoXml']);
            break;
        case 'AddUserCollectionToRole':
            soapEnvelope.addToPayload(opt, ['roleName', 'usersInfoXml']);
            break;
        case 'AddUserToGroup':
            soapEnvelope.addToPayload(opt, ['groupName', 'userName', 'userLoginName', 'userEmail', 'userNotes']);
            break;
        case 'AddUserToRole':
            soapEnvelope.addToPayload(opt, ['roleName', 'userName', 'userLoginName', 'userEmail', 'userNotes']);
            break;
        case 'GetAllUserCollectionFromWeb':
            break;
        case 'GetGroupCollection':
            soapEnvelope.addToPayload(opt, ['groupNamesXml']);
            break;
        case 'GetGroupCollectionFromRole':
            soapEnvelope.addToPayload(opt, ['roleName']);
            break;
        case 'GetGroupCollectionFromSite':
            break;
        case 'GetGroupCollectionFromUser':
            soapEnvelope.addToPayload(opt, ['userLoginName']);
            break;
        case 'GetGroupCollectionFromWeb':
            break;
        case 'GetGroupInfo':
            soapEnvelope.addToPayload(opt, ['groupName']);
            break;
        case 'GetRoleCollection':
            soapEnvelope.addToPayload(opt, ['roleNamesXml']);
            break;
        case 'GetRoleCollectionFromGroup':
            soapEnvelope.addToPayload(opt, ['groupName']);
            break;
        case 'GetRoleCollectionFromUser':
            soapEnvelope.addToPayload(opt, ['userLoginName']);
            break;
        case 'GetRoleCollectionFromWeb':
            break;
        case 'GetRoleInfo':
            soapEnvelope.addToPayload(opt, ['roleName']);
            break;
        case 'GetRolesAndPermissionsForCurrentUser':
            break;
        case 'GetRolesAndPermissionsForSite':
            break;
        case 'GetUserCollection':
            soapEnvelope.addToPayload(opt, ['userLoginNamesXml']);
            break;
        case 'GetUserCollectionFromGroup':
            soapEnvelope.addToPayload(opt, ['groupName']);
            break;
        case 'GetUserCollectionFromRole':
            soapEnvelope.addToPayload(opt, ['roleName']);
            break;
        case 'GetUserCollectionFromSite':
            break;
        case 'GetUserCollectionFromWeb':
            break;
        case 'GetUserInfo':
            soapEnvelope.addToPayload(opt, ['userLoginName']);
            break;
        case 'GetUserLoginFromEmail':
            soapEnvelope.addToPayload(opt, ['emailXml']);
            break;
        case 'RemoveGroup':
            soapEnvelope.addToPayload(opt, ['groupName']);
            break;
        case 'RemoveGroupFromRole':
            soapEnvelope.addToPayload(opt, ['roleName', 'groupName']);
            break;
        case 'RemoveRole':
            soapEnvelope.addToPayload(opt, ['roleName']);
            break;
        case 'RemoveUserCollectionFromGroup':
            soapEnvelope.addToPayload(opt, ['groupName', 'userLoginNamesXml']);
            break;
        case 'RemoveUserCollectionFromRole':
            soapEnvelope.addToPayload(opt, ['roleName', 'userLoginNamesXml']);
            break;
        case 'RemoveUserCollectionFromSite':
            soapEnvelope.addToPayload(opt, ['userLoginNamesXml']);
            break;
        case 'RemoveUserFromGroup':
            soapEnvelope.addToPayload(opt, ['groupName', 'userLoginName']);
            break;
        case 'RemoveUserFromRole':
            soapEnvelope.addToPayload(opt, ['roleName', 'userLoginName']);
            break;
        case 'RemoveUserFromSite':
            soapEnvelope.addToPayload(opt, ['userLoginName']);
            break;
        case 'RemoveUserFromWeb':
            soapEnvelope.addToPayload(opt, ['userLoginName']);
            break;
        case 'UpdateGroupInfo':
            soapEnvelope.addToPayload(opt, ['oldGroupName', 'groupName', 'ownerIdentifier', 'ownerType', 'description']);
            break;
        case 'UpdateRoleDefInfo':
            soapEnvelope.addToPayload(opt, ['oldRoleName', 'roleName', 'description', 'permissionMask']);
            break;
        case 'UpdateRoleInfo':
            soapEnvelope.addToPayload(opt, ['oldRoleName', 'roleName', 'description', 'permissionMask']);
            break;
        case 'UpdateUserInfo':
            soapEnvelope.addToPayload(opt, ['userLoginName', 'userName', 'userEmail', 'userNotes']);
            break;
        // USERPROFILESERVICE OPERATIONS
        case 'AddColleague':
            soapEnvelope.addToPayload(opt, ['user', 'colleagueAccountName', 'group', 'privacy', 'isInWorkGroup']);
            break;
        case 'AddLink':
            soapEnvelope.addToPayload(opt, ['user', 'name', 'url', 'group', 'privacy']);
            break;
        case 'AddMembership':
            soapEnvelope.addToPayload(opt, ['user', 'membershipInfo', 'group', 'privacy']);
            break;
        case 'AddPinnedLink':
            soapEnvelope.addToPayload(opt, ['user', 'name', 'url']);
            break;
        case 'CreateMemberGroup':
            soapEnvelope.addToPayload(opt, ['membershipInfo']);
            break;
        case 'CreateUserProfileByAccountName':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetCommonColleagues':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetCommonManager':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetCommonMemberships':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetInCommon':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetPropertyChoiceList':
            soapEnvelope.addToPayload(opt, ['propertyName']);
            break;
        case 'GetUserColleagues':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetUserLinks':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetUserMemberships':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetUserPinnedLinks':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'GetUserProfileByGuid':
            soapEnvelope.addToPayload(opt, ['guid']);
            break;
        case 'GetUserProfileByIndex':
            soapEnvelope.addToPayload(opt, ['index']);
            break;
        case 'GetUserProfileByName':
            // Note that this operation is inconsistent with the others, using AccountName rather than currentPerson
            if (typeof opt.accountName !== 'undefined' && opt.accountName.length > 0) {
                soapEnvelope.addToPayload(opt, [
                    ['AccountName', 'user']
                ]);
            }
            else {
                soapEnvelope.addToPayload(opt, ['AccountName']);
            }
            break;
        case 'GetUserProfileCount':
            break;
        case 'GetUserProfileSchema':
            break;
        case 'GetUserPropertyByAccountName':
            soapEnvelope.addToPayload(opt, ['user', 'propertyName']);
            break;
        case 'ModifyUserPropertyByAccountName':
            soapEnvelope.addToPayload(opt, ['user', 'newData']);
            break;
        case 'RemoveAllColleagues':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'RemoveAllLinks':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'RemoveAllMemberships':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'RemoveAllPinnedLinks':
            soapEnvelope.addToPayload(opt, ['user']);
            break;
        case 'RemoveColleague':
            soapEnvelope.addToPayload(opt, ['user', 'colleagueAccountName']);
            break;
        case 'RemoveLink':
            soapEnvelope.addToPayload(opt, ['user', 'id']);
            break;
        case 'RemoveMembership':
            soapEnvelope.addToPayload(opt, ['user', 'sourceInternal', 'sourceReference']);
            break;
        case 'RemovePinnedLink':
            soapEnvelope.addToPayload(opt, ['user', 'id']);
            break;
        case 'UpdateColleaguePrivacy':
            soapEnvelope.addToPayload(opt, ['user', 'colleagueAccountName', 'newPrivacy']);
            break;
        case 'UpdateLink':
            soapEnvelope.addToPayload(opt, ['user', 'data']);
            break;
        case 'UpdateMembershipPrivacy':
            soapEnvelope.addToPayload(opt, ['user', 'sourceInternal', 'sourceReference', 'newPrivacy']);
            break;
        case 'UpdatePinnedLink ':
            soapEnvelope.addToPayload(opt, ['user', 'data']);
            break;
        // VERSIONS OPERATIONS
        case 'DeleteAllVersions':
            soapEnvelope.addToPayload(opt, ['fileName']);
            break;
        case 'DeleteVersion':
            soapEnvelope.addToPayload(opt, ['fileName', 'fileVersion']);
            break;
        case 'GetVersions':
            soapEnvelope.addToPayload(opt, ['fileName']);
            break;
        case 'RestoreVersion':
            soapEnvelope.addToPayload(opt, ['fileName', 'fileVersion']);
            break;
        // VIEW OPERATIONS
        case 'AddView':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName', 'viewFields', 'query', 'rowLimit', 'rowLimit', 'type', 'makeViewDefault']);
            break;
        case 'DeleteView':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName']);
            break;
        case 'GetView':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName']);
            break;
        case 'GetViewCollection':
            soapEnvelope.addToPayload(opt, ['listName']);
            break;
        case 'GetViewHtml':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName']);
            break;
        case 'UpdateView':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName', 'viewProperties', 'query', 'viewFields', 'aggregations', 'formats', 'rowLimit']);
            break;
        case 'UpdateViewHtml':
            soapEnvelope.addToPayload(opt, ['listName', 'viewName', 'viewProperties', 'toolbar', 'viewHeader', 'viewBody', 'viewFooter', 'viewEmpty', 'rowLimitExceeded',
                'query', 'viewFields', 'aggregations', 'formats', 'rowLimit'
            ]);
            break;
        // WEBPARTPAGES OPERATIONS
        case 'AddWebPart':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'webPartXml', 'storage']);
            break;
        case 'AddWebPartToZone':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'webPartXml', 'storage', 'zoneId', 'zoneIndex']);
            break;
        case 'GetWebPart2':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'storageKey', 'storage', 'behavior']);
            break;
        case 'GetWebPartPage':
            soapEnvelope.addToPayload(opt, ['documentName', 'behavior']);
            break;
        case 'GetWebPartProperties':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'storage']);
            break;
        case 'GetWebPartProperties2':
            soapEnvelope.addToPayload(opt, ['pageUrl', 'storage', 'behavior']);
            break;
        // WEBS OPERATIONS
        case 'Webs.CreateContentType':
            soapEnvelope.addToPayload(opt, ['displayName', 'parentType', 'newFields', 'contentTypeProperties']);
            break;
        case 'GetColumns':
            soapEnvelope.addToPayload(opt, ['webUrl']);
            break;
        case 'GetContentType':
            soapEnvelope.addToPayload(opt, ['contentTypeId']);
            break;
        case 'GetContentTypes':
            break;
        case 'GetCustomizedPageStatus':
            soapEnvelope.addToPayload(opt, ['fileUrl']);
            break;
        case 'GetListTemplates':
            break;
        case 'GetObjectIdFromUrl':
            soapEnvelope.addToPayload(opt, ['objectUrl']);
            break;
        case 'GetWeb':
            soapEnvelope.addToPayload(opt, [
                ['webUrl', 'webURL']
            ]);
            break;
        case 'GetWebCollection':
            break;
        case 'GetAllSubWebCollection':
            break;
        case 'UpdateColumns':
            soapEnvelope.addToPayload(opt, ['newFields', 'updateFields', 'deleteFields']);
            break;
        case 'Webs.UpdateContentType':
            soapEnvelope.addToPayload(opt, ['contentTypeId', 'contentTypeProperties', 'newFields', 'updateFields', 'deleteFields']);
            break;
        case 'WebUrlFromPageUrl':
            soapEnvelope.addToPayload(opt, [
                ['pageUrl', 'pageURL']
            ]);
            break;
        // WORKFLOW OPERATIONS
        case 'AlterToDo':
            soapEnvelope.addToPayload(opt, ['item', 'todoId', 'todoListId', 'taskData']);
            break;
        case 'ClaimReleaseTask':
            soapEnvelope.addToPayload(opt, ['item', 'taskId', 'listId', 'fClaim']);
            break;
        case 'GetTemplatesForItem':
            soapEnvelope.addToPayload(opt, ['item']);
            break;
        case 'GetToDosForItem':
            soapEnvelope.addToPayload(opt, ['item']);
            break;
        case 'GetWorkflowDataForItem':
            soapEnvelope.addToPayload(opt, ['item']);
            break;
        case 'GetWorkflowTaskData':
            soapEnvelope.addToPayload(opt, ['item', 'listId', 'taskId']);
            break;
        case 'StartWorkflow':
            soapEnvelope.addToPayload(opt, ['item', 'templateId', 'workflowParameters']);
            break;
        default:
            break;
    }
    // Glue together the pieces of the SOAP message
    var msg = soapEnvelope.header + soapEnvelope.opheader + soapEnvelope.payload + soapEnvelope.opfooter + soapEnvelope.footer;
    var soapAction = constants_1.WebServiceOperationConstants[opt.operation][1] ? SOAPAction : false;
    return {
        msg: msg,
        SOAPEnvelope: soapEnvelope,
        SOAPAction: soapAction
    };
}
exports.generateXMLComponents = generateXMLComponents;
// The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
// the SiteData prefix on their names. This function replaces that name with the right name in the soapEnvelope.
function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
    var siteDataOp = siteDataOperation.substring(8);
    SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
    SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
    return SOAPEnvelope;
} // End of function siteDataFixSOAPEnvelope
/* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
// Escape column values
function escapeColumnValue(s) {
    if (typeof s === 'string') {
        return s.replace(/&(?![a-zA-Z]{1,8};)/g, '&amp;');
    }
    else {
        return s;
    }
}
function getQueryServiceHeader(operation) {
    return "<" + operation + " xmlns=\"" + queryService + "\">";
}
function getQueryServiceAction(operation) {
    return queryService + "/" + operation;
}
//# sourceMappingURL=spservices.service.js.map