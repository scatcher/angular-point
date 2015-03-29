/// <reference path=".tmp/typings/tsd.d.ts" />


declare module angularPoint {

  interface IndexedCache{
    addEntity(entity:ListItem): void;
    clear(): void;
    count(): number;
    first(): ListItem;
    keys(): string[];
    last(): ListItem;
    nthEntity(index:number): ListItem;
    removeEntity(entity:ListItem): void;
    toArray(): ListItem[];
    //Object with keys equaling ID and values being the individual list item
    [key: number]: ListItem;
  }

  interface ListItemCrudOptions{
    //TODO Implement
  }

  interface FieldDefinition {
    staticName:string;
    objectType:string;
    mappedName:string;
    readOnly?:boolean;
    required?:boolean;
    description?:string;
    getDefinition?():string;
    getDefaultValueForType?():string;
    getMockData?(options?:Object):any;
  }

  interface ListItemVersion {
    //TODO Implement
  }

  interface WorkflowDefinition{
    name:string;
    instantiationUrl:string;
    templateId:string;
  }

  interface StartWorkflowParams{
    templateId?:string;
    workflowName?:string;
  }

  interface Choice{
    value:string;
  }

  interface MultiChoice{
    value:string[];
  }

  interface Lookup{
    lookupValue:string;
    lookupId:number;
  }

  interface User{
    lookupValue:string;
    lookupId:number;
  }

  interface UserMulti{
    value:User[];
  }

  interface JSON{
    value:Object;
  }

  interface Attachments{
    value:string[];
  }

  interface ListItem{
    id?:number;
    created?:Date;
    modified?:Date;
    author?:User;
    editor?:User;
    permMask?:string;
    uniqueId?:string;
    fileRef?:Lookup;

    deleteAttachment?(url:string): ng.IPromise<any>;
    deleteItem?( options?:ListItemCrudOptions ): ng.IPromise<any>;
    getAttachmentCollection?(): ng.IPromise<string[]>;
    getAvailableWorkflows?(): ng.IPromise<WorkflowDefinition[]>;
    getFieldChoices?( fieldName:string ): string[];
    getFieldDefinition?( fieldName:string ): FieldDefinition;
    getFieldDescription?( fieldName:string ): string;
    getFieldLabel?( fieldName:string ): string;
    getFieldVersionHistory?(fieldNames:string[]): ng.IPromise<ListItemVersion>;
    getFormattedValue?( fieldName:string, options:Object ): string;
    getLookupReference?( fieldName:string, lookupId:number ): ListItem;
    resolvePermissions?(): UserPermissionsObject;
    saveChanges?( options?:ListItemCrudOptions ): ng.IPromise<ListItem>;
    saveFields?( fieldArray:string[], options?:ListItemCrudOptions ): ng.IPromise<ListItem>;
    startWorkflow?(options:StartWorkflowParams): ng.IPromise<any>;
    validateEntity?( options?:Object ): boolean;

    //Added by Model Instantiation
    getModel?():Model;
    getList?():List;
    getListId?():string;
  }

  interface List{
    guid:string;
    title:string;
    customFields:FieldDefinition[];
    getListId?():string;
    identifyWebURL?():string;
    //viewFields?:string;
    //private fields?:FieldDefinition[];
    //isReady?:boolean;
    webURL?:string;
  }

  interface Model{
    factory:Function;
    list:List;

    addNewItem?( entity:ListItem, options?:Object ): ng.IPromise<ListItem>;
    createEmptyItem?(overrides?:Object): ListItem;
    executeQuery?(queryName?:string, options?:Object): ng.IPromise<IndexedCache>;
    extendListMetadata?(options:Object): ng.IPromise<any>;
    generateMockData?(options?:Object): ListItem[];
    getAllListItems?(): ng.IPromise<IndexedCache>;
    getCache?(queryName:string): Cache;
    getCachedEntity?(entityId:number): ListItem;
    getCachedEntities?(): IndexedCache;
    getFieldDefinition?(fieldName:string): FieldDefinition;
    getListItemById?(entityId:number, options?:Object): ng.IPromise<ListItem>;
    getQuery?(queryName:string): Query;
    isInitialised?(): boolean;
    resolvePermissions?(): UserPermissionsObject;
    registerQuery?(queryOptions:QueryOptions): void;
    validateEntity?(entity:ListItem, options?:Object): boolean;
  }

  interface DiscussionThread{
    posts:DiscussionThreadPost[];
    nextId:number;
    getNextId():number;
    createPost(parentId:number,content:string):DiscussionThreadPost;
    getListItem():ListItem;
    prune():void;
    saveChanges():ng.IPromise<ListItem>;
  }

  interface DiscussionThreadPost{
    content:string;
    id:number;
    parentId:number;
    created:Date;
    user:User;
    removePost():void;
    deletePost():ng.IPromise<ListItem>;
    savePost():ng.IPromise<ListItem>;
    reply():ng.IPromise<ListItem>;
  }

  interface Cache{
    //TODO Populate me!
  }

  interface Query{
    execute?(options?:Object):ng.IPromise<IndexedCache>;
    operation?:string;
    cacheXML?:boolean;
    offlineXML?:string;
    query?:string;
    queryOptions?:string;
  }

  interface QueryOptions{
    name?:string;
    operation?:string;
  }

  interface UserPermissionsObject{
    ViewListItems:boolean;
    AddListItems:boolean;
    EditListItems:boolean;
    DeleteListItems:boolean;
    ApproveItems:boolean;
    OpenItems:boolean;
    ViewVersions:boolean;
    DeleteVersions:boolean;
    CancelCheckout:boolean;
    PersonalViews:boolean;
    ManageLists:boolean;
    ViewFormPages:boolean;
    Open:boolean;
    ViewPages:boolean;
    AddAndCustomizePages:boolean;
    ApplyThemeAndBorder:boolean;
    ApplyStyleSheets:boolean;
    ViewUsageData:boolean;
    CreateSSCSite:boolean;
    ManageSubwebs:boolean;
    CreateGroups:boolean;
    ManagePermissions:boolean;
    BrowseDirectories:boolean;
    BrowseUserInfo:boolean;
    AddDelPrivateWebParts:boolean;
    UpdatePersonalWebParts:boolean;
    ManageWeb:boolean;
    UseRemoteAPIs:boolean;
    ManageAlerts:boolean;
    CreateAlerts:boolean;
    EditMyUserInfo:boolean;
    EnumeratePermissions:boolean;
    FullMask:boolean;
  }

}
