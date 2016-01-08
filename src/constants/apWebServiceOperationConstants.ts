export interface IWebServiceOperationConstants {
    [key: string]: [string, boolean];
}

export var WebServiceOperationConstants: IWebServiceOperationConstants = {
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
