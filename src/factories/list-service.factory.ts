import {Query, ListItem} from '../factories';
import {AP_CONFIG, IUserPermissionsObject, BasePermissionObject, DefaultFields} from '../constants';
import {IQueryOptions} from './query.factory';
import {IFieldDefinition, FieldDefinition, IFieldConfigurationObject} from './field-definition.factory';
import {DataService} from '../services/dataservice.service';
import {registerChange} from '../services/utility.service';
import {getDefaultValueForType} from '../services/field.service';
import {generateValuePairs, generateViewFieldsXML} from '../services/encode.service';
import {processListItems, extendListMetadata} from '../services/decode.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {injector} from '../services/injector.service';
import {Injectable} from "@angular/core";
import {registerListService} from '../services/cache.service';

import {times, isObject, isDate, isBoolean, isArray, isEmpty, isNumber, isString} from 'lodash';

interface IOWSMapping {
    [key: string]: {
        mappedName: string;
        objectType: string;
    };
}

export interface IListServiceConfig {
    customFields: IFieldConfigurationObject[];
    description?: string;
    factory: IFieldServiceFactory<any>;
    guid: string;
    store?: Observable<any>;
    title: string;
}

export interface IQueriesContainer {
    getAllListItems?: Query<any>;
    [key: string]: Query<any>;
}

export interface IFieldServiceFactory<T extends ListItem<any>> {
    (rawListItemObject: Object, ...items: any[]): T;
}

export interface IMockDataOptions {
    permissionLevel?: string;
    quantity?: number;
}

export interface ICreateListItemOptions<T extends ListItem<any>> {
    buildValuePairs?: boolean;
    valuePairs?: [string, any][];
}

export interface IListFieldMapping {
    [key: string]: {
        mappedName: string;
        objectType: string;
    };
}

