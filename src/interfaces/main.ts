/// <reference path="../app.module.ts" />

declare module ap {

    export interface IXMLGroup {
        Description: string;
        ID: string;
        Name: string;
        OwnerID: string;
        OwnerIsUser: string;
    }

    export interface IXMLUser {
        Email: string;
        Flags: string;
        ID: string;
        IsDomainGroup: string;
        IsSiteAdmin: string;
        LoginName: string;
        Name: string;
        Notes: string;
        Sid: string;
    }

    export interface IListItemCrudOptions<T> {
        target: IndexedCache<T>;
    }


    export interface IListItemVersion<T> extends ListItem<T> {
        version: Date;
    }

    export interface IWorkflowDefinition {
        instantiationUrl: string;
        name: string;
        templateId: string;
    }

    export interface IStartWorkflowParams {
        fileRef?: string;
        item: string;
        templateId: string;
        workflowName?: string;
        workflowParameters?: string;
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
        count?: number;
        filter?: Object;
        page?: number;
        sorting?: Object;
    }

    interface INGTableParamsReference {
        count(): number;
        filter(): Object;
        orderBy(): string[]
        page(): number;
        sorting(): Object;
        total(): number;
        total(number): void;
    }

    export interface INGTableSettings {
        total?: number;
        counts?: number[];
        defaultSort?: string; //options: ['asc', 'desc']
        groupBy?: string | Function;
        filterDelay?: number;
        getData($defer: ng.IDeferred<ap.ListItem<any>[]>, params: INGTableParamsReference): void;
    }

    export interface INGTableParams {
        new (parameters: INGTableParamsObject, settings: INGTableSettings): INGTable;
    }

    export interface INGTable {
        reload(): void;
    }
}

