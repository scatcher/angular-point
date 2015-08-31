/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    export interface IUserPermissionsObject {
        AddAndCustomizePages: boolean;
        AddDelPrivateWebParts: boolean;
        AddListItems: boolean;
        ApplyStyleSheets: boolean;
        ApplyThemeAndBorder: boolean;
        ApproveItems: boolean;
        BrowseDirectories: boolean;
        BrowseUserInfo: boolean;
        CancelCheckout: boolean;
        CreateAlerts: boolean;
        CreateGroups: boolean;
        CreateSSCSite: boolean;
        DeleteListItems: boolean;
        DeleteVersions: boolean;
        EditListItems: boolean;
        EditMyUserInfo: boolean;
        EnumeratePermissions: boolean;
        FullMask: boolean;
        ManageAlerts: boolean;
        ManageLists: boolean;
        ManagePermissions: boolean;
        ManageSubwebs: boolean;
        ManageWeb: boolean;
        Open: boolean;
        OpenItems: boolean;
        PersonalViews: boolean;
        UpdatePersonalWebParts: boolean;
        UseRemoteAPIs: boolean;
        ViewFormPages: boolean;
        ViewListItems: boolean;
        ViewPages: boolean;
        ViewUsageData: boolean;
        ViewVersions: boolean;
    }

    export class BasePermissionObject implements IUserPermissionsObject {
        AddAndCustomizePages = false;
        AddDelPrivateWebParts = false;
        AddListItems = false;
        ApplyStyleSheets = false;
        ApplyThemeAndBorder = false;
        ApproveItems = false;
        BrowseDirectories = false;
        BrowseUserInfo = false;
        CancelCheckout = false;
        CreateAlerts = false;
        CreateGroups = false;
        CreateSSCSite = false;
        DeleteListItems = false;
        DeleteVersions = false;
        EditListItems = false;
        EditMyUserInfo = false;
        EnumeratePermissions = false;
        FullMask = false;
        ManageAlerts = false;
        ManageLists = false;
        ManagePermissions = false;
        ManageSubwebs = false;
        ManageWeb = false;
        Open = false;
        OpenItems = false;
        PersonalViews = false;
        UpdatePersonalWebParts = false;
        UseRemoteAPIs = false;
        ViewFormPages = false;
        ViewListItems = false;
        ViewPages = false;
        ViewUsageData = false;
        ViewVersions = false;
    }


    angular
        .module('angularPoint')
        .constant('apBasePermissionObject', BasePermissionObject);

}