/**
 * @ngdoc function
 * @name ListService
 * @description
 * ListService Constructor
 * Provides the Following
 * - adds an empty "data" array
 * - adds an empty "queries" object
 * - adds a deferred obj "ready"
 * - builds "model" with constructor
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
 * @param {string} config.title - List name, no spaces.  Offline XML file will need to be
 * named the same (ex: CustomList so xml file would be APConfig.offlineXML + '/CustomList.xml')
 * @param {string} config.getListId() - Unique SharePoint ID (ex: '{3DBEB25A-BEF0-4213-A634-00DAF46E3897}')
 * @param {object[]} config.customFields - Maps SharePoint fields with names we'll use within the
 * application.  Identifies field types and formats accordingly.  Also denotes if a field is read only.
 * @constructor
 *
 * @example
 * <pre>
 * //Taken from a fictitious projectsModel.ts
 *
 * export class ProjectsModel extends ap.ListService {
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
@Injectable()
export class ListService<T extends ListItem<any>> {
    private __store: Observable<ListItem<any>[]>;
    changeTokenDeletions = new BehaviorSubject<number>(null);
    customFields: IFieldConfigurationObject[] = [];
    listDefinitionExtended: Observable<ListService<T>>;
    environments: { [key: string]: string };
    factory: IFieldServiceFactory<T>;
    fieldDefinitionsExtended: boolean = false;
    fields: IFieldDefinition[] = [];
    guid: string;
    isReady = false;
    lastServerUpdate: Date;
    mapping: IListFieldMapping;
    permissions: IUserPermissionsObject;
    queries: IQueriesContainer = {};
    title: string;
    viewFields: string;
    WebFullUrl; // only appears if extended from list definition
    webURL: string;

    constructor({guid, customFields = [], factory, title, store}: IListServiceConfig) {

        /** Assign all properties of config to the model */
        this.guid = guid;
        this.customFields = customFields;
        this.factory = factory;
        this.title = title;
        this.addStore(store);
        this.webURL = AP_CONFIG.defaultUrl;
        this.environments = this.environments || { production: this.guid };
        /**
         * @description
         * 1. Populates the fields array which uses the Field constructor to combine the default
         * SharePoint fields with those defined in the list definition on the model
         * 2. Creates the list.viewFields XML string that defines the fields to be requested on a query
         */
        this.fields = this.buildFieldDefinitions(this.customFields);
        this.viewFields = generateViewFieldsXML(this.fields);
        this.mapping = this.buildOWSMapping(this.fields);

        /** Register cache name with cache service so we can map factory name with list GUID */
        registerListService(this);


        /** Convenience querys that simply returns all list items within a list. */
        this.registerQuery({
            name: '__getAllListItems',
            operation: 'GetListItems'
        });

        /** Get a single list item from a list, primarily used to quickly identify currentPerson
         *  permissions on list using the ows_PermMask property.  List items can have unique permissions
         *  so can't rely on this 100% to correctly resolve list permissions.  In the case where that is
         *  necessary you will need to use a similar query using GetListItemChangesSinceToken method which
         *  will take longer but will correctly resolve the list permissions.
         */
        this.registerQuery({
            name: '__sample',
            operation: 'GetListItems',
            rowLimit: 1
        });

    }

    addStore(store: any) {
        return this.__store = store;
    }

    getStore(): any {
        return this.__store;
    }

    /**
     * @ngdoc function
     * @name ListService.addNewItem
     * @module ListService
     * @description
     * Using the definition of a list stored in a model, create a new list item in SharePoint.
     * @param {object} entity An object that will be converted into key/value pairs based on the field definitions
     * defined in the model.
     * @param {object} [options] - Pass additional options to the data service.
     * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
     * @param {object} [options.map=new Map()] Optionally place new item in a specified cache.
     * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
     * field identified in the model.
     * @returns {Observable<T>} An observable which when resolved will returned the newly created list item from there server.
     * This allows us to update the view with a valid new object that contains a unique list item id.
     *
     * @example
     * <pre>
     * <file name="app/project/projectsModel.js">
     * projectModel.addNewItem({
     *        title: 'A Project',
     *        customer: {lookupValue: 'My Customer', lookupId: 123},
     *        description: 'This is the project description'
     *     }).subscribe(function(newEntityFromServer) {
     *         //The local query cache is automatically updated but
     *         //any other dependent logic can go here
     * };
     * </file>
     * </pre>
     */
    addNewItem<T extends ListItem<any>>(entity: ListItem<T>, {
        buildValuePairs = true,
        valuePairs = []
    }: ICreateListItemOptions<T> = {}): Observable<T> {

        var config = {
            batchCmd: 'New',
            buildValuePairs,
            listName: this.getListId(),
            operation: 'UpdateListItems',
            valuePairs,
            webURL: this.identifyWebURL()
        };

        if (entity.id) {
            throw new Error('Cannot add a new list item that already has an ID. ' + JSON.stringify(entity, null, 2));
        }

        if (config.buildValuePairs === true) {
            let editableFields: IFieldDefinition[] = this.fields.filter((fieldDefinition) => fieldDefinition.readOnly === false);
            config.valuePairs = generateValuePairs(editableFields, entity);
        }

        const dataService: DataService = injector.get(DataService);
        /** Overload the function then pass anything past the first parameter to the supporting methods */
        return dataService.serviceWrapper(config)
            .map((response) => {
                /** Online this should return an XML object */
                let listItems = processListItems<T>(response, this.mapping, <any>this);
                let newListItem: ListItem<T> = listItems[listItems.length - 1];

                /** Optionally broadcast change event */
                registerChange(this, 'create', newListItem.id);

                /** Return reference to last listItem in cache because it will have the new highest id */
                return newListItem;
            })
        // .catch((err) => {
        //     throw new Error('Unable to create new list item.  Err:' + err);
        // });

    }

    buildFieldDefinitions(customFields: IFieldConfigurationObject[]): IFieldDefinition[] {
        return [...DefaultFields, ...customFields].map((fieldConfig: IFieldConfigurationObject) => {
            return new FieldDefinition(fieldConfig);
        });
    }

    buildOWSMapping(fields: IFieldDefinition[]): { [key: string]: { mappedName: string; objectType: string; } } {
        return fields.reduce<IOWSMapping>((container: IOWSMapping, fieldDefinition: IFieldDefinition) => {
            container['ows_' + fieldDefinition.staticName] = {
                mappedName: fieldDefinition.mappedName,
                objectType: fieldDefinition.objectType
            };
            return container;
        }, {});
    }


    /**
     * @ngdoc function
     * @name ListService.createEmptyItem
     * @module ListService
     * @description
     * Creates an object using the editable fields from the model, all attributes are empty based on the field
     * type unless an overrides object is passed in.  The overrides object extends the defaults.  A benefit to this
     * approach is the returned object inherits from the ListItem prototype so we have the ability to call
     * entity.saveChanges instead of calling the model.addNewItem(entity).
     *
     * @param {object} [overrides] - Optionally extend the new empty item with specific values.
     * @returns {object} Newly created list item.
     */
    createEmptyItem(overrides?: Object): T {
        var newItem = {};
        for (let fieldDefinition of this.customFields) {
            /** Create attributes for each non-readonly field definition */
            if (!fieldDefinition.readOnly) {
                /** Create an attribute with the expected empty value based on field definition type */
                newItem[fieldDefinition.mappedName] = getDefaultValueForType(fieldDefinition.objectType);
            }
        }
        /** Extend any values that should override the default empty values */
        var rawObject = Object.assign({}, newItem, overrides);

        //Ensure we access list service from unsaved object
        rawObject.getListService = () => this;
        return this.factory(rawObject);
    }

    /**
     * @ngdoc function
     * @name ListService.executeQuery
     * @module ListService
     * @description
     * The primary method for retrieving data from a query registered on a model.  It returns an observable
     * which resolves to the local cache after post processing entities with constructors.
     *
     * @param {string} [queryName=APConfig.defaultQueryName] A unique key to identify this query
     * @returns {Observable<T[]>} Observable that when resolves with an Map of list items which inherit from ListItem and
     * optionally go through a defined constructor on the model.
     *
     * @example To call the query or check for changes since the last call.
     * <pre>
     * projectModel.executeQuery('MyCustomQuery').subscribe((entities) => {
     *      //We now have a reference to Map of entities stored in the local cache
     *      //These inherit from the ListItem prototype as well as the Project prototype on the model
     *      this.subsetOfProjects = entities;
     *  });
     * </pre>
     */
    executeQuery<T extends ListItem<any>>(queryName?: string): Observable<T[]> {
        var model = this;
        var query = model.getQuery<T>(queryName);
        if (query) {
            return query.execute();
        }
    }


    /**
     * @ngdoc function
     * @name ListService.extendListMetadata
     * @module ListService
     * @description
     * Extends the List and Fields with list information returned from the server.  Only runs once and after that
     * returns the existing Observable.
     * @returns {Observable<ListService>} Observable that is resolved with the extended listService.
     */
    extendListMetadata(): Observable<ListService<T>> {
        var listService = this;

        /** Only request information if the list hasn't already been extended and is not currently being requested */
        if (!listService.listDefinitionExtended) {
            /** All Future Requests get this */
            // listService.listDefinitionExtended = true;

            const dataService: DataService = injector.get(DataService);
            let getListAction = dataService.getList({
                listName: listService.getListId(),
                webURL: listService.webURL
            });

            /** We can potentially have 2 separate requests for data so store them in array so we can wait until
             * all are resolved.
             */
            let observableArray = [getListAction];

            /** Add a request for a sample list item to the server requests if we haven't
             * already resolved currentPerson permissions for the list.
             */
            if (!listService.permissions) {
                /** Permissions not set yet, when the query is resolved with a sample list item
                 * the query class will use the permMask from the list item to set the temp permissions
                 * for the list until a time where we can run a GetListItemChangesSinceToken request and
                 * set the actual permissions.
                 */
                observableArray.push(listService.executeQuery('__sample'));
            }

            listService.listDefinitionExtended = Observable
                .forkJoin(observableArray)
                .map((resolvedObservables: [Element, any]) => {
                    extendListMetadata(listService, resolvedObservables[0]);
                    return listService;
                });
                // .catch(err => reject(err));
        }

        return listService.listDefinitionExtended;
    }

    /**
     * @ngdoc function
     * @name ListService:extendPermissionsFromListItem
     * @methodOf ListService
     * @param {ListItem} listItem List item to use as sample of user's permisssions for list.
     * @description
     * If the user permissions haven't been resolved for the list, use the permissions from a
     * sample list item and assume they're the same for the entire list
     * @returns {IUserPermissionsObject} Resolved permissions for the list item.
     */
    extendPermissionsFromListItem(listItem: ListItem<any>): IUserPermissionsObject {
        if (!listItem) {
            throw new Error('A valid list item is required in order to extend list permissions.');
        }
        this.permissions = listItem.resolvePermissions();
        return this.permissions;
    }


    /**
     * @ngdoc function
     * @name ListService.generateMockData
     * @module ListService
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
    // generateMockData<T extends ListItem<any>>(options?: IMockDataOptions): T[] {
    //     var mockData = [],
    //         model = this;

    //     var defaults = {
    //         quantity: 10,
    //         staticValue: false,
    //         permissionLevel: 'FullMask'
    //     };

    //     /** Extend defaults with any provided options */
    //     var opts: IMockDataOptions = Object.assign({}, defaults, options);

    //     times(opts.quantity, (count) => {
    //         var mock = {
    //             id: count + 1
    //         };
    //         /** Create an attribute with mock data for each field */
    //         for (let field of model.fields) {
    //             mock[field.mappedName] = field.getMockData(opts);
    //         }
    //         /** Use the factory on the model to extend the object */
    //         mockData.push(model.factory(mock));
    //     });
    //     return mockData;
    // }

    /**
     * @ngdoc function
     * @name ListService.getAllListItems
     * @module ListService
     * @description
     * Inherited from ListService constructor
     * Gets all list items in the current list, processes the xml, and caches the data in model.
     * @returns {Observable<T[]>} Observable returning all list items when resolved.
     * @example
     * <pre>
     * //Taken from a fictitious projectsModel.js
     * projectModel.getAllListItems().subscribe(function(entities) {
     *     //Do something with all of the returned entities
     *     $scope.projects = entities;
     * };
     * </pre>
     */
    getAllListItems<T extends ListItem<any>>(): Observable<T[]> {
        var model = this;
        return model.executeQuery('__getAllListItems');
    }

    /**
     * @ngdoc function
     * @name ListService.getFieldDefinition
     * @module ListService
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
    getFieldDefinition(fieldName: string): IFieldDefinition {
        var model = this;
        return model.fields.find((fieldDefinition) => fieldDefinition.mappedName === fieldName);
    }


    /**
     * @ngdoc function
     * @name ListService:getListId
     * @methodOf ListService
     * @description
     * Defaults to list.guid.  For a multi-environment setup, we accept a list.environments object with a property for each named
     * environment with a corresponding value of the list guid.  The active environment can be selected
     * by setting AP_CONFIG.environment to the string name of the desired environment.
     * @returns {string} List ID.
     */
    getListId(): string {
        if (isString(this.environments[AP_CONFIG.environment])) {
            /**
             * For a multi-environment setup, we accept a list.environments object with a property for each named
             * environment with a corresponding value of the list guid.  The active environment can be selected
             * by setting AP_CONFIG.environment to the string name of the desired environment.
             */
            return this.environments[AP_CONFIG.environment];
        } else {
            throw new Error('There isn\'t a valid environment definition for AP_CONFIG.environment=' + AP_CONFIG.environment + '  ' +
                'Please confirm that the list "' + this.title + '" has the necessary environmental configuration.');
        }
    }


    /**
     * @ngdoc function
     * @name ListService.getListItemById
     * @param {number} listItemId Id of the item being requested.
     * @param {object} options Used to override DataService defaults.
     * @description
     * Inherited from ListService constructor
     * Attempts to retrieve the requested list item from the server.
     * @returns {Observable<T>} Observable that resolves with the requested list item if found.  Otherwise it returns undefined.
     * @example
     * <pre>
     * //Taken from a fictitious projectsModel.js
     * projectModel.getListItemById(12).subscribe(function(listItem) {
     *     //Do something with the located listItem
     *     $scope.project = listItem;
     * };
     * </pre>
     */
    getListItemById<T extends ListItem<any>>(listItemId: number, options?: Object): Observable<T> {
        var model = this,
            /** Unique Query Name */
            queryKey = 'GetListItemById-' + listItemId;

        /** Register a new Query if it doesn't already exist */
        if (!model.getQuery(queryKey)) {
            var defaults = {
                name: queryKey,
                operation: 'GetListItems',
                rowLimit: 1,
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
            var opts = Object.assign({}, defaults, options);
            model.registerQuery(opts);
        }

        return model.executeQuery<T>(queryKey)
            .map((arr: T[]) => {
                return arr[0];
            });
    }


    /**
     * @ngdoc function
     * @name ListService.getQuery
     * @module ListService
     * @description
     * Helper function that attempts to locate and return a reference to the requested or catchall query.
     * @param {string} [queryName=APConfig.defaultQueryName] A unique key to identify this query.
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
    getQuery<T extends ListItem<any>>(queryName: string): Query<T> {
        var model = this, query;
        if (isObject(model.queries[queryName])) {
            /** The named query exists */
            query = model.queries[queryName];
        } else if (isObject(model.queries[AP_CONFIG.defaultQueryName]) && !queryName) {
            /** A named query wasn't specified and the catchall query exists */
            query = model.queries[AP_CONFIG.defaultQueryName];
        } else {
            /** Requested query not found */
            query = undefined;
        }
        return query;
    }

    /**
     * @ngdoc function
     * @name ListService:identifyWebURL
     * @methodOf ListService
     * @description
     * If a list is extended, use the provided webURL, otherwise use list.webURL.  If never set it will default
     * to AP_CONFIG.defaultUrl.
     * @returns {string} webURL param.
     */
    identifyWebURL(): string {
        return this.WebFullUrl ? this.WebFullUrl : this.webURL;
    }


    /**
     * @ngdoc function
     * @name ListService.isInitialised
     * @module ListService
     * @description
     * Methods which allows us to easily determine if we've successfully made any queries this session.
     * @returns {boolean} Returns evaluation.
     */
    isInitialised(): boolean {
        var model = this;
        return isDate(model.lastServerUpdate);
    }


    /**
     * @ngdoc function
     * @name ListService.registerQuery
     * @module ListService
     * @description
     * Constructor that allows us create a static query with the option to build dynamic queries as seen in the
     * third example.  This construct is a passthrough to [SPServices](http: //spservices.codeplex.com/)
     * @param {object} queryOptions Initialization parameters.
     * @param {boolean} [queryOptions.force=false] Ignore cached data and force server query.
     * @param {number} [queryOptions.listItemID] Optionally request for a single list item by id.
     * @param {boolean} [queryOptions.localStorage=false] Should we store data from this query in local storage to speed up requests in the future.
     * @param {number} [queryOptions.localStorageExpiration=86400000] Set expiration in milliseconds - Defaults to a day
     * and if set to 0 doesn't expire.  Can be updated globally using APConfig.localStorageExpiration.
     * @param {string} [queryOptions.name=primary] The name that we use to identify this query.
     * @param {string} [queryOptions.operation=GetListItemChangesSinceToken] Optionally use 'GetListItems' to
     * receive a more efficient response, just don't have the ability to check for changes since the last time
     * the query was called. Defaults to [GetListItemChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx)
     * but for a smaller payload and faster response you can use [GetListItems](http: //spservices.codeplex.com/wikipage?title=GetListItems&referringTitle=Lists).
     * @param {string} [queryOptions.query=Ordered ascending by ID] CAML query passed to SharePoint to control
     * the data SharePoint returns. Josh McCarty has a good quick reference [here](http: //joshmccarty.com/2012/06/a-caml-query-quick-reference).
     * @param {string} [queryOptions.queryOptions] SharePoint options xml as string.
     * <pre>
     * <QueryOptions>
     *    <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>
     *    <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>
     *    <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>
     *    <ExpandUserField>FALSE</ExpandUserField>
     * </QueryOptions>
     * </pre>
     * @param {string} [queryOptions.rowLimit] The number of list items to return, 0 returns all list items.
     * @param {boolean} [queryOptions.runOnce] Pertains to GetListItems only, optionally run a single time and return initial value for all future
     * calls.  Works well with data that isn't expected to change throughout the session but unlike localStorage or sessionStorage
     * the data doesn't persist between sessions.
     * @param {boolean} [queryOptions.sessionStorage=false] Use the browsers sessionStorage to cache the list items and uses the
     * queryOptions.localStorageExpiration param to validate how long the cache is good for.
     * @param {string} [queryOptions.viewFields] XML as string that specifies fields to return.
     * @param {string} [queryOptions.webURL] Used to override the default URL if list is located somewhere else.
     * @returns {object} Query Returns a new query object.
     *
     * @example
     * <h4>Example #1</h4>
     * <pre>
     * // Query to retrieve the most recent 25 modifications
     * model.registerQuery({
     *    name: 'recentChanges',
     *    rowLimit: 25,
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
     * // call it.  Uses the session cache to make the initial call faster.
     * projectModel.registerQuery({
     *     name: 'primary',
     *     sessionCache: true,
     *     //Set an expiration value of 8 hours rather than use the default of 24
     *     localStorageExpiration: 28800000,
     *     query: '' +
     *         '<Query>' +
     *         '   <OrderBy>' +
     *         '       <FieldRef Name="Title" Ascending="TRUE"/>' +
     *         '   </OrderBy>' +
     *         '</Query>'
     * });
     *
     * //To call the query or check for changes since the last call
     * projectModel.executeQuery('primary')
     *   .subscribe((entities) => {
     *     // We now have a reference to array of entities stored in the local
     *     // cache.  These inherit from the ListItem prototype as well as the
     *     // Project prototype on the model
     *     vm.projects = entities;
     *   }, (err) => {
     *       //Handle error
     *   })
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
    registerQuery<T extends ListItem<any>>(queryOptions: IQueryOptions): Query<T> {

        var defaults = {
            /** If name isn't set, assume this is the only model and designate as primary */
            name: AP_CONFIG.defaultQueryName
        };

        queryOptions = Object.assign({}, defaults, queryOptions);

        this.queries[queryOptions.name] = new Query(queryOptions, this, this.viewFields);

        /** Return the newly created query */
        return this.queries[queryOptions.name];
    }


    /**
     * @ngdoc function
     * @name ListService.resolvePermissions
     * @module ListService
     * @description
     * See apModelFactory.resolvePermissions for details on what we expect to have returned.
     * @returns {Object} Contains properties for each permission level evaluated for current currentPerson.
     * @example
     * Lets assume we're checking to see if a currentPerson has edit rights for a given list.
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
    resolvePermissions(): IUserPermissionsObject {
        if (this && this.permissions) {
            /** If request has been made to GetListItemChangesSinceToken we have already stored the
             * permission for this list.
             */
            return this.permissions;
        } else {
            console.error('Attempted to resolve permissions of a listService that hasn\'t been initialized.', this);
            return new BasePermissionObject();
        }
    }

    /**
     * @ngdoc function
     * @name ListService.validateEntity
     * @module ListService
     * @description
     * Uses the custom fields defined in an model to ensure each field (required = true) is evaluated
     * based on field type
     * @param {object} listItem SharePoint list item.
     * @returns {boolean} Evaluation of validity.
     */
    validateEntity<T extends ListItem<any>>(listItem: T): boolean {
        var valid = true;

        var checkObject = (fieldValue) => {
            return isObject(fieldValue) && isNumber(fieldValue.lookupId);
        };

        for (let fieldDefinition of <IFieldDefinition[]>this.customFields) {
            var fieldValue = listItem[fieldDefinition.mappedName];
            /** Only evaluate required fields */
            if ((fieldDefinition.required || fieldDefinition.Required) && valid) {
                switch (fieldDefinition.objectType) {
                    case 'Boolean':
                        valid = isBoolean(fieldValue);
                        break;
                    case 'DateTime':
                        valid = isDate(fieldValue);
                        break;
                    case 'Lookup':
                    case 'User':
                        valid = checkObject(fieldValue);
                        break;
                    case 'LookupMulti':
                    case 'UserMulti':
                        /** Ensure it's a valid array containing objects */
                        valid = isArray(fieldValue) && fieldValue.length > 0;
                        if (valid) {
                            /** Additionally check that each lookup/person contains a lookupId */
                            for (let fieldObject of fieldValue) {
                                if (valid) {
                                    valid = checkObject(fieldObject);
                                } else {
                                    /** Short circuit */
                                    return false;
                                }
                            }
                        }
                        break;
                    default:
                        /** Evaluate everything else as a string */
                        valid = !isEmpty(fieldValue);

                }
            }
            if (!valid) {
                return false;
            }
        }
        return valid;
    }
}

