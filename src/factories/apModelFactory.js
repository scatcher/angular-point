'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apModelFactory
 * @description
 * Exposes the model prototype and a constructor to instantiate a new Model.
 *
 * @requires angularPoint.apModalService
 * @requires angularPoint.apCacheService
 * @requires angularPoint.apDataService
 * @requires angularPoint.apListFactory
 * @requires angularPoint.apListItemFactory
 * @requires angularPoint.apQueryFactory
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .factory('apModelFactory', function (_, apCacheService, apDataService, apListFactory, apListItemFactory, apQueryFactory, apUtilityService, apFieldService, apConfig, apIndexedCacheFactory, apDecodeService, $q, toastr) {

        var defaultQueryName = apConfig.defaultQueryName;

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
         * //Taken from a fictitious projectsModel.js
         * var model = new apModelFactory.Model({
         *     factory: Project,
         *     list: {
         *         guid: '{PROJECT LIST GUID}',
         *         title: 'Projects',
         *         customFields: [
         *             {
         *                staticName: 'Title',
         *                objectType: 'Text',
         *                mappedName: 'title',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Customer',
         *                objectType: 'Lookup',
         *                mappedName: 'customer',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'ProjectDescription',
         *                objectType: 'Text',
         *                mappedName: 'projectDescription',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Status',
         *                objectType: 'Text',
         *                mappedName: 'status',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'TaskManager',
         *                objectType: 'User',
         *                mappedName: 'taskManager',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'ProjectGroup',
         *                objectType: 'Lookup',
         *                mappedName: 'group',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'CostEstimate',
         *                objectType: 'Currency',
         *                mappedName: 'costEstimate',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Active',
         *                objectType: 'Boolean',
         *                mappedName: 'active',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Attachments',
         *                objectType: 'Attachments',
         *                mappedName: 'attachments',
         *                readOnly: true
         *             }
         *         ]
         *     }
         * });
         * </pre>
         */
        function Model(config) {
            var model = this;
            var defaults = {
                data: [],
                factory: apListItemFactory.createGenericFactory(),
                fieldDefinitionsExtended: false,
                /** Date/Time of last communication with server */
                lastServerUpdate: null,
                queries: {}
            };

            _.extend(model, defaults, config);

            /** Use list constructor to decorate */
            model.list = apListFactory.create(model.list);

            /** Set the constructor's prototype to inherit from ListItem so we can inherit functionality */
            model.factory.prototype = apListItemFactory.create();
            /** Constructor for ListItem is Object so ensure we update to properly reference ListItem */
            model.factory.constructor = apListItemFactory.ListItem;

            /** Make the model directly accessible from the list item */
            model.factory.prototype.getModel = function () {
                return model;
            };

            /** Register cache name with cache service so we can map factory name with list GUID */
            apCacheService.registerModel(model);

            /** Convenience query that simply returns all list items within a list. */
            model.registerQuery({
                name: 'getAllListItems',
                operation: 'GetListItems'
            });

            model.searchLocalCache = searchLocalCache;

            return model;
        }

        /** All Models inherit the following from their base prototype */
        Model.prototype = {
            addNewItem: addNewItem,
            createEmptyItem: createEmptyItem,
            executeQuery: executeQuery,
            extendListMetadata: extendListMetadata,
            generateMockData: generateMockData,
            getAllListItems: getAllListItems,
            getCache: getCache,
            getCachedEntity: getCachedEntity,
            getCachedEntities: getCachedEntities,
            getFieldDefinition: getFieldDefinition,
            getListItemById: getListItemById,
            //getLocalEntity: getLocalEntity,
            getQuery: getQuery,
            //initializeModalState: initializeModalState,
            isInitialised: isInitialised,
            //resolvePermissions: resolvePermissions,
            registerQuery: registerQuery,
            validateEntity: validateEntity
        };

        return {
            create: create,
            deepGroup: deepGroup,
            Model: Model,
            searchLocalCache: searchLocalCache
        };


        /********************* Private **************************/

        /**
         * @ngdoc function
         * @name Model.searchLocalCache
         * @module Model
         * @description
         * Search functionality that allow for deeply searching an array of objects for the first
         * record matching the supplied value.  Additionally it maps indexes to speed up future calls.  It
         * currently rebuilds the mapping when the length of items in the local cache has changed or when the
         * rebuildIndex flag is set.
         *
         * @param {*} value The value or array of values to compare against.
         * @param {object} [options] Object containing optional parameters.
         * @param {string} [options.propertyPath] The dot separated propertyPath.
         * <pre>
         * 'project.lookupId'
         * </pre>
         * @param {object} [options.cacheName] Required if using a data source other than primary cache.
         * @param {object} [options.localCache=model.getCache()] Array of objects to search (Default model.getCache()).
         * @param {boolean} [options.rebuildIndex=false] Ignore previous index and rebuild.
         *
         * @returns {(object|object[])} Either the object(s) that you're searching for or undefined if not found.
         */
        function searchLocalCache(value, options) {
            var model = this,
                searchCache,
                searchIndex,
                searchResults,
                defaults = {
                    propertyPath: 'id',
                    localCache: model.getCache(),
                    cacheName: 'main',
                    rebuildIndex: false
                };
            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            if (opts.propertyPath === 'id') {
                searchIndex = opts.localCache;
            } else {
                /** Create a cache if it doesn't already exist */
                model._cachedIndexes = model._cachedIndexes || {};
                model._cachedIndexes[opts.cacheName] = model._cachedIndexes[opts.cacheName] || {};
                searchCache = model._cachedIndexes[opts.cacheName];
                var properties = opts.propertyPath.split('.');
                /** Create cache location with the same property map as the one provided
                 * @example
                 * <pre>
                 * model._cachedIndexes{
                 *      main: { //Default Cache name unless otherwise specified
                 *          lookup: {
                 *              lookupId: { ///// Cache Location for 'lookup.lookupId' //////// }
                 *          },
                 *          user: {
                 *              lookupValue: { ///// Cache Location for 'user.lookupValue' //////// }
                 *          }
                 *      }
                 * }
                 * </pre>
                 */
                _.each(properties, function (attribute) {
                    searchCache[attribute] = searchCache[attribute] || {};
                    /** Update cache reference to another level down the cache object */
                    searchCache = searchCache[attribute];
                });

                /** Remap if no existing map, the number of items in the array has changed, or the rebuild flag is set */
                if (!_.isNumber(searchCache.count) || searchCache.count !== opts.localCache.count() || opts.rebuildIndex) {
                    searchCache.indexedCache = deepGroup(opts.localCache, opts.propertyPath);
                    /** Store the current length of the array for future comparisons */
                    searchCache.count = opts.localCache.count();
                    /** Simple counter to gauge the frequency we rebuild cache */
                    searchCache.buildCount = searchCache.buildCount || 0;
                    searchCache.buildCount++;
                }
                searchIndex = searchCache.indexedCache;
            }

            /** Allow an array of values to be passed in */
            if (_.isArray(value)) {
                searchResults = [];
                _.each(value, function (key) {
                    searchResults.push(searchIndex[key]);
                });
                /** Primitive passed in */
            } else {
                searchResults = searchIndex[value];
            }
            return searchResults;
        }

        /**
         * @ngdoc function
         * @name Model.deepGroup
         * @module Model
         * @description
         * Creates an indexed cache of entities using a provided property path string to find the key for the cache.
         * @param {object} object A cached index object.
         * @param {string} propertyPath Dot separated property path that leads to the desired property to use as a key.
         * @returns {object} New indexed cache based on the provided property path string.
         */
        function deepGroup(object, propertyPath) {

            function DeepGroup() {
            }

            /** Use the methods on the IndexedCacheFactory for the base prototype */
            DeepGroup.prototype = apIndexedCacheFactory.IndexedCache;
            /** Overwrite the addEntity method on base prototype to allow for dynamic property path */
            DeepGroup.prototype.addEntity = addEntity;


            var group = new DeepGroup();
            _.each(object, function (entity) {
                group.addEntity(entity);
            });

            return group;


            function addEntity(entity) {
                var cache = this;
                var targetProperty = _.deepGet(entity, propertyPath);
                if (targetProperty) {
                    cache[targetProperty] = entity;
                }
            }
        }

        ///**
        // * @ngdoc function
        // * @name Model.getLocalEntity
        // * @module Model
        // * @description
        // * Similar to Model.searchLocalCache but you don't need to specify a query, only searches by list item
        // * id, and returns a promise that is fulfilled once the requested list item is registered in the cache
        // *
        // * @param {number} entityId The ListItem.id of the object.
        // * @returns {promise} Will resolve once the item is registered in the cache.
        // * @example
        // * <pre>
        // * var task = {
        // *    title: 'A Task',
        // *    project: {
        // *        lookupId: 4,
        // *        lookupValue: 'Super Project'
        // *    }
        // * };
        // *
        // * // Now we'd like to get the project referenced in the task
        // * projectModel.getLocalEntity(task.project.lookupId).then(function(entity) {
        // *     var projectThatICareAbout = entity;
        // *     //Do something with it
        // * }
        // * </pre>
        // */
        //function getLocalEntity(entityId) {
        //    var model = this;
        //    return apCacheService.getEntity(model.list.getListId(), entityId);
        //}

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
        function getAllListItems() {
            var model = this;
            return apDataService.executeQuery(model, model.queries.getAllListItems);
        }

        /**
         * @ngdoc function
         * @name Model.getListItemById
         * @param {number} entityId Id of the item being requested.
         * @param {object} options Used to override apDataService defaults.
         * @description
         * Inherited from Model constructor
         * Attempts to retrieve the requested list item from the server.
         * @returns {object} Promise that resolves with the requested list item if found.  Otherwise it returns undefined.
         * @example
         * <pre>
         * //Taken from a fictitious projectsModel.js
         * projectModel.getListItemById().then(function(entity) {
         *     //Do something with the located entity
         *     $scope.project = entity;
         * };
         * </pre>
         */
        function getListItemById(entityId, options) {
            var model = this,
                /** Only required option for apDataService is listName which is available on model */
                defaults = {listName: model.list.getListId()},
                opts = _.extend({}, defaults, options);

            /** Fetch from the server */
            return apDataService.getListItemById(entityId, model, opts);
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
        function addNewItem(entity, options) {
            var model = this,
                deferred = $q.defer();

            apDataService.createListItem(model, entity, options)
                .then(function (response) {
                    deferred.resolve(response);
                    /** Optionally broadcast change event */
                    apUtilityService.registerChange(model);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name Model.registerQuery
         * @module Model
         * @description
         * Constructor that allows us create a static query with the option to build dynamic queries as seen in the
         * third example.  This construct is a passthrough to [SPServices](http://spservices.codeplex.com/)
         * @param {object} [queryOptions] Optional options to pass through to the
         * [dataService](#/api/dataService.executeQuery).
         * @param {string} [queryOptions.name=defaultQueryName] Optional name of the new query (recommended but will
         * default to 'Primary' if not specified)
         * @param {string} [queryOptions.operation="GetListItemChangesSinceToken"] Defaults to
         * [GetListItemChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx)
         * but for a smaller payload and faster response you can use
         * [GetListItems](http://spservices.codeplex.com/wikipage?title=GetListItems&referringTitle=Lists).
         * @param {boolean} [queryOptions.cacheXML=false] Typically don't need to store the XML response because it
         * has already been parsed into JS objects.
         * @param {string} [queryOptions.offlineXML] Optionally reference a specific XML file to use for this query instead
         * of using the shared XML file used by all queries on this model.  Useful to mock custom query results.
         * @param {string} [queryOptions.query] CAML Query - Josh McCarty has a good quick reference
         * [here](http://joshmccarty.com/2012/06/a-caml-query-quick-reference)
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
         pre>
         */
        function registerQuery(queryOptions) {
            var model = this;

            var defaults = {
                /** If name isn't set, assume this is the only model and designate as primary */
                name: defaultQueryName
            };

            queryOptions = _.extend({}, defaults, queryOptions);

            model.queries[queryOptions.name] = apQueryFactory.create(queryOptions, model);

            /** Return the newly created query */
            return model.queries[queryOptions.name];
        }

        /**
         * @ngdoc function
         * @name Model.getQuery
         * @module Model
         * @description
         * Helper function that attempts to locate and return a reference to the requested or catchall query.
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query.
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
        function getQuery(queryName) {
            var model = this, query;
            if (_.isObject(model.queries[queryName])) {
                /** The named query exists */
                query = model.queries[queryName];
            } else if (_.isObject(model.queries[defaultQueryName]) && !queryName) {
                /** A named query wasn't specified and the catchall query exists */
                query = model.queries[defaultQueryName];
            } else {
                /** Requested query not found */
                query = undefined;
            }
            return query;
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
        function getFieldDefinition(fieldName) {
            var model = this;
            return _.findWhere(model.list.fields, {mappedName: fieldName});
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
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query.
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
        function getCache(queryName) {
            var model = this, query, cache;
            query = model.getQuery(queryName);
            if (query && query.indexedCache) {
                cache = query.indexedCache;
            }
            return cache;
        }


        /**
         * @ngdoc function
         * @name Model.getCachedEntity
         * @module Model
         * @description
         * Attempts to locate a model entity by id.
         * @param {number} entityId The ID of the requested entity.
         * @returns {object} Returns either the requested entity or undefined if it's not found.
         */
        function getCachedEntity(entityId) {
            var model = this;
            return apCacheService.getCachedEntity(model.list.getListId(), entityId);
        }

        /**
         * @ngdoc function
         * @name Model.getCachedEntities
         * @module Model
         * @description
         * Returns all entities registered for this model regardless of query.
         * @returns {object[]} All registered entities for this model.
         */
        function getCachedEntities() {
            var model = this;
            return apCacheService.getCachedEntities(model.list.getListId());
        }

        /**
         * @ngdoc function
         * @name Model.executeQuery
         * @module Model
         * @description
         * The primary method for retrieving data from a query registered on a model.  It returns a promise
         * which resolves to the local cache after post processing entities with constructors.
         *
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query
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
        function executeQuery(queryName, options) {
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
        function extendListMetadata(options) {
            var model = this,
                deferred = $q.defer(),
                defaults = {listName: model.list.getListId()};

            /** Only request information if the list hasn't already been extended and is not currently being requested */
            if (!model.fieldDefinitionsExtended && !model.deferredListDefinition) {
                model.deferredListDefinition = deferred.promise;
                var opts = _.extend({}, defaults, options);
                apDataService.getList(opts)
                    .then(function (responseXML) {
                        apDecodeService.extendListDefinitionFromXML(model.list, responseXML);
                        apDecodeService.extendFieldDefinitionsFromXML(model.list.fields, responseXML);
                        model.fieldDefinitionsExtended = true;
                        deferred.resolve(model);
                    });
            }
            return model.deferredListDefinition;
        }

        /**
         * @ngdoc function
         * @name Model.isInitialised
         * @module Model
         * @description
         * Methods which allows us to easily determine if we've successfully made any queries this session.
         * @returns {boolean} Returns evaluation.
         */
        function isInitialised() {
            var model = this;
            return _.isDate(model.lastServerUpdate);
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
        function createEmptyItem(overrides) {
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
            var rawObject = _.extend({}, newItem, overrides);
            return new model.factory(rawObject);
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
        function generateMockData(options) {
            var mockData = [],
                model = this;

            var defaults = {
                quantity: 10,
                staticValue: false,
                permissionLevel: 'FullMask'
            };

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            _.times(opts.quantity, function (count) {
                var mock = {};
                /** Create an attribute with mock data for each field */
                _.each(model.list.fields, function (field) {
                    mock[field.mappedName] = field.getMockData(opts);
                });
                mock.id = count + 1;
                /** Use the factory on the model to extend the object */
                mockData.push(new model.factory(mock));
            });
            return mockData;
        }

        /**
         * @ngdoc function
         * @name Model.validateEntity
         * @module Model
         * @description
         * Uses the custom fields defined in an model to ensure each field (required = true) is evaluated
         * based on field type
         *
         * @param {object} entity SharePoint list item.
         * @param {object} [options] Object containing optional parameters.
         * @param {boolean} [options.toast=true] Should toasts be generated to alert the user of issues.
         * @returns {boolean} Evaluation of validity.
         */
        function validateEntity(entity, options) {
            var valid = true,
                model = this;

            var defaults = {
                toast: true
            };

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            var checkObject = function (fieldValue) {
                return _.isObject(fieldValue) && _.isNumber(fieldValue.lookupId);
            };

            _.each(model.list.customFields, function (fieldDefinition) {
                var fieldValue = entity[fieldDefinition.mappedName];
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


        ///**
        // * @ngdoc function
        // * @name Model.resolvePermissions
        // * @module Model
        // * @description
        // * See apModelFactory.resolvePermissions for details on what we expect to have returned.
        // * @returns {Object} Contains properties for each permission level evaluated for current user.
        // * @example
        // * Lets assume we're checking to see if a user has edit rights for a given list.
        // * <pre>
        // * var userPermissions = tasksModel.resolvePermissions();
        // * var userCanEdit = userPermissions.EditListItems;
        // * </pre>
        // * Example of what the returned object would look like
        // * for a site admin.
        // * <pre>
        // * perm = {
        // *    "ViewListItems":true,
        // *    "AddListItems":true,
        // *    "EditListItems":true,
        // *    "DeleteListItems":true,
        // *    "ApproveItems":true,
        // *    "OpenItems":true,
        // *    "ViewVersions":true,
        // *    "DeleteVersions":true,
        // *    "CancelCheckout":true,
        // *    "PersonalViews":true,
        // *    "ManageLists":true,
        // *    "ViewFormPages":true,
        // *    "Open":true,
        // *    "ViewPages":true,
        // *    "AddAndCustomizePages":true,
        // *    "ApplyThemeAndBorder":true,
        // *    "ApplyStyleSheets":true,
        // *    "ViewUsageData":true,
        // *    "CreateSSCSite":true,
        // *    "ManageSubwebs":true,
        // *    "CreateGroups":true,
        // *    "ManagePermissions":true,
        // *    "BrowseDirectories":true,
        // *    "BrowseUserInfo":true,
        // *    "AddDelPrivateWebParts":true,
        // *    "UpdatePersonalWebParts":true,
        // *    "ManageWeb":true,
        // *    "UseRemoteAPIs":true,
        // *    "ManageAlerts":true,
        // *    "CreateAlerts":true,
        // *    "EditMyUserInfo":true,
        // *    "EnumeratePermissions":true,
        // *    "FullMask":true
        // * }
        // * </pre>
        // */
        //
        //function resolvePermissions() {
        //    var model = this;
        //    if (model.list && model.list.effectivePermMask) {
        //        return apUtilityService.resolvePermissions(model.list.effectivePermMask);
        //    } else {
        //        window.console.error('Attempted to resolve permissions of a model that hasn\'t been initialized.', model);
        //        return apUtilityService.resolvePermissions(null);
        //    }
        //}

        /**
         * @ngdoc function
         * @name angularPoint.apModelFactory:create
         * @methodOf angularPoint.apModelFactory
         * @param {object} config Options object.
         * @description
         * Instantiates and returns a new Model.
         * @example
         * <pre>
         * var model = apModelFactory.create({
         *     factory: Task,
         *     list: {
         *         title: 'Tasks', //Maps to the offline XML file in dev folder (no spaces)
         *         // List GUID can be found in list properties in SharePoint designer
         *         guid: '{DBA4535D-D8F3-4D65-B7C0-7E970AE3A52D}',
         *         customFields: [
         *             // Array of objects mapping each SharePoint field to a property on a list item object
         *             {staticName: 'Title', objectType: 'Text', mappedName: 'title', readOnly: false},
         *             {staticName: 'Description', objectType: 'Text', mappedName: 'description', readOnly: false},
         *             {staticName: 'Priority', objectType: 'Text', mappedName: 'priority', readOnly: false},
         *             {staticName: 'Status', objectType: 'Text', mappedName: 'status', readOnly: false},
         *             {staticName: 'RequestedBy', objectType: 'User', mappedName: 'requestedBy', readOnly: false},
         *             {staticName: 'AssignedTo', objectType: 'User', mappedName: 'assignedTo', readOnly: false},
         *             {staticName: 'EstimatedEffort', objectType: 'Integer', mappedName: 'estimatedEffort', readOnly: false},
         *             {staticName: 'PercentComplete', objectType: 'Integer', mappedName: 'percentComplete', readOnly: false}
         *         ]
         *     }
         * });
         * </pre>
         */
        function create(config) {
            return new Model(config);
        }


    });
