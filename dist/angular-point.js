/// <reference path="../typings/ap.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
var ap;
(function (ap) {
    'use strict';
    //TODO: Remove dependency on toastr
    /** Check to see if dependent modules exist */
    try {
        angular.module('toastr');
    }
    catch (e) {
        /** Toastr wasn't found so redirect all toastr requests to $log */
        angular.module('toastr', [])
            .factory('toastr', function ($log) {
            return {
                error: $log.error,
                info: $log.info,
                success: $log.info,
                warning: $log.warn
            };
        });
    }
    /**
     * @ngdoc overview
     * @module
     * @name angularPoint
     * @description
     * This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint
     * functionality in your project.
     * @installModule
     */
    angular.module('angularPoint', [
        'toastr'
    ])
        .run(function (apListItemFactory, apModelFactory) {
    });
})(ap || (ap = {}));

/// <reference path="app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    angular.module('angularPoint')
        .config(Config);
    function Config(apConfig) {
        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
    }
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
/**
 * @ngdoc object
 * @name angularPoint.apConfig
 * @description
 * Basic config for the application (unique for each environment).  Update to change for your environment.
 *
 * @param {string} appTitle Name of the application in case you need to reference.
 * @param {boolean} debug Determines if we should show debug code.
 * @param {string} defaultUrl Automatically sets the defaultUrl for web service calls so we don't need to make the
 * initial blocking call by SPServices.
 * @param {string} [defaultQueryName='primary'] The name that a query is registered with on a model if a name isn't specified.
 * @param {string} [firebaseUrl] Necessary if you're using apSyncService.  Look there for more details.
 * @param {boolean} [offline] Automatically set based on the URL of the site.  Pulls offline XML when hosted locally.
 * @param {string} [offlineXML='dev/'] The location to look for offline xml files.
 * @example
 * <h4>Default Configuration</h4>
 * <pre>
 * .constant('apConfig', {
 *     appTitle: 'Angular-Point',
 *     debugEnabled: true,
 *     firebaseURL: "The optional url of your firebase source",
 *     offline: window.location.href.indexOf('localhost') > -1 ||
 *         window.location.href.indexOf('http://0.') > -1 ||
 *         window.location.href.indexOf('http://10.') > -1 ||
 *         window.location.href.indexOf('http://192.') > -1
 * })
 * </pre>
 *
 * <h4>To Override</h4>
 * <pre>
 * angular.module('MyApp', ['my dependencies'])
 *      .config(function ($stateProvider, $urlRouterProvider) {
 *          //My routes
 *      })
 *      .run(function(apConfig) {
 *          //To set the default site root
 *          apConfig.defaultUrl =
 *            '//sharepoint.myserver.com/siteRoot';
 *
 *          //To set the default location to look for
 *          //offline xml files.
 *          apConfig.offlineXML = 'myCachedQueries/';
 *      });
 * </pre>
 */
