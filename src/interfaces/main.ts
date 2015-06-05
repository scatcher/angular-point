/// <reference path="../app.module.ts" />

declare module ap {

    export interface IListItemCrudOptions<T> {
        target:IIndexedCache<T>;
    }


    export interface IListItemVersion<T> extends T {
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

//    export interface ICache<T> extends IIndexedCache<T>{
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

interface _ {
    isGuid(string):boolean;
    deepIn(Object, string): boolean;
    deepGet(Object, string): any;
    isDefined(val:any): boolean;
}

interface chance {

}

interface window {
    URL;
    Chance;
}

interface IToast{
    toastId:number;
    scope:ng.IScope;
    iconClass:string;
}

interface toastr {
    error(message: string, title?:string, optionsOverride?:Object):IToast;
    info(message: string, title?:string, optionsOverride?:Object):IToast;
    success(message: string, title?:string, optionsOverride?:Object):IToast;
    warning(message: string, title?:string, optionsOverride?:Object):IToast;
    clear(IToast?):void;
}
