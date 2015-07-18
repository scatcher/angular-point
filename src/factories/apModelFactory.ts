/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var apCacheService: CacheService, apDataService: DataService, apListFactory: ListFactory,
        apQueryFactory: QueryFactory, apUtilityService: UtilityService,
        apFieldService: FieldService, apConfig: IAPConfig, apIndexedCacheFactory: IndexedCacheFactory,
        apDecodeService: DecodeService, $q: ng.IQService, toastr: toastr;

    export interface IModel {
        addNewItem<T extends ListItem<any>>(entity: Object, options?: Object): ng.IPromise<T>;
        createEmptyItem<T extends ListItem<any>>(overrides?: Object): T;
        deferredListDefinition: ng.IPromise<Object>;
        executeQuery<T extends ListItem<any>>(queryName?: string, options?: Object): ng.IPromise<IndexedCache<T>>;
        extendListMetadata(options?: Object): ng.IPromise<any>;
        factory: IModelFactory;
        generateMockData<T extends ListItem<any>>(options?: Object): T[];
        getAllListItems<T extends ListItem<any>>(): ng.IPromise<IndexedCache<T>>;
        getCache<T extends ListItem<any>>(queryName?: string): IndexedCache<T>;
        getCachedEntities<T extends ListItem<any>>(): IndexedCache<T>;
        getCachedEntity<T extends ListItem<any>>(listItemId: number): T;
        getFieldDefinition(fieldName: string): IExtendedFieldDefinition | IFieldDefinition;
        getList(): List;
        getListId(): string;
        getListItemById<T extends ListItem<any>>(listItemId: number, options?: Object): ng.IPromise<T>;
        getModel(): Model;
        getQuery<T extends ListItem<any>>(queryName: string): IQuery<T>;
        isInitialised(): boolean;
        lastServerUpdate: Date;
        list: List;
        queries: IQueriesContainer;
        registerQuery<T extends ListItem<any>>(queryOptions: IQueryOptions): IQuery<T>;
        resolvePermissions(): IUserPermissionsObject;
        validateEntity<T extends ListItem<any>>(listItem: T, options?: Object): boolean;
    }

    export interface IUninitializedModel {
        factory: Function;
        list: IUninstantiatedList;
        [key: string]: any;
    }

    export interface IQueriesContainer {
        getAllListItems?: IQuery<any>;
        [key: string]: IQuery<any>
    }

    interface IModelFactory {
        new <T extends ListItem<any>>(rawObject: Object): T;
    }


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
    export class Model implements IModel {
        data = [];
        deferredListDefinition;
        list: List;
        factory: IModelFactory;
        fieldDefinitionsExtended: boolean = false;
        lastServerUpdate: Date;
        queries: IQueriesContainer = {};
        requestForFieldDefinitions;
        constructor(config: IUninitializedModel) {

            /** Assign all properties of config to the model */
            _.assign(this, config);

            /** Allow us to reference the model directly from the list item's factory prototype */
            this.factory.prototype.getModel = () => this;

            /** Use list constructor to instantiate valid list */
            this.list = new List(this.list);

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
        addNewItem<T extends ListItem<any>>(entity: Object, options?: Object): ng.IPromise<T> {
            var model = this,
                deferred = $q.defer();

            apDataService.createListItem(model, entity, options)
                .then((listItem) => {
                    deferred.resolve(listItem);
                    /** Optionally broadcast change event */
                    apUtilityService.registerChange(model, 'create', listItem.id);
                });
            return deferred.promise;
        }


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
        createEmptyItem<T extends ListItem<any>>(overrides?: Object): T {
            var model = this;
            var newItem = {};
            _.each(model.list.customFields, (fieldDefinition) => {
                /** Create attributes for each non-readonly field definition */
                if (!fieldDefinition.readOnly) {
                    /** Create an attribute with the expected empty value based on field definition type */
                    newItem[fieldDefinition.mappedName] = apFieldService.getDefaultValueForType(fieldDefinition.objectType);
                }
            });
            /** Extend any values that should override the default empty values */
            var rawObject = _.assign({}, newItem, overrides);
            return new model.factory<T>(rawObject);
        }

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
        executeQuery<T extends ListItem<any>>(queryName?: string, options?: Object): ng.IPromise<IndexedCache<T>> {
            var model = this;
            var query = model.getQuery(queryName);
            if (query) {
                return query.execute(options);
            }
        }


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
        extendListMetadata(options?: Object): ng.IPromise<any> {
            var model = this,
                deferred = $q.defer(),
                defaults = { listName: model.list.getListId() };

            /** Only request information if the list hasn't already been extended and is not currently being requested */
            if (!model.deferredListDefinition) {
                /** All Future Requests get this */
                model.deferredListDefinition = deferred.promise;

                var opts = _.assign({}, defaults, options);
                apDataService.getList(opts)
                    .then((responseXML) => {
                        apDecodeService.extendListMetadata(model, responseXML);
                        deferred.resolve(model);
                    });
            }
            return model.deferredListDefinition;
        }

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
        generateMockData<T extends ListItem<any>>(options?: IMockDataOptions): T[] {
            var mockData = [],
                model = this;

            var defaults = {
                quantity: 10,
                staticValue: false,
                permissionLevel: 'FullMask'
            };

            /** Extend defaults with any provided options */
            var opts: IMockDataOptions = _.assign({}, defaults, options);

            _.times(opts.quantity, (count) => {
                var mock = {
                    id: count + 1
                };
                /** Create an attribute with mock data for each field */
                _.each(model.list.fields, (field: IFieldDefinition) => {
                    mock[field.mappedName] = field.getMockData(opts);
                });

                /** Use the factory on the model to extend the object */
                mockData.push(new model.factory<T>(mock));
            });
            return mockData;
        }

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
        getAllListItems<T extends ListItem<any>>(): ng.IPromise<IndexedCache<T>> {
            var model = this;
            var query = model.queries.getAllListItems;
            return apDataService.executeQuery<T>(model, query, { target: query.indexedCache });
        }

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
        getCache<T extends ListItem<any>>(queryName?: string): IndexedCache<T> {
            var model = this, query, cache;
            query = model.getQuery(queryName);
            if (query && query.indexedCache) {
                cache = query.indexedCache;
            }
            return cache;
        }

        /**
         * @ngdoc function
         * @name Model.getCachedEntities
         * @module Model
         * @description
         * Returns all entities registered for this model regardless of query.
         * @returns {IndexedCache<T>} All registered entities for this model.
         */
        getCachedEntities<T extends ListItem<any>>(): IndexedCache<T> {
            var model = this;
            return apCacheService.getCachedEntities<T>(model.list.getListId());
        }


        /**
         * @ngdoc function
         * @name Model.getCachedEntity
         * @module Model
         * @description
         * Attempts to locate a model listItem by id.
         * @param {number} listItemId The ID of the requested listItem.
         * @returns {object} Returns either the requested listItem or undefined if it's not found.
         */
        getCachedEntity<T extends ListItem<any>>(listItemId: number): T {
            var model = this;
            return apCacheService.getCachedEntity<T>(model.list.getListId(), listItemId);
        }


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
        getFieldDefinition(fieldName: string): IExtendedFieldDefinition {
            var model = this;
            return _.find(model.list.fields, { mappedName: fieldName });
        }


        /**
         * @ngdoc function
         * @name ListItem.getList
         * @description
         * Allows us to reference the list definition directly from the list item.  This is added to the
         * model.factory prototype in apModelFactory.  See the [List](#/api/List) documentation for more info.
         * @returns {object} List for the list item.
         */
        getList(): List {
            return this.list;
        }


        /**
         * @ngdoc function
         * @name ListItem.getListId
         * @description
         * Allows us to reference the list ID directly from the model.
         * @returns {string} List ID.
         */
        getListId(): string {
            return this.list.getListId();
        }


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
        getListItemById<T extends ListItem<any>>(listItemId: number, options?: Object): ng.IPromise<T> {
            var deferred = $q.defer(),
                model = this,
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
                .then((indexedCache) => {
                    /** Should return an indexed cache object with a single listItem so just return the requested listItem */
                    deferred.resolve(indexedCache.first());
                }, (err) => {
                    deferred.reject(err);
                });

            return deferred.promise;
        }


        /**
         * @ngdoc function
         * @name ListItem.getModel
         * @description
         * Allows us to reference the parent model directly from the list item.  This is added to the
         * model.factory prototype in apModelFactory.  See the [List](#/api/List) documentation for more info.
         * @returns {object} Model for the list item.
         */
        getModel(): Model {
            return this;
        }


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
        getQuery<T extends ListItem<any>>(queryName: string): IQuery<T> {
            var model = this, query;
            if (_.isObject(model.queries[queryName])) {
                /** The named query exists */
                query = model.queries[queryName];
            } else if (_.isObject(model.queries[apConfig.defaultQueryName]) && !queryName) {
                /** A named query wasn't specified and the catchall query exists */
                query = model.queries[apConfig.defaultQueryName];
            } else {
                /** Requested query not found */
                query = undefined;
            }
            return query;
        }



        /**
         * @ngdoc function
         * @name Model.isInitialised
         * @module Model
         * @description
         * Methods which allows us to easily determine if we've successfully made any queries this session.
         * @returns {boolean} Returns evaluation.
         */
        isInitialised(): boolean {
            var model = this;
            return _.isDate(model.lastServerUpdate);
        }


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
        registerQuery<T extends ListItem<any>>(queryOptions: IQueryOptions): IQuery<T> {
            var model = this;

            var defaults = {
                /** If name isn't set, assume this is the only model and designate as primary */
                name: apConfig.defaultQueryName
            };

            queryOptions = _.assign({}, defaults, queryOptions);

            model.queries[queryOptions.name] = apQueryFactory.create(queryOptions, model);

            /** Return the newly created query */
            return model.queries[queryOptions.name];
        }


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
        resolvePermissions(): IUserPermissionsObject {
            var model = this;
            if (model.list && model.list.effectivePermMask) {
                /** Get the permission mask from the permission mask name */
                var permissionMask = apUtilityService.convertEffectivePermMask(model.list.effectivePermMask);
                return apUtilityService.resolvePermissions(permissionMask);
            } else {
                window.console.error('Attempted to resolve permissions of a model that hasn\'t been initialized.', model);
                return apUtilityService.resolvePermissions(null);
            }
        }

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
        validateEntity<T extends ListItem<any>>(listItem: T, options?: Object): boolean {
            var valid = true,
                model = this;

            var defaults = {
                toast: true
            };

            /** Extend defaults with any provided options */
            var opts = _.assign({}, defaults, options);

            var checkObject = (fieldValue) => {
                return _.isObject(fieldValue) && _.isNumber(fieldValue.lookupId);
            };

            _.each(model.list.customFields, (fieldDefinition: IExtendedFieldDefinition) => {
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
                                _.each(fieldValue, (fieldObject) => {
                                    if (valid) {
                                        valid = checkObject(fieldObject);
                                    } else {
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
        }
    }

    export class ModelFactory {
        Model = Model;
        static $inject = ['$q', 'apCacheService', 'apConfig', 'apDataService', 'apDecodeService', 'apFieldService', 'apIndexedCacheFactory', 'apListFactory', 'apQueryFactory', 'apUtilityService', 'toastr'];
        constructor(_$q_, _apCacheService_, _apConfig_, _apDataService_, _apDecodeService_, _apFieldService_, _apIndexedCacheFactory_, _apListFactory_, _apQueryFactory_, _apUtilityService_, _toastr_) {

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

        create(config) {
            return new Model(config);
        }

    }

    interface IMockDataOptions {
        permissionLevel?: string;
        quantity?: number;
    }

    angular
        .module('angularPoint')
        .service('apModelFactory', ModelFactory);


}