var ap;
(function (ap) {
    'use strict';
    ap.APConfig = {
        appTitle: 'Angular-Point',
        debug: false,
        defaultQueryName: 'primary',
        defaultUrl: '',
        environment: 'production',
        firebaseURL: "The optional url of your firebase source",
        offline: window.location.href.indexOf('localhost') > -1 ||
            window.location.href.indexOf('http://0.') > -1 ||
            window.location.href.indexOf('http://10.') > -1 ||
            window.location.href.indexOf('http://127.') > -1 ||
            window.location.href.indexOf('http://192.') > -1,
        offlineXML: 'dev/'
    };
    angular
        .module('angularPoint')
        .constant('apConfig', ap.APConfig);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    ap.DefaultFields = [
        { staticName: 'ID', objectType: 'Counter', mappedName: 'id', readOnly: true },
        { staticName: 'Modified', objectType: 'DateTime', mappedName: 'modified', readOnly: true },
        { staticName: 'Created', objectType: 'DateTime', mappedName: 'created', readOnly: true },
        { staticName: 'Author', objectType: 'User', mappedName: 'author', readOnly: true },
        { staticName: 'Editor', objectType: 'User', mappedName: 'editor', readOnly: true },
        { staticName: 'PermMask', objectType: 'Mask', mappedName: 'permMask', readOnly: true },
        { staticName: 'UniqueId', objectType: 'String', mappedName: 'uniqueId', readOnly: true },
        { staticName: 'FileRef', objectType: 'Lookup', mappedName: 'fileRef', readOnly: true }
    ];
    /**
     * @ngdoc object
     * @name angularPoint.apDefaultFields
     * @description
     * Read only fields that should be included in all lists
     */
    angular
        .module('angularPoint')
        .constant('apDefaultFields', ap.DefaultFields);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    ap.DefaultListItemQueryOptions = '' +
        '<QueryOptions>' +
        '   <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>' +
        '   <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>' +
        '   <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>' +
        '   <ExpandUserField>FALSE</ExpandUserField>' +
        '</QueryOptions>';
    angular
        .module('angularPoint')
        .constant('apDefaultListItemQueryOptions', ap.DefaultListItemQueryOptions);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    angular.module('angularPoint')
        .constant('_', _);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
//  apWebServiceOperationConstants.OpName = [WebService, needs_SOAPAction];
//      OpName              The name of the Web Service operation -> These names are unique
//      WebService          The name of the WebService this operation belongs to
//      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the setRequestHeaderfunction.
//                          true if the operation does a write, else false
var ap;
(function (ap) {
    'use strict';
    ap.WebServiceOperationConstants = {
        GetAlerts: ['Alerts', false],
        DeleteAlerts: ['Alerts', true],
        Mode: ['Authentication', false],
        Login: ['Authentication', false],
        CopyIntoItems: ['Copy', true],
        CopyIntoItemsLocal: ['Copy', true],
        GetItem: ['Copy', false],
        GetForm: ['Forms', false],
        GetFormCollection: ['Forms', false],
        AddAttachment: ['Lists', true],
        AddDiscussionBoardItem: ['Lists', true],
        AddList: ['Lists', true],
        AddListFromFeature: ['Lists', true],
        ApplyContentTypeToList: ['Lists', true],
        CheckInFile: ['Lists', true],
        CheckOutFile: ['Lists', true],
        CreateContentType: ['Webs', true],
        DeleteAttachment: ['Lists', true],
        DeleteContentType: ['Lists', true],
        DeleteContentTypeXmlDocument: ['Lists', true],
        DeleteList: ['Lists', true],
        GetAttachmentCollection: ['Lists', false],
        GetList: ['Lists', false],
        GetListAndView: ['Lists', false],
        GetListCollection: ['Lists', false],
        GetListContentType: ['Lists', false],
        GetListContentTypes: ['Lists', false],
        GetListItemChanges: ['Lists', false],
        GetListItemChangesSinceToken: ['Lists', false],
        GetListItems: ['Lists', false],
        GetVersionCollection: ['Lists', false],
        UndoCheckOut: ['Lists', true],
        UpdateContentType: ['Webs', true],
        UpdateContentTypesXmlDocument: ['Lists', true],
        UpdateContentTypeXmlDocument: ['Lists', true],
        UpdateList: ['Lists', true],
        UpdateListItems: ['Lists', true],
        AddMeeting: ['Meetings', true],
        CreateWorkspace: ['Meetings', true],
        RemoveMeeting: ['Meetings', true],
        SetWorkSpaceTitle: ['Meetings', true],
        ResolvePrincipals: ['People', false],
        SearchPrincipals: ['People', false],
        AddPermission: ['Permissions', true],
        AddPermissionCollection: ['Permissions', true],
        GetPermissionCollection: ['Permissions', true],
        RemovePermission: ['Permissions', true],
        RemovePermissionCollection: ['Permissions', true],
        UpdatePermission: ['Permissions', true],
        GetLinks: ['PublishedLinksService', true],
        GetPortalSearchInfo: ['Search', false],
        GetQuerySuggestions: ['Search', false],
        GetSearchMetadata: ['Search', false],
        Query: ['Search', false],
        QueryEx: ['Search', false],
        Registration: ['Search', false],
        Status: ['Search', false],
        SendClientScriptErrorReport: ['SharePointDiagnostics', true],
        GetAttachments: ['SiteData', false],
        EnumerateFolder: ['SiteData', false],
        SiteDataGetList: ['SiteData', false],
        SiteDataGetListCollection: ['SiteData', false],
        SiteDataGetSite: ['SiteData', false],
        SiteDataGetSiteUrl: ['SiteData', false],
        SiteDataGetWeb: ['SiteData', false],
        CreateWeb: ['Sites', true],
        DeleteWeb: ['Sites', true],
        GetSite: ['Sites', false],
        GetSiteTemplates: ['Sites', false],
        AddComment: ['SocialDataService', true],
        AddTag: ['SocialDataService', true],
        AddTagByKeyword: ['SocialDataService', true],
        CountCommentsOfUser: ['SocialDataService', false],
        CountCommentsOfUserOnUrl: ['SocialDataService', false],
        CountCommentsOnUrl: ['SocialDataService', false],
        CountRatingsOnUrl: ['SocialDataService', false],
        CountTagsOfUser: ['SocialDataService', false],
        DeleteComment: ['SocialDataService', true],
        DeleteRating: ['SocialDataService', true],
        DeleteTag: ['SocialDataService', true],
        DeleteTagByKeyword: ['SocialDataService', true],
        DeleteTags: ['SocialDataService', true],
        GetAllTagTerms: ['SocialDataService', false],
        GetAllTagTermsForUrlFolder: ['SocialDataService', false],
        GetAllTagUrls: ['SocialDataService', false],
        GetAllTagUrlsByKeyword: ['SocialDataService', false],
        GetCommentsOfUser: ['SocialDataService', false],
        GetCommentsOfUserOnUrl: ['SocialDataService', false],
        GetCommentsOnUrl: ['SocialDataService', false],
        GetRatingAverageOnUrl: ['SocialDataService', false],
        GetRatingOfUserOnUrl: ['SocialDataService', false],
        GetRatingOnUrl: ['SocialDataService', false],
        GetRatingsOfUser: ['SocialDataService', false],
        GetRatingsOnUrl: ['SocialDataService', false],
        GetSocialDataForFullReplication: ['SocialDataService', false],
        GetTags: ['SocialDataService', true],
        GetTagsOfUser: ['SocialDataService', true],
        GetTagTerms: ['SocialDataService', true],
        GetTagTermsOfUser: ['SocialDataService', true],
        GetTagTermsOnUrl: ['SocialDataService', true],
        GetTagUrlsOfUser: ['SocialDataService', true],
        GetTagUrlsOfUserByKeyword: ['SocialDataService', true],
        GetTagUrls: ['SocialDataService', true],
        GetTagUrlsByKeyword: ['SocialDataService', true],
        SetRating: ['SocialDataService', true],
        UpdateComment: ['SocialDataService', true],
        SpellCheck: ['SpellCheck', false],
        AddTerms: ['TaxonomyClientService', true],
        GetChildTermsInTerm: ['TaxonomyClientService', false],
        GetChildTermsInTermSet: ['TaxonomyClientService', false],
        GetKeywordTermsByGuids: ['TaxonomyClientService', false],
        GetTermsByLabel: ['TaxonomyClientService', false],
        GetTermSets: ['TaxonomyClientService', false],
        AddGroup: ['usergroup', true],
        AddGroupToRole: ['usergroup', true],
        AddRole: ['usergroup', true],
        AddRoleDef: ['usergroup', true],
        AddUserCollectionToGroup: ['usergroup', true],
        AddUserCollectionToRole: ['usergroup', true],
        AddUserToGroup: ['usergroup', true],
        AddUserToRole: ['usergroup', true],
        GetAllUserCollectionFromWeb: ['usergroup', false],
        GetGroupCollection: ['usergroup', false],
        GetGroupCollectionFromRole: ['usergroup', false],
        GetGroupCollectionFromSite: ['usergroup', false],
        GetGroupCollectionFromUser: ['usergroup', false],
        GetGroupCollectionFromWeb: ['usergroup', false],
        GetGroupInfo: ['usergroup', false],
        GetRoleCollection: ['usergroup', false],
        GetRoleCollectionFromGroup: ['usergroup', false],
        GetRoleCollectionFromUser: ['usergroup', false],
        GetRoleCollectionFromWeb: ['usergroup', false],
        GetRoleInfo: ['usergroup', false],
        GetRolesAndPermissionsForCurrentUser: ['usergroup', false],
        GetRolesAndPermissionsForSite: ['usergroup', false],
        GetUserCollection: ['usergroup', false],
        GetUserCollectionFromGroup: ['usergroup', false],
        GetUserCollectionFromRole: ['usergroup', false],
        GetUserCollectionFromSite: ['usergroup', false],
        GetUserCollectionFromWeb: ['usergroup', false],
        GetUserInfo: ['usergroup', false],
        GetUserLoginFromEmail: ['usergroup', false],
        RemoveGroup: ['usergroup', true],
        RemoveGroupFromRole: ['usergroup', true],
        RemoveRole: ['usergroup', true],
        RemoveUserCollectionFromGroup: ['usergroup', true],
        RemoveUserCollectionFromRole: ['usergroup', true],
        RemoveUserCollectionFromSite: ['usergroup', true],
        RemoveUserFromGroup: ['usergroup', true],
        RemoveUserFromRole: ['usergroup', true],
        RemoveUserFromSite: ['usergroup', true],
        RemoveUserFromWeb: ['usergroup', true],
        UpdateGroupInfo: ['usergroup', true],
        UpdateRoleDefInfo: ['usergroup', true],
        UpdateRoleInfo: ['usergroup', true],
        UpdateUserInfo: ['usergroup', true],
        AddColleague: ['UserProfileService', true],
        AddLink: ['UserProfileService', true],
        AddMembership: ['UserProfileService', true],
        AddPinnedLink: ['UserProfileService', true],
        CreateMemberGroup: ['UserProfileService', true],
        CreateUserProfileByAccountName: ['UserProfileService', true],
        GetCommonColleagues: ['UserProfileService', false],
        GetCommonManager: ['UserProfileService', false],
        GetCommonMemberships: ['UserProfileService', false],
        GetInCommon: ['UserProfileService', false],
        GetPropertyChoiceList: ['UserProfileService', false],
        GetUserColleagues: ['UserProfileService', false],
        GetUserLinks: ['UserProfileService', false],
        GetUserMemberships: ['UserProfileService', false],
        GetUserPinnedLinks: ['UserProfileService', false],
        GetUserProfileByGuid: ['UserProfileService', false],
        GetUserProfileByIndex: ['UserProfileService', false],
        GetUserProfileByName: ['UserProfileService', false],
        GetUserProfileCount: ['UserProfileService', false],
        GetUserProfileSchema: ['UserProfileService', false],
        GetUserPropertyByAccountName: ['UserProfileService', false],
        ModifyUserPropertyByAccountName: ['UserProfileService', true],
        RemoveAllColleagues: ['UserProfileService', true],
        RemoveAllLinks: ['UserProfileService', true],
        RemoveAllMemberships: ['UserProfileService', true],
        RemoveAllPinnedLinks: ['UserProfileService', true],
        RemoveColleague: ['UserProfileService', true],
        RemoveLink: ['UserProfileService', true],
        RemoveMembership: ['UserProfileService', true],
        RemovePinnedLink: ['UserProfileService', true],
        UpdateColleaguePrivacy: ['UserProfileService', true],
        UpdateLink: ['UserProfileService', true],
        UpdateMembershipPrivacy: ['UserProfileService', true],
        UpdatePinnedLink: ['UserProfileService', true],
        DeleteAllVersions: ['Versions', true],
        DeleteVersion: ['Versions', true],
        GetVersions: ['Versions', false],
        RestoreVersion: ['Versions', true],
        AddView: ['Views', true],
        DeleteView: ['Views', true],
        GetView: ['Views', false],
        GetViewHtml: ['Views', false],
        GetViewCollection: ['Views', false],
        UpdateView: ['Views', true],
        UpdateViewHtml: ['Views', true],
        AddWebPart: ['WebPartPages', true],
        AddWebPartToZone: ['WebPartPages', true],
        GetWebPart2: ['WebPartPages', false],
        GetWebPartPage: ['WebPartPages', false],
        GetWebPartProperties: ['WebPartPages', false],
        GetWebPartProperties2: ['WebPartPages', false],
        GetColumns: ['Webs', false],
        GetContentType: ['Webs', false],
        GetContentTypes: ['Webs', false],
        GetCustomizedPageStatus: ['Webs', false],
        GetListTemplates: ['Webs', false],
        GetObjectIdFromUrl: ['Webs', false],
        GetWeb: ['Webs', false],
        GetWebCollection: ['Webs', false],
        GetAllSubWebCollection: ['Webs', false],
        UpdateColumns: ['Webs', true],
        WebUrlFromPageUrl: ['Webs', false],
        AlterToDo: ['Workflow', true],
        ClaimReleaseTask: ['Workflow', true],
        GetTemplatesForItem: ['Workflow', false],
        GetToDosForItem: ['Workflow', false],
        GetWorkflowDataForItem: ['Workflow', false],
        GetWorkflowTaskData: ['Workflow', false],
        StartWorkflow: ['Workflow', true]
    };
    angular.module('angularPoint')
        .constant('apWebServiceOperationConstants', ap.WebServiceOperationConstants);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    ap.XMLFieldAttributeTypes = {
        Decimals: 'Number',
        EnforceUniqueValues: 'Boolean',
        Filterable: 'Boolean',
        FromBaseType: 'Boolean',
        Hidden: 'Boolean',
        Indexed: 'Boolean',
        NumLines: 'Number',
        ReadOnly: 'Boolean',
        Required: 'Boolean',
        Sortable: 'Boolean'
    };
    /**
     * @ngdoc object
     * @name angularPoint.apXMLListAttributeTypes
     * @description Constant object map which contains many common XML attributes found on a field definition with their
     * corresponding type.
     */
    angular
        .module('angularPoint')
        .constant('apXMLFieldAttributeTypes', ap.XMLFieldAttributeTypes);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    ap.XMLListAttributeTypes = {
        BaseType: 'Number',
        ServerTemplate: 'Number',
        Created: 'DateTime',
        Modified: 'DateTime',
        LastDeleted: 'DateTime',
        Version: 'Number',
        ThumbnailSize: 'Number',
        WebImageWidth: 'Number',
        WebImageHeight: 'Number',
        Flags: 'Number',
        ItemCount: 'Number',
        ReadSecurity: 'Number',
        WriteSecurity: 'Number',
        Author: 'Number',
        MajorWithMinorVersionsLimit: 'Number',
        HasUniqueScopes: 'Boolean',
        NoThrottleListOperations: 'Boolean',
        HasRelatedLists: 'Boolean',
        AllowDeletion: 'Boolean',
        AllowMultiResponses: 'Boolean',
        EnableAttachments: 'Boolean',
        EnableModeration: 'Boolean',
        EnableVersioning: 'Boolean',
        HasExternalDataSource: 'Boolean',
        Hidden: 'Boolean',
        MultipleDataList: 'Boolean',
        Ordered: 'Boolean',
        ShowUser: 'Boolean',
        EnablePeopleSelector: 'Boolean',
        EnableResourceSelector: 'Boolean',
        EnableMinorVersion: 'Boolean',
        RequireCheckout: 'Boolean',
        ThrottleListOperations: 'Boolean',
        ExcludeFromOfflineClient: 'Boolean',
        EnableFolderCreation: 'Boolean',
        IrmEnabled: 'Boolean',
        IsApplicationList: 'Boolean',
        PreserveEmptyValues: 'Boolean',
        StrictTypeCoercion: 'Boolean',
        EnforceDataValidation: 'Boolean',
        MaxItemsPerThrottledOperation: 'Number'
    };
    /**
     * @ngdoc object
     * @name angularPoint.apXMLListAttributeTypes
     * @description Constant object map which contains many common XML attributes found on a list definition with their
     * corresponding type.
     */
    angular
        .module('angularPoint')
        .constant('apXMLListAttributeTypes', ap.XMLListAttributeTypes);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var CamlFactory = (function () {
        function CamlFactory() {
        }
        /**
         * @ngdoc function
         * @name angularPoint.apCamlFactory:camlContainsQuery
         * @methodOf angularPoint.apCamlFactory
         * @parameter {object[]} fieldDefinitionsArray Array of fields to search for a given search string.
         * @parameter {string} searchString String of text to search records for.
         * @description
         * Returns a combination of selectors using CAML '<Or></Or>' elements
         * @returns {string} Caml select string.
         * @example
         * <pre>
         *
         * var testHTML = {objectType: 'HTML', staticName: 'HTML'};
         * var testJSON = {objectType: 'JSON', staticName: 'JSON'};
         * var testText = {objectType: 'Text', staticName: 'Text'};
         * var testText2 = {objectType: 'Text', staticName: 'Text'};
         *
         * var testCaml = camlContainsQuery([testHTML, testText, testJSON, testText2], 'Test Query');
         * console.log(testCaml);
         *
         * //Returns
         * <Or><Contains><FieldRef Name=\"HTML\" /><Value Type=\"Text\"><![CDATA[Test Query]]>
         * </Value></Contains><Or><Contains><FieldRef Name=\"Text\" /><Value Type=\"Text\">Test Query</Value>
         * </Contains><Or><Contains><FieldRef Name=\"JSON\" /><Value Type=\"Text\"><![CDATA[Test Query]]>
         * </Value></Contains><Contains><FieldRef Name=\"Text\" /><Value Type=\"Text\">Test Query</Value>
         * </Contains></Or></Or></Or>
         * </pre>
         */
        CamlFactory.prototype.camlContainsQuery = function (fieldDefinitionsArray, searchString) {
            var _this = this;
            var selectStatements = [];
            /** Create a select statement for each field */
            _.each(fieldDefinitionsArray, function (fieldDefinition, definitionIndex) {
                selectStatements.push(_this.createCamlContainsSelector(fieldDefinition, searchString));
            });
            return this.chainCamlSelects(selectStatements, 'And');
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCamlFactory:chainCamlSelects
         * @methodOf angularPoint.apCamlFactory
         * @description
         * Used to combine multiple caml selectors into a single CAML query string wrapped properly.
         * @param {object[]} selectStatements An array of select statements to wrap in "<Or>".
         * @param {string} joinType Valid caml join type ('Or', 'And', ...).
         * @returns {string} CAML query string.
         */
        CamlFactory.prototype.chainCamlSelects = function (selectStatements, joinType) {
            var camlQuery = '', camlQueryClosure = '';
            _.each(selectStatements, function (statement, statementIndex) {
                /** Add an or clause if we still have additional fields to process */
                if (statementIndex < selectStatements.length - 1) {
                    camlQuery += '<' + joinType + '>';
                    camlQueryClosure = '</' + joinType + '>' + camlQueryClosure;
                }
                camlQuery += statement;
            });
            return camlQuery + camlQueryClosure;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCamlFactory:createCamlContainsSelector
         * @methodOf angularPoint.apCamlFactory
         * @description
         * Escapes characters that SharePoint gets upset about based on field type.
         * @example
         * <pre>
         * var testHTML = {objectType: 'HTML', staticName: 'HTML'};
         *
         * var testCaml = createCamlContainsSelector(testHTML, 'Test Query');
         * console.log(testCaml);
         *
         * //Returns
         * <Contains>
         *   <FieldRef Name=\"HTML\" />
         *   <Value Type=\"Text\"><![CDATA[Test Query]]></Value>
         * </Contains>
         * </pre>
         */
        CamlFactory.prototype.createCamlContainsSelector = function (fieldDefinition, searchString) {
            var camlSelector;
            switch (fieldDefinition.objectType) {
                case 'HTML':
                case 'JSON':
                    camlSelector = '' +
                        '<Contains>' +
                        '<FieldRef Name="' + fieldDefinition.staticName + '" />' +
                        /** Use CDATA wrapper to escape [&, <, > ] */
                        '<Value Type="Text"><![CDATA[' + searchString + ']]></Value>' +
                        '</Contains>';
                    break;
                default:
                    camlSelector = '' +
                        '<Contains>' +
                        '<FieldRef Name="' + fieldDefinition.staticName + '" />' +
                        '<Value Type="Text">' + searchString + '</Value>' +
                        '</Contains>';
            }
            return camlSelector;
        };
        return CamlFactory;
    })();
    ap.CamlFactory = CamlFactory;
    /**
     * @ngdoc function
     * @name angularPoint.apCamlFactory
     * @description
     * Tools to assist with the creation of CAML queries.
     *
     */
    angular.module('angularPoint')
        .service('apCamlFactory', CamlFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var apFieldService, apUtilityService;
    /**
     * @ngdoc object
     * @name Field
     * @description
     * Defined in the MODEL.list.fieldDefinitions array.  Each field definition object maps an internal field
     * in a SharePoint list/library to a JavaScript object using the internal SharePoint field name, the field
     * type, and the desired JavaScript property name to add onto the parsed list item object. Ignore shown usage,
     * each field definition is just an object within the fieldDefinitions array.
     * @param {object} obj Field definition.
     * @param {string} obj.staticName The actual SharePoint field name.
     * @param {string} [obj.objectType='Text']
     * <dl>
     *     <dt>Boolean</dt>
     *     <dd>Used to store a TRUE/FALSE value (stored in SharePoint as 0 or 1).</dd>
     *     <dt>Calc</dt>
     *     <dd>";#" Delimited String: The first value will be the calculated column value
     *     type, the second will be the value</dd>
     *     <dt>Choice</dt>
     *     <dd>Simple text string but when processing the initial list definition, we
     *     look for a Choices XML element within the field definition and store each
     *     value.  We can then retrieve the valid Choices with one of the following:
     *     ```var fieldDefinition = LISTITEM.getFieldDefinition('CHOICE_FIELD_NAME');```
     *                                      or
     *     ```var fieldDefinition = MODELNAME.getFieldDefinition('CHOICE_FIELD_NAME');```
     *     ```var choices = fieldDefinition.Choices;```

     *     </dd>
     *     <dt>Counter</dt>
     *     <dd>Same as Integer. Generally used only for the internal ID field. Its integer
     *     value is set automatically to be unique with respect to every other item in the
     *     current list. The Counter type is always read-only and cannot be set through a
     *     form post.</dd>
     *     <dt>Currency</dt>
     *     <dd>Floating point number.</dd>
     *     <dt>DateTime</dt>
     *     <dd>Replace dashes with slashes and the "T" deliminator with a space if found.  Then
     *     converts into a valid JS date object.</dd>
     *     <dt>Float</dt>
     *     <dd>Floating point number.</dd>
     *     <dt>HTML</dt>
     *     <dd>```_.unescape(STRING)```</dd>
     *     <dt>Integer</dt>
     *     <dd>Parses the string to a base 10 int.</dd>
     *     <dt>JSON</dt>
     *     <dd>Parses JSON if valid and converts into a a JS object.  If not valid, an error is
     *     thrown with additional info on specifically what is invalid.</dd>
     *     <dt>Lookup</dt>
     *     <dd>Passes string to Lookup constructor where it is broken into an object containing
     *     a "lookupValue" and "lookupId" attribute.  Inherits additional prototype methods from
     *     Lookup.  See [Lookup](#/api/Lookup) for more information.
     *     </dd>
     *     <dt>LookupMulti</dt>
     *     <dd>Converts multiple delimited ";#" strings into an array of Lookup objects.</dd>
     *     <dt>MultiChoice</dt>
     *     <dd>Converts delimited ";#" string into an array of strings representing each of the
     *     selected choices.  Similar to the single "Choice", the XML Choices are stored in the
     *     field definition after the initial call is returned from SharePoint so we can reference
     *     later.
     *     </dd>
     *     <dt>Number</dt>
     *     <dd>Treats as a float.</dd>
     *     <dt>Text</dt>
     *     <dd>**Default** No processing of the text string from XML.</dd>
     *     <dt>User</dt>
     *     <dd>Similar to Lookup but uses the "User" prototype as a constructor to convert into a
     *     User object with "lookupId" and "lookupValue" attributes.  The lookupId is the site collection
     *     ID for the user and the lookupValue is typically the display name.
     *     See [User](#/api/User) for more information.
     *     </dd>
     *     <dt>UserMulti</dt>
     *     <dd>Parses delimited string to returns an array of User objects.</dd>
     * </dl>
     * @param {string} obj.mappedName The attribute name we'd like to use
     * for this field on the newly created JS object.
     * @param {boolean} [obj.readOnly=false] When saving, we only push fields
     * that are mapped and not read only.
     * @param {boolean} [obj.required=false] Allows us to validate the field to ensure it is valid based
     * on field type.
     * @returns {object} Field
     *
     * @requires angularPoint.apFieldFactory
     * @constructor
     */
    var FieldDefinition = (function () {
        function FieldDefinition(obj) {
            var self = this;
            var defaults = {
                readOnly: false,
                objectType: 'Text'
            };
            _.assign(self, defaults, obj);
            self.displayName = self.displayName ? self.displayName : apUtilityService.fromCamelCase(self.mappedName);
            /** Deprecated internal name and replace with staticName but maintain compatibility */
            self.staticName = self.staticName || self.internalName;
        }
        /**
         * @ngdoc function
         * @name Field:getDefaultValueForType
         * @methodOf Field
         * @description
         * Returns an object defining a specific field type
         * @returns {object} { defaultValue: '...':string, staticMock: '...':string, dynamicMock: ...:Function}
         */
        FieldDefinition.prototype.getDefinition = function () {
            return apFieldService.getDefinition(this.objectType);
        };
        /**
         * @ngdoc function
         * @name Field:getDefaultValueForType
         * @methodOf Field
         * @description
         * Can return mock data appropriate for the field type, by default it dynamically generates data but
         * the staticValue param will instead return a hard coded type specific value.
         */
        FieldDefinition.prototype.getDefaultValueForType = function () {
            return apFieldService.getDefaultValueForType(this.objectType);
        };
        /**
         * @ngdoc function
         * @name Field:getMockData
         * @methodOf Field
         * @param {object} [options] Optional params passed to apFieldService.getMockData.
         * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
         * @returns {*} mockData
         */
        FieldDefinition.prototype.getMockData = function (options) {
            return apFieldService.getMockData(this.objectType, options);
        };
        return FieldDefinition;
    })();
    ap.FieldDefinition = FieldDefinition;
    /**
     * @ngdoc service
     * @name angularPoint.apFieldFactory
     * @description
     * Contains the Field constructor and prototype definitions.
     * @property {constructor} Field The Field constructor.
     *
     * @requires angularPoint.apFieldService
     * @requires angularPoint.apUtilityService
     *
     */
    var FieldFactory = (function () {
        function FieldFactory(_apFieldService_, _apUtilityService_) {
            this.FieldDefinition = FieldDefinition;
            apFieldService = _apFieldService_;
            apUtilityService = _apUtilityService_;
        }
        FieldFactory.$inject = ['apFieldService', 'apUtilityService'];
        return FieldFactory;
    })();
    ap.FieldFactory = FieldFactory;
    angular
        .module('angularPoint')
        .service('apFieldFactory', FieldFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    /**
     * @ngdoc object
     * @name IndexedCache
     * @description
     * Cache constructor that is extended to make it easier to work with via prototype methods.  Located in
     * apIndexedCacheFactory.
     * @param {object} [object] Optionally extend new cache with provided object.
     * @requires angularPoint.apIndexedCacheFactory
     * @constructor
     */
    var IndexedCache = (function () {
        function IndexedCache(object) {
            if (object) {
                _.assign(this, object);
            }
        }
        /**
         * @ngdoc function
         * @name IndexedCache.addEntity
         * @methodOf IndexedCache
         * @description
         * Adds a new key to the cache if not already there with a value of the new listItem.
         * @param {object} listItem Entity to add to the cache.
         */
        IndexedCache.prototype.addEntity = function (listItem) {
            if (_.isObject(listItem) && !!listItem.id) {
                /** Only add the listItem to the cache if it's not already there */
                if (!this[listItem.id]) {
                    this[listItem.id.toString()] = listItem;
                }
            }
            else {
                throw new Error('A valid listItem wasn\'t found: ' + JSON.stringify(listItem));
            }
        };
        /**
         * @ngdoc function
         * @name IndexedCache.clear
         * @methodOf IndexedCache
         * @description
         * Clears all cached elements from the containing cache object.
         */
        IndexedCache.prototype.clear = function () {
            var _this = this;
            _.each(this, function (listItem, key) { return delete _this[key]; });
        };
        /**
         * @ngdoc function
         * @name IndexedCache.count
         * @methodOf IndexedCache
         * @description
         * Returns the number of entities in the cache.
         * @returns {number} Number of entities in the cache.
         */
        IndexedCache.prototype.count = function () {
            return this.keys().length;
        };
        /**
         * @ngdoc function
         * @name IndexedCache.first
         * @methodOf IndexedCache
         * @description
         * Returns the first listItem in the index (smallest ID).
         * @returns {object} First listItem in cache.
         */
        IndexedCache.prototype.first = function () {
            return this.nthEntity(0);
        };
        /**
         * @ngdoc function
         * @name IndexedCache.keys
         * @methodOf IndexedCache
         * @description
         * Returns the array of keys (listItem ID's) for the cache.
         * @returns {string[]} Array of listItem id's as strings.
         */
        IndexedCache.prototype.keys = function () {
            return _.keys(this);
        };
        /**
         * @ngdoc function
         * @name IndexedCache.last
         * @methodOf IndexedCache
         * @description
         * Returns the last listItem in the index (largest ID).
         * @returns {object} Last listItem in cache.
         */
        IndexedCache.prototype.last = function () {
            var keys = this.keys();
            return this[keys[keys.length - 1]];
        };
        /**
         * @ngdoc function
         * @name IndexedCache.nthEntity
         * @methodOf IndexedCache
         * @description
         * Based on the
         * @param {number} index The index of the item requested.
         * @returns {object} First listItem in cache.
         */
        IndexedCache.prototype.nthEntity = function (index) {
            var keys = this.keys();
            return this[keys[index]];
        };
        /**
         * @ngdoc function
         * @name IndexedCache.removeEntity
         * @methodOf IndexedCache
         * @description
         * Removes a listItem from the cache.
         * @param {object|number} listItem Entity to remove or ID of listItem to be removed.
         */
        IndexedCache.prototype.removeEntity = function (listItem) {
            if (_.isObject(listItem) && listItem.id && this[listItem.id]) {
                delete this[listItem.id];
            }
            else if (_.isNumber(listItem)) {
                /** Allow listItem ID to be used instead of then listItem */
                delete this[listItem];
            }
        };
        /**
         * @ngdoc function
         * @name IndexedCache.toArray
         * @methodOf IndexedCache
         * @description
         * Turns the cache object into an array of entities.
         * @returns {object[]} Returns the array of entities currently in the cache.
         */
        IndexedCache.prototype.toArray = function () {
            return _.toArray(this);
        };
        return IndexedCache;
    })();
    ap.IndexedCache = IndexedCache;
    /**
     * @ngdoc object
     * @name angularPoint.apIndexedCacheFactory
     * @description
     * Exposes the EntityFactory prototype and a constructor to instantiate a new Entity Factory in apCacheService.
     *
     */
    var IndexedCacheFactory = (function () {
        function IndexedCacheFactory() {
            this.IndexedCache = IndexedCache;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apIndexedCacheFactory:create
         * @methodOf angularPoint.apIndexedCacheFactory
         * @description
         * Instantiates and returns a new Indexed Cache.grunt
         */
        IndexedCacheFactory.prototype.create = function (overrides) {
            return new IndexedCache(overrides);
        };
        return IndexedCacheFactory;
    })();
    ap.IndexedCacheFactory = IndexedCacheFactory;
    angular.module('angularPoint')
        .service('apIndexedCacheFactory', IndexedCacheFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var apConfig, apDefaultFields, apFieldFactory;
    /**
     * @ngdoc object
     * @name List
     * @description
     * List Object Constructor.  This is handled automatically when creating a new model so there shouldn't be
     * any reason to manually call.
     * @param {object} config Initialization parameters.
     * @param {string} config.guid Unique SharePoint GUID for the list we'll be basing the model on
     * ex:'{4D74831A-42B2-4558-A67F-B0B5ADBC0EAC}'
     * @param {string} config.title Maps to the offline XML file in dev folder (no spaces)
     * ex: 'ProjectsList' so the offline XML file would be located at apConfig.offlineXML + 'ProjectsList.xml'
     * @param {object[]} [config.customFields] Mapping of SharePoint field names to the internal names we'll be using
     * in our application.  Also contains field type, readonly attribute, and any other non-standard settings.
     * <pre>
     * [
     *   {
         *       staticName: "Title",
         *       objectType: "Text",
         *       mappedName: "lastName",
         *       readOnly:false
         *   },
     *   {
         *       staticName: "FirstName",
         *       objectType: "Text",
         *       mappedName: "firstName",
         *       readOnly:false
         *   },
     *   {
         *       staticName: "Organization",
         *       objectType: "Lookup",
         *       mappedName: "organization",
         *       readOnly:false
         *   },
     *   {
         *       staticName: "Account",
         *       objectType: "User",
         *       mappedName: "account",
         *       readOnly:false
         *   },
     *   {
         *       staticName: "Details",
         *       objectType: "Text",
         *       mappedName: "details",
         *       readOnly:false
         *   }
     * ]
     * </pre>
     * @property {string} viewFields XML string defining each of the fields to include in all CRUD requests,
     * generated when the Model.List is instantiated.
     * <pre>
     *     <ViewFields>...</ViewFields>
     * </pre>
     * @property {Field[]} fields Generated when the Model.List is instantiated.  Combines the standard
     * default fields for all lists with the fields identified in the config.customFields and instantiates each
     * with the Field constructor.
     * @requires angularPoint.apListFactory
     * @constructor
     */
    var List = (function () {
        function List(config) {
            this.customFields = [];
            this.fields = [];
            this.guid = '';
            this.isReady = false;
            this.mapping = {};
            this.title = '';
            this.viewFields = '';
            this.webURL = apConfig.defaultUrl;
            _.assign(this, config);
            this.environments = this.environments || { production: this.guid };
            this.extendFieldDefinitions();
        }
        /**
         * @description
         * 1. Populates the fields array which uses the Field constructor to combine the default
         * SharePoint fields with those defined in the list definition on the model
         * 2. Creates the list.viewFields XML string that defines the fields to be requested on a query
         *
         * @param {object} list Reference to the list within a model.
         */
        List.prototype.extendFieldDefinitions = function () {
            var _this = this;
            /**
             * Constructs the field
             * - adds to viewField
             * - create ows_ mapping
             * @param fieldDefinition
             */
            var buildField = function (fieldDefinition) {
                var field = new apFieldFactory.FieldDefinition(fieldDefinition);
                _this.fields.push(field);
                _this.viewFields += '<FieldRef Name="' + field.staticName + '"/>';
                _this.mapping['ows_' + field.staticName] = {
                    mappedName: field.mappedName,
                    objectType: field.objectType
                };
            };
            /** Open viewFields */
            this.viewFields += '<ViewFields>';
            /** Add the default fields */
            _.each(apDefaultFields, function (field) { return buildField(field); });
            /** Add each of the fields defined in the model */
            _.each(this.customFields, function (field) { return buildField(field); });
            /** Close viewFields */
            this.viewFields += '</ViewFields>';
        };
        /**
         * @ngdoc function
         * @name List:getListId
         * @methodOf List
         * @description
         * Defaults to list.guid.  For a multi-environment setup, we accept a list.environments object with a property for each named
         * environment with a corresponding value of the list guid.  The active environment can be selected
         * by setting apConfig.environment to the string name of the desired environment.
         * @returns {string} List ID.
         */
        List.prototype.getListId = function () {
            if (_.isString(this.environments[apConfig.environment])) {
                /**
                 * For a multi-environment setup, we accept a list.environments object with a property for each named
                 * environment with a corresponding value of the list guid.  The active environment can be selected
                 * by setting apConfig.environment to the string name of the desired environment.
                 */
                return this.environments[apConfig.environment];
            }
            else {
                throw new Error('There isn\'t a valid environment definition for apConfig.environment=' + apConfig.environment + '  ' +
                    'Please confirm that the list "' + this.title + '" has the necessary environmental configuration.');
            }
        };
        /**
         * @ngdoc function
         * @name List:identifyWebURL
         * @methodOf List
         * @description
         * If a list is extended, use the provided webURL, otherwise use list.webURL.  If never set it will default
         * to apConfig.defaultUrl.
         * @returns {string} webURL param.
         */
        List.prototype.identifyWebURL = function () {
            return this.WebFullUrl ? this.WebFullUrl : this.webURL;
        };
        return List;
    })();
    ap.List = List;
    /**
     * @ngdoc service
     * @name angularPoint.apListFactory
     * @description
     * Exposes the List prototype and a constructor to instantiate a new List.
     *
     * @property {constructor} List The List constructor.
     *
     * @requires angularPoint.apConfig
     * @requires angularPoint.apDefaultFields
     * @requires angularPoint.apFieldFactory
     */
    var ListFactory = (function () {
        function ListFactory(_apConfig_, _apDefaultFields_, _apFieldFactory_) {
            this.List = List;
            apConfig = _apConfig_;
            apDefaultFields = _apDefaultFields_;
            apFieldFactory = _apFieldFactory_;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apListFactory:create
         * @methodOf angularPoint.apListFactory
         * @param {object} config Options object.
         * @description
         * Instantiates and returns a new List.
         */
        ListFactory.prototype.create = function (config) {
            return new List(config);
        };
        ListFactory.$inject = ['apConfig', 'apDefaultFields', 'apFieldFactory'];
        return ListFactory;
    })();
    ap.ListFactory = ListFactory;
    angular.module('angularPoint')
        .service('apListFactory', ListFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var $q, toastr, apCacheService, apDataService, apEncodeService, apUtilityService, apFormattedFieldValueService, apConfig;
    /**
     * @ngdoc object
     * @name ListItem
     * @description
     * Base prototype which all list items inherit from.  All methods can be accessed through this prototype so all CRUD
     * functionality can be called directly from a given list item.
     * @constructor
     */
    var ListItem = (function () {
        function ListItem() {
        }
        /**
         * @ngdoc function
         * @name ListItem.deleteAttachment
         * @description
         * Delete an attachment from a list item.
         * @param {string} url Requires the URL for the attachment we want to delete.
         * @returns {object} Promise which resolves with the updated attachment collection.
         * @example
         * <pre>
         * $scope.deleteAttachment = function (attachment) {
             *     var confirmation = window.confirm("Are you sure you want to delete this file?");
             *     if (confirmation) {
             *         scope.listItem.deleteAttachment(attachment).then(function () {
             *             alert("Attachment successfully deleted");
             *         });
             *     }
             * };
         * </pre>
         */
        ListItem.prototype.deleteAttachment = function (url) {
            var listItem = this;
            return apDataService.deleteAttachment({
                listItemID: listItem.id,
                url: url,
                listName: listItem.getModel().list.getListId()
            });
        };
        /**
         * @ngdoc function
         * @name ListItem.deleteItem
         * @description
         * Deletes record directly from the object and removes record from user cache.
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.updateAllCaches=false] Iterate over each of the query cache's and ensure the listItem is
         * removed everywhere.  This is more process intensive so by default we only remove the cached listItem in the
         * cache where this listItem is currently stored.
         * @returns {object} Promise which really only lets us know the request is complete.
         * @example
         * ```
         * <ul>
         *    <li ng-repeat="task in tasks">
         *        {{task.title}} <a href ng-click="task.deleteItem()>delete</a>
         *    </li>
         * </ul>
         * ```
         * List of tasks.  When the delete link is clicked, the list item item is removed from the local cache and
         * the view is updated to no longer show the task.
         */
        ListItem.prototype.deleteItem = function (options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();
            apDataService.deleteListItem(model, listItem, options).then(function (response) {
                deferred.resolve(response);
                /** Optionally broadcast change event */
                apUtilityService.registerChange(model, 'delete', listItem.id);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name ListItem.getAttachmentCollection
         * @description
         * Requests all attachments for a given list item.
         * @returns {object} Promise which resolves with all attachments for a list item.
         * @example
         * <pre>
         * //Pull down all attachments for the current list item
         * var fetchAttachments = function (listItem) {
             *     listItem.getAttachmentCollection()
             *         .then(function (attachments) {
             *             scope.attachments = attachments;
             *         });
             * };
         * </pre>
         */
        ListItem.prototype.getAttachmentCollection = function () {
            var listItem = this;
            return apDataService.getCollection({
                operation: 'GetAttachmentCollection',
                listName: listItem.getModel().list.getListId(),
                webURL: listItem.getModel().list.webURL,
                ID: listItem.id,
                filterNode: 'Attachment'
            });
        };
        /**
         * @ngdoc function
         * @name ListItem.getAvailableWorkflows
         * @description
         * Wrapper for apDataService.getAvailableWorkflows.  Simply passes the current item in.
         * @returns {promise} Array of objects defining each of the available workflows.
         */
        ListItem.prototype.getAvailableWorkflows = function () {
            var listItem = this;
            return apDataService.getAvailableWorkflows(listItem.fileRef.lookupValue);
        };
        /**
         * @ngdoc function
         * @name ListItem.getChanges
         * @description
         * Wrapper for model.getListItemById.  Queries server for any changes and extends the existing
         * list item with those changes.
         * @returns {promise} Promise which resolves with the updated list item.
         */
        ListItem.prototype.getChanges = function () {
            var model = this.getModel();
            return model.getListItemById(this.id);
        };
        /**
         * @ngdoc function
         * @name ListItem.getFieldChoices
         * @param {string} fieldName Internal field name.
         * @description
         * Uses the field definition defined in the model to attempt to find the choices array for a given Lookup or
         * MultiLookup type field.  The default value is fieldDefinition.choices which can optionally be added to a
         * given field definition.  If this isn't found, we check fieldDefinition.Choices which is populated after a
         * GetListItemsSinceToken operation or a Model.extendListMetadata operation.  Finally if that isn't available
         * we return an empty array.
         * @returns {string[]} An array of choices for a Choice or MultiChoice type field.
         */
        ListItem.prototype.getFieldChoices = function (fieldName) {
            var listItem = this;
            var fieldDefinition = listItem.getFieldDefinition(fieldName);
            return fieldDefinition.choices || fieldDefinition.Choices || [];
        };
        /**
         * @ngdoc function
         * @name ListItem.getFieldDefinition
         * @description
         * Returns the field definition from the definitions defined in the custom fields array within a model.
         * @example
         * <pre>
         * var project = {
             *    title: 'Project 1',
             *    location: {
             *        lookupId: 5,
             *        lookupValue: 'Some Building'
             *    }
             * };
         *
         * //To get field metadata
         * var locationDefinition = project.getFieldDefinition('location');
         * </pre>
         * @param {string} fieldName Internal field name.
         * @returns {object} Field definition.
         */
        ListItem.prototype.getFieldDefinition = function (fieldName) {
            var listItem = this;
            return listItem.getModel().getFieldDefinition(fieldName);
        };
        /**
         * @ngdoc function
         * @name ListItem.getFieldDescription
         * @param {string} fieldName Internal field name.
         * @description
         * Uses the field definition defined in the model to attempt to find the description for a given field.  The default
         * value is fieldDefinition.Description which is populated after a GetListItemsSinceToken operation or a
         * Model.extendListMetadata operation.  If this isn't available we look for an optional attribute of a field
         * fieldDefinition.description.  Finally if that have anything it returns an empty string.
         * @returns {string} The description for a given field object.
         */
        ListItem.prototype.getFieldDescription = function (fieldName) {
            var listItem = this;
            var fieldDefinition = listItem.getFieldDefinition(fieldName);
            return fieldDefinition.description || fieldDefinition.Description || '';
        };
        /**
         * @ngdoc function
         * @name ListItem.getFieldLabel
         * @param {string} fieldName Internal field name.
         * @description
         * Uses the field definition defined in the model to attempt to find the label for a given field.  The default
         * value is fieldDefinition.label.  If not available it will then use fieldDefinition.DisplayName which is
         * populated after a GetListItemsSinceToken operation or a Model.extendListMetadata operation.  If this isn't
         * available it will fallback to the the fieldDefinition.DisplayName which is a best guess at converting the
         * caml case version of the mapped name using apUtilityService.fromCamelCase.
         * @returns {string} The label for a given field object.
         */
        ListItem.prototype.getFieldLabel = function (fieldName) {
            var listItem = this;
            var fieldDefinition = listItem.getFieldDefinition(fieldName);
            return fieldDefinition.label || fieldDefinition.DisplayName || fieldDefinition.displayName;
        };
        /**
         * @ngdoc function
         * @name ListItem.getFieldVersionHistory
         * @description
         * Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each
         * version.  If no fields are provided, we look at the field definitions in the model and pull all non-readonly
         * fields.  The only way to do this that I've been able to get working is to get the version history for each
         * field independently and then build the history by combining the server responses for each requests into a
         * snapshot of the object.
         * @param {string[]} [fieldNames] An array of field names that we're interested in.
         * @returns {object} promise - containing array of changes
         * @example
         * Assuming we have a modal form where we want to display each version of the title and project fields
         * of a given list item.
         * <pre>
         * myGenericListItem.getFieldVersionHistory(['title', 'project'])
         *     .then(function(versionHistory) {
         *            // We now have an array of every version of these fields
         *            $scope.versionHistory = versionHistory;
         *      };
         * </pre>
         */
        ListItem.prototype.getFieldVersionHistory = function (fieldNames) {
            var deferred = $q.defer();
            var listItem = this;
            var model = listItem.getModel();
            var promiseArray = [];
            /** Constructor that creates a promise for each field */
            var createPromise = function (fieldName) {
                var fieldDefinition = _.find(model.list.fields, { mappedName: fieldName });
                var payload = {
                    operation: 'GetVersionCollection',
                    strlistID: model.list.getListId(),
                    strlistItemID: listItem.id,
                    strFieldName: fieldDefinition.staticName,
                    webURL: undefined
                };
                /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
                if (apConfig.defaultUrl) {
                    payload.webURL = apConfig.defaultUrl;
                }
                promiseArray.push(apDataService.getFieldVersionHistory(payload, fieldDefinition));
            };
            if (!fieldNames) {
                /** If fields aren't provided, pull the version history for all NON-readonly fields */
                var targetFields = _.where(model.list.fields, { readOnly: false });
                fieldNames = [];
                _.each(targetFields, function (field) {
                    fieldNames.push(field.mappedName);
                });
            }
            else if (_.isString(fieldNames)) {
                /** If a single field name is provided, add it to an array so we can process it more easily */
                fieldNames = [fieldNames];
            }
            /** Generate promises for each field */
            _.each(fieldNames, function (fieldName) {
                createPromise(fieldName);
            });
            /** Pause until all requests are resolved */
            $q.all(promiseArray).then(function (changes) {
                var versionHistory = {};
                /** All fields should have the same number of versions */
                _.each(changes, function (fieldVersions) {
                    _.each(fieldVersions, function (fieldVersion) {
                        versionHistory[fieldVersion.modified.toJSON()] =
                            versionHistory[fieldVersion.modified.toJSON()] || {};
                        /** Add field to the version history for this version */
                        _.assign(versionHistory[fieldVersion.modified.toJSON()], fieldVersion);
                    });
                });
                var versionArray = [];
                /** Add a version prop on each version to identify the numeric sequence */
                _.each(versionHistory, function (ver, num) {
                    ver.version = num;
                    versionArray.push(ver);
                });
                deferred.resolve(versionArray);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name ListItem.getFormattedValue
         * @description
         * Given the attribute name on a listItem, we can lookup the field type and from there return a formatted
         * string representation of that value.
         * @param {string} fieldName Attribute name on the object that contains the value to stringify.
         * @param {object} [options] Pass through to apFormattedFieldValueService.getFormattedFieldValue.
         * @returns {string} Formatted string representing the field value.
         */
        ListItem.prototype.getFormattedValue = function (fieldName, options) {
            var listItem = this;
            var fieldDefinition = listItem.getFieldDefinition(fieldName);
            if (!fieldDefinition) {
                throw 'A field definition for a field named ' + fieldName + ' wasn\'t found.';
            }
            return apFormattedFieldValueService
                .getFormattedFieldValue(listItem[fieldName], fieldDefinition.objectType, options);
        };
        /**
         * @ngdoc function
         * @name ListItem.getList
         * @description
         * Abstraction to allow logic in model to be used instead of defining the list location in more than one place.
         * @returns {object} List for the list item.
         */
        ListItem.prototype.getList = function () {
            var model = this.getModel();
            return model.getList();
        };
        /**
         * @ngdoc function
         * @name ListItem.getListId
         * @description
         * Allows us to reference the list ID directly from the list item.  This is added to the
         * model.factory prototype in apModelFactory.
         * @returns {string} List ID.
         */
        ListItem.prototype.getListId = function () {
            var model = this.getModel();
            return model.getListId();
        };
        /**
         * @ngdoc function
         * @name ListItem.getLookupReference
         * @description
         * Allows us to retrieve the listItem being referenced in a given lookup field.
         * @param {string} fieldName Name of the lookup property on the list item that references a listItem.
         * @param {number} [lookupId=listItem.fieldName.lookupId] The listItem.lookupId of the lookup object.  This allows us to also use this logic
         * on a multi-select by iterating over each of the lookups.
         * @example
         * <pre>
         * var project = {
             *    title: 'Project 1',
             *    location: {
             *        lookupId: 5,
             *        lookupValue: 'Some Building'
             *    }
             * };
         *
         * //To get the location listItem
         * var listItem = project.getLookupReference('location');
         * </pre>
         * @returns {object} The listItem the lookup is referencing or undefined if not in the cache.
         */
        ListItem.prototype.getLookupReference = function (fieldName, lookupId) {
            var listItem = this;
            var lookupReference;
            if (_.isUndefined(fieldName)) {
                throw new Error('A field name is required.');
            }
            else if (_.isEmpty(listItem[fieldName])) {
                lookupReference = '';
            }
            else {
                var model = listItem.getModel();
                var fieldDefinition = model.getFieldDefinition(fieldName);
                /** Ensure the field definition has the List attribute which contains the GUID of the list
                 *  that a lookup is referencing. */
                if (fieldDefinition && fieldDefinition.List) {
                    var targetId = lookupId || listItem[fieldName].lookupId;
                    lookupReference = apCacheService.getCachedEntity(fieldDefinition.List, targetId);
                }
                else {
                    throw new Error('This isn\'t a valid Lookup field or the field definitions need to be extended ' +
                        'before we can complete this request.');
                }
            }
            return lookupReference;
        };
        /**
         * @ngdoc function
         * @name ListItem.resolvePermissions
         * @description
         * See apModelService.resolvePermissions for details on what we expect to have returned.
         * @returns {Object} Contains properties for each permission level evaluated for current user.
         * @example
         * Lets assume we're checking to see if a user has edit rights for a given task list item.
         * <pre>
         * var canUserEdit = function(task) {
         *      var userPermissions = task.resolvePermissions();
         *      return userPermissions.EditListItems;
         * };
         * </pre>
         * Example of what the returned object would look like
         * for a site admin.
         * <pre>
         * userPermissions = {
         *    "ViewListItems": true,
         *    "AddListItems": true,
         *    "EditListItems": true,
         *    "DeleteListItems": true,
         *    "ApproveItems": true,
         *    "OpenItems": true,
         *    "ViewVersions": true,
         *    "DeleteVersions": true,
         *    "CancelCheckout": true,
         *    "PersonalViews": true,
         *    "ManageLists": true,
         *    "ViewFormPages": true,
         *    "Open": true,
         *    "ViewPages": true,
         *    "AddAndCustomizePages": true,
         *    "ApplyThemeAndBorder": true,
         *    "ApplyStyleSheets": true,
         *    "ViewUsageData": true,
         *    "CreateSSCSite": true,
         *    "ManageSubwebs": true,
         *    "CreateGroups": true,
         *    "ManagePermissions": true,
         *    "BrowseDirectories": true,
         *    "BrowseUserInfo": true,
         *    "AddDelPrivateWebParts": true,
         *    "UpdatePersonalWebParts": true,
         *    "ManageWeb": true,
         *    "UseRemoteAPIs": true,
         *    "ManageAlerts": true,
         *    "CreateAlerts": true,
         *    "EditMyUserInfo": true,
         *    "EnumeratePermissions": true,
         *    "FullMask": true
         * }
         * </pre>
         */
        ListItem.prototype.resolvePermissions = function () {
            return apUtilityService.resolvePermissions(this.permMask);
        };
        /**
         * @ngdoc function
         * @name ListItem.saveChanges
         * @description
         * Updates record directly from the object
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure listItem is
         * updated everywhere.  This is more process intensive so by default we only update the cached listItem in the
         * cache where this listItem is currently stored.
         * @returns {object} Promise which resolved with the updated list item from the server.
         * @example
         * <pre>
         * // Example of save function on a fictitious
         * // app/modules/tasks/TaskDetailsCtrl.js modal form.
         * $scope.saveChanges = function(task) {
         *      task.saveChanges().then(function() {
         *          // Successfully saved so we can do something
         *          // like close form
         *
         *          }, function() {
         *          // Failure
         *
         *          });
         * }
         * </pre>
         */
        ListItem.prototype.saveChanges = function (options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();
            /** Redirect if the request is actually creating a new list item.  This can occur if we create
             * an empty item that is instantiated from the model and then attempt to save instead of using
             * model.addNewItem */
            if (!listItem.id) {
                return model.addNewItem(listItem, options);
            }
            apDataService.updateListItem(model, listItem, options)
                .then(function (updatedListItem) {
                deferred.resolve(updatedListItem);
                /** Optionally broadcast change event */
                apUtilityService.registerChange(model, 'update', updatedListItem.id);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name ListItem.saveFields
         * @description
         * Saves a named subset of fields back to SharePoint.  This is an alternative to saving all fields.
         * @param {array|string} fieldArray Array of internal field names that should be saved to SharePoint or a single
         * string to save an individual field.
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure listItem is
         * updated everywhere.  This is more process intensive so by default we only update the cached listItem in the
         * cache where this listItem is currently stored.
         * @returns {object} Promise which resolves with the updated list item from the server.
         * @example
         * <pre>
         * // Example of saveFields function on a fictitious
         * // app/modules/tasks/TaskDetailsCtrl.js modal form.
         * // Similar to saveChanges but instead we only save
         * // specified fields instead of pushing everything.
         * $scope.updateStatus = function(task) {
         *      task.saveFields(['status', 'notes']).then(function() {
         *          // Successfully updated the status and
         *          // notes fields for the given task
         *
         *          }, function() {
         *          // Failure to update the field
         *
         *          });
         * }
         * </pre>
         */
        ListItem.prototype.saveFields = function (fieldArray, options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();
            var definitions = [];
            /** Allow a string to be passed in to save a single field */
            var fieldNames = _.isString(fieldArray) ? [fieldArray] : fieldArray;
            /** Find the field definition for each of the requested fields */
            _.each(fieldNames, function (field) {
                var match = _.find(model.list.customFields, { mappedName: field });
                if (match) {
                    definitions.push(match);
                }
            });
            /** Generate value pairs for specified fields */
            var valuePairs = apEncodeService.generateValuePairs(definitions, listItem);
            var defaults = { buildValuePairs: false, valuePairs: valuePairs };
            /** Extend defaults with any provided options */
            var opts = _.assign({}, defaults, options);
            apDataService.updateListItem(model, listItem, opts)
                .then(function (updatedListItem) {
                deferred.resolve(updatedListItem);
                /** Optionally broadcast change event */
                apUtilityService.registerChange(model, 'update', updatedListItem.id);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name ListItem.setPristine
         * @param {ListItem} [listItem] Optionally pass list item object back to the list item constructor to
         * run any initialization logic.  Otherwise we just overwrite existing values on the object with a copy from the
         * original object.
         * @description
         * Resets all list item properties back to a pristine state but doesn't update any properties added
         * manually to the list item.
         */
        ListItem.prototype.setPristine = function (listItem) {
            if (!this.id || !_.isFunction(this.getPristine)) {
                throw new Error('Unable to find the pristine state for this list item.');
            }
            var pristineState = this.getPristine();
            if (listItem) {
                listItem.constructor(pristineState);
            }
            else {
                _.assign(this, pristineState);
            }
        };
        /**
         * @ngdoc function
         * @name ListItem.startWorkflow
         * @description
         * Given a workflow name or templateId we initiate a given workflow using apDataService.startWorkflow.
         * @param {object} options Params for method and pass through options to apDataService.startWorkflow.
         * @param {string} [options.templateId] Used to directly start the workflow without looking up the templateId.
         * @param {string} [options.workflowName] Use this value to lookup the templateId and then start the workflow.
         * @returns {promise} Resolves with server response.
         */
        ListItem.prototype.startWorkflow = function (options) {
            var listItem = this, deferred = $q.defer();
            /** Set the relative file reference */
            options.fileRef = listItem.fileRef.lookupValue;
            if (!options.templateId && !options.workflowName) {
                throw 'Either a templateId or workflowName is required to initiate a workflow.';
            }
            else if (options.templateId) {
                /** The templateId is already provided so we don't need to look for it */
                initiateRequest();
            }
            else {
                /** We first need to get the template GUID for the workflow */
                listItem.getAvailableWorkflows()
                    .then(function (workflows) {
                    var targetWorklow = _.findWhere(workflows, { name: options.workflowName });
                    if (!targetWorklow) {
                        throw 'A workflow with the specified name wasn\'t found.';
                    }
                    /** Create an extended set of options to pass any overrides to apDataService */
                    options.templateId = targetWorklow.templateId;
                    initiateRequest();
                });
            }
            return deferred.promise;
            function initiateRequest() {
                apDataService.startWorkflow(options)
                    .then(function (xmlResponse) {
                    deferred.resolve(xmlResponse);
                });
            }
        };
        /**
         * @ngdoc function
         * @name ListItem.validateEntity
         * @description
         * Helper function that passes the current item to Model.validateEntity
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.toast=true] Set to false to prevent toastr messages from being displayed.
         * @returns {boolean} Evaluation of validity.
         */
        ListItem.prototype.validateEntity = function (options) {
            var listItem = this, model = listItem.getModel();
            return model.validateEntity(listItem, options);
        };
        return ListItem;
    })();
    ap.ListItem = ListItem;
    /** In the event that a factory isn't specified, just use a
     * standard constructor to allow it to inherit from ListItem */
    var StandardListItem = (function () {
        function StandardListItem(obj) {
            _.assign(this, obj);
        }
        return StandardListItem;
    })();
    ap.StandardListItem = StandardListItem;
    /**
     * @ngdoc object
     * @name apListItemFactory
     * @description
     * Exposes the ListItem prototype and a constructor to instantiate a new ListItem.
     * See [ListItem](#/api/ListItem) for details of the methods available on the prototype.
     *
     * @requires ListItem
     * @requires apCacheService
     * @requires apDataService
     * @requires apUtilityService
     */
    var ListItemFactory = (function () {
        function ListItemFactory(_$q_, _apCacheService_, _apConfig_, _apDataService_, _apEncodeService_, _apFormattedFieldValueService_, _apUtilityService_, _toastr_) {
            this.ListItem = ListItem;
            $q = _$q_;
            apCacheService = _apCacheService_;
            apConfig = _apConfig_;
            apDataService = _apDataService_;
            apEncodeService = _apEncodeService_;
            apFormattedFieldValueService = _apFormattedFieldValueService_;
            apUtilityService = _apUtilityService_;
            toastr = _toastr_;
        }
        /**
         * @ngdoc function
         * @name apListItemFactory: create
         * @methodOf apListItemFactory
         * @description
         * Instantiates and returns a new ListItem.
         */
        ListItemFactory.prototype.create = function () {
            return new ListItem();
        };
        /**
         * @ngdoc function
         * @name apListItemFactory: createGenericFactory
         * @methodOf apListItemFactory
         * @description
         * In the event that a factory isn't specified, just use a
         * standard constructor to allow it to inherit from ListItem
         */
        ListItemFactory.prototype.createGenericFactory = function () {
            return new StandardListItem();
        };
        ListItemFactory.$inject = ['$q', 'apCacheService', 'apConfig', 'apDataService', 'apEncodeService', 'apFormattedFieldValueService', 'apUtilityService', 'toastr'];
        return ListItemFactory;
    })();
    ap.ListItemFactory = ListItemFactory;
    angular
        .module('angularPoint')
        .service('apListItemFactory', ListItemFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var $q, apUtilityService;
    /**
     * @ngdoc function
     * @name Lookup
     * @description
     * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
     * to create an async request for the entity being referenced by the lookup
     * @param {string} s String to split into lookupValue and lookupId
     * @param {object} options Contains a reference to the parent list item and the property name.
     * @param {object} options.entity Reference to parent list item.
     * @param {object} options.propertyName Key on list item object.
     * @constructor
     */
    var Lookup = (function () {
        function Lookup(s, options) {
            var lookup = this;
            var thisLookup = new apUtilityService.SplitIndex(s);
            lookup.lookupId = thisLookup.id;
            lookup.lookupValue = thisLookup.value || '';
        }
        return Lookup;
    })();
    ap.Lookup = Lookup;
    var LookupFactory = (function () {
        function LookupFactory(_$q_, _apUtilityService_) {
            this.Lookup = Lookup;
            $q = _$q_;
            apUtilityService = _apUtilityService_;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apLookupFactory:create
         * @methodOf angularPoint.apLookupFactory
         * @description
         * Instantiates and returns a new Lookup field.
         */
        LookupFactory.prototype.create = function (s, options) {
            return new Lookup(s, options);
        };
        LookupFactory.$inject = ['$q', 'apUtilityService'];
        return LookupFactory;
    })();
    ap.LookupFactory = LookupFactory;
    /**
     * @ngdoc function
     * @name angularPoint.apLookupFactory
     * @description
     * Tools to assist with the creation of CAML queries.
     *
     */
    angular.module('angularPoint')
        .service('apLookupFactory', LookupFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var apCacheService, apDataService, apListFactory, apQueryFactory, apUtilityService, apFieldService, apConfig, apIndexedCacheFactory, apDecodeService, $q, toastr;
    /**
     * @ngdoc function
     * @name Model
     * @description
     * Model Constructor
     * Provides the Following
     * - adds an empty "data" array
     * - adds an empty "queries" object
     * - adds a deferred obj "ready"
     * - builds "model.list" with constructor
     * - adds "getAllListItems" function
     * - adds "addNewItem" function
     * @param {object} config Object containing optional params.
     * @param {object} [config.factory = apListItemFactory.createGenericFactory()] - Constructor function for
     * individual list items.
     * @param {boolean} [config.fieldDefinitionsExtended=false] Queries using the GetListItemChangesSinceToken
     * operation return the full list definition along with the requested entities.  The first time one of these
     * queries is executed we will try to extend our field definitions defined in the model with the additional
     * information provided from the server.  Examples are options for a Choice field, display name of the field,
     * field description, and any other field information provided for the fields specified in the model.  This
     * flag is set once the first query is complete so we don't process again.
     * @param {object} config.list - Definition of the list in SharePoint.
     * be passed to the list constructor to extend further
     * @param {string} config.list.title - List name, no spaces.  Offline XML file will need to be
     * named the same (ex: CustomList so xml file would be apConfig.offlineXML + '/CustomList.xml')
     * @param {string} config.list.getListId() - Unique SharePoint ID (ex: '{3DBEB25A-BEF0-4213-A634-00DAF46E3897}')
     * @param {object[]} config.list.customFields - Maps SharePoint fields with names we'll use within the
     * application.  Identifies field types and formats accordingly.  Also denotes if a field is read only.
     * @constructor
     *
     * @example
     * <pre>
     * //Taken from a fictitious projectsModel.ts
     *
     * export class ProjectsModel extends ap.Model {
     *      constructor() {
     *          super({
     *              factory: Project,
     *              list: {
     *                  guid: '{PROJECT LIST GUID}',
     *                  title: 'Projects',
     *                  customFields: [
     *                      {
     *                         staticName: 'Title',
     *                         objectType: 'Text',
     *                         mappedName: 'title',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'Customer',
     *                         objectType: 'Lookup',
     *                         mappedName: 'customer',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'ProjectDescription',
     *                         objectType: 'Text',
     *                         mappedName: 'projectDescription',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'Status',
     *                         objectType: 'Text',
     *                         mappedName: 'status',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'TaskManager',
     *                         objectType: 'User',
     *                         mappedName: 'taskManager',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'ProjectGroup',
     *                         objectType: 'Lookup',
     *                         mappedName: 'group',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'CostEstimate',
     *                         objectType: 'Currency',
     *                         mappedName: 'costEstimate',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'Active',
     *                         objectType: 'Boolean',
     *                         mappedName: 'active',
     *                         readOnly: false
     *                      },
     *                      {
     *                         staticName: 'Attachments',
     *                         objectType: 'Attachments',
     *                         mappedName: 'attachments',
     *                         readOnly: true
     *                      }
     *                  ]
     *              }
     *          });
     *
     *          var model = this;
     *
     *          //Any other model setup
     *      }
     *      someExposedModelMethod() {
     *          this.dosomething...
     *      }
     *
     *   }
     * </pre>
     */
    var Model = (function () {
        function Model(config) {
            var _this = this;
            this.data = [];
            // factory: <T>(rawObject: Object) => void;
            this.fieldDefinitionsExtended = false;
            this.queries = {};
            /** Assign all properties of config to the model */
            _.assign(this, config);
            /** Allow us to reference the model directly from the list item's factory prototype */
            this.factory.prototype.getModel = function () { return _this; };
            /** Use list constructor to instantiate valid list */
            this.list = new ap.List(this.list);
            /** Register cache name with cache service so we can map factory name with list GUID */
            apCacheService.registerModel(this);
            /** Convenience query that simply returns all list items within a list. */
            this.registerQuery({
                name: 'getAllListItems',
                operation: 'GetListItems'
            });
        }
        /**
         * @ngdoc function
         * @name Model.addNewItem
         * @module Model
         * @description
         * Using the definition of a list stored in a model, create a new list item in SharePoint.
         * @param {object} entity An object that will be converted into key/value pairs based on the field definitions
         * defined in the model.
         * @param {object} [options] - Pass additional options to the data service.
         * @returns {object} A promise which when resolved will returned the newly created list item from there server.
         * This allows us to update the view with a valid new object that contains a unique list item id.
         *
         * @example
         * <pre>
         * <file name="app/modules/project/projectsModel.js">
         * projectModel.addNewItem({
         *        title: 'A Project',
         *        customer: {lookupValue: 'My Customer', lookupId: 123},
         *        description: 'This is the project description'
         *     }).then(function(newEntityFromServer) {
         *         //The local query cache is automatically updated but
         *         //any other dependent logic can go here
         * };
         * </file>
         * </pre>
         */
        Model.prototype.addNewItem = function (entity, options) {
            var model = this, deferred = $q.defer();
            apDataService.createListItem(model, entity, options)
                .then(function (listItem) {
                deferred.resolve(listItem);
                /** Optionally broadcast change event */
                apUtilityService.registerChange(model, 'create', listItem.id);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name Model.createEmptyItem
         * @module Model
         * @description
         * Creates an object using the editable fields from the model, all attributes are empty based on the field
         * type unless an overrides object is passed in.  The overrides object extends the defaults.  A benefit to this
         * approach is the returned object inherits from the ListItem prototype so we have the ability to call
         * entity.saveChanges instead of calling the model.addNewItem(entity).
         *
         * @param {object} [overrides] - Optionally extend the new empty item with specific values.
         * @returns {object} Newly created list item.
         */
        Model.prototype.createEmptyItem = function (overrides) {
            var model = this;
            var newItem = {};
            _.each(model.list.customFields, function (fieldDefinition) {
                /** Create attributes for each non-readonly field definition */
                if (!fieldDefinition.readOnly) {
                    /** Create an attribute with the expected empty value based on field definition type */
                    newItem[fieldDefinition.mappedName] = apFieldService.getDefaultValueForType(fieldDefinition.objectType);
                }
            });
            /** Extend any values that should override the default empty values */
            var rawObject = _.assign({}, newItem, overrides);
            return new model.factory(rawObject);
        };
        /**
         * @ngdoc function
         * @name Model.executeQuery
         * @module Model
         * @description
         * The primary method for retrieving data from a query registered on a model.  It returns a promise
         * which resolves to the local cache after post processing entities with constructors.
         *
         * @param {string} [queryName=apConfig.defaultQueryName] A unique key to identify this query
         * @param {object} [options] Pass options to the data service.
         * @returns {object} Promise that when resolves returns an array of list items which inherit from ListItem and
         * optionally go through a defined constructor on the model.
         *
         * @example To call the query or check for changes since the last call.
         * <pre>
         * projectModel.executeQuery('MyCustomQuery').then(function(entities) {
         *      //We now have a reference to array of entities stored in the local cache
         *      //These inherit from the ListItem prototype as well as the Project prototype on the model
         *      $scope.subsetOfProjects = entities;
         *  });
         * </pre>
         */
        Model.prototype.executeQuery = function (queryName, options) {
            var model = this;
            var query = model.getQuery(queryName);
            if (query) {
                return query.execute(options);
            }
        };
        /**
         * @ngdoc function
         * @name Model.extendListMetadata
         * @module Model
         * @description
         * Extends the List and Fields with list information returned from the server.  Only runs once and after that
         * returns the existing promise.
         * @param {object} [options] Pass-through options to apDataService.getList
         * @returns {object} Promise that is resolved once the information has been added.
         */
        Model.prototype.extendListMetadata = function (options) {
            var model = this, deferred = $q.defer(), defaults = { listName: model.list.getListId() };
            /** Only request information if the list hasn't already been extended and is not currently being requested */
            if (!model.deferredListDefinition) {
                /** All Future Requests get this */
                model.deferredListDefinition = deferred.promise;
                var opts = _.assign({}, defaults, options);
                apDataService.getList(opts)
                    .then(function (responseXML) {
                    apDecodeService.extendListMetadata(model, responseXML);
                    deferred.resolve(model);
                });
            }
            return model.deferredListDefinition;
        };
        /**
         * @ngdoc function
         * @name Model.generateMockData
         * @module Model
         * @description
         * Generates 'n' mock records for testing using the field types defined in the model to provide something to visualize.
         *
         * @param {object} [options] Object containing optional parameters.
         * @param {number} [options.quantity=10] The requested number of mock records to return.
         * @param {string} [options.permissionLevel=FullMask] Sets the mask on the mock records to simulate desired
         * permission level.
         * @param {boolean} [options.staticValue=false] By default all mock data is dynamically created but if set,
         * this will cause static data to be used instead.
         */
        Model.prototype.generateMockData = function (options) {
            var mockData = [], model = this;
            var defaults = {
                quantity: 10,
                staticValue: false,
                permissionLevel: 'FullMask'
            };
            /** Extend defaults with any provided options */
            var opts = _.assign({}, defaults, options);
            _.times(opts.quantity, function (count) {
                var mock = {
                    id: count + 1
                };
                /** Create an attribute with mock data for each field */
                _.each(model.list.fields, function (field) {
                    mock[field.mappedName] = field.getMockData(opts);
                });
                /** Use the factory on the model to extend the object */
                mockData.push(new model.factory(mock));
            });
            return mockData;
        };
        /**
         * @ngdoc function
         * @name Model.getAllListItems
         * @description
         * Inherited from Model constructor
         * Gets all list items in the current list, processes the xml, and caches the data in model.
         * @returns {object} Promise returning all list items when resolved.
         * @example
         * <pre>
         * //Taken from a fictitious projectsModel.js
         * projectModel.getAllListItems().then(function(entities) {
         *     //Do something with all of the returned entities
         *     $scope.projects = entities;
         * };
         * </pre>
         */
        Model.prototype.getAllListItems = function () {
            var model = this;
            return apDataService.executeQuery(model, model.queries.getAllListItems);
        };
        /**
         * @ngdoc function
         * @name Model.getCache
         * @module Model
         * @description
         * Helper function that return the local cache for a named query if provided, otherwise
         * it returns the cache for the primary query for the model.  Useful if you know the query
         * has already been resolved and there's no need to check SharePoint for changes.
         *
         * @param {string} [queryName=apConfig.defaultQueryName] A unique key to identify this query.
         * @returns {Array} Returns the contents of the current cache for a named query.
         *
         * @example
         * <pre>
         * var primaryQueryCache = projectModel.getCache();
         * </pre>
         *
         * <pre>
         * var primaryQueryCache = projectModel.getCache('primary');
         * </pre>
         *
         * <pre>
         * var namedQueryCache = projectModel.getCache('customQuery');
         * </pre>
         */
        Model.prototype.getCache = function (queryName) {
            var model = this, query, cache;
            query = model.getQuery(queryName);
            if (query && query.indexedCache) {
                cache = query.indexedCache;
            }
            return cache;
        };
        /**
         * @ngdoc function
         * @name Model.getCachedEntities
         * @module Model
         * @description
         * Returns all entities registered for this model regardless of query.
         * @returns {IndexedCache<T>} All registered entities for this model.
         */
        Model.prototype.getCachedEntities = function () {
            var model = this;
            return apCacheService.getCachedEntities(model.list.getListId());
        };
        /**
         * @ngdoc function
         * @name Model.getCachedEntity
         * @module Model
         * @description
         * Attempts to locate a model listItem by id.
         * @param {number} listItemId The ID of the requested listItem.
         * @returns {object} Returns either the requested listItem or undefined if it's not found.
         */
        Model.prototype.getCachedEntity = function (listItemId) {
            var model = this;
            return apCacheService.getCachedEntity(model.list.getListId(), listItemId);
        };
        /**
         * @ngdoc function
         * @name Model.getFieldDefinition
         * @module Model
         * @description
         * Returns the field definition from the definitions defined in the custom fields array within a model.
         * <pre>
         * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
         *
         * //To get field metadata
         * var locationDefinition = projectsModel.getFieldDefinition('location');
         * </pre>
         * @param {string} fieldName Internal field name.
         * @returns {object} Field definition.
         */
        Model.prototype.getFieldDefinition = function (fieldName) {
            var model = this;
            return _.find(model.list.fields, { mappedName: fieldName });
        };
        /**
         * @ngdoc function
         * @name ListItem.getList
         * @description
         * Allows us to reference the list definition directly from the list item.  This is added to the
         * model.factory prototype in apModelFactory.  See the [List](#/api/List) documentation for more info.
         * @returns {object} List for the list item.
         */
        Model.prototype.getList = function () {
            return this.list;
        };
        /**
         * @ngdoc function
         * @name ListItem.getListId
         * @description
         * Allows us to reference the list ID directly from the model.
         * @returns {string} List ID.
         */
        Model.prototype.getListId = function () {
            return this.list.getListId();
        };
        /**
         * @ngdoc function
         * @name Model.getListItemById
         * @param {number} listItemId Id of the item being requested.
         * @param {object} options Used to override apDataService defaults.
         * @description
         * Inherited from Model constructor
         * Attempts to retrieve the requested list item from the server.
         * @returns {object} Promise that resolves with the requested list item if found.  Otherwise it returns undefined.
         * @example
         * <pre>
         * //Taken from a fictitious projectsModel.js
         * projectModel.getListItemById(12).then(function(listItem) {
         *     //Do something with the located listItem
         *     $scope.project = listItem;
         * };
         * </pre>
         */
        Model.prototype.getListItemById = function (listItemId, options) {
            var deferred = $q.defer(), model = this, 
            /** Unique Query Name */
            queryKey = 'GetListItemById-' + listItemId;
            /** Register a new Query if it doesn't already exist */
            if (!model.getQuery(queryKey)) {
                var defaults = {
                    name: queryKey,
                    operation: 'GetListItems',
                    CAMLRowLimit: 1,
                    CAMLQuery: '' +
                        '<Query>' +
                        ' <Where>' +
                        '   <Eq>' +
                        '     <FieldRef Name="ID"/>' +
                        '     <Value Type="Number">' + listItemId + '</Value>' +
                        '   </Eq>' +
                        ' </Where>' +
                        '</Query>'
                };
                /** Allows us to override defaults */
                var opts = _.assign({}, defaults, options);
                model.registerQuery(opts);
            }
            model.executeQuery(queryKey)
                .then(function (indexedCache) {
                /** Should return an indexed cache object with a single listItem so just return the requested listItem */
                deferred.resolve(indexedCache.first());
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name ListItem.getModel
         * @description
         * Allows us to reference the parent model directly from the list item.  This is added to the
         * model.factory prototype in apModelFactory.  See the [List](#/api/List) documentation for more info.
         * @returns {object} Model for the list item.
         */
        Model.prototype.getModel = function () {
            return this;
        };
        /**
         * @ngdoc function
         * @name Model.getQuery
         * @module Model
         * @description
         * Helper function that attempts to locate and return a reference to the requested or catchall query.
         * @param {string} [queryName=apConfig.defaultQueryName] A unique key to identify this query.
         * @returns {object} See Query prototype for additional details on what a Query looks like.
         *
         * @example
         * <pre>
         * var primaryQuery = projectModel.getQuery();
         * </pre>
         *
         * <pre>
         * var primaryQuery = projectModel.getQuery('primary');
         * </pre>
         *
         * <pre>
         * var namedQuery = projectModel.getQuery('customQuery');
         * </pre>
         */
        Model.prototype.getQuery = function (queryName) {
            var model = this, query;
            if (_.isObject(model.queries[queryName])) {
                /** The named query exists */
                query = model.queries[queryName];
            }
            else if (_.isObject(model.queries[apConfig.defaultQueryName]) && !queryName) {
                /** A named query wasn't specified and the catchall query exists */
                query = model.queries[apConfig.defaultQueryName];
            }
            else {
                /** Requested query not found */
                query = undefined;
            }
            return query;
        };
        /**
         * @ngdoc function
         * @name Model.isInitialised
         * @module Model
         * @description
         * Methods which allows us to easily determine if we've successfully made any queries this session.
         * @returns {boolean} Returns evaluation.
         */
        Model.prototype.isInitialised = function () {
            var model = this;
            return _.isDate(model.lastServerUpdate);
        };
        /**
         * @ngdoc function
         * @name Model.registerQuery
         * @module Model
         * @description
         * Constructor that allows us create a static query with the option to build dynamic queries as seen in the
         * third example.  This construct is a passthrough to [SPServices](http: //spservices.codeplex.com/)
         * @param {object} [queryOptions] Optional options to pass through to the
         * [dataService](#/api/dataService.executeQuery).
         * @param {string} [queryOptions.name=apConfig.defaultQueryName] Optional name of the new query (recommended but will
         * default to 'Primary' if not specified)
         * @param {string} [queryOptions.operation="GetListItemChangesSinceToken"] Defaults to
         * [GetListItemChangesSinceToken](http: //msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx)
         * but for a smaller payload and faster response you can use
         * [GetListItems](http: //spservices.codeplex.com/wikipage?title=GetListItems&referringTitle=Lists).
         * @param {boolean} [queryOptions.cacheXML=false] Typically don't need to store the XML response because it
         * has already been parsed into JS objects.
         * @param {string} [queryOptions.offlineXML] Optionally reference a specific XML file to use for this query instead
         * of using the shared XML file used by all queries on this model.  Useful to mock custom query results.
         * @param {string} [queryOptions.query] CAML Query - Josh McCarty has a good quick reference
         * [here](http: //joshmccarty.com/2012/06/a-caml-query-quick-reference)
         * @param {string} [queryOptions.queryOptions]
         * <pre>
         * // Default options
         * '<QueryOptions>' +
         * '   <IncludeMandatoryColumns>' +
         *      'FALSE' +
         *     '</IncludeMandatoryColumns>' +
         * '   <IncludeAttachmentUrls>' +
         *      'TRUE' +
         *     '</IncludeAttachmentUrls>' +
         * '   <IncludeAttachmentVersion>' +
         *      'FALSE' +
         *     '</IncludeAttachmentVersion>' +
         * '   <ExpandUserField>' +
         *      'FALSE' +
         *     '</ExpandUserField>' +
         * '</QueryOptions>',
         * </pre>
         *
         *
         * @returns {object} Query Returns a new query object.
         *
         * @example
         * <h4>Example #1</h4>
         * <pre>
         * // Query to retrieve the most recent 25 modifications
         * model.registerQuery({
         *    name: 'recentChanges',
         *    CAMLRowLimit: 25,
         *    query: '' +
         *        '<Query>' +
         *        '   <OrderBy>' +
         *        '       <FieldRef Name="Modified" Ascending="FALSE"/>' +
         *        '   </OrderBy>' +
         *            //Prevents any records from being returned if user doesn't
         *            // have permissions on project
         *        '   <Where>' +
         *        '       <IsNotNull>' +
         *        '           <FieldRef Name="Project"/>' +
         *        '       </IsNotNull>' +
         *        '   </Where>' +
         *        '</Query>'
         * });
         * </pre>
         *
         * <h4>Example #2</h4>
         * <pre>
         * // Could be placed on the projectModel and creates the query but doesn't
         * // call it
         * projectModel.registerQuery({
         *     name: 'primary',
         *     query: '' +
         *         '<Query>' +
         *         '   <OrderBy>' +
         *         '       <FieldRef Name="Title" Ascending="TRUE"/>' +
         *         '   </OrderBy>' +
         *         '</Query>'
         * });
         *
         * //To call the query or check for changes since the last call
         * projectModel.executeQuery('primary').then(function(entities) {
         *     // We now have a reference to array of entities stored in the local
         *     // cache.  These inherit from the ListItem prototype as well as the
         *     // Project prototype on the model
         *     $scope.projects = entities;
         * });
         * </pre>
         *
         * <h4>Example #3</h4>
         * <pre>
         * // Advanced functionality that would allow us to dynamically create
         * // queries for list items with a lookup field associated with a specific
         * // project id.  Let's assume this is on the projectTasksModel.
         * model.queryByProjectId(projectId) {
         *     // Unique query name
         *     var queryKey = 'pid' + projectId;
         *
         *     // Register project query if it doesn't exist
         *     if (!_.isObject(model.queries[queryKey])) {
         *         model.registerQuery({
         *             name: queryKey,
         *             query: '' +
         *                 '<Query>' +
         *                 '   <OrderBy>' +
         *                 '       <FieldRef Name="ID" Ascending="TRUE"/>' +
         *                 '   </OrderBy>' +
         *                 '   <Where>' +
         *                 '       <And>' +
         *                              // Prevents any records from being returned
         *                              //if user doesn't have permissions on project
         *                 '           <IsNotNull>' +
         *                 '               <FieldRef Name="Project"/>' +
         *                 '           </IsNotNull>' +
         *                              // Return all records for the project matching
         *                              // param projectId
         *                 '           <Eq>' +
         *                 '               <FieldRef Name="Project" LookupId="TRUE"/>' +
         *                 '               <Value Type="Lookup">' + projectId + '</Value>' +
         *                 '           </Eq>' +
         *                 '       </And>' +
         *                 '   </Where>' +
         *                 '</Query>'
         *         });
         *     }
         *     //Still using execute query but now we have a custom query
         *     return model.executeQuery(queryKey);
         * };
         * </pre>
         */
        Model.prototype.registerQuery = function (queryOptions) {
            var model = this;
            var defaults = {
                /** If name isn't set, assume this is the only model and designate as primary */
                name: apConfig.defaultQueryName
            };
            queryOptions = _.assign({}, defaults, queryOptions);
            model.queries[queryOptions.name] = apQueryFactory.create(queryOptions, model);
            /** Return the newly created query */
            return model.queries[queryOptions.name];
        };
        /**
         * @ngdoc function
         * @name Model.resolvePermissions
         * @module Model
         * @description
         * See apModelFactory.resolvePermissions for details on what we expect to have returned.
         * @returns {Object} Contains properties for each permission level evaluated for current user.
         * @example
         * Lets assume we're checking to see if a user has edit rights for a given list.
         * <pre>
         * var userPermissions = tasksModel.resolvePermissions();
         * var userCanEdit = userPermissions.EditListItems;
         * </pre>
         * Example of what the returned object would look like
         * for a site admin.
         * <pre>
         * perm = {
            *    "ViewListItems": true,
            *    "AddListItems": true,
            *    "EditListItems": true,
            *    "DeleteListItems": true,
            *    "ApproveItems": true,
            *    "OpenItems": true,
            *    "ViewVersions": true,
            *    "DeleteVersions": true,
            *    "CancelCheckout": true,
            *    "PersonalViews": true,
            *    "ManageLists": true,
            *    "ViewFormPages": true,
            *    "Open": true,
            *    "ViewPages": true,
            *    "AddAndCustomizePages": true,
            *    "ApplyThemeAndBorder": true,
            *    "ApplyStyleSheets": true,
            *    "ViewUsageData": true,
            *    "CreateSSCSite": true,
            *    "ManageSubwebs": true,
            *    "CreateGroups": true,
            *    "ManagePermissions": true,
            *    "BrowseDirectories": true,
            *    "BrowseUserInfo": true,
            *    "AddDelPrivateWebParts": true,
            *    "UpdatePersonalWebParts": true,
            *    "ManageWeb": true,
            *    "UseRemoteAPIs": true,
            *    "ManageAlerts": true,
            *    "CreateAlerts": true,
            *    "EditMyUserInfo": true,
            *    "EnumeratePermissions": true,
            *    "FullMask": true
            * }
         * </pre>
         */
        Model.prototype.resolvePermissions = function () {
            var model = this;
            if (model.list && model.list.effectivePermMask) {
                /** Get the permission mask from the permission mask name */
                var permissionMask = apUtilityService.convertEffectivePermMask(model.list.effectivePermMask);
                return apUtilityService.resolvePermissions(permissionMask);
            }
            else {
                window.console.error('Attempted to resolve permissions of a model that hasn\'t been initialized.', model);
                return apUtilityService.resolvePermissions(null);
            }
        };
        /**
         * @ngdoc function
         * @name Model.validateEntity
         * @module Model
         * @description
         * Uses the custom fields defined in an model to ensure each field (required = true) is evaluated
         * based on field type
         *
         * @param {object} listItem SharePoint list item.
         * @param {object} [options] Object containing optional parameters.
         * @param {boolean} [options.toast=true] Should toasts be generated to alert the user of issues.
         * @returns {boolean} Evaluation of validity.
         */
        Model.prototype.validateEntity = function (listItem, options) {
            var valid = true, model = this;
            var defaults = {
                toast: true
            };
            /** Extend defaults with any provided options */
            var opts = _.assign({}, defaults, options);
            var checkObject = function (fieldValue) {
                return _.isObject(fieldValue) && _.isNumber(fieldValue.lookupId);
            };
            _.each(model.list.customFields, function (fieldDefinition) {
                var fieldValue = listItem[fieldDefinition.mappedName];
                var fieldDescriptor = '"' + fieldDefinition.objectType + '" value.';
                /** Only evaluate required fields */
                if ((fieldDefinition.required || fieldDefinition.Required) && valid) {
                    switch (fieldDefinition.objectType) {
                        case 'Boolean':
                            valid = _.isBoolean(fieldValue);
                            break;
                        case 'DateTime':
                            valid = _.isDate(fieldValue);
                            break;
                        case 'Lookup':
                        case 'User':
                            valid = checkObject(fieldValue);
                            break;
                        case 'LookupMulti':
                        case 'UserMulti':
                            /** Ensure it's a valid array containing objects */
                            valid = _.isArray(fieldValue) && fieldValue.length > 0;
                            if (valid) {
                                /** Additionally check that each lookup/person contains a lookupId */
                                _.each(fieldValue, function (fieldObject) {
                                    if (valid) {
                                        valid = checkObject(fieldObject);
                                    }
                                    else {
                                        /** Short circuit */
                                        return false;
                                    }
                                });
                            }
                            break;
                        default:
                            /** Evaluate everything else as a string */
                            valid = !_.isEmpty(fieldValue);
                    }
                    if (!valid && opts.toast) {
                        var fieldName = fieldDefinition.label || fieldDefinition.staticName;
                        toastr.error(fieldName + ' does not appear to be a valid ' + fieldDescriptor);
                    }
                }
                if (!valid) {
                    return false;
                }
            });
            return valid;
        };
        return Model;
    })();
    ap.Model = Model;
    var ModelFactory = (function () {
        function ModelFactory(_$q_, _apCacheService_, _apConfig_, _apDataService_, _apDecodeService_, _apFieldService_, _apIndexedCacheFactory_, _apListFactory_, _apQueryFactory_, _apUtilityService_, _toastr_) {
            this.Model = Model;
            $q = _$q_;
            apCacheService = _apCacheService_;
            apConfig = _apConfig_;
            apDataService = _apDataService_;
            apDecodeService = _apDecodeService_;
            apFieldService = _apFieldService_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;
            apListFactory = _apListFactory_;
            apQueryFactory = _apQueryFactory_;
            apUtilityService = _apUtilityService_;
            toastr = _toastr_;
        }
        ModelFactory.prototype.create = function (config) {
            return new Model(config);
        };
        ModelFactory.$inject = ['$q', 'apCacheService', 'apConfig', 'apDataService', 'apDecodeService', 'apFieldService', 'apIndexedCacheFactory', 'apListFactory', 'apQueryFactory', 'apUtilityService', 'toastr'];
        return ModelFactory;
    })();
    ap.ModelFactory = ModelFactory;
    angular
        .module('angularPoint')
        .service('apModelFactory', ModelFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var $q, apIndexedCacheFactory, apConfig, apDefaultListItemQueryOptions, apDataService;
    /**
     * @ngdoc function
     * @name Query
     * @description
     * Primary constructor that all queries inherit from.
     * @param {object} config Initialization parameters.
     * @param {string} [config.operation=GetListItemChangesSinceToken] Optionally use 'GetListItems' to
     * receive a more efficient response, just don't have the ability to check for changes since the last time
     * the query was called.
     * @param {boolean} [config.cacheXML=true] Set to false if you want a fresh request.
     * @param {string} [config.offlineXML] Optionally reference a specific XML file to use for this query instead
     * of using the shared XML file for this list.
     * @param {string} [config.query=Ordered ascending by ID] CAML query passed to SharePoint to control
     * the data SharePoint returns.
     * @param {string} [config.queryOptions] SharePoint options.
     * <pre>
     * //Default
     * queryOptions: '' +
     * '<QueryOptions>' +
     * '   <IncludeMandatoryColumns>' +
     *      'FALSE' +
     *     '</IncludeMandatoryColumns>' +
     * '   <IncludeAttachmentUrls>' +
     *      'TRUE' +
     *     '</IncludeAttachmentUrls>' +
     * '   <IncludeAttachmentVersion>' +
     *      'FALSE' +
     *     '</IncludeAttachmentVersion>' +
     * '   <ExpandUserField>' +
     *      'FALSE' +
     *     '</ExpandUserField>' +
     * '</QueryOptions>',
     * </pre>
     * @param {object} model Reference to the parent model for the query.  Allows us to reference when out of
     * scope.
     * @constructor
     *
     * @example
     * <pre>
     * // Query to retrieve the most recent 25 modifications
     * model.registerQuery({
         *    name: 'recentChanges',
         *    CAMLRowLimit: 25,
         *    query: '' +
         *        '<Query>' +
         *        '   <OrderBy>' +
         *        '       <FieldRef Name="Modified" Ascending="FALSE"/>' +
         *        '   </OrderBy>' +
         *            // Prevents any records from being returned if user
         *            // doesn't have permissions on project
         *        '   <Where>' +
         *        '       <IsNotNull>' +
         *        '           <FieldRef Name="Project"/>' +
         *        '       </IsNotNull>' +
         *        '   </Where>' +
         *        '</Query>'
         * });
     * </pre>
     */
    var Query = (function () {
        function Query(config, model) {
            /** Very memory intensive to enable cacheXML which is disabled by default*/
            this.cacheXML = false;
            /** Reference to the most recent query when performing GetListItemChangesSinceToken */
            this.changeToken = undefined;
            /** Flag to prevent us from makeing concurrent requests */
            this.negotiatingWithServer = false;
            /** Every time we run we want to check to update our cached data with
             * any changes made on the server */
            this.operation = 'GetListItemChangesSinceToken';
            /** Default query returns list items in ascending ID order */
            this.query = "\n        <Query>\n           <OrderBy>\n               <FieldRef Name=\"ID\" Ascending=\"TRUE\"/>\n           </OrderBy>\n        </Query>";
            this.indexedCache = apIndexedCacheFactory.create();
            this.initialized = $q.defer();
            this.listName = model.list.getListId();
            this.queryOptions = apDefaultListItemQueryOptions;
            this.viewFields = model.list.viewFields;
            /** Set the default url if the config param is defined, otherwise let SPServices handle it */
            if (apConfig.defaultUrl) {
                this.webURL = apConfig.defaultUrl;
            }
            _.assign(this, config);
            /** Allow the model to be referenced at a later time */
            this.getModel = function () { return model; };
        }
        /**
         * @ngdoc function
         * @name Query.execute
         * @methodOf Query
         * @description
         * Query SharePoint, pull down all initial records on first call along with list definition if using
         * "GetListItemChangesSinceToken".  Note: this is  substantially larger than "GetListItems" on first call.
         * Subsequent calls pulls down changes (Assuming operation: "GetListItemChangesSinceToken").
         * @param {object} [options] Any options that should be passed to dataService.executeQuery.
         * @returns {object[]} Array of list item objects.
         */
        Query.prototype.execute = function (options) {
            var query = this;
            var model = query.getModel();
            var deferred = $q.defer();
            /** Return existing promise if request is already underway or has been previously executed in the past
             * 1/10th of a second */
            if (query.negotiatingWithServer || (_.isDate(query.lastRun) && query.lastRun.getTime() + 100 > new Date().getTime())) {
                return query.promise;
            }
            else {
                /** Set flag to prevent another call while this query is active */
                query.negotiatingWithServer = true;
                /** Set flag if this if the first time this query has been run */
                var firstRunQuery = _.isNull(query.lastRun);
                var defaults = {
                    /** Designate the central cache for this query if not already set */
                    target: query.getCache()
                };
                /** Extend defaults with any options */
                var queryOptions = _.assign({}, defaults, options);
                apDataService.executeQuery(model, query, queryOptions).then(function (results) {
                    if (firstRunQuery) {
                        /** Promise resolved the first time query is completed */
                        query.initialized.resolve(queryOptions.target);
                    }
                    /** Remove lock to allow for future requests */
                    query.negotiatingWithServer = false;
                    /** Store query completion date/time on model to allow us to identify age of data */
                    model.lastServerUpdate = new Date();
                    deferred.resolve(queryOptions.target);
                });
                /** Save reference on the query **/
                query.promise = deferred.promise;
                return deferred.promise;
            }
        };
        Query.prototype.getCache = function () {
            return this.indexedCache;
        };
        return Query;
    })();
    ap.Query = Query;
    var QueryFactory = (function () {
        function QueryFactory(_$q_, _apConfig_, _apDataService_, _apDefaultListItemQueryOptions_, _apIndexedCacheFactory_) {
            this.Query = Query;
            $q = _$q_;
            apConfig = _apConfig_;
            apDataService = _apDataService_;
            apDefaultListItemQueryOptions = _apDefaultListItemQueryOptions_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apQueryFactory:create
         * @methodOf angularPoint.apQueryFactory
         * @param {object} config Options object.
         * @param {object} model Reference to the model.
         * @description
         * Instantiates and returns a new Query.
         */
        QueryFactory.prototype.create = function (config, model) {
            return new Query(config, model);
        };
        QueryFactory.$inject = ['$q', 'apConfig', 'apDataService', 'apDefaultListItemQueryOptions', 'apIndexedCacheFactory'];
        return QueryFactory;
    })();
    ap.QueryFactory = QueryFactory;
    /**
     * @ngdoc object
     * @name angularPoint.apQueryFactory
     * @description
     * Exposes the Query prototype and a constructor to instantiate a new Query.
     *
     * @requires angularPoint.apDataService
     * @requires angularPoint.apConfig
     */
    angular.module('angularPoint')
        .service('apQueryFactory', QueryFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var apUtilityService;
    /**
     * @ngdoc function
     * @name User
     * @description
     * Allows for easier distinction when debugging if object type is shown as a User.  Turns a delimited ";#"
     * string into an object shown below depeinding on field settings:
     * <pre>
     * {
         *      lookupId: 1,
         *      lookupValue: 'Joe User'
         * }
     * </pre>
     * or
     * <pre>
     * {
         *      lookupId: 1,
         *      lookupValue: 'Joe User',
         *      loginName: 'joe.user',
         *      email: 'joe@company.com',
         *      sipAddress: 'whatever',
         *      title: 'Sr. Widget Maker'
         * }
     * </pre>
     * @param {string} s Delimited string used to create a User object.
     * @constructor
     */
    var User = (function () {
        function User(str) {
            var self = this;
            var thisUser = new apUtilityService.SplitIndex(str);
            var thisUserExpanded = thisUser.value.split(',#');
            if (thisUserExpanded.length === 1) {
                //Standard user columns only return a id,#value pair
                self.lookupId = thisUser.id;
                self.lookupValue = thisUser.value;
            }
            else {
                //Allow for case where user adds additional properties when setting up field
                self.lookupId = thisUser.id;
                self.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
                self.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
                self.email = thisUserExpanded[2].replace(/(,,)/g, ',');
                self.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
                self.title = thisUserExpanded[4].replace(/(,,)/g, ',');
            }
        }
        return User;
    })();
    var UserFactory = (function () {
        function UserFactory(_apUtilityService_) {
            this.User = User;
            apUtilityService = _apUtilityService_;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apUserFactory:create
         * @methodOf angularPoint.apUserFactory
         * @description
         * Instantiates and returns a new User field.
         */
        UserFactory.prototype.create = function (s) {
            return new User(s);
        };
        UserFactory.$inject = ['apUtilityService'];
        return UserFactory;
    })();
    ap.UserFactory = UserFactory;
    /**
     * @ngdoc function
     * @name angularPoint.apUserFactory
     * @description
     * Tools to assist with the creation of CAML queries.
     *
     */
    angular.module('angularPoint')
        .service('apUserFactory', UserFactory);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    /** Local references to cached promises */
    var _getGroupCollection, _getUserProfile;
    var UserModel = (function () {
        function UserModel($q, apDataService) {
            this.$q = $q;
            this.apDataService = apDataService;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:checkIfMember
         * @methodOf angularPoint.apUserModel
         * @description
         * Checks to see if current user is a member of the specified group.
         * @param {string} groupName Name of the group.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {object} Returns the group definition if the user is a member. {ID:string, Name:string, Description:string, OwnerId:string, OwnerIsUser:string}
         * @example
         * <pre>{ID: "190", Name: "Blog Contributors", Description: "We are bloggers...", OwnerID: "126", OwnerIsUser: "False"}</pre>
         */
        UserModel.prototype.checkIfMember = function (groupName, force) {
            if (force === void 0) { force = false; }
            //Allow function to be called before group collection is ready
            var deferred = this.$q.defer();
            //Initially ensure groups are ready, any future calls will receive the return
            this.getGroupCollection(force).then(function (groupCollection) {
                var groupDefinition = _.find(groupCollection, { Name: groupName });
                deferred.resolve(groupDefinition);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getGroupCollection
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the group definitions for the current user and caches results.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {IGroupDefinition[]} Promise which resolves with the array of groups the user belongs to.
         */
        UserModel.prototype.getGroupCollection = function (force) {
            var _this = this;
            if (force === void 0) { force = false; }
            if (!_getGroupCollection || force) {
                /** Create a new deferred object if not already defined */
                var deferred = this.$q.defer();
                this.getUserProfile(force).then(function (userProfile) {
                    _this.apDataService.getGroupCollectionFromUser(userProfile.userLoginName)
                        .then(function (groupCollection) {
                        deferred.resolve(groupCollection);
                    });
                });
                _getGroupCollection = deferred.promise;
            }
            return _getGroupCollection;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getUserProfile
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the user profile for the current user and caches results.
         * Pull user profile info and parse into a profile object
         * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {object} Promise which resolves with the requested user profile.
         */
        UserModel.prototype.getUserProfile = function (force) {
            if (force === void 0) { force = false; }
            if (!_getUserProfile || force) {
                /** Create a new deferred object if not already defined */
                _getUserProfile = this.apDataService.getUserProfileByName();
            }
            return _getUserProfile;
        };
        UserModel.$inject = ['$q', 'apDataService'];
        return UserModel;
    })();
    /**
     * @ngdoc service
     * @name angularPoint.apUserModel
     * @description
     * Simple service that allows us to request and cache both the current user and their group memberships.
     *
     * @requires apDataService
     *
     */
    angular.module('angularPoint')
        .service('apUserModel', UserModel);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ap;
(function (ap) {
    'use strict';
    var service, $q, $log, apIndexedCacheFactory;
    /**
     * @description Stores list names when a new model is registered along with the GUID to allow us to
     *     retrieve the GUID in future
     * @example
     * <pre>
     *     listNameToIdMap = {
         *          list1Name: {
         *              model: list1Model,
         *              listId: list1GUID
         *          },
         *          list2Name: {
         *              model: list2Model,
         *              listId: list2GUID
         *          }
         *          ...
         *     }
     * </pre>
     */
    var listNameToIdMap = {}, 
    /**
     * @description Stores list GUID when a new model is registered with a reference to the model for
     *     future reference.
     * @example
     * <pre>
     *     listsMappedByListId = {
     *          list1GUID: {
     *              model: list1Model
     *          },
     *          list2GUID: {
     *              model: list2Model
     *          }
     *          ...
     *     }
     * </pre>
     */
    listsMappedByListId = {}, 
    /**
     * @description The Main cache object which stores ModelCache objects.  Keys being the model GUID and
     *     value being an a ModelCache object
     * @example
     * <pre>
     *     entityCache = {
     *          list1GUID: {
     *              item1ID: { //EnityCache for entity 1
     *                  associationQueue: [],
     *                  updateCount: 3,
     *                  listId: list1GUID,
     *                  entityId: item1ID,
     *                  entityLocations: [],
     *                  entity: {} //This is where the actual entity is referenced
     *              }
     *              item2ID: { //EnityCache for entity 2
     *                  ...
     *              }
     *          },
     *          list2GUID: {
     *              item1ID: ...
     *          }
     *          ...
     *     }
     * </pre>
     */
    entityCache = {};
    /**
     * @name EntityCache
     * @description
     * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
     * the cache has been updated, timestamp of last update, and add/update/remove functionality.
     * @constructor apCacheService
     * @param {string} listId GUID for list the list item belongs to.
     * @param {number} entityId The entity.id.
     */
    var EntityContainer = (function () {
        function EntityContainer(listId, entityId) {
            this.entityId = entityId;
            this.associationQueue = [];
            this.entityLocations = [];
            this.updateCount = 0;
            this.listId = service.getListId(listId);
        }
        /**
         * @name EntityContainer.getEntity
         * @description
         * Promise which returns the requested entity once it has been registered in the cache.
         */
        EntityContainer.prototype.getEntity = function () {
            var entityContainer = this;
            var deferred = $q.defer();
            if (entityContainer.entity) {
                /** Entity already exists so resolve immediately */
                deferred.resolve(entityContainer.entity);
            }
            else {
                entityContainer.associationQueue.push(deferred);
            }
            return deferred.promise;
        };
        EntityContainer.prototype.removeEntity = function () {
            var entityContainer = this;
            service.removeEntity(entityContainer.listId, entityContainer.entityId);
        };
        return EntityContainer;
    })();
    /**
     * @name ModelCache
     * @description
     * Cache of Entity Containers for each registered entity retrieved by the model.
     * @constructor
     */
    var ModelCache = (function (_super) {
        __extends(ModelCache, _super);
        function ModelCache() {
            _super.apply(this, arguments);
        }
        return ModelCache;
    })(ap.IndexedCache);
    var CacheService = (function () {
        function CacheService(_$q_, _$log_, _apIndexedCacheFactory_) {
            this.entityCache = entityCache;
            $q = _$q_;
            $log = _$log_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;
            service = this;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:deleteEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Deletes all references to an entity.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        CacheService.prototype.deleteEntity = function (listId, entityId) {
            var entityTypeKey = this.getListId(listId);
            this.removeEntity(entityTypeKey, entityId);
            var model = this.getModel(entityTypeKey);
            _.each(model.queries, function (query) {
                var cache = query.getCache();
                cache.removeEntity(entityId);
            });
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getCachedEntities
         * @methodOf angularPoint.apCacheService
         * @description
         * Returns all entities for a given model as an indexed cache with keys being the entity id's.
         * @param {string} listId GUID for list the list item belongs to.
         * @returns {object} Indexed cache containing all entities for a model.
         */
        CacheService.prototype.getCachedEntities = function (listId) {
            var modelCache = this.getModelCache(listId), allEntities = apIndexedCacheFactory.create();
            _.each(modelCache, function (entityContainer) {
                if (entityContainer.entity && entityContainer.entity.id) {
                    allEntities.addEntity(entityContainer.entity);
                }
            });
            return allEntities;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getCachedEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Synchronise call to return a cached entity;
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {object} entity || undefined
         */
        CacheService.prototype.getCachedEntity = function (listId, entityId) {
            return this.getEntityContainer(listId, entityId).entity;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Returns a deferred object that resolves with the requested entity immediately if already present or at
         *     some point in the future assuming the entity is eventually registered.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {promise} entity
         */
        CacheService.prototype.getEntity = function (listId, entityId) {
            var entityContainer = this.getEntityContainer(listId, entityId);
            return entityContainer.getEntity();
        };
        CacheService.prototype.getEntityContainer = function (listId, entityId) {
            var entityTypeKey = this.getListId(listId);
            var modelCache = this.getModelCache(entityTypeKey);
            /** Create the object structure if it doesn't already exist */
            modelCache[entityId] = modelCache[entityId] || new EntityContainer(entityTypeKey, entityId);
            return modelCache[entityId];
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getListId
         * @methodOf angularPoint.apCacheService
         * @description
         * Allows us to use either the List Name or the list GUID and returns the lowercase GUID
         * @param {string} keyString List GUID or name.
         * @returns {string} Lowercase list GUID.
         */
        CacheService.prototype.getListId = function (keyString) {
            if (_.isGuid(keyString)) {
                /** GUID */
                return keyString.toLowerCase();
            }
            else {
                /** List Title */
                return this.getListIdFromListName(keyString);
            }
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getListIdFromListName
         * @methodOf angularPoint.apCacheService
         * @description
         * Allows us to lookup an entity cache using the name of the list instead of the GUID.
         * @param {string} name The name of the list.
         * @returns {string} GUID for the list.
         */
        CacheService.prototype.getListIdFromListName = function (name) {
            var guid;
            if (listNameToIdMap[name] && listNameToIdMap[name].listId) {
                guid = listNameToIdMap[name].listId;
            }
            return guid;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getModel
         * @methodOf angularPoint.apCacheService
         * @description
         * Allows us to retrieve a reference to a given model by either the list title or list GUID.
         * @param {string} listId List title or list GUID.
         * @returns {object} A reference to the requested model.
         */
        CacheService.prototype.getModel = function (listId) {
            var model, entityTypeKey = this.getListId(listId);
            if (listsMappedByListId[entityTypeKey]) {
                model = listsMappedByListId[entityTypeKey].model;
            }
            return model;
        };
        /** Locates the stored cache for a model */
        CacheService.prototype.getModelCache = function (listId) {
            var entityTypeKey = this.getListId(listId);
            entityCache[entityTypeKey] = entityCache[entityTypeKey] || new ModelCache();
            return entityCache[entityTypeKey];
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Registers an entity in the cache and fulfills any pending deferred requests for the entity. If the
         * entity already exists in the cache, we extend the existing object with the updated entity and return a
         * reference to this updated object so the there is only a single instance of this entity withing the cache.
         * @param {object} entity Pass in a newly created entity to add to the cache.
         * @param {object} [targetCache] Optionally pass in a secondary cache to add a reference to this entity.
         */
        CacheService.prototype.registerEntity = function (entity, targetCache) {
            var model = entity.getModel();
            var entityContainer = this.getEntityContainer(model.list.getListId(), entity.id);
            /** Maintain a single object in cache for this entity */
            if (!_.isObject(entityContainer.entity)) {
                /** Entity isn't currently in the cache */
                entityContainer.entity = entity;
            }
            else {
                /** Already exists so update to maintain any other references being used for this entity. */
                //TODO Look at performance hit from extending and see if it would be acceptable just to replace
                _.assign(entityContainer.entity, entity);
            }
            /** Counter to keep track of the number of updates for this entity */
            entityContainer.updateCount++;
            if (_.isObject(targetCache) && !_.isArray(targetCache) && !targetCache[entity.id]) {
                /** Entity hasn't been added to the target cache yet */
                targetCache[entity.id] = entityContainer.entity;
            }
            /** Resolve any requests for this entity */
            _.each(entityContainer.associationQueue, function (deferredRequest) {
                deferredRequest.resolve(entityContainer.entity);
                /** Remove request from queue */
                entityContainer.associationQueue.shift();
            });
            return entityContainer.entity;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerModel
         * @methodOf angularPoint.apCacheService
         * @description
         * Creates a new ModelCache for the provide model where all list items will be stored with the key equaling
         * the entity id's and value being a EntityContainer.  The entity is stored at EntityContainer.entity.
         * @param {object} model Model to create the cache for.
         */
        CacheService.prototype.registerModel = function (model) {
            if (model.list && model.list.getListId() && model.list.title) {
                var listId = model.list.getListId().toLowerCase();
                /** Store a reference to the model by list title */
                listNameToIdMap[model.list.title] = {
                    model: model,
                    listId: listId
                };
                /** Store a reference to the model by list guid */
                listsMappedByListId[listId] = {
                    model: model
                };
            }
        };
        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:removeEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Removes the entity from the local entity cache.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        CacheService.prototype.removeEntity = function (listId, entityId) {
            var modelCache = this.getModelCache(listId);
            if (modelCache[entityId]) {
                delete modelCache[entityId];
            }
        };
        CacheService.$inject = ['$q', '$log', 'apIndexedCacheFactory'];
        return CacheService;
    })();
    ap.CacheService = CacheService;
    /**
     * @ngdoc service
     * @name angularPoint.apCacheService
     * @description
     * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises
     *     that resolve once a requested list item is registered in the future.
     */
    angular.module('angularPoint')
        .service('apCacheService', CacheService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    /**
     * @ngdoc service
     * @name apChangeService
     * @description
     * Primarily used for apMockBackend so we can know what to expect before an attempt to update a list
     * item is intercepted.
     */
    var ChangeService = (function () {
        function ChangeService() {
            this.callbackQueue = [];
        }
        ChangeService.prototype.registerListItemUpdate = function (entity, options, promise) {
            _.each(this.callbackQueue, function (callback) {
                callback(entity, options, promise);
            });
        };
        ChangeService.prototype.subscribeToUpdates = function (callback) {
            this.callbackQueue.push(callback);
        };
        return ChangeService;
    })();
    ap.ChangeService = ChangeService;
    angular
        .module('angularPoint')
        .service('apChangeService', ChangeService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var service, $q, $timeout, $http, apConfig, apUtilityService, apCacheService, apDecodeService, apEncodeService, apFieldService, apIndexedCacheFactory, toastr, SPServices, apDefaultListItemQueryOptions, apWebServiceOperationConstants, apXMLToJSONService, apChangeService;
    var DataService = (function () {
        function DataService(_$http_, _$q_, _$timeout_, _apCacheService_, _apChangeService_, _apConfig_, _apDecodeService_, _apDefaultListItemQueryOptions_, _apEncodeService_, _apFieldService_, _apIndexedCacheFactory_, _apUtilityService_, _apWebServiceOperationConstants_, _apXMLToJSONService_, _SPServices_, _toastr_) {
            service = this;
            $http = _$http_;
            $q = _$q_;
            $timeout = _$timeout_;
            apCacheService = _apCacheService_;
            apChangeService = _apChangeService_;
            apConfig = _apConfig_;
            apDecodeService = _apDecodeService_;
            apDefaultListItemQueryOptions = _apDefaultListItemQueryOptions_;
            apEncodeService = _apEncodeService_;
            apFieldService = _apFieldService_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;
            apUtilityService = _apUtilityService_;
            apWebServiceOperationConstants = _apWebServiceOperationConstants_;
            apXMLToJSONService = _apXMLToJSONService_;
            SPServices = _SPServices_;
            toastr = _toastr_;
        }
        /**
         * @ngdoc function
         * @name DataService.createListItem
         * @description
         * Creates a new list item for the provided model.
         * @param {object} model Reference to the entities model.
         * @param {object} listItem JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        DataService.prototype.createListItem = function (model, listItem, options) {
            var defaults = {
                batchCmd: 'New',
                buildValuePairs: true,
                indexedCache: apIndexedCacheFactory.create({}),
                listName: model.list.getListId(),
                operation: 'UpdateListItems',
                target: undefined,
                valuePairs: [],
                webURL: model.list.identifyWebURL()
            }, deferred = $q.defer();
            defaults.target = defaults.indexedCache;
            var opts = _.assign({}, defaults, options);
            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, { readOnly: false });
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, listItem);
            }
            opts.getCache = function () { return opts.indexedCache; };
            /** Overload the function then pass anything past the first parameter to the supporting methods */
            this.serviceWrapper(opts)
                .then(function (response) {
                /** Online this should return an XML object */
                var indexedCache = apDecodeService.processListItems(model, opts, response, opts);
                /** Return reference to last listItem in cache because it will have the new highest id */
                deferred.resolve(indexedCache.last());
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        DataService.prototype.createItemUrlFromFileRef = function (fileRefString) {
            return window.location.protocol + '//' + window.location.hostname + '/' + fileRefString;
        };
        /**
         * @ngdoc function
         * @name DataService.deleteAttachment
         * @description
         * Deletes and attachment on a list item.  Most commonly used by ListItem.deleteAttachment which is shown
         * in the example.
         *
         * @param {object} options Configuration parameters.
         * @param {string} options.listItemId ID of the list item with the attachment.
         * @param {string} options.url Requires the URL for the attachment we want to delete.
         * @param {string} options.listName Best option is the GUID of the list.
         * <pre>'{37388A98-534C-4A28-BFFA-22429276897B}'</pre>
         *
         * @returns {object} Promise which resolves with the updated attachment collection.
         *
         * @example
         * <pre>
         * ListItem.prototype.deleteAttachment = function (url) {
         *    var listItem = this;
         *    return DataService.deleteAttachment({
         *        listItemId: listItem.id,
         *        url: url,
         *        listName: listItem.getModel().list.getListId()
         *    });
         * };
         * </pre>
         */
        DataService.prototype.deleteAttachment = function (options) {
            var defaults = {
                operation: 'DeleteAttachment',
                filterNode: 'Field'
            };
            var opts = _.assign({}, defaults, options);
            return this.serviceWrapper(opts);
        };
        /**
         * @ngdoc function
         * @name DataService.deleteListItem
         * @description
         * Typically called directly from a list item, removes the list item from SharePoint
         * and the local cache.
         * @param {object} model Reference to the entities model.
         * @param {object} listItem JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {Array} [options.target=item.getCache()] Optional location to search through and remove the
         * local cached copy.
         * @returns {object} Promise which resolves when the operation is complete.  Nothing of importance is returned.
         */
        DataService.prototype.deleteListItem = function (model, listItem, options) {
            var defaults = {
                target: _.isFunction(listItem.getCache) ? listItem.getCache() : model.getCache(),
                operation: 'UpdateListItems',
                listName: model.list.getListId(),
                batchCmd: 'Delete',
                ID: listItem.id,
                webURL: model.list.identifyWebURL()
            };
            var opts = _.assign({}, defaults, options);
            /** Check to see if list item or document because documents need the FileRef as well as id to delete */
            if (listItem.fileRef && listItem.fileRef.lookupValue) {
                var fileExtension = listItem.fileRef.lookupValue.split('.').pop();
                if (isNaN(fileExtension)) {
                    /** File extension instead of numeric extension so it's a document
                     * @Example
                     * Document: "Site/library/file.csv"
                     * List Item: "Site/List/5_.000"
                     * */
                    opts.valuePairs = [['FileRef', listItem.fileRef.lookupValue]];
                }
            }
            var deferred = $q.defer();
            this.serviceWrapper(opts)
                .then(function () {
                /** Success */
                apCacheService.deleteEntity(opts.listName, listItem.id);
                deferred.resolve();
            }, function (outcome) {
                //In the event of an error, display toast
                toastr.error('There was an error deleting a list item from ' + model.list.title);
                deferred.reject(outcome);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.executeQuery
         * @description
         * Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.
         * @param {object} model Reference to the model where the Query resides.
         * @param {object} query Reference to the Query making the call.
         * @param {object} [options] Optional configuration parameters.
         * @param {Array} [options.target=model.getCache()] The target destination for returned entities
         * @returns {object} - Key value hash containing all list item id's as keys with the listItem as the value.
         */
        DataService.prototype.executeQuery = function (model, query, options) {
            var _this = this;
            var defaults = {
                target: model.getCache()
            };
            var deferred = $q.defer();
            /** Extend defaults **/
            var opts = _.assign({}, defaults, options);
            this.serviceWrapper(query)
                .then(function (response) {
                if (query.operation === 'GetListItemChangesSinceToken') {
                    _this.processChangeTokenXML(model, query, response, opts);
                }
                /** Convert the XML into JS objects */
                var entities = apDecodeService.processListItems(model, query, response, opts);
                deferred.resolve(entities);
                /** Set date time to allow for time based updates */
                query.lastRun = new Date();
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.generateWebServiceUrl
         * @description
         * Builds the appropriate SharePoint resource URL.  If a URL isn't provided and it hasn't already been cached
         * we make a call to the server to find the root URL.  All future requests will then use this cached value.
         * @param {string} service The name of the service the SOAP operation is using.
         * @param {string} [webURL] Optionally provide the URL so we don't need to make a call to the server.
         * @returns {promise} Resolves with the url for the service.
         */
        DataService.prototype.generateWebServiceUrl = function (service, webURL) {
            var ajaxURL = "_vti_bin/" + service + ".asmx", deferred = $q.defer();
            if (webURL) {
                ajaxURL = webURL.charAt(webURL.length - 1) === '/' ?
                    webURL + ajaxURL : webURL + '/' + ajaxURL;
                deferred.resolve(ajaxURL);
            }
            else {
                this.getCurrentSite().then(function (thisSite) {
                    ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === '/') ? ajaxURL : ('/' + ajaxURL));
                    deferred.resolve(ajaxURL);
                });
            }
            return deferred.promise;
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
         *     .then(function(templateArray) {
         *          ....templateArray = [{
         *              "name": "WidgetApproval",
         *              "instantiationUrl": "https: //sharepoint.mycompany.com/_layouts/IniWrkflIP.aspx?List=fc17890e-8c0…311-cea9-40d1-a183-6edde9333815}&Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}",
         *              "templateId": "59062311-cea9-40d1-a183-6edde9333815"
         *          }]
         *     });
         * </pre>
         * @param {string} fileRefString Relative or static url referencing the item.
         * @returns {object} Resolves with an array of objects defining each of the available workflows for the item.
         */
        DataService.prototype.getAvailableWorkflows = function (fileRefString) {
            var deferred = $q.defer();
            /** Build the full url for the fileRef if not already provided.  FileRef for an item defaults to a relative url */
            var itemUrl = fileRefString.indexOf(': //') > -1 ? fileRefString : this.createItemUrlFromFileRef(fileRefString);
            this.serviceWrapper({
                operation: 'GetTemplatesForItem',
                item: itemUrl
            }).then(function (responseXML) {
                var workflowTemplates = [];
                var xmlTemplates = $(responseXML).SPFilterNode('WorkflowTemplate');
                _.each(xmlTemplates, function (xmlTemplate) {
                    var template = {
                        name: $(xmlTemplate).attr('Name'),
                        instantiationUrl: $(xmlTemplate).attr('InstantiationUrl'),
                        templateId: '{' + $(xmlTemplate).find('WorkflowTemplateIdSet').attr('TemplateId') + '}'
                    };
                    workflowTemplates.push(template);
                });
                deferred.resolve(workflowTemplates);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.getCollection
         * @description
         * Used to handle any of the Get[filterNode]Collection calls to SharePoint
         *
         * @param {Object} options - object used to extend payload and needs to include all SPServices required attributes
         * @param {string} [options.operation] GetUserCollectionFromSite
         * @param {string} [options.operation] GetGroupCollectionFromSite
         * @param {string} [options.operation] GetGroupCollectionFromUser @requires options.userLoginName
         * @param {string} [options.operation] GetUserCollectionFromGroup @requires options.groupName
         * @param {string} [options.operation] GetListCollection
         * @param {string} [options.operation] GetViewCollection @requires options.listName
         * @param {string} [options.operation] GetAttachmentCollection @requires options.listName & options.ID
         * @param {string} [options.filterNode] - Value to iterate over in returned XML
         *         if not provided it's extracted from the name of the operation
         *         ex: Get[User]CollectionFromSite, "User" is used as the filterNode
         *
         * @returns {object[]} Promise which when resolved will contain an array of objects representing the
         * requested collection.
         *
         * @example
         * <pre>
         * DataService.getCollection({
         *        operation: "GetGroupCollectionFromUser",
         *        userLoginName: $scope.state.selectedUser.LoginName
         *        }).then(function (response) {
         *            postProcessFunction(response);
         *       });
         * </pre>
         */
        DataService.prototype.getCollection = function (options) {
            var defaults = {
                postProcess: processXML
            };
            var opts = _.assign({}, defaults, options);
            /** Determine the XML node to iterate over if filterNode isn't provided */
            var filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];
            var deferred = $q.defer();
            /** Convert the xml returned from the server into an array of js objects */
            function processXML(serverResponse) {
                var convertedItems = [];
                /** Get attachments only returns the links associated with a list item */
                if (opts.operation === 'GetAttachmentCollection') {
                    /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                    $(serverResponse).SPFilterNode(filterNode).each(function () {
                        convertedItems.push($(this).text());
                    });
                }
                else {
                    var nodes = $(serverResponse).SPFilterNode(filterNode);
                    convertedItems = apXMLToJSONService.parse(nodes, { includeAllAttrs: true, removeOws: false });
                }
                return convertedItems;
            }
            var validPayload = this.validateCollectionPayload(opts);
            if (validPayload) {
                this.serviceWrapper(opts)
                    .then(function (response) {
                    deferred.resolve(response);
                });
            }
            else {
                toastr.error('Invalid payload: ', opts);
                deferred.reject();
            }
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.getCurrentSite
         * @description
         * Requests and caches the root url for the current site.  It caches the response so any future calls receive
         * the cached promise.
         * @returns {promise} Resolves with the current site root url.
         */
        DataService.prototype.getCurrentSite = function () {
            var deferred = $q.defer();
            //var self = this.getCurrentSite;
            if (!this.queryForCurrentSite) {
                /** We only want to run this once so cache the promise the first time and just reference it in the future */
                this.queryForCurrentSite = deferred.promise;
                var msg = SPServices.SOAPEnvelope.header +
                    "<WebUrlFromPageUrl xmlns='" + SPServices.SCHEMASharePoint + "/soap/' ><pageUrl>" +
                    ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
                    "</pageUrl></WebUrlFromPageUrl>" +
                    SPServices.SOAPEnvelope.footer;
                $http({
                    method: 'POST',
                    url: '/_vti_bin/Webs.asmx',
                    data: msg,
                    responseType: "document",
                    headers: {
                        "Content-Type": "text/xml;charset='utf-8'"
                    }
                }).then(function (response) {
                    /** Success */
                    apConfig.defaultUrl = $(response.data).find("WebUrlFromPageUrlResult").text();
                    deferred.resolve(apConfig.defaultUrl);
                }, function (response) {
                    /** Error */
                    var error = apDecodeService.checkResponseForErrors(response.data);
                    deferred.reject(error);
                });
            }
            return this.queryForCurrentSite;
        };
        /**
         * @ngdoc function
         * @name DataService.getFieldVersionHistory
         * @description
         * Returns the version history for a field in a list item.
         * @param {object} options Configuration object passed to SPServices.
         * <pre>
         * var options = {
         *        operation: 'GetVersionCollection',
         *        webURL: apConfig.defaultUrl,
         *        strlistID: model.list.getListId(),
         *        strlistItemID: listItem.id,
         *        strFieldName: fieldDefinition.staticName
         *    };
         * </pre>
         * @param {object} fieldDefinition Field definition object from the model.
         * @returns {object[]} Promise which resolves with an array of list item changes for the specified field.
         */
        DataService.prototype.getFieldVersionHistory = function (options, fieldDefinition) {
            var defaults = {
                operation: 'GetVersionCollection'
            };
            var opts = _.assign({}, defaults, options);
            var deferred = $q.defer();
            this.serviceWrapper(opts)
                .then(function (response) {
                /** Parse XML response */
                var versions = apDecodeService.parseFieldVersions(response, fieldDefinition);
                /** Resolve with an array of all field versions */
                deferred.resolve(versions);
            }, function (outcome) {
                /** Failure */
                toastr.error('Failed to fetch version history.');
                deferred.reject(outcome);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.getGroupCollectionFromUser
         * @description
         * Fetches an array of group names the user is a member of.  If no user is provided we use the current user.
         * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
         * @returns {string[]} Promise which resolves with the array of groups the user belongs to.
         */
        DataService.prototype.getGroupCollectionFromUser = function (login) {
            var _this = this;
            /** Create a new deferred object if not already defined */
            var deferred = $q.defer();
            var getGroupCollection = function (userLoginName) {
                _this.serviceWrapper({
                    operation: 'GetGroupCollectionFromUser',
                    userLoginName: userLoginName,
                    filterNode: 'Group'
                }).then(function (groupCollection) { return deferred.resolve(groupCollection); });
            };
            if (!login) {
                /** No login name provided so lookup profile for current user */
                this.getUserProfileByName()
                    .then(function (userProfile) { return getGroupCollection(userProfile.userLoginName); });
            }
            else {
                getGroupCollection(login);
            }
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.getList
         * @description
         * Returns all list details including field and list config.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {object} Promise which resolves with an object defining field and list config.
         */
        DataService.prototype.getList = function (options) {
            var defaults = {
                operation: 'GetList'
            };
            var opts = _.assign({}, defaults, options);
            return this.serviceWrapper(opts);
        };
        /**
         * @ngdoc function
         * @name DataService.getListFields
         * @description
         * Returns field definitions for a specified list.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {Promise} Promise which resolves with an array of field definitions for the list.
         */
        DataService.prototype.getListFields = function (options) {
            var deferred = $q.defer();
            this.getList(options)
                .then(function (responseXml) {
                var nodes = $(responseXml).SPFilterNode('Field');
                var fields = apXMLToJSONService.parse(nodes, { includeAllAttrs: true, removeOws: false });
                deferred.resolve(fields);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.getUserProfile
         * @description
         * Returns the profile for an optional user, but defaults the the current user if one isn't provided.
         * Pull user profile info and parse into a profile object
         * http: //spservices.codeplex.com/wikipage?title=GetUserProfileByName
         * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
         * @returns {object} Promise which resolves with the requested user profile.
         */
        DataService.prototype.getUserProfileByName = function (login) {
            var deferred = $q.defer();
            var payload = {
                accountName: undefined,
                operation: 'GetUserProfileByName'
            };
            if (login) {
                payload.accountName = login;
            }
            this.serviceWrapper(payload)
                .then(function (serverResponse) {
                var userProfile = {
                    AccountName: undefined,
                    userLoginName: undefined
                };
                //Not formatted like a normal SP response so need to manually parse
                $(serverResponse).SPFilterNode('PropertyData').each(function () {
                    var nodeName = $(this).SPFilterNode('Name');
                    var nodeValue = $(this).SPFilterNode('Value');
                    if (nodeName.length > 0 && nodeValue.length > 0) {
                        userProfile[nodeName.text().trim()] = nodeValue.text().trim();
                    }
                });
                /** Optionally specify a necessary prefix that should appear before the user login */
                userProfile.userLoginName = apConfig.userLoginNamePrefix ?
                    (apConfig.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
                deferred.resolve(userProfile);
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.processChangeTokenXML
         * @description
         * The initial call to GetListItemChangesSinceToken also includes the field definitions for the
         * list so extend the existing field definitions and list defined in the model.  After that, store
         * the change token and make any changes to the user's permissions for the list.
         * @param {Model} model List model.
         * @param {IQuery} query Valid query object.
         * @param {XMLDocument} responseXML XML response from the server.
         * @param {object} opts Config options built up along the way.
         */
        DataService.prototype.processChangeTokenXML = function (model, query, responseXML, opts) {
            if (!model.deferredListDefinition) {
                var deferred = $q.defer();
                /** Replace the null placeholder with this promise so we don't have to process in the future and also
                 * don't have to query again if we run Model.extendListMetadata. */
                model.deferredListDefinition = deferred.promise;
                /** Immediately resolve because there's no need to perform any async actions */
                deferred.resolve(model);
                apDecodeService.extendListMetadata(model, responseXML);
            }
            /** Store token for future web service calls to return changes */
            query.changeToken = this.retrieveChangeToken(responseXML);
            /** Update the user permissions for this list */
            var effectivePermissionMask = this.retrievePermMask(responseXML);
            if (effectivePermissionMask) {
                model.list.effectivePermMask = effectivePermissionMask;
            }
            /** Change token query includes deleted items as well so we need to process them separately */
            this.processDeletionsSinceToken(responseXML, opts.target);
        };
        /**
         * @ngdoc function
         * @name DataService.processDeletionsSinceToken
         * @description
         * GetListItemChangesSinceToken returns items that have been added as well as deleted so we need
         * to remove the deleted items from the local cache.
         * @param {XMLDocument} responseXML XML response from the server.
         * @param {Object} indexedCache Cached object of key value pairs.
         */
        DataService.prototype.processDeletionsSinceToken = function (responseXML, indexedCache) {
            /** Remove any locally cached entities that were deleted from the server */
            $(responseXML).SPFilterNode('Id').each(function () {
                /** Check for the type of change */
                var changeType = $(this).attr('ChangeType');
                if (changeType === 'Delete') {
                    var listItemId = parseInt($(this).text(), 10);
                    /** Remove from local data array */
                    indexedCache.removeEntity(listItemId);
                }
            });
        };
        /**
         * @ngdoc function
         * @name DataService.requestData
         * @description
         * The primary function that handles all communication with the server.  This is very low level and isn't
         * intended to be called directly.
         * @param {object} opts Payload object containing the details of the request.
         * @returns {promise} Promise that resolves with the server response.
         */
        DataService.prototype.requestData = function (opts) {
            var deferred = $q.defer();
            var soapData = SPServices.generateXMLComponents(opts);
            var service = apWebServiceOperationConstants[opts.operation][0];
            this.generateWebServiceUrl(service, opts.webURL)
                .then(function (url) {
                $http.post(url, soapData.msg, {
                    responseType: "document",
                    headers: {
                        "Content-Type": "text/xml;charset='utf-8'",
                        SOAPAction: function () { return soapData.SOAPAction ? soapData.SOAPAction : null; }
                    },
                    transformResponse: function (data, headersGetter) {
                        if (_.isString(data)) {
                            data = $.parseXML(data);
                        }
                        return data;
                    }
                }).then(function (response) {
                    /** Success */
                    /** Errors can still be resolved without throwing an error so check the XML */
                    var error = apDecodeService.checkResponseForErrors(response.data);
                    if (error) {
                        console.error(error, opts);
                        deferred.reject(error);
                    }
                    else {
                        deferred.resolve(response.data);
                    }
                }, function (response) {
                    /** Failure */
                    var error = apDecodeService.checkResponseForErrors(response.data);
                    console.error(response.statusText, opts);
                    deferred.reject(response.statusText + ': ' + error);
                });
            });
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name DataService.retrieveChangeToken
         * @description
         * Returns the change token from the xml response of a GetListItemChangesSinceToken query
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {XMLDocument} responseXML XML response from the server.
         */
        DataService.prototype.retrieveChangeToken = function (responseXML) {
            return $(responseXML).find('Changes').attr('LastChangeToken');
        };
        /**
         * @ngdoc function
         * @name DataService.retrievePermMask
         * @description
         * Returns the text representation of the users permission mask
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {XMLDocument} responseXML XML response from the server.
         */
        DataService.prototype.retrievePermMask = function (responseXML) {
            return $(responseXML).find('listitems').attr('EffectivePermMask');
        };
        /**
         * @ngdoc function
         * @name DataService.serviceWrapper
         * @description
         * Generic wrapper for any SPServices web service call.  The big benefit to this function is it allows us
         * to continue to use the $q promise model throughout the application instead of using the promise
         * implementation used in SPServices so we have a more consistent experience.
         * Check http: //spservices.codeplex.com/documentation for details on expected parameters for each operation.
         *
         * @param {object} options Payload params that is directly passed to SPServices.
         * @param {string} [options.webURL] XML filter string used to find the elements to iterate over.
         * @param {string} [options.filterNode] XML filter string used to find the elements to iterate over.
         * This is typically 'z: row' for list items.
         * @returns {object} Returns a promise which when resolved either returns clean objects parsed by the value
         * in options.filterNode or the raw XML response if a options.filterNode
         *
         *      If options.filterNode is provided, returns XML parsed by node name
         *      Otherwise returns the server response
         */
        DataService.prototype.serviceWrapper = function (options) {
            var defaults = {
                postProcess: processXML,
                webURL: apConfig.defaultUrl
            };
            var opts = _.assign({}, defaults, options);
            var deferred = $q.defer();
            /** Convert the xml returned from the server into an array of js objects */
            function processXML(serverResponse) {
                if (opts.filterNode) {
                    var nodes = $(serverResponse).SPFilterNode(opts.filterNode);
                    return apXMLToJSONService.parse(nodes, { includeAllAttrs: true, removeOws: false });
                }
                else {
                    return serverResponse;
                }
            }
            this.requestData(opts)
                .then(function (response) {
                /** Failure */
                var data = opts.postProcess(response);
                deferred.resolve(data);
            }, function (response) {
                /** Failure */
                toastr.error('Failed to complete the requested ' + opts.operation + ' operation.');
                deferred.reject(response);
            });
            return deferred.promise;
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
         * @returns {object} Deferred object that resolves once complete.
         * @example
         * <pre>
         * DataService.startWorkflow({
         *     item: "https: //server/site/Lists/item" + idData + "_.000",
         *     templateId: "{c29c1291-a25c-47d7-9345-8fb1de2a1fa3}",
         *     workflowParameters: "<Data><monthName>" + txtBox.value + "</monthName></Data>",
         *   ...}).then(function() {
         *       //Success
         *   }, function(err) {
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
            }, opts = _.assign({}, defaults, options);
            /** We have the relative file reference but we need to create the fully qualified reference */
            if (!opts.item && opts.fileRef) {
                opts.item = this.createItemUrlFromFileRef(opts.fileRef);
            }
            return this.serviceWrapper(opts);
        };
        /**
         * @ngdoc function
         * @name DataService.updateListItem
         * @description
         * Updates an existing list item.
         * @param {object} model Reference to the entities model.
         * @param {object} listItem JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        DataService.prototype.updateListItem = function (model, listItem, options) {
            var defaults = {
                batchCmd: 'Update',
                buildValuePairs: true,
                ID: listItem.id,
                listName: model.list.getListId(),
                operation: 'UpdateListItems',
                target: listItem.getCache(),
                valuePairs: [],
                webURL: model.list.identifyWebURL()
            }, deferred = $q.defer(), opts = _.assign({}, defaults, options);
            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, { readOnly: false });
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, listItem);
            }
            if (model.list.webURL && !opts.webURL) {
                opts.webURL = model.list.webURL;
            }
            /** Notify any listeners to expect a change */
            apChangeService.registerListItemUpdate(listItem, opts, deferred.promise);
            ///** Overload the function then pass anything past the first parameter to the supporting methods */
            //this.serviceWrapper(opts, listItem, model)
            this.serviceWrapper(opts)
                .then(function (response) {
                var indexedCache = apDecodeService.processListItems(model, listItem.getQuery(), response, opts);
                /** Return reference to updated listItem  */
                deferred.resolve(indexedCache[listItem.id]);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        /**
         * @description
         * Simply verifies that all components of the payload are present.
         * @param {object} opts Payload config.
         * @returns {boolean} Collection is valid.
         */
        DataService.prototype.validateCollectionPayload = function (opts) {
            var validPayload = true;
            var verifyParams = function (params) {
                _.each(params, function (param) {
                    if (!opts[param]) {
                        toastr.error('options' + param + ' is required to complete this operation');
                        validPayload = false;
                    }
                });
            };
            //Verify all required params are included
            switch (opts.operation) {
                case 'GetGroupCollectionFromUser':
                    verifyParams(['userLoginName']);
                    break;
                case 'GetUserCollectionFromGroup':
                    verifyParams(['groupName']);
                    break;
                case 'GetViewCollection':
                    verifyParams(['listName']);
                    break;
                case 'GetAttachmentCollection':
                    verifyParams(['listName', 'ID']);
                    break;
            }
            return validPayload;
        };
        DataService.$inject = ['$http', '$q', '$timeout', 'apCacheService', 'apChangeService', 'apConfig', 'apDecodeService',
            'apDefaultListItemQueryOptions', 'apEncodeService', 'apFieldService', 'apIndexedCacheFactory',
            'apUtilityService', 'apWebServiceOperationConstants', 'apXMLToJSONService', 'SPServices', 'toastr'];
        return DataService;
    })();
    ap.DataService = DataService;
    angular
        .module('angularPoint')
        .service('apDataService', DataService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    /**
     * @ngdoc service
     * @name angularPoint.apDecodeService
     * @description
     * Processes the XML received from SharePoint and converts it into JavaScript objects based on predefined field types.
     *
     * @requires angularPoint.apUtilityService
     * @requires angularPoint.apConfig
     * @requires angularPoint.apCacheService
     */
    var DecodeService = (function () {
        function DecodeService(apCacheService, apLookupFactory, apUserFactory, apFieldService, apXMLListAttributeTypes, apXMLFieldAttributeTypes) {
            this.apCacheService = apCacheService;
            this.apLookupFactory = apLookupFactory;
            this.apUserFactory = apUserFactory;
            this.apFieldService = apFieldService;
            this.apXMLListAttributeTypes = apXMLListAttributeTypes;
            this.apXMLFieldAttributeTypes = apXMLFieldAttributeTypes;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:checkResponseForErrors
         * @methodOf angularPoint.apDecodeService
         * @description
         * Errors don't always throw correctly from SPServices so this function checks to see if part
         * of the XHR response contains an "errorstring" element.
         * @param {object} responseXML XHR response from the server.
         * @returns {string|null} Returns an error string if present, otherwise returns null.
         */
        DecodeService.prototype.checkResponseForErrors = function (responseXML) {
            var error = null;
            /** Look for <errorstring></errorstring> or <ErrorText></ErrorText> for details on any errors */
            var errorElements = ['ErrorText', 'errorstring'];
            _.each(errorElements, function (element) {
                $(responseXML).find(element).each(function () {
                    error = $(this).text();
                    /** Break early if found */
                    return false;
                });
            });
            return error;
        };
        /** Converts UTC date to a localized date
         * Taken from: http://stackoverflow.com/questions/6525538/convert-utc-date-time-to-local-date-time-using-javascript
         * */
        DecodeService.prototype.convertUTCDateToLocalDate = function (date) {
            var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
            var offset = date.getTimezoneOffset() / 60;
            var hours = date.getHours();
            newDate.setHours(hours - offset);
            return newDate;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:createListItemProvider
         * @methodOf angularPoint.apDecodeService
         * @description
         * The initial constructor for a list item that references the array where the entity exists and the
         * query used to fetch the entity.  From there it extends the entity using the factory defined in the
         * model for the list item.
         * @param {object} model Reference to the model for the list item.
         * @param {object} query Reference to the query object used to retrieve the entity.
         * @param {object} indexedCache Location where we'll be pushing the new entity.
         * @returns {Function} Returns a function that takes the new list item while keeping model, query,
         * and container in scope for future reference.
         */
        DecodeService.prototype.createListItemProvider = function (model, query, indexedCache) {
            var _this = this;
            return function (rawObject) {
                var listItem;
                if (indexedCache[rawObject.id]) {
                    //Object already exists in cache so we just need to update properties
                    listItem = indexedCache[rawObject.id];
                    //Call constructor on original list item to perform any initialization logic again
                    listItem.constructor(rawObject);
                }
                else {
                    //Creating a new List Item
                    /** Create Reference to the indexed cache */
                    rawObject.getCache = function () { return indexedCache; };
                    /** Allow us to reference the originating query that generated this object */
                    rawObject.getQuery = function () { return query; };
                    listItem = new model.factory(rawObject);
                    /** Register in global application listItem cache */
                    _this.apCacheService.registerEntity(listItem, indexedCache);
                }
                //Store the value instead of just a reference to the original object
                var pristineValue = _.cloneDeep(rawObject);
                //Allow us to reference the uninstantiated version of this list item
                listItem.getPristine = function () { return pristineValue; };
                return indexedCache[rawObject.id];
            };
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendFieldDefinitionsFromXML
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes the XML response from a web service call and extends any field definitions in the model
         * with additional field metadata.  Important to note that all properties will coming from the XML start
         * with a capital letter.
         * @param {object[]} fieldDefinitions Field definitions from the model.
         * @param {object} responseXML XML response from the server.
         */
        DecodeService.prototype.extendFieldDefinitionsFromXML = function (fieldDefinitions, responseXML) {
            var _this = this;
            var fieldMap = {};
            /** Map all custom fields with keys of the staticName and values = field definition */
            _.each(fieldDefinitions, function (field) {
                if (field.staticName) {
                    fieldMap[field.staticName] = field;
                }
            });
            /** Iterate over each of the field nodes */
            var fields = $(responseXML).SPFilterNode('Field');
            _.each(fields, function (xmlField) {
                var staticName = $(xmlField).attr('StaticName');
                var fieldDefinition = fieldMap[staticName];
                /** If we've defined this field then we should extend it */
                if (fieldDefinition) {
                    _this.extendObjectWithXMLAttributes(xmlField, fieldDefinition, _this.apXMLFieldAttributeTypes);
                    /** Additional processing for Choice fields to include the default value and choices */
                    if (fieldDefinition.objectType === 'Choice' || fieldDefinition.objectType === 'MultiChoice') {
                        fieldDefinition.Choices = [];
                        /** Convert XML Choices object to an array of choices */
                        var xmlChoices = $(xmlField).find('CHOICE');
                        _.each(xmlChoices, function (xmlChoice) {
                            fieldDefinition.Choices.push($(xmlChoice).text());
                        });
                        fieldDefinition.Default = $(xmlField).find('Default').text();
                    }
                }
            });
            return fieldDefinitions;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendListDefinitionFromXML
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes the XML response from a web service call and extends the list definition in the model
         * with additional field metadata.  Important to note that all properties will coming from the XML start
         * with a capital letter.
         * @param {object} list model.list
         * @param {object} responseXML XML response from the server.
         * @returns {object} Extended list object.
         */
        DecodeService.prototype.extendListDefinitionFromXML = function (list, responseXML) {
            var service = this;
            $(responseXML).find("List").each(function () {
                service.extendObjectWithXMLAttributes(this, list, service.apXMLListAttributeTypes);
            });
            return list;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendListMetadata
         * @methodOf angularPoint.apDecodeService
         * @description
         * Convenience method that extends the list definition and the field definitions from an xml list response
         * from the server.  Can be used specifically with GetListItemsSinceToken and GetList operations.
         * @param {object} model Model for a given list.
         * @param {object} responseXML XML response from the server.
         */
        DecodeService.prototype.extendListMetadata = function (model, responseXML) {
            this.extendListDefinitionFromXML(model.list, responseXML);
            this.extendFieldDefinitionsFromXML(model.list.fields, responseXML);
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendObjectWithXMLAttributes
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes an XML element and copies all attributes over to a given JS object with corresponding values.  If
         * no JS Object is provided, it extends an empty object and returns it.  If an attributeTypes object is provided
         * we parse each of the defined field so they are typed correctly instead of being a simple string.
         * Note: Properties are not necessarily CAMLCase.
         * @param {object} xmlObject An XML element.
         * @param {object} [jsObject={}] An optional JS Object to extend XML attributes to.
         * @param {object} [attributeTypes={}] Key/Val object with keys being the name of the field and val being the
         * type of field.
         * @returns {object} JS Object
         */
        DecodeService.prototype.extendObjectWithXMLAttributes = function (xmlObject, jsObject, attributeTypes) {
            var _this = this;
            var objectToExtend = jsObject || {};
            var attributeMap = attributeTypes || {};
            var xmlAttributes = xmlObject.attributes;
            _.each(xmlAttributes, function (attr, attrNum) {
                var attrName = xmlAttributes[attrNum].name;
                objectToExtend[attrName] = $(xmlObject).attr(attrName);
                if (attributeMap[attrName]) {
                    objectToExtend[attrName] = _this.parseStringValue(objectToExtend[attrName], attributeMap[attrName]);
                }
            });
            return objectToExtend;
        };
        DecodeService.prototype.jsAttachments = function (str) {
            /* Depending on CAMLQueryOptions Config an attachment can be formatted in 1 of the below 3 ways:
             1. {number} The number of attachments for a given list item.
             CAMLQueryOptions
             <IncludeAttachmentUrls>FALSE</IncludeAttachmentUrls>
             <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>

             Example
             ows_Attachments="2"

             2. {string}
             CAMLQueryOptions
             <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>
             <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>

             Format
             ;#[ListUrl]/Attachments/[ListItemId]/[FileName];#

             Example:
             ows_Attachments=";#https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx;#"

             //Todo Check to see if there is any value in this option
             3. {string} NOTE: We don't currently handle this format.
             CAMLQueryOptions
             <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>
             <IncludeAttachmentVersion>TRUE</IncludeAttachmentVersion>

             Format
             ;#[ListUrl]/Attachments/[ListItemId]/[FileName];#[AttachmentGUID],[Version Number];#

             Example:
             ows_Attachments=";#https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx;#{4378D394-8601-480D-ABD0-0A0505E726FB},1;#"
             */
            if (!isNaN(str)) {
                /** Value is a number current stored as a string */
                var int = parseInt(str);
                if (int > 0) {
                    return int;
                }
                else {
                    return '';
                }
            }
            else {
                /** Split into an array of attachment URLs */
                return this.jsChoiceMulti(str);
            }
        };
        DecodeService.prototype.jsBoolean = function (str) {
            /** SharePoint uses different string representations for booleans in different places so account for each */
            return str === '1' || str === 'True' || str === 'TRUE';
        };
        DecodeService.prototype.jsCalc = function (str) {
            if (str.length === 0) {
                return null;
            }
            else {
                var thisCalc = str.split(';#');
                // The first value will be the calculated column value type, the second will be the value
                return this.parseStringValue(thisCalc[1], thisCalc[0]);
            }
        };
        DecodeService.prototype.jsChoiceMulti = function (str) {
            if (str.length === 0) {
                return [];
            }
            else {
                var thisChoiceMultiObject = [];
                var thisChoiceMulti = str.split(';#');
                for (var i = 0; i < thisChoiceMulti.length; i++) {
                    if (thisChoiceMulti[i].length !== 0) {
                        thisChoiceMultiObject.push(thisChoiceMulti[i]);
                    }
                }
                return thisChoiceMultiObject;
            }
        };
        DecodeService.prototype.jsDate = function (str) {
            if (!str) {
                return null;
            }
            else {
                /** Replace dashes with slashes and the "T" deliminator with a space if found */
                var dt = str.split("T")[0] !== str ? str.split("T") : str.split(" ");
                var d = dt[0].split("-");
                var t = dt[1].split(":");
                var t3 = t[2].split("Z");
                return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t3[0]);
            }
        };
        DecodeService.prototype.jsFloat = function (str) {
            if (!str) {
                return str;
            }
            else {
                return parseFloat(str);
            }
        };
        DecodeService.prototype.jsInt = function (str) {
            if (!str) {
                return str;
            }
            else {
                return parseInt(str, 10);
            }
        };
        DecodeService.prototype.jsLookup = function (str, options) {
            if (str.length === 0) {
                return null;
            }
            else {
                //Send to constructor
                return this.apLookupFactory.create(str, options);
            }
        };
        DecodeService.prototype.jsLookupMulti = function (str, options) {
            if (str.length === 0) {
                return [];
            }
            else {
                var thisLookupMultiObject = [];
                var thisLookupMulti = str.split(';#');
                for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                    /** Ensure a lookup id is present before attempting to push a new lookup */
                    if (thisLookupMulti[i]) {
                        var thisLookup = this.jsLookup(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
                        thisLookupMultiObject.push(thisLookup);
                    }
                }
                return thisLookupMultiObject;
            }
        };
        DecodeService.prototype.jsObject = function (str) {
            if (!str) {
                return str;
            }
            else {
                /** Ensure JSON is valid and if not throw error with additional detail */
                var json = null;
                try {
                    json = JSON.parse(str);
                }
                catch (err) {
                    console.error('Invalid JSON: ', str);
                }
                return json;
            }
        };
        DecodeService.prototype.jsString = function (str) {
            return str;
        };
        DecodeService.prototype.jsUser = function (str) {
            if (str.length === 0) {
                return null;
            }
            //Send to constructor
            return this.apUserFactory.create(str);
        };
        DecodeService.prototype.jsUserMulti = function (str) {
            if (str.length === 0) {
                return [];
            }
            else {
                var thisUserMultiObject = [];
                var thisUserMulti = str.split(';#');
                for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                    var thisUser = this.jsUser(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
                    thisUserMultiObject.push(thisUser);
                }
                return thisUserMultiObject;
            }
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:parseFieldVersions
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes an XML response from SharePoint webservice and returns an array of field versions.
         *
         * @param {xml} responseXML Returned XML from web service call.
         * @param {object} fieldDefinition Field definition from the model.
         *
         * @returns {Array} Array objects containing the various version of a field for each change.
         */
        DecodeService.prototype.parseFieldVersions = function (responseXML, fieldDefinition) {
            var _this = this;
            var versions = [];
            var xmlVersions = $(responseXML).find('Version');
            var versionCount = xmlVersions.length;
            _.each(xmlVersions, function (xmlVersion, index) {
                /** Bug in SOAP Web Service returns time in UTC time for version history
                 *  Details: https://spservices.codeplex.com/discussions/391879
                 */
                var utcDate = _this.parseStringValue($(xmlVersion).attr('Modified'), 'DateTime');
                /** Parse the xml and create a representation of the version as a js object */
                var version = {
                    editor: _this.parseStringValue($(xmlVersion).attr('Editor'), 'User'),
                    /** Turn the SharePoint formatted date into a valid date object */
                    modified: _this.convertUTCDateToLocalDate(utcDate),
                    /** Returns records in desc order so compute the version number from index */
                    version: versionCount - index
                };
                /** Properly format field based on definition from model */
                version[fieldDefinition.mappedName] =
                    _this.parseStringValue($(xmlVersion).attr(fieldDefinition.staticName), fieldDefinition.objectType);
                /** Push to beginning of array */
                versions.unshift(version);
            });
            return versions;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:parseStringValue
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts a SharePoint string representation of a field into the correctly formatted JavaScript version
         * based on object type.  A majority of this code is directly taken from Marc Anderson's incredible
         * [SPServices](http://spservices.codeplex.com/) project but it needed some minor tweaking to work here.
         * @param {string} str SharePoint string representing the value.
         * @param {string} [objectType='Text'] The type based on field definition.  See
         * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
         * @param {object} [options] Options to pass to the object constructor.
         * @param {object} [options.entity] Reference to the parent list item which can be used by child constructors.
         * @param {object} [options.propertyName] Name of property on the list item.
         * @returns {*} The newly instantiated JavaScript value based on field type.
         */
        DecodeService.prototype.parseStringValue = function (str, objectType, options) {
            var unescapedValue = _.unescape(str);
            var colValue;
            switch (objectType) {
                case 'Attachments':
                    colValue = this.jsAttachments(unescapedValue);
                    break;
                case 'Boolean':
                    colValue = this.jsBoolean(unescapedValue);
                    break;
                case 'Calculated':
                    colValue = this.jsCalc(unescapedValue);
                    break;
                case 'datetime': // For calculated columns, stored as datetime;#value
                case 'DateTime':
                    // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
                    colValue = this.jsDate(unescapedValue);
                    break;
                case 'Lookup':
                    colValue = this.jsLookup(unescapedValue, options);
                    break;
                case 'User':
                    colValue = this.jsUser(unescapedValue);
                    break;
                case 'LookupMulti':
                    colValue = this.jsLookupMulti(unescapedValue, options);
                    break;
                case 'UserMulti':
                    colValue = this.jsUserMulti(unescapedValue);
                    break;
                case 'Integer':
                case 'Counter':
                    colValue = this.jsInt(unescapedValue);
                    break;
                case 'Number':
                case 'Currency':
                case 'float': // For calculated columns, stored as float;#value
                case 'Float':
                    colValue = this.jsFloat(unescapedValue);
                    break;
                case 'MultiChoice':
                    colValue = this.jsChoiceMulti(unescapedValue);
                    break;
                case 'JSON':
                    colValue = this.jsObject(unescapedValue);
                    break;
                case 'Choice':
                case 'HTML':
                case 'Note':
                default:
                    // All other objectTypes will be simple strings
                    colValue = this.jsString(unescapedValue);
                    break;
            }
            return colValue;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:parseXMLEntity
         * @methodOf angularPoint.apDecodeService
         * @description
         * Convert an XML list item into a JS object using the fields defined in the model for the given list item.
         * @param {object} xmlEntity XML Object.
         * @param {object} options Configuration options.
         * @param {string} options.mapping Mapping of fields we'd like to extend on our JS object.
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * @param {boolean} [options.listItemProvider] List item constructor.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * @returns {object} New entity using the factory on the model.
         */
        DecodeService.prototype.parseXMLEntity = function (xmlEntity, options) {
            var _this = this;
            var entity = {};
            var rowAttrs = xmlEntity.attributes;
            /** Bring back all mapped columns, even those with no value */
            _.each(options.mapping, function (fieldDefinition) {
                entity[fieldDefinition.mappedName] = _this.apFieldService.getDefaultValueForType(fieldDefinition.objectType);
            });
            /** Parse through the element's attributes */
            _.each(rowAttrs, function (attr) {
                var thisAttrName = attr.name;
                var thisMapping = options.mapping[thisAttrName];
                var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : options.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
                var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
                if (options.includeAllAttrs || thisMapping !== undefined) {
                    entity[thisObjectName] = _this.parseStringValue(attr.value, thisObjectType, {
                        entity: entity,
                        propertyName: thisObjectName
                    });
                }
            });
            return entity;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:processListItems
         * @methodOf angularPoint.apDecodeService
         * @description
         * Post processing of data after returning list items from server.  Returns a promise that resolves with
         * the processed entities.  Promise allows us to batch conversions of large lists to prevent ui slowdowns.
         * @param {object} model Reference to allow updating of model.
         * @param {object} query Reference to the query responsible for requesting entities.
         * @param {xml} responseXML Resolved promise from SPServices web service call.
         * @param {object} [options] Optional configuration object.
         * @param {function} [options.factory=model.factory] Constructor function typically stored on the model.
         * @param {string} [options.filter='z:row'] XML filter string used to find the elements to iterate over.
         * @param {Array} [options.mapping=model.list.mapping] Field definitions, typically stored on the model.
         * @param {Array} [options.target=model.getCache()] Optionally pass in array to update after processing.
         * @returns {Object} Inedexed Cache.
         */
        DecodeService.prototype.processListItems = function (model, query, responseXML, options) {
            var defaults = {
                factory: model.factory,
                filter: 'z:row',
                mapping: model.list.mapping,
                target: model.getCache()
            };
            var opts = _.assign({}, defaults, options);
            /** Map returned XML to JS objects based on mapping from model */
            var filteredNodes = $(responseXML).SPFilterNode(opts.filter);
            /** Prepare constructor for XML entities with references to the query and cached container */
            var listItemProvider = this.createListItemProvider(model, query, opts.target);
            /** Convert XML entities into JS objects and register in cache with listItemProvider, this returns an
             * array of entities but at this point we're not using them because the indexed cache should be more
             * performant. */
            this.xmlToJson(filteredNodes, listItemProvider, opts);
            return opts.target;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:xmlToJson
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
         * "SPXmlToJson" function.
         * @param {array} xmlEntities ["z:rows"] XML rows that need to be parsed.
         * @param {function} listItemProvider Constructor function used to build the list item with references to
         * the query, cached container, and registers each list item in the apCacheService.
         * @param {object} options Options object.
         * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * @param {boolean} [options.listItemProvider] List item constructor.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * be stripped off the field name.
         * @param {array} [options.target] Optional location to push parsed entities.
         * @returns {object[]} An array of JavaScript objects.
         */
        DecodeService.prototype.xmlToJson = function (xmlEntities, listItemProvider, options) {
            var _this = this;
            var defaults = {
                mapping: {},
                includeAllAttrs: false,
                removeOws: true
            };
            var opts = _.assign({}, defaults, options);
            var parsedEntities = [];
            _.each(xmlEntities, function (xmlEntity) {
                var parsedEntity = _this.parseXMLEntity(xmlEntity, opts);
                var instantiatedListItem = listItemProvider(parsedEntity);
                parsedEntities.push(instantiatedListItem);
            });
            return parsedEntities;
        };
        DecodeService.$inject = ['apCacheService', 'apLookupFactory', 'apUserFactory', 'apFieldService',
            'apXMLListAttributeTypes', 'apXMLFieldAttributeTypes'];
        return DecodeService;
    })();
    ap.DecodeService = DecodeService;
    /**********************PRIVATE*********************/
    /**Constructors for user and lookup fields*/
    /**Allows for easier distinction when debugging if object type is shown as either Lookup or User**/
    angular.module('angularPoint')
        .service('apDecodeService', DecodeService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var EncodeService = (function () {
        function EncodeService(apUtilityService, SPServices) {
            this.apUtilityService = apUtilityService;
            this.SPServices = SPServices;
        }
        /**
         * Converts an array of selected values into a SharePoint MultiChoice string
         * @param {string[]} arr
         * @returns {string}
         */
        EncodeService.prototype.choiceMultiToString = function (arr) {
            var str = '';
            var delim = ';#';
            if (arr.length > 0) {
                /** String is required to begin with deliminator */
                str += delim;
                /** Append each item in the supplied array followed by deliminator */
                _.each(arr, function (choice) { return str += choice + delim; });
            }
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:createValuePair
         * @methodOf angularPoint.apEncodeService
         * @description
         * Uses a field definition from a model to properly format a value for submission to SharePoint.  Typically
         * used prior to saving a list item, we iterate over each of the non-readonly properties defined in the model
         * for a list item and convert those value into value pairs that we can then hand off to SPServices.
         * @param {object} fieldDefinition The field definition, typically defined in the model.
         * <pre>
         * {
             *  staticName: "Title",
             *  objectType: "Text",
             *  mappedName: "lastName",
             *  readOnly:false
             * }
         * </pre>
         * @param {*} value Current field value.
         * @returns {Array} [fieldName, fieldValue]
         */
        EncodeService.prototype.createValuePair = function (fieldDefinition, value) {
            var encodedValue = this.encodeValue(fieldDefinition.objectType, value);
            return [fieldDefinition.staticName, encodedValue];
        };
        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:encodeValue
         * @methodOf angularPoint.apEncodeService
         * @param {string} fieldType One of the valid field types.
         * @param {*} value Value to be encoded.
         * @returns {string} Encoded value ready to be sent to the server.
         */
        EncodeService.prototype.encodeValue = function (fieldType, value) {
            var str = '';
            /** Only process if note empty, undefined, or null.  Allow false. */
            if (value !== '' && !_.isUndefined(value) && !_.isNull(value)) {
                switch (fieldType) {
                    case 'Lookup':
                    case 'User':
                        if (value.lookupId) {
                            /** Only include lookupValue if defined */
                            str = value.lookupId + ';#' + (value.lookupValue || '');
                        }
                        break;
                    case 'LookupMulti':
                    case 'UserMulti':
                        str = this.stringifySharePointMultiSelect(value, 'lookupId');
                        break;
                    case 'MultiChoice':
                        str = this.choiceMultiToString(value);
                        break;
                    case 'Boolean':
                        str = value ? "1" : "0";
                        break;
                    case 'DateTime':
                        //A string date in ISO8601 format, e.g., '2013-05-08T01:20:29Z-05:00'
                        str = this.stringifySharePointDate(value);
                        break;
                    case 'JSON':
                        str = JSON.stringify(value);
                        break;
                    case 'HTML':
                    case 'Note':
                    default:
                        str = value;
                }
            }
            if (_.isString(str)) {
                /** Ensure we encode before sending to server (replace ", <, >)*/
                str = this.SPServices.encodeXml(str);
            }
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:generateValuePairs
         * @methodOf angularPoint.apEncodeService
         * @description
         * Typically used to iterate over the non-readonly field definitions stored in a model and convert a
         * given list item entity into value pairs that we can pass to SPServices for saving.
         * @param {Array} fieldDefinitions Definitions from the model.
         * @param {object} listItem list item that we'll attempt to iterate over to find the properties that we need to
         * save it to SharePoint.
         * @returns {[string, string][]} Value pairs of all non-readonly fields.
         * @example
         * [[fieldName1, fieldValue1], [fieldName2, fieldValue2], ...]
         */
        EncodeService.prototype.generateValuePairs = function (fieldDefinitions, listItem) {
            var _this = this;
            var pairs = [];
            _.each(fieldDefinitions, function (field) {
                /** Check to see if item contains data for this field */
                if (_.has(listItem, field.mappedName)) {
                    pairs.push(_this.createValuePair(field, listItem[field.mappedName]));
                }
            });
            return pairs;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:stringifySharePointDate
         * @methodOf angularPoint.apEncodeService
         * @description
         * Converts a JavaScript date into a modified ISO8601 date string using the TimeZone
         * offset for the current user.
         * @example
         * <pre>'2014-05-08T08:12:18Z-07:00'</pre>
         * @param {Date} date Valid JS date.
         * @returns {string} ISO8601 date string.
         */
        EncodeService.prototype.stringifySharePointDate = function (date) {
            var jsDate;
            if (!_.isDate(date) && _.isString(date) && date.split('-').length === 3) {
                /** Date string formatted YYYY-MM-DD */
                var dateComponents = date.split('-');
                jsDate = new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2], 0, 0, 0);
            }
            else if (!_.isDate(date)) {
                throw new Error('Invalid Date Provided: ' + date.toString());
            }
            else {
                jsDate = date;
            }
            var dateString = '';
            dateString += jsDate.getFullYear();
            dateString += '-';
            dateString += this.apUtilityService.doubleDigit(jsDate.getMonth() + 1);
            dateString += '-';
            dateString += this.apUtilityService.doubleDigit(jsDate.getDate());
            dateString += 'T';
            dateString += this.apUtilityService.doubleDigit(jsDate.getHours());
            dateString += ':';
            dateString += this.apUtilityService.doubleDigit(jsDate.getMinutes());
            dateString += ':';
            dateString += this.apUtilityService.doubleDigit(jsDate.getSeconds());
            dateString += 'Z-';
            if (!this.savedTimeZone) {
                //Get difference between UTC time and local time in minutes and convert to hours
                //Store so we only need to do this once
                this.savedTimeZone = new Date().getTimezoneOffset() / 60;
            }
            dateString += this.apUtilityService.doubleDigit(this.savedTimeZone);
            dateString += ':00';
            return dateString;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:stringifySharePointMultiSelect
         * @methodOf angularPoint.apEncodeService
         * @description
         * Turns an array of, typically {lookupId: someId, lookupValue: someValue}, objects into a string
         * of delimited id's that can be passed to SharePoint for a multi select lookup or multi user selection
         * field.  SharePoint doesn't need the lookup values so we only need to pass the ID's back.
         *
         * @param {object[]} multiSelectValue Array of {lookupId: #, lookupValue: 'Some Value'} objects.
         * @param {string} [idProperty='lookupId'] Property name where we'll find the ID value on each of the objects.
         * @param {string} [valueProperty='lookupValue'] Property name where we'll find the value for this object.
         * @returns {string} Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1]
         */
        EncodeService.prototype.stringifySharePointMultiSelect = function (multiSelectValue, idProperty, valueProperty) {
            if (idProperty === void 0) { idProperty = 'lookupId'; }
            if (valueProperty === void 0) { valueProperty = 'lookupValue'; }
            var stringifiedValues = '';
            var idProp = idProperty || 'lookupId';
            var valProp = valueProperty || 'lookupValue';
            _.each(multiSelectValue, function (lookupObject, iteration) {
                /** Need to format string of id's in following format [ID0];#[VAL0];#[ID1];#[VAL1];# */
                stringifiedValues += lookupObject[idProp] + ';#' + (lookupObject[valProp] || '');
                if (iteration < multiSelectValue.length) {
                    stringifiedValues += ';#';
                }
            });
            return stringifiedValues;
        };
        EncodeService.$inject = ['apUtilityService', 'SPServices'];
        return EncodeService;
    })();
    ap.EncodeService = EncodeService;
    /**
     * @ngdoc service
     * @name angularPoint.apEncodeService
     * @description
     * Processes JavaScript objects and converts them to a format SharePoint expects.
     *
     * @requires angularPoint.apUtilityService
     */
    angular.module('angularPoint')
        .service('apEncodeService', EncodeService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    function exceptionLoggingService($log, $injector) {
        function error(exception, cause) {
            /** Need to inject otherwise get circular dependency when using dependency injection */
            var apLogger = $injector.get('apLogger');
            // now try to log the error to the server side.
            apLogger.exception(exception, cause);
            // preserve the default behaviour which will log the error
            // to the console, and allow the application to continue running.
            $log.error.apply($log, arguments);
        }
        return error;
    }
    angular
        .module('angularPoint')
        .factory('$exceptionHandler', exceptionLoggingService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var ExportService = (function () {
        function ExportService(apUtilityService, apFormattedFieldValueService) {
            this.apUtilityService = apUtilityService;
            this.apFormattedFieldValueService = apFormattedFieldValueService;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apExportService:generateCSV
         * @methodOf angularPoint.apExportService
         * @description
         * Converts an array of objects into a parsed array of arrays based on a field config object.
         * @param {object[]} entities Array of objects to convert.
         * @param {object|string[]} fields Array of objects defining the fields to parse.  Can also pass in strings representing the name of the field which will then be parsed based on field type.
         * FieldDefinition:
         * {string} object.field Property name on the object that we want to parse.
         * {string} [object.label=object.field capitalized] Column Label
         * {function} [object.getVal] Custom function that overrides the default method of parsing based on field type.
         * @param {object} [options] Optional config settings.
         * @param {string} [options.delim='; '] Delimiter used to separate fields that potentially contain multiple values that will be concatenated into a string.
         * @returns {array[]} Return array of arrays, with the first array being the column names and every subsequent array representing a row in the csv dataset.
         * @example
         * <pre>
         * var customDelimiter = ' | ';
         * var saveCSV = function() {
             *    var parsedCSV = apExportService.generateCSV(entities, [
             *     //Field definition
             *     { label: 'ID', field: 'id' },
             *     //Field as simple string
             *     'title',
             *     'project',
             *     { label: 'Project:ID', field: 'project.lookupId' },
             *     { label: 'Type', field: 'eventType' },
             *     { label: 'Start Date', field: 'startDate' },
             *     { label: 'End Date', field: 'endDate' },
             *     'location',
             *     'description',
             *     //Field definition with custom parse logic
             *     { label: 'Comments', field: 'comments', stringify: function (comments) {
             *       var str = '';
             *       _.each(comments, function (comment, i) {
             *         if (i > 0) {
             *           str += '\n';
             *         }
             *         str += comment.text + '\n';
             *       });
             *       return str;
             *     }}
             *   ]);
             *
             *   //Save to user's machine
             *   apExportService.saveCSV(parsedCSV, 'MyFile', {delim: customDelimiter});
             * }
         * </pre>
         *
         */
        ExportService.prototype.generateCSV = function (entities, fields, options) {
            var _this = this;
            var defaults = {
                dateFormat: 'json',
                delim: '; ',
                includeTitleRow: true
            }, opts = _.assign({}, defaults, options), entitiesArray = [
                []
            ];
            /** Process each of the entities in the data source */
            _.each(entities, function (entity, entityIndex) {
                var entityArray = [];
                /** Process each of the specified fields */
                _.each(fields, function (f) {
                    /** Handle both string and object definition */
                    var fieldDefinition = _.isString(f) ? { field: f } : f;
                    /** Split the field name from the property if provided */
                    var fieldComponents = fieldDefinition.field.split('.');
                    var propertyName = fieldComponents[0];
                    /** First array has the field names */
                    if (entityIndex === 0 && opts.includeTitleRow) {
                        /** Take a best guess if a column label isn't specified by capitalizing and inserting spaces between camel humps*/
                        var label = fieldDefinition.label ?
                            fieldDefinition.label : _this.apUtilityService.fromCamelCase(propertyName);
                        entitiesArray[0].push(label);
                    }
                    var val = '';
                    if (_.isFunction(fieldDefinition.stringify)) {
                        /** Allows us to override standard field logic for special cases */
                        val = fieldDefinition.stringify(entity[fieldDefinition.field]);
                    }
                    else if (fieldComponents.length > 1) {
                        /** Allow user to specify dot separated property path */
                        if (_.deepIn(entity, fieldDefinition.field)) {
                            val = _.deepGet(entity, fieldDefinition.field).toString();
                        }
                    }
                    else {
                        /** Get the value based on field type defined in the model for the entity*/
                        var modelDefinition = entity.getFieldDefinition(propertyName);
                        val = _this.apFormattedFieldValueService.getFormattedFieldValue(entity[fieldDefinition.field], modelDefinition.objectType, opts);
                    }
                    /** Add string to column */
                    entityArray.push(val);
                });
                /** Add row */
                entitiesArray.push(entityArray);
            });
            return entitiesArray;
        };
        /**
         * @description Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or
         *  ISO-8859-1 with ISO-8859-1 cognates.
         * @param {string} text Text to be validated and cleaned.
         * @returns {string}
         */
        ExportService.prototype.replaceWordChars = function (text) {
            var s = text;
            // smart single quotes and apostrophe
            s = s.replace(/[\u2018|\u2019|\u201A]/g, "\'");
            // smart double quotes
            s = s.replace(/[\u201C|\u201D|\u201E]/g, "\"");
            // ellipsis
            s = s.replace(/\u2026/g, "...");
            // dashes
            s = s.replace(/[\u2013|\u2014]/g, "-");
            // circumflex
            s = s.replace(/\u02C6/g, "^");
            // open angle bracket
            s = s.replace(/\u2039/g, "<");
            // close angle bracket
            s = s.replace(/\u203A/g, ">");
            // spaces
            s = s.replace(/[\u02DC|\u00A0]/g, " ");
            return s;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveCSV
         * @methodOf angularPoint.apExportService
         * @description
         * Converts an array of arrays into a valid CSV file that is then downloaded to the users machine
         * @requires angularPoint.apExportService:saveFile
         * @param {array[]} data Array of arrays that we'd like to dump to a CSV file and save to the local machine.
         * @param {string} [filename=debug.csv] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveCSV(objectToSave, 'MyFile');
         * //This would download a file named MyFile.csv
         * </pre>
         *
         */
        ExportService.prototype.saveCSV = function (data, filename) {
            if (filename === void 0) { filename = 'debug.csv'; }
            var csvString = '';
            _.each(data, function (row) {
                _.each(row, function (column, columnIndex) {
                    var result = column === null ? '' : this.replaceWordChars(column);
                    if (columnIndex > 0) {
                        csvString += ',';
                    }
                    /** Escape single quotes with doubles in within the string */
                    result = result.replace(/"/g, '""');
                    /** Surround string with quotes so we can have line breaks */
                    csvString += '"' + result + '"';
                });
                csvString += '\n';
            });
            this.saveFile(csvString, 'csv;charset=utf-8;', filename);
        };
        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveFile
         * @methodOf angularPoint.apExportService
         * @description
         * Used to convert a JS object or XML document into a file that is then downloaded on the users
         * local machine.  Original work located:
         * [here](http://bgrins.github.io/devtools-snippets/#console-save).
         * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
         * @param {string} fileType Can be either 'xml' or 'json'.
         * @param {string} [filename=debug.json] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveJSON(objectToSave, 'myobject.json');
         * </pre>
         *
         */
        ExportService.prototype.saveFile = function (data, fileType, filename) {
            if (filename === void 0) { filename = 'debug.json'; }
            if (!data) {
                console.error('apExportService.save' + fileType.toUpperCase() + ': No data');
                return;
            }
            /** If passed in fileType="csv;charset=utf-8;" we just want to use "csv" */
            var fileExtension = fileType.split(';')[0];
            if (!filename) {
                filename = 'debug.' + fileExtension;
            }
            if (fileType === 'json' && typeof data === 'object') {
                data = JSON.stringify(data, undefined, 4);
            }
            var blob = new Blob([data], { type: 'text/' + fileType }), e = document.createEvent('MouseEvents'), a = document.createElement('a');
            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/' + fileType, a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        };
        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveJSON
         * @methodOf angularPoint.apExportService
         * @description
         * Simple convenience function that uses angularPoint.apExportService:saveFile to download json to the local machine.
         * @requires angularPoint.apExportService:saveFile
         * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
         * @param {string} [filename=debug.json] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveJSON(objectToSave, 'myobject.json');
         * </pre>
         *
         */
        ExportService.prototype.saveJSON = function (data, filename) {
            if (filename === void 0) { filename = 'debug.json'; }
            this.saveFile(data, 'json', filename);
        };
        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveXML
         * @methodOf angularPoint.apExportService
         * @description
         * Simple convenience function that uses angularPoint.apExportService:saveFile to download xml to the local machine.
         * @requires angularPoint.apExportService:saveFile
         * @param {object} data XML object that we'd like to dump to a XML file and save to the local machine.
         * @param {string} [filename=debug.xml] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveXML(objectToSave, 'myobject.xml');
         * </pre>
         *
         */
        ExportService.prototype.saveXML = function (data, filename) {
            if (filename === void 0) { filename = 'debug.xml'; }
            this.saveFile(data, 'xml', filename);
        };
        ExportService.$inject = ['apUtilityService', 'apFormattedFieldValueService'];
        return ExportService;
    })();
    ap.ExportService = ExportService;
    /**
     * @ngdoc service
     * @name angularPoint.apExportService
     * @description
     * Tools to assist with development.
     * @requires angularPoint.apUtilityService
     */
    angular.module('angularPoint')
        .service('apExportService', ExportService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var service, uniqueCount = 0;
    var FieldService = (function () {
        function FieldService() {
            service = this;
            this.fieldTypes = getFieldTypes();
        }
        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:getDefaultValueForType
         * @methodOf angularPoint.apFieldService
         * @description
         * Returns the empty value expected for a field type
         * @param {string} fieldType Type of field.
         * @returns {*} Default value based on field type.
         */
        FieldService.prototype.getDefaultValueForType = function (fieldType) {
            var fieldDefinition = service.getDefinition(fieldType), defaultValue;
            if (fieldDefinition) {
                defaultValue = fieldDefinition.defaultValue;
            }
            return defaultValue;
        };
        /**
         * Returns an object defining a specific field type
         * @param {string} fieldType
         * @returns {object} fieldTypeDefinition
         */
        FieldService.prototype.getDefinition = function (fieldType) {
            return service.fieldTypes[fieldType] ? service.fieldTypes[fieldType] : service.fieldTypes['Text'];
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:getMockData
         * @methodOf angularPoint.apFieldService
         * @description
         * Can return mock data appropriate for the field type, by default it dynamically generates data but
         * the staticValue param will instead return a hard coded type specific value
         *
         * @requires ChanceJS to produce dynamic data.
         * https://github.com/victorquinn/chancejs
         * @param {string} fieldType Field type from the field definition.
         * @param {object} [options] Optional params.
         * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
         * @returns {*} mockData
         */
        FieldService.prototype.getMockData = function (fieldType, options) {
            var mock;
            var fieldDefinition = service.getDefinition(fieldType);
            if (fieldDefinition) {
                if (_.isFunction(window.Chance) && options && !options.staticValue) {
                    /** Return dynamic data if ChanceJS is available and flag isn't set requiring static data */
                    mock = fieldDefinition.dynamicMock(options);
                }
                else {
                    /** Return static data if the flag is set or ChanceJS isn't available */
                    mock = fieldDefinition.staticMock;
                }
            }
            return mock;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:mockPermMask
         * @methodOf angularPoint.apFieldService
         * @description
         * Defaults to a full mask but allows simulation of each of main permission levels
         * @param {object} [options] Options container.
         * @param {string} [options.permissionLevel=FullMask] Optional mask.
         * @returns {string} Values for mask.
         */
        FieldService.prototype.mockPermMask = function (options) {
            var mask = 'FullMask';
            if (options && options.permissionLevel) {
                mask = options.permissionLevel;
            }
            return service.resolveValueForEffectivePermMask(mask);
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:resolveValueForEffectivePermMask
         * @methodOf angularPoint.apFieldService
         * @description
         * Takes the name of a permission mask and returns a permission value which can then be used
         * to generate a permission object using modelService.resolvePermissions(outputfromthis)
         * @param {string} perMask Options:
         *  - AddListItems
         *  - EditListItems
         *  - DeleteListItems
         *  - ApproveItems
         *  - FullMask
         *  - ViewListItems
         * @returns {string} value
         */
        FieldService.prototype.resolveValueForEffectivePermMask = function (perMask) {
            var permissionValue;
            switch (perMask) {
                case 'AddListItems':
                    permissionValue = '0x0000000000000002';
                    break;
                case 'EditListItems':
                    permissionValue = '0x0000000000000004';
                    break;
                case 'DeleteListItems':
                    permissionValue = '0x0000000000000008';
                    break;
                case 'ApproveItems':
                    permissionValue = '0x0000000000000010';
                    break;
                case 'FullMask':
                    permissionValue = '0x7FFFFFFFFFFFFFFF';
                    break;
                case 'ViewListItems':
                default:
                    permissionValue = '0x0000000000000001';
                    break;
            }
            return permissionValue;
        };
        return FieldService;
    })();
    ap.FieldService = FieldService;
    function getFieldTypes() {
        return {
            Text: {
                defaultValue: '',
                staticMock: 'Test String',
                dynamicMock: randomString
            },
            Note: {
                defaultValue: '',
                staticMock: 'This is a sentence.',
                dynamicMock: randomParagraph
            },
            Boolean: {
                defaultValue: null,
                staticMock: true,
                dynamicMock: randomBoolean
            },
            Calculated: {
                defaultValue: null,
                staticMock: 'float;#123.45',
                dynamicMock: randomCalc
            },
            Choice: {
                defaultValue: '',
                staticMock: 'My Choice',
                dynamicMock: randomString
            },
            Counter: {
                defaultValue: null,
                staticMock: getUniqueCounter(),
                dynamicMock: getUniqueCounter
            },
            Currency: {
                defaultValue: null,
                staticMock: 120.50,
                dynamicMock: randomCurrency
            },
            DateTime: {
                defaultValue: null,
                staticMock: new Date(2014, 5, 4, 11, 33, 25),
                dynamicMock: randomDate
            },
            Integer: {
                defaultValue: null,
                staticMock: 14,
                dynamicMock: randomInteger
            },
            JSON: {
                defaultValue: '',
                staticMock: [
                    { id: 1, title: 'test' },
                    { id: 2 }
                ],
                dynamicMock: randomString
            },
            Lookup: {
                defaultValue: '',
                staticMock: { lookupId: 49, lookupValue: 'Static Lookup' },
                dynamicMock: randomLookup
            },
            LookupMulti: {
                defaultValue: [],
                staticMock: [
                    { lookupId: 50, lookupValue: 'Static Multi 1' },
                    { lookupId: 51, lookupValue: 'Static Multi 2' }
                ],
                dynamicMock: randomLookupMulti
            },
            Mask: {
                defaultValue: service.mockPermMask(),
                staticMock: service.mockPermMask(),
                dynamicMock: service.mockPermMask
            },
            MultiChoice: {
                defaultValue: [],
                staticMock: ['A Good Choice', 'A Bad Choice'],
                dynamicMock: randomStringArray
            },
            User: {
                defaultValue: '',
                staticMock: { lookupId: 52, lookupValue: 'Static User' },
                dynamicMock: randomUser
            },
            UserMulti: {
                defaultValue: [],
                staticMock: [
                    { lookupId: 53, lookupValue: 'Static User 1' },
                    { lookupId: 54, lookupValue: 'Static User 2' }
                ],
                dynamicMock: randomUserMulti
            }
        };
    }
    function getUniqueCounter() {
        uniqueCount++;
        return uniqueCount;
    }
    function randomBoolean() {
        return chance.bool();
    }
    function randomCalc() {
        return 'float;#' + chance.floating({ min: 0, max: 10000 });
    }
    function randomString() {
        return chance.word() + ' ' + chance.word();
    }
    function randomStringArray() {
        var randomArr = [];
        /** Create a random (1-4) number of strings and add to array */
        _.times(_.random(1, 4), function () {
            randomArr.push(randomString());
        });
        return randomArr;
    }
    function randomParagraph() {
        return chance.paragraph();
    }
    function randomCurrency() {
        return parseInt(_.random(10000000, true) * 100) / 100;
    }
    function randomDate() {
        return chance.date();
    }
    function randomInteger() {
        return chance.integer();
    }
    function randomLookup() {
        return {
            lookupId: getUniqueCounter(),
            lookupValue: chance.word()
        };
    }
    function randomUser() {
        return {
            lookupId: getUniqueCounter(),
            lookupValue: chance.name()
        };
    }
    function randomLookupMulti() {
        var mockData = [];
        _.each(_.random(10), function () {
            mockData.push(randomLookup());
        });
        return mockData;
    }
    function randomUserMulti() {
        var mockData = [];
        _.each(_.random(10), function () {
            mockData.push(randomUser());
        });
        return mockData;
    }
    /**
     * @ngdoc service
     * @name angularPoint.apFieldService
     * @description
     * Handles the mapping of the various types of fields used within a SharePoint list
     */
    angular.module('angularPoint')
        .service('apFieldService', FieldService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var service, $filter;
    /**
     * @ngdoc service
     * @name angularPoint.apFormattedFieldValueService
     * @description
     * Returns the formatted string value for a field based on field type.
     */
    var FormattedFieldValueService = (function () {
        function FormattedFieldValueService(_$filter_) {
            service = this;
            $filter = _$filter_;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:getFormattedFieldValue
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {object|array|string|integer|boolean} prop Target that we'd like to stringify.
         * @param {string} [propertyType='String'] Assumes by default that it's already a string.  Most of the normal field
         * types identified in the model field definitions are supported.
         *
         * - Lookup
         * - User
         * - Boolean
         * - DateTime
         * - Integer
         * - Number
         * - Counter
         * - MultiChoice
         * - UserMulti
         * - LookupMulti
         * @param {object} options Optional config.
         * @param {string} [options.delim=', '] Optional delimiter to split concatenated strings.
         * @param {string} [options.dateFormat='short'] Either 'json' which converts a date into ISO8601 date string
         * or a mask for the angular date filter.
         * @example
         * <pre>
         *  var project = {
         *    title: 'Super Project',
         *   members: [
         *     { lookupId: 12, lookupValue: 'Joe' },
         *     { lookupId: 19, lookupValue: 'Beth' }
         *   ]
         * };
         *
         * var membersAsString = apFormattedFieldValueService:getFormattedFieldValue({
         *    project.members,
         *    'UserMulti',
         *    { delim: ' | '} //Custom Delimiter
         * });
         *
         * // membersAsString = 'Joe | Beth';
         *
         * </pre>
         * @returns {string} Stringified property on the object based on the field type.
         */
        FormattedFieldValueService.prototype.getFormattedFieldValue = function (prop, propertyType, options) {
            if (propertyType === void 0) { propertyType = 'String'; }
            var defaults = {
                delim: ', ',
                dateFormat: 'short'
            }, opts = _.assign({}, defaults, options);
            var str = '';
            /** Only process if prop is defined */
            if (prop) {
                switch (propertyType) {
                    case 'Boolean':
                        str = service.stringifyBoolean(prop);
                        break;
                    case 'Calculated':
                        str = service.stringifyCalc(prop);
                        break;
                    case 'Lookup':
                    case 'User':
                        str = service.stringifyLookup(prop);
                        break;
                    case 'DateTime':
                        str = service.stringifyDate(prop, opts.dateFormat);
                        break;
                    case 'Integer':
                    case 'Number':
                    case 'Float':
                    case 'Counter':
                        str = service.stringifyNumber(prop);
                        break;
                    case 'Currency':
                        str = service.stringifyCurrency(prop);
                        break;
                    case 'MultiChoice':
                        str = service.stringifyMultiChoice(prop, opts.delim);
                        break;
                    case 'UserMulti':
                    case 'LookupMulti':
                        str = service.stringifyMultiLookup(prop, opts.delim);
                        break;
                    default:
                        str = prop;
                }
            }
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyBoolean
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {boolean} prop Boolean to stringify.
         * @description
         * Returns the stringified boolean if it is set.
         * @returns {string} Stringified boolean.
         */
        FormattedFieldValueService.prototype.stringifyBoolean = function (prop) {
            var str = '';
            if (_.isBoolean(prop)) {
                str = prop.toString();
            }
            return str;
        };
        FormattedFieldValueService.prototype.stringifyCalc = function (prop) {
            if (prop.length === 0) {
                return '';
            }
            else if (_.isNumber(prop)) {
                return service.getFormattedFieldValue(prop, 'Number');
            }
            else if (_.isDate(prop)) {
                return service.getFormattedFieldValue(prop, 'DateTime');
            }
            else {
                return service.getFormattedFieldValue(prop, 'Text');
            }
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyCurrency
         * @methodOf angularPoint.apFormattedFieldValueService
         * @description
         * Converts a numeric value into a formatted currency string.
         * @param {number} prop Property on object to parse.
         * @returns {string} Stringified currency.
         */
        FormattedFieldValueService.prototype.stringifyCurrency = function (prop) {
            return $filter('currency')(prop, '$');
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyDate
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {date} prop Date object.
         * @param {string} dateFormat Either 'json' which converts a date into ISO8601 date string or a mask for
         * the angular date filter.
         * @description
         * Returns JSON date.
         * @returns {string} JSON date.
         */
        FormattedFieldValueService.prototype.stringifyDate = function (prop, dateFormat) {
            var str = '';
            if (_.isDate(prop)) {
                str = dateFormat === 'json' ? prop.toJSON() : $filter('date')(prop, dateFormat);
            }
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyLookup
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {obj} prop Property on object to parse.
         * @description
         * Returns the property.lookupValue if present.
         * @returns {string} Property.lookupValue.
         */
        FormattedFieldValueService.prototype.stringifyLookup = function (prop) {
            var str = '';
            if (prop && prop.lookupValue) {
                str = prop.lookupValue;
            }
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyMultiChoice
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {string[]} prop Array of selected choices.
         * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
         * @description
         * Converts an array of strings into a single concatenated string.
         * @returns {string} Concatenated string representation.
         */
        FormattedFieldValueService.prototype.stringifyMultiChoice = function (prop, delim) {
            if (delim === void 0) { delim = '; '; }
            var str = '';
            _.each(prop, function (choice, i) {
                if (i > 0) {
                    str += delim;
                }
                str += choice;
            });
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyMultiLookup
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {object[]} prop Array of lookup objects.
         * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
         * @description
         * Converts an array of selected lookup values into a single concatenated string.
         * @returns {string} Concatenated string representation.
         */
        FormattedFieldValueService.prototype.stringifyMultiLookup = function (prop, delim) {
            if (delim === void 0) { delim = '; '; }
            var str = '';
            _.each(prop, function (val, valIndex) {
                /** Add artificial delim */
                if (valIndex > 0) {
                    str += delim;
                }
                str += service.stringifyLookup(val);
            });
            return str;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apFormattedFieldValueService:stringifyNumber
         * @methodOf angularPoint.apFormattedFieldValueService
         * @param {number} prop Property on object to parse.
         * @description
         * Converts a number to a string representation.
         * @returns {string} Stringified number.
         */
        FormattedFieldValueService.prototype.stringifyNumber = function (prop) {
            var str = '';
            if (_.isNumber(prop)) {
                str = prop.toString();
            }
            return str;
        };
        FormattedFieldValueService.$inject = ['$filter'];
        return FormattedFieldValueService;
    })();
    ap.FormattedFieldValueService = FormattedFieldValueService;
    angular
        .module('angularPoint')
        .service('apFormattedFieldValueService', FormattedFieldValueService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var deferred, registerCallback;
    var logTypes = ['log', 'error', 'info', 'debug', 'warn'];
    var Logger = (function () {
        function Logger($q, $window, $log, $timeout) {
            var _this = this;
            this.$window = $window;
            this.$log = $log;
            this.$timeout = $timeout;
            /** Create a deferred object we can use to delay functionality until log model is registered */
            deferred = $q.defer();
            registerCallback = deferred.promise;
            /** Generate a method for each logger call */
            _.each(logTypes, function (logType) {
                /**
                 * @Example
                 *
                 * info(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
                 *     var opts = _.assign({}, {
                 *         message: message,
                 *         type: 'info'
                 *         url: $window.location.href,
                 *     }, optionsOverride);
                 *
                 *     return this.notify(opts);
                 * }
                 *
                 */
                _this[logType] = function (message, optionsOverride) {
                    var opts = _.assign({}, {
                        message: message,
                        type: logType,
                    }, optionsOverride);
                    return _this.notify(opts);
                };
            });
        }
        /**
         * @ngdoc function
         * @name apLogger.exception
         * @methodOf apLogger
         * @param {Error} exception Error which caused event.
         * @param {string} [cause] Angular sometimes provides cause.
         * @param {ILogger} optionsOverride Override any log options.
         */
        Logger.prototype.exception = function (exception, cause, optionsOverride) {
            try {
                var errorMessage = exception.toString();
                // generate a stack trace
                /* global printStackTrace:true */
                var stackTrace = printStackTrace({ e: exception });
                this.error(errorMessage, _.assign({}, {
                    event: 'exception',
                    stackTrace: stackTrace,
                    cause: (cause || "")
                }, optionsOverride));
            }
            catch (loggingError) {
                this.$log.warn("Error server-side logging failed");
                this.$log.log(loggingError);
            }
        };
        Logger.prototype.notify = function (options) {
            var _this = this;
            return this.$timeout(function () {
                /** Allow navigation to settle before capturing url */
                return _this.registerEvent(_.assign({}, { url: _this.$window.location.href }, options));
            }, 0);
        };
        Logger.prototype.registerEvent = function (logEvent) {
            return registerCallback.then(function (callback) {
                if (_.isFunction(callback)) {
                    return callback(logEvent);
                }
            });
        };
        /**
         * @ngdoc function
         * @name apLogger.subscribe
         * @methodOf apLogger
         * @param {Function} callback Callend when event occurs.
         * @description Callback fired when log event occurs
         */
        Logger.prototype.subscribe = function (callback) {
            deferred.resolve(callback);
        };
        Logger.$inject = ['$q', '$window', '$log', '$timeout'];
        return Logger;
    })();
    ap.Logger = Logger;
    /**
     * @ngdoc service
     * @name apLogger
     * @description
     * Common definitions used in the application.
     *
     * HOW TO USE
     * 1. Create a logging model for logs to be stored
     * 2. Ensure everyone has write access to the list
     * 3. Add the model as one of the dependencies in your .run so it'll be instantiated immediately
     * 4. Subscribe to change events from on the model
     *
     *
     * @example
     * <pre>
     * export class Log extends ap.ListItem{
     *     cause: string;
     *     event: string;
     *     formattedStackTrace: string;
     *     json: Object;
     *     message: string;
     *     stackTrace: string[];
     *     type: string;
     *     url: string;
     *     constructor(obj){
     *         _.assign(this, obj);
     *         // Create a formatted representation of the stacktrace to display in email notification
     *         if(this.stackTrace && !this.formattedStackTrace) {
     *             this.formattedStackTrace = '';
     *             _.each(this.stackTrace, (traceEntry) => {
     *                 this.formattedStackTrace += `${traceEntry}
     *             `;
     *             });
     *         }
     *     }
     * }
     * var logCounter = 0;
     * var maxLogsPerSesssion = 5;
     * export class LogsModel extends ap.Model{
     *     constructor(apLogger: ap.Logger) {
     *         model = this;
     *         super({
     *             factory: Log,
     *             list: {
     *                 title: 'Logs',
     *                 guid: '{LOG LIST GUID...CHANGE ME}',
     *                 customFields: [
     *                     {staticName: 'Message', objectType: 'Note', mappedName: 'message', readOnly: false},
     *                     {staticName: 'Title', objectType: 'Text', mappedName: 'url', readOnly: false},
     *                     {staticName: 'LogType', objectType: 'Text', mappedName: 'type', readOnly: false},
     *                     {staticName: 'StackTrace', objectType: 'JSON', mappedName: 'stackTrace', readOnly: false},
     *                     {staticName: 'Cause', objectType: 'Text', mappedName: 'cause', readOnly: false},
     *                     {staticName: 'JSON', objectType: 'JSON', mappedName: 'json', readOnly: false},
     *                     {staticName: 'Event', objectType: 'Text', mappedName: 'event', readOnly: false},
     *                     {
     *                         staticName: 'FormattedStackTrace',
     *                         objectType: 'Note',
     *                         mappedName: 'formattedStackTrace',
     *                         readOnly: false,
     *                         description: 'Trace formatted to be readable in email notification.'
     *                     }
     *                 ]
     *             }
     *         });
     *         // Register this model as the list where all logs will be stored
     *         apLogger.subscribe(function (event: ap.ILogEvent) {
     *             // Ensure we keep logging under control, prevents spamming server if loop occurs
     *             if(logCounter < maxLogsPerSesssion) {
     *                 var newLog = model.createEmptyItem(event);
     *                 console.log(newLog);
     *                 newLog.saveChanges();
     *                 logCounter++;
     *             }
     *         });
     *     }
     * }
     *
     * </pre>
     *
     */
    angular
        .module('angularPoint')
        .service('apLogger', Logger);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    // Set up SOAP envelope
    var SOAPEnvelope = (function () {
        function SOAPEnvelope() {
            this.header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                "xmlns:xsd='http://www.w3.org/2001/XMLSchema' " +
                "xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
            this.footer = "</soap:Body></soap:Envelope>";
            this.payload = "";
        }
        return SOAPEnvelope;
    })();
    //TODO Cleanup and convert to TS
    function Service(apWebServiceOperationConstants, apWebServiceService) {
        /*
         * SPServices - Work with SharePoint's Web Services using jQuery
         * Version 2014.02a
         * @requires jQuery v1.8 or greater - jQuery 1.10.x recommended
         *
         * Copyright (c) 2009-2013 Sympraxis Consulting LLC
         * Examples and docs at:
         * http://spservices.codeplex.com
         * Licensed under the MIT license:
         * http://www.opensource.org/licenses/mit-license.php
         */
        /*
         * @description Work with SharePoint's Web Services using jQuery
         * @type jQuery
         * @name SPServices
         * @category Plugins/SPServices
         * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
         */
        /* jshint undef: true */
        /* global L_Menu_BaseUrl, _spUserId, _spPageContextInfo, GipAddSelectedItems, GipRemoveSelectedItems, GipGetGroupData */
        // Global variables
        var SCHEMASharePoint = "http://schemas.microsoft.com/sharepoint";
        var i = 0; // Generic loop counter
        var encodeOptionList = ["listName", "description"]; // Used to encode options which may contain special characters
        // Defaults added as a function in our library means that the caller can override the defaults
        // for their session by calling this function.  Each operation requires a different set of options;
        // we allow for all in a standardized way.
        var defaults = {
            operation: "",
            webURL: "",
            makeViewDefault: false,
            // For operations requiring CAML, these options will override any abstractions
            CAMLViewName: "",
            CAMLQuery: "",
            CAMLViewFields: "",
            CAMLRowLimit: 0,
            CAMLQueryOptions: "<QueryOptions></QueryOptions>",
            // Abstractions for CAML syntax
            batchCmd: "Update",
            valuePairs: [],
            // As of v0.7.1, removed all options which were assigned an empty string ("")
            DestinationUrls: [],
            behavior: "Version3",
            storage: "Shared",
            objectType: "List",
            cancelMeeting: true,
            nonGregorian: false,
            fClaim: false,
            recurrenceId: 0,
            sequence: 0,
            maximumItemsToReturn: 0,
            startIndex: 0,
            isHighPriority: false,
            isPrivate: false,
            rating: 1,
            maxResults: 10,
            principalType: "User",
            async: true,
            completefunc: null // Function to call on completion
        }; // End SPServices.defaults
        // Main function, which calls SharePoint's Web Services directly.
        var SPServices = {
            defaults: defaults,
            encodeXml: encodeXml,
            generateXMLComponents: generateXMLComponents,
            SCHEMASharePoint: SCHEMASharePoint,
            SOAPEnvelope: new SOAPEnvelope()
        };
        function generateXMLComponents(options) {
            /** Key/Value mapping of SharePoint properties to SPServices properties */
            var mapping = [
                ['query', 'CAMLQuery'],
                ['viewFields', 'CAMLViewFields'],
                ['rowLimit', 'CAMLRowLimit'],
                ['queryOptions', 'CAMLQueryOptions'],
                ['listItemID', 'ID']
            ];
            /** Ensure the SharePoint properties are available prior to extending with defaults */
            _.each(mapping, function (map) {
                if (options[map[0]] && !options[map[1]]) {
                    /** Ensure SPServices properties are added in the event the true property name is used */
                    options[map[1]] = options[map[0]];
                }
            });
            var soapEnvelope = new SOAPEnvelope();
            var SOAPAction;
            // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
            var opt = _.assign({}, defaults, options);
            // Encode options which may contain special character, esp. ampersand
            _.each(encodeOptionList, function (optionName) {
                if (_.isString(opt[optionName])) {
                    opt[optionName] = encodeXml(opt[optionName]);
                }
            });
            var service = apWebServiceOperationConstants[opt.operation][0];
            // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
            soapEnvelope.opheader = "<" + opt.operation + " xmlns=\"" + apWebServiceService.xmlns(service) + "\" >";
            SOAPAction = apWebServiceService.action(service);
            // Add the operation to the SOAPAction and opfooter
            SOAPAction += opt.operation;
            soapEnvelope.opfooter = "</" + opt.operation + ">";
            // Each operation requires a different set of values.  This switch statement sets them up in the soapEnvelope.payload.
            switch (opt.operation) {
                // ALERT OPERATIONS
                case "GetAlerts":
                    break;
                case "DeleteAlerts":
                    soapEnvelope.payload += "<IDs>";
                    for (i = 0; i < opt.IDs.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.IDs[i]);
                    }
                    soapEnvelope.payload += "</IDs>";
                    break;
                // AUTHENTICATION OPERATIONS
                case "Mode":
                    break;
                case "Login":
                    addToPayload(opt, ["username", "password"]);
                    break;
                // COPY OPERATIONS
                case "CopyIntoItems":
                    addToPayload(opt, ["SourceUrl"]);
                    soapEnvelope.payload += "<DestinationUrls>";
                    for (i = 0; i < opt.DestinationUrls.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
                    }
                    soapEnvelope.payload += "</DestinationUrls>";
                    addToPayload(opt, ["Fields", "Stream", "Results"]);
                    break;
                case "CopyIntoItemsLocal":
                    addToPayload(opt, ["SourceUrl"]);
                    soapEnvelope.payload += "<DestinationUrls>";
                    for (i = 0; i < opt.DestinationUrls.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
                    }
                    soapEnvelope.payload += "</DestinationUrls>";
                    break;
                case "GetItem":
                    addToPayload(opt, ["Url", "Fields", "Stream"]);
                    break;
                // FORM OPERATIONS
                case "GetForm":
                    addToPayload(opt, ["listName", "formUrl"]);
                    break;
                case "GetFormCollection":
                    addToPayload(opt, ["listName"]);
                    break;
                // LIST OPERATIONS
                case "AddAttachment":
                    addToPayload(opt, ["listName", "listItemID", "fileName", "attachment"]);
                    break;
                case "AddDiscussionBoardItem":
                    addToPayload(opt, ["listName", "message"]);
                    break;
                case "AddList":
                    addToPayload(opt, ["listName", "description", "templateID"]);
                    break;
                case "AddListFromFeature":
                    addToPayload(opt, ["listName", "description", "featureID", "templateID"]);
                    break;
                case "ApplyContentTypeToList":
                    addToPayload(opt, ["webUrl", "contentTypeId", "listName"]);
                    break;
                case "CheckInFile":
                    addToPayload(opt, ["pageUrl", "comment", "CheckinType"]);
                    break;
                case "CheckOutFile":
                    addToPayload(opt, ["pageUrl", "checkoutToLocal", "lastmodified"]);
                    break;
                case "CreateContentType":
                    addToPayload(opt, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
                    break;
                case "DeleteAttachment":
                    addToPayload(opt, ["listName", "listItemID", "url"]);
                    break;
                case "DeleteContentType":
                    addToPayload(opt, ["listName", "contentTypeId"]);
                    break;
                case "DeleteContentTypeXmlDocument":
                    addToPayload(opt, ["listName", "contentTypeId", "documentUri"]);
                    break;
                case "DeleteList":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetAttachmentCollection":
                    addToPayload(opt, ["listName", ["listItemID", "ID"]]);
                    break;
                case "GetList":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetListAndView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetListCollection":
                    break;
                case "GetListContentType":
                    addToPayload(opt, ["listName", "contentTypeId"]);
                    break;
                case "GetListContentTypes":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetListItems":
                    addToPayload(opt, ["listName", "viewName",
                        ["query", "CAMLQuery"],
                        ["viewFields", "CAMLViewFields"],
                        ["rowLimit", "CAMLRowLimit"],
                        ["queryOptions", "CAMLQueryOptions"]
                    ]);
                    break;
                case "GetListItemChanges":
                    addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
                    break;
                case "GetListItemChangesSinceToken":
                    addToPayload(opt, ["listName", "viewName",
                        ["query", "CAMLQuery"],
                        ["viewFields", "CAMLViewFields"],
                        ["rowLimit", "CAMLRowLimit"],
                        ["queryOptions", "CAMLQueryOptions"],
                        {
                            name: "changeToken",
                            sendNull: false
                        },
                        {
                            name: "contains",
                            sendNull: false
                        }
                    ]);
                    break;
                case "GetVersionCollection":
                    addToPayload(opt, ["strlistID", "strlistItemID", "strFieldName"]);
                    break;
                case "UndoCheckOut":
                    addToPayload(opt, ["pageUrl"]);
                    break;
                case "UpdateContentType":
                    addToPayload(opt, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
                    break;
                case "UpdateContentTypesXmlDocument":
                    addToPayload(opt, ["listName", "newDocument"]);
                    break;
                case "UpdateContentTypeXmlDocument":
                    addToPayload(opt, ["listName", "contentTypeId", "newDocument"]);
                    break;
                case "UpdateList":
                    addToPayload(opt, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
                    break;
                case "UpdateListItems":
                    addToPayload(opt, ["listName"]);
                    if (typeof opt.updates !== "undefined" && opt.updates.length > 0) {
                        addToPayload(opt, ["updates"]);
                    }
                    else {
                        soapEnvelope.payload += "<updates><Batch OnError=\"Continue\"><Method ID=\"1\" Cmd=\"" + opt.batchCmd + "\">";
                        for (i = 0; i < opt.valuePairs.length; i++) {
                            soapEnvelope.payload += "<Field Name=\"" + opt.valuePairs[i][0] + "\">" + escapeColumnValue(opt.valuePairs[i][1]) + "</Field>";
                        }
                        if (opt.batchCmd !== "New") {
                            soapEnvelope.payload += "<Field Name=\"ID\">" + opt.ID + "</Field>";
                        }
                        soapEnvelope.payload += "</Method></Batch></updates>";
                    }
                    break;
                // MEETINGS OPERATIONS
                case "AddMeeting":
                    addToPayload(opt, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
                    break;
                case "CreateWorkspace":
                    addToPayload(opt, ["title", "templateName", "lcid", "timeZoneInformation"]);
                    break;
                case "RemoveMeeting":
                    addToPayload(opt, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
                    break;
                case "SetWorkspaceTitle":
                    addToPayload(opt, ["title"]);
                    break;
                // PEOPLE OPERATIONS
                case "ResolvePrincipals":
                    addToPayload(opt, ["principalKeys", "principalType", "addToUserInfoList"]);
                    break;
                case "SearchPrincipals":
                    addToPayload(opt, ["searchText", "maxResults", "principalType"]);
                    break;
                // PERMISSION OPERATIONS
                case "AddPermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                    break;
                case "AddPermissionCollection":
                    addToPayload(opt, ["objectName", "objectType", "permissionsInfoXml"]);
                    break;
                case "GetPermissionCollection":
                    addToPayload(opt, ["objectName", "objectType"]);
                    break;
                case "RemovePermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
                    break;
                case "RemovePermissionCollection":
                    addToPayload(opt, ["objectName", "objectType", "memberIdsXml"]);
                    break;
                case "UpdatePermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                    break;
                // PUBLISHEDLINKSSERVICE OPERATIONS
                case "GetLinks":
                    break;
                // SEARCH OPERATIONS
                case "GetPortalSearchInfo":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    break;
                case "GetQuerySuggestions":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "GetSearchMetadata":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    break;
                case "Query":
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "QueryEx":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "Registration":
                    soapEnvelope.payload += wrapNode("registrationXml", encodeXml(opt.registrationXml));
                    break;
                case "Status":
                    break;
                // SHAREPOINTDIAGNOSTICS OPERATIONS
                case "SendClientScriptErrorReport":
                    addToPayload(opt, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
                    break;
                // SITEDATA OPERATIONS
                case "EnumerateFolder":
                    addToPayload(opt, ["strFolderUrl"]);
                    break;
                case "GetAttachments":
                    addToPayload(opt, ["strListName", "strItemId"]);
                    break;
                case "SiteDataGetList":
                    addToPayload(opt, ["strListName"]);
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetListCollection":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetSite":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetSiteUrl":
                    addToPayload(opt, ["Url"]);
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetWeb":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                // SITES OPERATIONS
                case "CreateWeb":
                    addToPayload(opt, ["url", "title", "description", "templateName", "language", "languageSpecified",
                        "locale", "localeSpecified", "collationLocale", "collationLocaleSpecified", "uniquePermissions",
                        "uniquePermissionsSpecified", "anonymous", "anonymousSpecified", "presence", "presenceSpecified"
                    ]);
                    break;
                case "DeleteWeb":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetSite":
                    addToPayload(opt, ["SiteUrl"]);
                    break;
                case "GetSiteTemplates":
                    addToPayload(opt, ["LCID", "TemplateList"]);
                    break;
                // SOCIALDATASERVICE OPERATIONS
                case "AddComment":
                    addToPayload(opt, ["url", "comment", "isHighPriority", "title"]);
                    break;
                case "AddTag":
                    addToPayload(opt, ["url", "termID", "title", "isPrivate"]);
                    break;
                case "AddTagByKeyword":
                    addToPayload(opt, ["url", "keyword", "title", "isPrivate"]);
                    break;
                case "CountCommentsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "CountCommentsOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "CountCommentsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "CountRatingsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "CountTagsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "DeleteComment":
                    addToPayload(opt, ["url", "lastModifiedTime"]);
                    break;
                case "DeleteRating":
                    addToPayload(opt, ["url"]);
                    break;
                case "DeleteTag":
                    addToPayload(opt, ["url", "termID"]);
                    break;
                case "DeleteTagByKeyword":
                    addToPayload(opt, ["url", "keyword"]);
                    break;
                case "DeleteTags":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetAllTagTerms":
                    addToPayload(opt, ["maximumItemsToReturn"]);
                    break;
                case "GetAllTagTermsForUrlFolder":
                    addToPayload(opt, ["urlFolder", "maximumItemsToReturn"]);
                    break;
                case "GetAllTagUrls":
                    addToPayload(opt, ["termID"]);
                    break;
                case "GetAllTagUrlsByKeyword":
                    addToPayload(opt, ["keyword"]);
                    break;
                case "GetCommentsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                    break;
                case "GetCommentsOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "GetCommentsOnUrl":
                    addToPayload(opt, ["url", "maximumItemsToReturn", "startIndex"]);
                    if (typeof opt.excludeItemsTime !== "undefined" && opt.excludeItemsTime.length > 0) {
                        soapEnvelope.payload += wrapNode("excludeItemsTime", opt.excludeItemsTime);
                    }
                    break;
                case "GetRatingAverageOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetRatingOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "GetRatingOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetRatingsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "GetRatingsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetSocialDataForFullReplication":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "GetTags":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetTagsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                    break;
                case "GetTagTerms":
                    addToPayload(opt, ["maximumItemsToReturn"]);
                    break;
                case "GetTagTermsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn"]);
                    break;
                case "GetTagTermsOnUrl":
                    addToPayload(opt, ["url", "maximumItemsToReturn"]);
                    break;
                case "GetTagUrls":
                    addToPayload(opt, ["termID"]);
                    break;
                case "GetTagUrlsByKeyword":
                    addToPayload(opt, ["keyword"]);
                    break;
                case "GetTagUrlsOfUser":
                    addToPayload(opt, ["termID", "userAccountName"]);
                    break;
                case "GetTagUrlsOfUserByKeyword":
                    addToPayload(opt, ["keyword", "userAccountName"]);
                    break;
                case "SetRating":
                    addToPayload(opt, ["url", "rating", "title", "analysisDataEntry"]);
                    break;
                case "UpdateComment":
                    addToPayload(opt, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
                    break;
                // SPELLCHECK OPERATIONS
                case "SpellCheck":
                    addToPayload(opt, ["chunksToSpell", "declaredLanguage", "useLad"]);
                    break;
                // TAXONOMY OPERATIONS
                case "AddTerms":
                    addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                    break;
                case "GetChildTermsInTerm":
                    addToPayload(opt, ["sspId", "lcid", "termId", "termSetId"]);
                    break;
                case "GetChildTermsInTermSet":
                    addToPayload(opt, ["sspId", "lcid", "termSetId"]);
                    break;
                case "GetKeywordTermsByGuids":
                    addToPayload(opt, ["termIds", "lcid"]);
                    break;
                case "GetTermsByLabel":
                    addToPayload(opt, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                    break;
                case "GetTermSets":
                    addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "clientTimeStamps", "clientVersions"]);
                    break;
                // USERS AND GROUPS OPERATIONS
                case "AddGroup":
                    addToPayload(opt, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
                    break;
                case "AddGroupToRole":
                    addToPayload(opt, ["groupName", "roleName"]);
                    break;
                case "AddRole":
                    addToPayload(opt, ["roleName", "description", "permissionMask"]);
                    break;
                case "AddRoleDef":
                    addToPayload(opt, ["roleName", "description", "permissionMask"]);
                    break;
                case "AddUserCollectionToGroup":
                    addToPayload(opt, ["groupName", "usersInfoXml"]);
                    break;
                case "AddUserCollectionToRole":
                    addToPayload(opt, ["roleName", "usersInfoXml"]);
                    break;
                case "AddUserToGroup":
                    addToPayload(opt, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
                    break;
                case "AddUserToRole":
                    addToPayload(opt, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
                    break;
                case "GetAllUserCollectionFromWeb":
                    break;
                case "GetGroupCollection":
                    addToPayload(opt, ["groupNamesXml"]);
                    break;
                case "GetGroupCollectionFromRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetGroupCollectionFromSite":
                    break;
                case "GetGroupCollectionFromUser":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetGroupCollectionFromWeb":
                    break;
                case "GetGroupInfo":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetRoleCollection":
                    addToPayload(opt, ["roleNamesXml"]);
                    break;
                case "GetRoleCollectionFromGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetRoleCollectionFromUser":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetRoleCollectionFromWeb":
                    break;
                case "GetRoleInfo":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetRolesAndPermissionsForCurrentUser":
                    break;
                case "GetRolesAndPermissionsForSite":
                    break;
                case "GetUserCollection":
                    addToPayload(opt, ["userLoginNamesXml"]);
                    break;
                case "GetUserCollectionFromGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetUserCollectionFromRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetUserCollectionFromSite":
                    break;
                case "GetUserCollectionFromWeb":
                    break;
                case "GetUserInfo":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetUserLoginFromEmail":
                    addToPayload(opt, ["emailXml"]);
                    break;
                case "RemoveGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "RemoveGroupFromRole":
                    addToPayload(opt, ["roleName", "groupName"]);
                    break;
                case "RemoveRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "RemoveUserCollectionFromGroup":
                    addToPayload(opt, ["groupName", "userLoginNamesXml"]);
                    break;
                case "RemoveUserCollectionFromRole":
                    addToPayload(opt, ["roleName", "userLoginNamesXml"]);
                    break;
                case "RemoveUserCollectionFromSite":
                    addToPayload(opt, ["userLoginNamesXml"]);
                    break;
                case "RemoveUserFromGroup":
                    addToPayload(opt, ["groupName", "userLoginName"]);
                    break;
                case "RemoveUserFromRole":
                    addToPayload(opt, ["roleName", "userLoginName"]);
                    break;
                case "RemoveUserFromSite":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "RemoveUserFromWeb":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "UpdateGroupInfo":
                    addToPayload(opt, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
                    break;
                case "UpdateRoleDefInfo":
                    addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
                    break;
                case "UpdateRoleInfo":
                    addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
                    break;
                case "UpdateUserInfo":
                    addToPayload(opt, ["userLoginName", "userName", "userEmail", "userNotes"]);
                    break;
                // USERPROFILESERVICE OPERATIONS
                case "AddColleague":
                    addToPayload(opt, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
                    break;
                case "AddLink":
                    addToPayload(opt, ["accountName", "name", "url", "group", "privacy"]);
                    break;
                case "AddMembership":
                    addToPayload(opt, ["accountName", "membershipInfo", "group", "privacy"]);
                    break;
                case "AddPinnedLink":
                    addToPayload(opt, ["accountName", "name", "url"]);
                    break;
                case "CreateMemberGroup":
                    addToPayload(opt, ["membershipInfo"]);
                    break;
                case "CreateUserProfileByAccountName":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonManager":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetInCommon":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetPropertyChoiceList":
                    addToPayload(opt, ["propertyName"]);
                    break;
                case "GetUserColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserPinnedLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserProfileByGuid":
                    addToPayload(opt, ["guid"]);
                    break;
                case "GetUserProfileByIndex":
                    addToPayload(opt, ["index"]);
                    break;
                case "GetUserProfileByName":
                    // Note that this operation is inconsistent with the others, using AccountName rather than accountName
                    if (typeof opt.accountName !== "undefined" && opt.accountName.length > 0) {
                        addToPayload(opt, [
                            ["AccountName", "accountName"]
                        ]);
                    }
                    else {
                        addToPayload(opt, ["AccountName"]);
                    }
                    break;
                case "GetUserProfileCount":
                    break;
                case "GetUserProfileSchema":
                    break;
                case "GetUserPropertyByAccountName":
                    addToPayload(opt, ["accountName", "propertyName"]);
                    break;
                case "ModifyUserPropertyByAccountName":
                    addToPayload(opt, ["accountName", "newData"]);
                    break;
                case "RemoveAllColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllPinnedLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveColleague":
                    addToPayload(opt, ["accountName", "colleagueAccountName"]);
                    break;
                case "RemoveLink":
                    addToPayload(opt, ["accountName", "id"]);
                    break;
                case "RemoveMembership":
                    addToPayload(opt, ["accountName", "sourceInternal", "sourceReference"]);
                    break;
                case "RemovePinnedLink":
                    addToPayload(opt, ["accountName", "id"]);
                    break;
                case "UpdateColleaguePrivacy":
                    addToPayload(opt, ["accountName", "colleagueAccountName", "newPrivacy"]);
                    break;
                case "UpdateLink":
                    addToPayload(opt, ["accountName", "data"]);
                    break;
                case "UpdateMembershipPrivacy":
                    addToPayload(opt, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
                    break;
                case "UpdatePinnedLink ":
                    addToPayload(opt, ["accountName", "data"]);
                    break;
                // VERSIONS OPERATIONS
                case "DeleteAllVersions":
                    addToPayload(opt, ["fileName"]);
                    break;
                case "DeleteVersion":
                    addToPayload(opt, ["fileName", "fileVersion"]);
                    break;
                case "GetVersions":
                    addToPayload(opt, ["fileName"]);
                    break;
                case "RestoreVersion":
                    addToPayload(opt, ["fileName", "fileVersion"]);
                    break;
                // VIEW OPERATIONS
                case "AddView":
                    addToPayload(opt, ["listName", "viewName", "viewFields", "query", "rowLimit", "rowLimit", "type", "makeViewDefault"]);
                    break;
                case "DeleteView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetViewCollection":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetViewHtml":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "UpdateView":
                    addToPayload(opt, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
                    break;
                case "UpdateViewHtml":
                    addToPayload(opt, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded",
                        "query", "viewFields", "aggregations", "formats", "rowLimit"
                    ]);
                    break;
                // WEBPARTPAGES OPERATIONS
                case "AddWebPart":
                    addToPayload(opt, ["pageUrl", "webPartXml", "storage"]);
                    break;
                case "AddWebPartToZone":
                    addToPayload(opt, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
                    break;
                case "GetWebPart2":
                    addToPayload(opt, ["pageUrl", "storageKey", "storage", "behavior"]);
                    break;
                case "GetWebPartPage":
                    addToPayload(opt, ["documentName", "behavior"]);
                    break;
                case "GetWebPartProperties":
                    addToPayload(opt, ["pageUrl", "storage"]);
                    break;
                case "GetWebPartProperties2":
                    addToPayload(opt, ["pageUrl", "storage", "behavior"]);
                    break;
                // WEBS OPERATIONS
                case "Webs.CreateContentType":
                    addToPayload(opt, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
                    break;
                case "GetColumns":
                    addToPayload(opt, ["webUrl"]);
                    break;
                case "GetContentType":
                    addToPayload(opt, ["contentTypeId"]);
                    break;
                case "GetContentTypes":
                    break;
                case "GetCustomizedPageStatus":
                    addToPayload(opt, ["fileUrl"]);
                    break;
                case "GetListTemplates":
                    break;
                case "GetObjectIdFromUrl":
                    addToPayload(opt, ["objectUrl"]);
                    break;
                case "GetWeb":
                    addToPayload(opt, [
                        ["webUrl", "webURL"]
                    ]);
                    break;
                case "GetWebCollection":
                    break;
                case "GetAllSubWebCollection":
                    break;
                case "UpdateColumns":
                    addToPayload(opt, ["newFields", "updateFields", "deleteFields"]);
                    break;
                case "Webs.UpdateContentType":
                    addToPayload(opt, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
                    break;
                case "WebUrlFromPageUrl":
                    addToPayload(opt, [
                        ["pageUrl", "pageURL"]
                    ]);
                    break;
                // WORKFLOW OPERATIONS
                case "AlterToDo":
                    addToPayload(opt, ["item", "todoId", "todoListId", "taskData"]);
                    break;
                case "ClaimReleaseTask":
                    addToPayload(opt, ["item", "taskId", "listId", "fClaim"]);
                    break;
                case "GetTemplatesForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetToDosForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetWorkflowDataForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetWorkflowTaskData":
                    addToPayload(opt, ["item", "listId", "taskId"]);
                    break;
                case "StartWorkflow":
                    addToPayload(opt, ["item", "templateId", "workflowParameters"]);
                    break;
                default:
                    break;
            }
            // Glue together the pieces of the SOAP message
            var msg = soapEnvelope.header + soapEnvelope.opheader + soapEnvelope.payload + soapEnvelope.opfooter + soapEnvelope.footer;
            var soapAction = apWebServiceOperationConstants[opt.operation][1] ? SOAPAction : false;
            return {
                msg: msg,
                SOAPEnvelope: soapEnvelope,
                SOAPAction: soapAction
            };
            // Add the option values to the soapEnvelope.payload for the operation
            //  opt = options for the call
            //  paramArray = an array of option names to add to the payload
            //      "paramName" if the parameter name and the option name match
            //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
            //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
            function addToPayload(opt, paramArray) {
                var i;
                for (i = 0; i < paramArray.length; i++) {
                    // the parameter name and the option name match
                    if (typeof paramArray[i] === "string") {
                        soapEnvelope.payload += wrapNode(paramArray[i], opt[paramArray[i]]);
                    }
                    else if (_.isArray(paramArray[i]) && paramArray[i].length === 2) {
                        soapEnvelope.payload += wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
                    }
                    else if ((typeof paramArray[i] === "object") && (paramArray[i].sendNull !== undefined)) {
                        soapEnvelope.payload += ((opt[paramArray[i].name] === undefined) || (opt[paramArray[i].name].length === 0)) ? "" : wrapNode(paramArray[i].name, opt[paramArray[i].name]);
                    }
                    else {
                        console.error(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
                    }
                }
            } // End of function addToPayload
            // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
            // the SiteData prefix on their names. This function replaces that name with the right name in the soapEnvelope.
            function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
                var siteDataOp = siteDataOperation.substring(8);
                SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
                SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
                return SOAPEnvelope;
            } // End of function siteDataFixSOAPEnvelope
        }
        ; // End SPServices.generateXMLComponents
        //TODO Move this somewhere else, it's too buried down here
        // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
        // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
        // for performance details.
        $.fn.SPFilterNode = function (name) {
            return this.find('*').filter(function () {
                return this.nodeName === name;
            });
        }; // End $.fn.SPFilterNode
        ////// PRIVATE FUNCTIONS ////////
        // Wrap an XML node (n) around a value (v)
        function wrapNode(n, v) {
            var thisValue = typeof v !== "undefined" ? v : "";
            return "<" + n + ">" + thisValue + "</" + n + ">";
        }
        // Get the filename from the full URL
        function fileName(s) {
            return s.substring(s.lastIndexOf("/") + 1, s.length);
        }
        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
        var xml_special_to_escaped_one_map = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };
        function encodeXml(string) {
            return string.replace(/([\&"<>])/g, function (str, item) {
                return xml_special_to_escaped_one_map[item];
            });
        }
        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
        // Escape column values
        function escapeColumnValue(s) {
            if (typeof s === "string") {
                return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
            }
            else {
                return s;
            }
        }
        // James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
        $.expr[':'].regex = function (elem, index, match) {
            var matchParams = match[3].split(','), validLabels = /^(data|css):/, attr = {
                method: matchParams[0].match(validLabels) ?
                    matchParams[0].split(':')[0] : 'attr',
                property: matchParams.shift().replace(validLabels, '')
            }, regexFlags = 'ig', regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
            return regex.test(jQuery(elem)[attr.method](attr.property));
        };
        return SPServices;
    }
    /**
     * @ngdoc service
     * @name angularPoint.SPServices
     * @description
     * This is just a trimmed down version of Marc Anderson's awesome [SPServices](http://spservices.codeplex.com/) library.
     * We're primarily looking for the ability to create the SOAP envelope and let AngularJS's $http service handle all
     * communication with the server.
     *
     * */
    angular.module('angularPoint')
        .factory('SPServices', Service);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    // Split values like 1;#value into id and value
    var SplitIndex = (function () {
        function SplitIndex(str) {
            var spl = str.split(';#');
            this.id = parseInt(spl[0], 10);
            this.value = spl[1];
        }
        return SplitIndex;
    })();
    var service, $q, apConfig, $timeout;
    var UtilityService = (function () {
        function UtilityService(_$q_, _$timeout_, _apConfig_) {
            this.SplitIndex = SplitIndex;
            service = this;
            $q = _$q_;
            $timeout = _$timeout_;
            apConfig = _apConfig_;
        }
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:batchProcess
         * @methodOf angularPoint.apUtilityService
         * @description
         * We REALLY don't want to lock the user's browser (blocking the UI thread) while iterating over an array of
         * entities and performing some process on them.  This function cuts the process into as many 50ms chunks as are
         * necessary. Based on example found in the following article:
         * [Timed array processing in JavaScript](http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/);
         * @param {Object[]} entities The entities that need to be processed.
         * @param {Function} process Reference to the process to be executed for each of the entities.
         * @param {Object} context this
         * @param {Number} [delay=25] Number of milliseconds to delay between batches.
         * @param {Number} [maxItems=entities.length] Maximum number of entities to process before pausing.
         * @returns {Object} Promise
         * @example
         * <pre>
         * function buildProjectSummary = function() {
             *    var deferred = $q.defer();
             *
             *    // Taken from a fictitious projectsModel.js
             *    projectModel.getAllListItems().then(function(entities) {
             *      var summaryObject = {};
             *      var extendProjectSummary = function(project) {
             *          // Do some process intensive stuff here
             *
             *      };
             *
             *      // Now that we have all of our projects we want to iterate
             *      // over each to create our summary object. The problem is
             *      // this could easily cause the page to hang with a sufficient
             *      // number of entities.
             *      apUtilityService.batchProcess(entities, extendProjectSummary, function() {
             *          // Long running process is complete so resolve promise
             *          deferred.resolve(summaryObject);
             *      }, 25, 1000);
             *    };
             *
             *    return deferred.promise;
             * }
         *
         * </pre>
         */
        UtilityService.prototype.batchProcess = function (entities, process, context, delay, maxItems) {
            var itemCount = entities.length, batchCount = 0, chunkMax = maxItems || itemCount, delay = delay || 25, index = 0, deferred = $q.defer();
            function chunkTimer() {
                batchCount++;
                var start = +new Date(), chunkIndex = index;
                while (index < itemCount && (index - chunkIndex) < chunkMax && (new Date() - start < 100)) {
                    process.call(context, entities[index], index, batchCount);
                    index += 1;
                }
                if (index < itemCount) {
                    $timeout(chunkTimer, delay);
                }
                else {
                    deferred.resolve(entities);
                }
            }
            chunkTimer();
            return deferred.promise;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:convertEffectivePermMask
         * @methodOf angularPoint.apUtilityService
         * @description
         * GetListItemsSinceToken operation returns the list element with an EffectivePermMask attribute which is the
         * name of the PermissionMask.  We then need to convert the name into an actual mask so this function contains
         * the known permission names with their masks.  If a provided mask name is found, the cooresponding mask
         * is returned.  Otherwise returns null.  [MSDN Source](http://msdn.microsoft.com/en-us/library/jj575178(v=office.12).aspx)
         * @param {string} permMaskName Permission mask name.
         * @returns {string|null} Return the mask for the name.
         */
        UtilityService.prototype.convertEffectivePermMask = function (permMaskName) {
            var permissionMask = null;
            var permissions = {
                //General
                EmptyMask: '0x0000000000000000',
                FullMask: '0x7FFFFFFFFFFFFFFF',
                //List and document permissions
                ViewListItems: '0x0000000000000001',
                AddListItems: '',
                EditListItems: '0x0000000000000004',
                DeleteListItems: '0x0000000000000008',
                ApproveItems: '0x0000000000000010',
                OpenItems: '0x0000000000000020',
                ViewVersions: '0x0000000000000040',
                DeleteVersions: '0x0000000000000080',
                CancelCheckout: '0x0000000000000100',
                ManagePersonalViews: '0x0000000000000200',
                ManageLists: '0x0000000000000800',
                ViewFormPages: '0x0000000000001000',
                //Web level permissions
                Open: '0x0000000000010000',
                ViewPages: '0x0000000000020000',
                AddAndCustomizePages: '0x0000000000040000',
                ApplyThemeAndBorder: '0x0000000000080000',
                ApplyStyleSheets: '0x0000000000100000',
                ViewUsageData: '0x0000000000200000',
                CreateSSCSite: '0x0000000000400000',
                ManageSubwebs: '0x0000000000800000',
                CreateGroups: '0x0000000001000000',
                ManagePermissions: '0x0000000002000000',
                BrowseDirectories: '0x0000000004000000',
                BrowseUserInfo: '0x0000000008000000',
                AddDelPrivateWebParts: '0x0000000010000000',
                UpdatePersonalWebParts: '0x0000000020000000',
                ManageWeb: '0x0000000040000000',
                UseClientIntegration: '0x0000001000000000',
                UseRemoteAPIs: '0x0000002000000000',
                ManageAlerts: '0x0000004000000000',
                CreateAlerts: '0x0000008000000000',
                EditMyUserInfo: '0x0000010000000000',
                //Special Permissions
                EnumeratePermissions: '0x4000000000000000'
            };
            if (permissions[permMaskName]) {
                permissionMask = permissions[permMaskName];
            }
            return permissionMask;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:dateWithinRange
         * @methodOf angularPoint.apUtilityService
         * @description
         * Converts dates into yyyymmdd formatted ints and evaluates to determine if the dateToCheck
         * falls within the date range provided
         * @param {Date} startDate Starting date.
         * @param {Date} endDate Ending date.
         * @param {Date} [dateToCheck=new Date()] Defaults to the current date.
         * @returns {boolean} Does the date fall within the range?
         */
        UtilityService.prototype.dateWithinRange = function (startDate, endDate, dateToCheck) {
            if (dateToCheck === void 0) { dateToCheck = new Date(); }
            /** Ensure both a start and end date are provided **/
            if (!startDate || !endDate) {
                return false;
            }
            /** Create an int representation of each of the dates */
            var startInt = service.yyyymmdd(startDate);
            var endInt = service.yyyymmdd(endDate);
            var dateToCheckInt = service.yyyymmdd(dateToCheck);
            return startInt <= dateToCheckInt && dateToCheckInt <= endInt;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:doubleDigit
         * @methodOf angularPoint.apUtilityService
         * @description Add a leading zero if a number/string only contains a single character.  So in the case
         * where the number 9 is passed in the string '09' is returned.
         * @param {(number|string)} val A number or string to evaluate.
         * @returns {string} Two digit string.
         */
        UtilityService.prototype.doubleDigit = function (val) {
            if (typeof val === 'number') {
                return val > 9 ? val.toString() : '0' + val;
            }
            else {
                return service.doubleDigit(parseInt(val));
            }
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:fromCamelCase
         * @methodOf angularPoint.apUtilityService
         * @param {string} str String to convert.
         * @description
         * Converts a camel case string into a space delimited string with each word having a capitalized first letter.
         * @returns {string} Humanized string.
         */
        UtilityService.prototype.fromCamelCase = function (str) {
            // insert a space before all caps
            return str.replace(/([A-Z])/g, ' $1')
                .replace(/^./, function (str) {
                return str.toUpperCase();
            });
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:registerChange
         * @methodOf angularPoint.apUtilityService
         * @description
         * If online and sync is being used, notify all online users that a change has been made.
         * //Todo Break this functionality into FireBase module that can be used if desired.
         * @param {object} model event
         */
        UtilityService.prototype.registerChange = function (model, changeType, listItemId) {
            /** Disabled this functionality until I can spend the necessary time to test */
            if (model.sync && _.isFunction(model.sync.registerChange)) {
                /** Register change after successful update */
                model.sync.registerChange(changeType, listItemId);
            }
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:resolvePermissions
         * @methodOf angularPoint.apUtilityService
         * @param {string} permissionsMask The WSS Rights Mask is an 8-byte, unsigned integer that specifies
         * the rights that can be assigned to a user or site group. This bit mask can have zero or more flags set.
         * @description
         * Converts permMask into something usable to determine permission level for current user.  Typically used
         * directly from a list item.  See ListItem.resolvePermissions.
         *
         * <h3>Additional Info</h3>
         *
         * -   [PermMask in SharePoint DVWPs](http://sympmarc.com/2009/02/03/permmask-in-sharepoint-dvwps/)
         * -   [$().SPServices.SPLookupAddNew and security trimming](http://spservices.codeplex.com/discussions/208708)
         *
         * @returns {object} Object with properties for each permission level identifying if current user has rights (true || false)
         * @example
         * <pre>
         * var perm = apUtilityService.resolvePermissions('0x0000000000000010');
         * </pre>
         * Example of what the returned object would look like
         * for a site admin.
         * <pre>
         * perm = {
             *    "ViewListItems":true,
             *    "AddListItems":true,
             *    "EditListItems":true,
             *    "DeleteListItems":true,
             *    "ApproveItems":true,
             *    "OpenItems":true,
             *    "ViewVersions":true,
             *    "DeleteVersions":true,
             *    "CancelCheckout":true,
             *    "PersonalViews":true,
             *    "ManageLists":true,
             *    "ViewFormPages":true,
             *    "Open":true,
             *    "ViewPages":true,
             *    "AddAndCustomizePages":true,
             *    "ApplyThemeAndBorder":true,
             *    "ApplyStyleSheets":true,
             *    "ViewUsageData":true,
             *    "CreateSSCSite":true,
             *    "ManageSubwebs":true,
             *    "CreateGroups":true,
             *    "ManagePermissions":true,
             *    "BrowseDirectories":true,
             *    "BrowseUserInfo":true,
             *    "AddDelPrivateWebParts":true,
             *    "UpdatePersonalWebParts":true,
             *    "ManageWeb":true,
             *    "UseRemoteAPIs":true,
             *    "ManageAlerts":true,
             *    "CreateAlerts":true,
             *    "EditMyUserInfo":true,
             *    "EnumeratePermissions":true,
             *    "FullMask":true
             * }
         * </pre>
         */
        UtilityService.prototype.resolvePermissions = function (permissionsMask) {
            var permissionSet = {
                ViewListItems: (1 & permissionsMask) > 0,
                AddListItems: (2 & permissionsMask) > 0,
                EditListItems: (4 & permissionsMask) > 0,
                DeleteListItems: (8 & permissionsMask) > 0,
                ApproveItems: (16 & permissionsMask) > 0,
                OpenItems: (32 & permissionsMask) > 0,
                ViewVersions: (64 & permissionsMask) > 0,
                DeleteVersions: (128 & permissionsMask) > 0,
                CancelCheckout: (256 & permissionsMask) > 0,
                PersonalViews: (512 & permissionsMask) > 0,
                ManageLists: (2048 & permissionsMask) > 0,
                ViewFormPages: (4096 & permissionsMask) > 0,
                Open: (permissionsMask & 65536) > 0,
                ViewPages: (permissionsMask & 131072) > 0,
                AddAndCustomizePages: (permissionsMask & 262144) > 0,
                ApplyThemeAndBorder: (permissionsMask & 524288) > 0,
                ApplyStyleSheets: (1048576 & permissionsMask) > 0,
                ViewUsageData: (permissionsMask & 2097152) > 0,
                CreateSSCSite: (permissionsMask & 4194314) > 0,
                ManageSubwebs: (permissionsMask & 8388608) > 0,
                CreateGroups: (permissionsMask & 16777216) > 0,
                ManagePermissions: (permissionsMask & 33554432) > 0,
                BrowseDirectories: (permissionsMask & 67108864) > 0,
                BrowseUserInfo: (permissionsMask & 134217728) > 0,
                AddDelPrivateWebParts: (permissionsMask & 268435456) > 0,
                UpdatePersonalWebParts: (permissionsMask & 536870912) > 0,
                ManageWeb: (permissionsMask & 1073741824) > 0,
                UseRemoteAPIs: (permissionsMask & 137438953472) > 0,
                ManageAlerts: (permissionsMask & 274877906944) > 0,
                CreateAlerts: (permissionsMask & 549755813888) > 0,
                EditMyUserInfo: (permissionsMask & 1099511627776) > 0,
                EnumeratePermissions: (permissionsMask & 4611686018427387904) > 0,
                FullMask: (permissionsMask == 9223372036854775807)
            };
            /**
             * Full Mask only resolves correctly for the Full Mask level
             * so in that case, set everything to true
             */
            if (permissionSet.FullMask) {
                _.each(permissionSet, function (perm, key) {
                    permissionSet[key] = true;
                });
            }
            return permissionSet;
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:stringifyXML
         * @methodOf angularPoint.apUtilityService
         * @description Simple utility to convert an XML object into a string and remove unnecessary whitespace.
         * @param {object} xml XML object.
         * @returns {string} Stringified version of the XML object.
         */
        UtilityService.prototype.stringifyXML = function (xml) {
            var str;
            if (_.isObject(xml)) {
                str = service.xmlToString(xml).replace(/\s+/g, ' ');
            }
            else if (_.isString(xml)) {
                str = xml;
            }
            return str;
        };
        UtilityService.prototype.toCamelCase = function (str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        };
        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:yyyymmdd
         * @methodOf angularPoint.apUtilityService
         * @description
         * Convert date into a int formatted as yyyymmdd
         * We don't need the time portion of comparison so an int makes this easier to evaluate
         */
        UtilityService.prototype.yyyymmdd = function (date) {
            var yyyy = date.getFullYear();
            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            /** Add leading 0's to month and day if necessary */
            return parseInt(yyyy + service.doubleDigit(mm) + service.doubleDigit(dd));
        };
        UtilityService.prototype.xmlToString = function (xmlData) {
            var xmlString;
            if (typeof XMLSerializer !== 'undefined') {
                /** Modern Browsers */
                xmlString = (new XMLSerializer()).serializeToString(xmlData);
            }
            else {
                /** Old versions of IE */
                xmlString = xmlData.xml;
            }
            return xmlString;
        };
        UtilityService.$inject = ['$q', '$timeout', 'apConfig'];
        return UtilityService;
    })();
    ap.UtilityService = UtilityService;
    /** Extend underscore with a simple helper function */
    _.mixin({
        isDefined: function (value) {
            return !_.isUndefined(value);
        },
        /** Based on functionality in Breeze.js */
        isGuid: function (value) {
            return (typeof value === "string") && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/
                .test(value);
        }
    });
    /**
     * @ngdoc service
     * @name angularPoint.apUtilityService
     * @description
     * Provides shared utility functionality across the application.
     *
     * @requires angularPoint.apConfig
     */
    angular.module('angularPoint')
        .service('apUtilityService', UtilityService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
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
    var WebServiceService = (function () {
        function WebServiceService() {
            this.webServices = [
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
        }
        WebServiceService.prototype.action = function (service) {
            return serviceDefinitions[service] ? serviceDefinitions[service].action : SCHEMASharePoint + '/soap/';
        };
        WebServiceService.prototype.xmlns = function (service) {
            return serviceDefinitions[service] ? serviceDefinitions[service].xmlns : SCHEMASharePoint + '/soap/';
        };
        return WebServiceService;
    })();
    ap.WebServiceService = WebServiceService;
    //  apWebServiceOperationConstants.OpName = [WebService, needs_SOAPAction];
    //      OpName              The name of the Web Service operation -> These names are unique
    //      WebService          The name of the WebService this operation belongs to
    //      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the
    // setRequestHeaderfunction. true if the operation does a write, else false
    angular.module('angularPoint')
        .service('apWebServiceService', WebServiceService);
})(ap || (ap = {}));

/// <reference path="../app.module.ts" />
var ap;
(function (ap) {
    'use strict';
    var XMLToJSONService = (function () {
        function XMLToJSONService(apDecodeService) {
            this.apDecodeService = apDecodeService;
        }
        XMLToJSONService.prototype.parse = function (xmlNodeSet, options) {
            var _this = this;
            var defaults = {
                includeAllAttrs: false,
                mapping: {},
                removeOws: true,
                sparse: false // If true, empty ("") values will not be returned
            };
            var opts = _.assign({}, defaults, options);
            var jsonObjectArray = [];
            _.each(xmlNodeSet, function (node) {
                var row = {};
                var rowAttrs = node.attributes;
                if (!opts.sparse) {
                    // Bring back all mapped columns, even those with no value
                    _.each(opts.mapping, function (column) { return row[column.mappedName] = ''; });
                }
                _.each(rowAttrs, function (rowAttribute) {
                    var attributeName = rowAttribute.name;
                    var columnMapping = opts.mapping[attributeName];
                    var objectName = typeof columnMapping !== "undefined" ? columnMapping.mappedName : opts.removeOws ? attributeName.split("ows_")[1] : attributeName;
                    var objectType = typeof columnMapping !== "undefined" ? columnMapping.objectType : undefined;
                    if (opts.includeAllAttrs || columnMapping !== undefined) {
                        row[objectName] = _this.apDecodeService.parseStringValue(rowAttribute.value, objectType);
                    }
                });
                // Push this item into the JSON Object
                jsonObjectArray.push(row);
            });
            // Return the JSON object
            return jsonObjectArray;
        };
        XMLToJSONService.$inject = ['apDecodeService'];
        return XMLToJSONService;
    })();
    ap.XMLToJSONService = XMLToJSONService;
    /**
     * @ngdoc service
     * @name angularPoint.apXMLToJSONService
     * @description
     * This function converts an XML node set into an array of JS objects.
     * This is essentially Marc Anderson's [SPServices](http://spservices.codeplex.com/) SPXmlTOJson function wrapped in
     * an Angular service to make it more modular and allow for testing.
     *
     */
    angular.module('angularPoint')
        .service('apXMLToJSONService', XMLToJSONService);
})(ap || (ap = {}));

//# sourceMappingURL=angular-point.js.map