export interface IXMLList {
    AllowDeletion?: string;
    AllowMultiResponses?: string;
    AnonymousPermMask?: string;
    Author?: string;
    BaseType?: string;
    Created?: string;
    DefaultViewUrl?: string;
    Description?: string;
    Direction?: string;
    DocTemplateUrl?: string;
    EmailAlias?: string;
    EnableAttachments?: string;
    EnableFolderCreation?: string;
    EnableMinorVersion?: string;
    EnableModeration?: string;
    EnablePeopleSelector?: string;
    EnableResourceSelector?: string;
    EnableVersioning?: string;
    EnforceDataValidation?: string;
    EventSinkAssembly?: string;
    EventSinkClass?: string;
    EventSinkData?: string;
    ExcludeFromOfflineClient?: string;
    FeatureId?: string;
    Flags?: string;
    HasExternalDataSource?: string;
    HasRelatedLists?: string;
    HasUniqueScopes?: string;
    Hidden?: string;
    ID?: string;
    ImageUrl?: string;
    IrmEnabled?: string;
    IsApplicationList?: string;
    ItemCount?: string;
    LastDeleted?: string;
    MajorVersionLimit?: string;
    MajorWithMinorVersionsLimit?: string;
    MaxItemsPerThrottledOperation?: string;
    Modified?: string;
    MultipleDataList?: string;
    Name?: string;
    NoThrottleListOperations?: string;
    Ordered?: string;
    PreserveEmptyValues?: string;
    ReadSecurity?: string;
    RequireCheckout?: string;
    RootFolder?: string;
    ScopeId?: string;
    SendToLocation?: string;
    ServerTemplate?: string;
    ShowUser?: string;
    StrictTypeCoercion?: string;
    ThrottleListOperations?: string;
    ThumbnailSize?: string;
    Title?: string;
    Version?: string;
    WebFullUrl?: string;
    WebId?: string;
    WebImageHeight?: string;
    WebImageWidth?: string;
    WorkFlowId?: string;
    WriteSecurity?: string;
}
