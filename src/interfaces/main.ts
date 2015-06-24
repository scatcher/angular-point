/// <reference path="../app.module.ts" />

declare module ap {

    export interface IXMLGroup {
        ID: string;
        Name: string;
        Description: string;
        OwnerID: string;
        OwnerIsUser: string;
    }

    export interface IXMLUser {
        ID: string;
        Sid: string;
        Name: string;
        LoginName: string;
        Email: string;
        Notes: string;
        IsSiteAdmin: string;
        IsDomainGroup: string;
        Flags: string;
    }

    export interface IListItemCrudOptions<T> {
        target: IndexedCache<T>;
    }


    export interface IListItemVersion<T> extends ListItem<T> {
        version: Date;
    }

    export interface IWorkflowDefinition {
        name: string;
        instantiationUrl: string;
        templateId: string;
    }

    export interface IStartWorkflowParams {
        item: string;
        templateId: string;
        workflowParameters?: string;
        fileRef?: string;
        workflowName?: string;
    }
    

    //    export interface IDiscussionThread {
    //        posts: IDiscussionThreadPost[];
    //        nextId: number;
    //        getNextId(): number;
    //        createPost(parentId: number, content: string): IDiscussionThreadPost;
    //        getListItem(): IListItem;
    //        prune(): void;
    //        saveChanges(): ng.IPromise<IListItem>;
    //    }

    //    export interface IDiscussionThreadPost {
    //        content: string;
    //        id: number;
    //        parentId: number;
    //        created: Date;
    //        user: IUser;
    //        removePost(): void;
    //        deletePost(): ng.IPromise<IListItem>;
    //        savePost(): ng.IPromise<IListItem>;
    //        reply(): ng.IPromise<IListItem>;
    //    }

    //    export interface ICache<T> extends IndexedCache<T>{
    //        //TODO Populate me!
    //    }

    export interface IUserPermissionsObject {
        ViewListItems: boolean;
        AddListItems: boolean;
        EditListItems: boolean;
        DeleteListItems: boolean;
        ApproveItems: boolean;
        OpenItems: boolean;
        ViewVersions: boolean;
        DeleteVersions: boolean;
        CancelCheckout: boolean;
        PersonalViews: boolean;
        ManageLists: boolean;
        ViewFormPages: boolean;
        Open: boolean;
        ViewPages: boolean;
        AddAndCustomizePages: boolean;
        ApplyThemeAndBorder: boolean;
        ApplyStyleSheets: boolean;
        ViewUsageData: boolean;
        CreateSSCSite: boolean;
        ManageSubwebs: boolean;
        CreateGroups: boolean;
        ManagePermissions: boolean;
        BrowseDirectories: boolean;
        BrowseUserInfo: boolean;
        AddDelPrivateWebParts: boolean;
        UpdatePersonalWebParts: boolean;
        ManageWeb: boolean;
        UseRemoteAPIs: boolean;
        ManageAlerts: boolean;
        CreateAlerts: boolean;
        EditMyUserInfo: boolean;
        EnumeratePermissions: boolean;
        FullMask: boolean;
    }


}

interface JQuery {
    SPFilterNode(string);
}

// declare module "lodash"  {
//     isGuid(string): boolean;
//     deepIn(Object, string): boolean;
//     deepGet(Object, string): any;
//     isDefined(val: any): boolean;
// }

interface IToast {
    toastId: number;
    scope: ng.IScope;
    iconClass: string;
}

interface toastr {
    error(message: string, title?: string, optionsOverride?: Object): IToast;
    info(message: string, title?: string, optionsOverride?: Object): IToast;
    success(message: string, title?: string, optionsOverride?: Object): IToast;
    warning(message: string, title?: string, optionsOverride?: Object): IToast;
    clear(IToast?): void;
}

declare module ngTable {
    export interface INGTableParamsObject {
        page?: number;
        count?: number;
        filter?: Object;
        sorting?: Object;
    }

    export interface INGTableSettings {
        total?: number;
        counts?: number[];
        defaultSort?: string; //options: ['asc', 'desc']
        groupBy?: string | Function;
        filterDelay?: number;
        getData($defer: ng.IDeferred<ap.ListItem<any>[]>, params: INGTableParamsObject): void;
    }

    export interface INGTableParams {
        new (parameters: INGTableParamsObject, settings: INGTableSettings): INGTable;
    }

    export interface INGTable {
        reload(): void;
    }
}

