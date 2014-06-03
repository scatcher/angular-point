'use strict';

/**
 * @ngdoc service
 * @name modelFactory
 * @module Model
 * @description
 * The 'modelFactory' provides a common base prototype for Model, Query, and List Item.
 *
 * @function
 */
angular.module('angularPoint')
    .factory('apModelFactory', function ($q, $timeout, $cacheFactory, $log, apConfig, apDataService, apCacheService, apFieldService, toastr) {

        var defaultQueryName = 'primary';

        /** In the event that a factory isn't specified, just use a
         * standard constructor to allow it to inherit from ListItem */
        var StandardListItem = function (item) {
            var self = this;
            _.extend(self, item);
        };

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
         * @param {object} options Object containing optional params.
         * @param {object} [options.factory=StandardListItem] - Constructor function for individual list items.
         * @param {object} options.list - Definition of the list in SharePoint; This object will
         * be passed to the list constructor to extend further
         * @param {string} options.list.title - List name, no spaces.  Offline XML file will need to be
         * named the same (ex: CustomList so xml file would be /dev/CustomList.xml)
         * @param {string} options.list.guid - Unique SharePoint ID (ex: '{3DBEB25A-BEF0-4213-A634-00DAF46E3897}')
         * @param {object[]} options.list.customFields - Maps SharePoint fields with names we'll use within the
         * application.  Identifies field types and formats accordingly.  Also denotes if a field is read only.
         * @constructor
         *
         * @example
         <pre>
         //Taken from a fictitious projectsModel.js
         var model = new modelFactory.Model({
                 factory: Project,
                 list: {
                     guid: '{PROJECT LIST GUID}',
                     title: 'Projects',
                     customFields: [
                         { internalName: 'Title', objectType: 'Text', mappedName: 'title', readOnly: false },
                         { internalName: 'Customer', objectType: 'Lookup', mappedName: 'customer', readOnly: false },
                         { internalName: 'ProjectDescription', objectType: 'Text', mappedName: 'projectDescription', readOnly: false },
                         { internalName: 'Status', objectType: 'Text', mappedName: 'status', readOnly: false },
                         { internalName: 'TaskManager', objectType: 'User', mappedName: 'taskManager', readOnly: false },
                         { internalName: 'ProjectGroup', objectType: 'Lookup', mappedName: 'group', readOnly: false },
                         { internalName: 'CostEstimate', objectType: 'Currency', mappedName: 'costEstimate', readOnly: false },
                         { internalName: 'Active', objectType: 'Boolean', mappedName: 'active', readOnly: false },
                         { internalName: 'Attachments', objectType: 'Attachments', mappedName: 'attachments', readOnly: true}
                     ]
                 }
             });
         </pre>
         */
        function Model(options) {
            var model = this;
            var defaults = {
                data: [],
                factory: StandardListItem,
                /** Date/Time of last communication with server */
                lastServerUpdate: null,
                queries: {}
            };

            _.extend(model, defaults, options);

            /** Use list constructor to decorate */
            model.list = new List(model.list);

            /** Set the constructor's prototype to inherit from ListItem so we can inherit functionality */
            model.factory.prototype = new ListItem();

            /** Make the model directly accessible from the list item */
            model.factory.prototype.getModel = function () {
                return model;
            };

            /** Register cache name with cache service so we can map factory name with list GUID */
            apCacheService.registerModel(model);


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
             <pre>
             'project.lookupId'
             </pre>
             * @param {object} [options.cacheName] Required if using a data source other than primary cache.
             * @param {object} [options.localCache=model.getCache()] Array of objects to search (Default model.getCache()).
             * @param {boolean} [options.rebuildIndex=false] Ignore previous index and rebuild.
             *
             * @returns {(object|object[])} Either the object(s) that you're searching for or undefined if not found.
             */
            model.searchLocalCache = function (value, options) {
                var self = model.searchLocalCache;
                var response;
                var defaults = {
                    propertyPath: 'id',
                    localCache: model.getCache(),
                    cacheName: 'main',
                    rebuildIndex: false
                };
                /** Extend defaults with any provided options */
                var opts = _.extend({}, defaults, options);
                /** Create a cache if it doesn't already exist */
                self.indexCache = self.indexCache || {};
                self.indexCache[opts.cacheName] = self.indexCache[opts.cacheName] || {};
                var cache = self.indexCache[opts.cacheName];
                var properties = opts.propertyPath.split('.');
                _.each(properties, function (attribute) {
                    cache[attribute] = cache[attribute] || {};
                    /** Update cache reference to another level down the cache object */
                    cache = cache[attribute];
                });
                cache.map = cache.map || [];
                /** Remap if no existing map, the number of items in the array has changed, or the rebuild flag is set */
                if (!_.isNumber(cache.count) || cache.count !== opts.localCache.length || opts.rebuildIndex) {
                    cache.map = _.deepPluck(opts.localCache, opts.propertyPath);
                    /** Store the current length of the array for future comparisons */
                    cache.count = opts.localCache.length;
                }
                /** Allow an array of values to be passed in */
                if (_.isArray(value)) {
                    response = [];
                    _.each(value, function (key) {
                        response.push(opts.localCache[cache.map.indexOf(key)]);
                    });
                } else {
                    response = opts.localCache[cache.map.indexOf(value)];
                }
                return response;
            };


            return model;
        }

        /**
         * @ngdoc function
         * @name Model.getAllListItems
         * @module modelFactoryModel
         * @description
         * Inherited from Model constructor
         * Gets all list items in the current list, processes the xml, and caches the data in model.
         * @returns {object} Promise returning all list items when resolved.
         * @example
         <pre>
         //Taken from a fictitious projectsModel.js
         projectModel.getAllListItems().then(function(entities) {
                  //Do something with all of the returned entities
                  $scope.projects = entities;
              };
         </pre>
         */
        Model.prototype.getAllListItems = function () {
            var deferred = $q.defer();
            apDataService.executeQuery(this, this.queries.getAllListItems, {deferred: deferred})
                .then(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise();
        };

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
         <pre>
         //Taken from a fictitious projectsModel.js
         projectModel.addNewItem({
                    title: 'A Project',
                    customer: {lookupValue: 'My Customer', lookupId: 123},
                    description: 'This is the project description'
                 }).then(function(newEntityFromServer) {
                     //The local query cache is automatically updated but any other dependent logic can go here
             };
         </pre>
         */
        Model.prototype.addNewItem = function (entity, options) {
            var model = this;
            var deferred = $q.defer();
            apDataService.addUpdateItemModel(model, entity, options).then(function (response) {
                deferred.resolve(response);
                /** Optionally broadcast change event */
                registerChange(model);
            });

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name Model.registerQuery
         * @module Model
         * @description
         * Constructor that allows us create a static query with a reference to the parent model
         * @param {object} [queryOptions] Optional options to pass through to the dataService.
         * @param {string} [queryOptions.name=defaultQueryName] Optional name of the new query (recommended but will
         * default to 'Primary' if not specified)
         * @returns {object} Query Returns a new query object.
         *
         * @example
         <pre>
         //Could be placed on the projectModel and creates the query but doesn't call it
         projectModel.registerQuery({
             name: 'primary',
             query: '' +
                 '<Query>' +
                 '   <OrderBy>' +
                 '       <FieldRef Name="Title" Ascending="TRUE"/>' +
                 '   </OrderBy>' +
                 '</Query>'
         });
         </pre>

         * @example
         <pre>
         //To call the query or check for changes since the last call
         projectModel.executeQuery('primary').then(function(entities) {
             //We now have a reference to array of entities stored in the local cache
             //These inherit from the ListItem prototype as well as the Project prototype on the model
             $scope.projects = entities;
         });
         </pre>

         * @example
         <pre>
         //Advanced functionality that would allow us to dynamically create queries for list items with a
         //lookup field associated with a specific project id.  Let's assume this is on the projectTasksModel.
         model.queryByProjectId(projectId) {
             // Unique query name
             var queryKey = 'pid' + projectId;

             // Register project query if it doesn't exist
             if (!_.isObject(model.queries[queryKey])) {
                 model.registerQuery({
                     name: queryKey,
                     query: '' +
                         '<Query>' +
                         '   <OrderBy>' +
                         '       <FieldRef Name="ID" Ascending="TRUE"/>' +
                         '   </OrderBy>' +
                         '   <Where>' +
                         '       <And>' +
                     // Prevents any records from being returned if user doesn't have permissions on project
                         '           <IsNotNull>' +
                         '               <FieldRef Name="Project"/>' +
                         '           </IsNotNull>' +
                     // Return all records for the project matching param projectId
                         '           <Eq>' +
                         '               <FieldRef Name="Project" LookupId="TRUE"/>' +
                         '               <Value Type="Lookup">' + projectId + '</Value>' +
                         '           </Eq>' +
                         '       </And>' +
                         '   </Where>' +
                         '</Query>'
                 });
             }
             //Still using execute query but now we have a custom query
             return model.executeQuery(queryKey);
         };
         </pre>
         */
        Model.prototype.registerQuery = function (queryOptions) {
            var model = this;

            var defaults = {
                /** If name isn't set, assume this is the only model and designate as primary */
                name: defaultQueryName
            };

            queryOptions = _.extend({}, defaults, queryOptions);

            model.queries[queryOptions.name] = new Query(queryOptions, model);

            /** Return the newly created query */
            return model.queries[queryOptions.name];
        };

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
         <pre>
         var primaryQuery = projectModel.getQuery();
         </pre>

         * @example
         <pre>
         var primaryQuery = projectModel.getQuery('primary');
         </pre>

         * @example
         <pre>
         var namedQuery = projectModel.getQuery('customQuery');
         </pre>
         */
        Model.prototype.getQuery = function (queryName) {
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
        };

        /**
         * @ngdoc function
         * @name Model.getCache
         * @module Model
         * @description
         * Returns the field definition from the definitions defined in the custom fields array within a model.
         * @param {string} fieldName Internal field name.
         * @returns {object} Field definition.
         */
        Model.prototype.getFieldDefinition = function (fieldName) {
            return _.findWhere(this.list.customFields, { mappedName: fieldName});
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
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query.
         * @returns {Array} Returns the contents of the current cache for a named query.
         *
         * @example
         <pre>
         var primaryQueryCache = projectModel.getCache();
         </pre>

         * @example
         <pre>
         var primaryQueryCache = projectModel.getCache('primary');
         </pre>

         * @example
         <pre>
         var namedQueryCache = projectModel.getCache('customQuery');
         </pre>
         */
        Model.prototype.getCache = function (queryName) {
            var model = this, query, cache;
            query = model.getQuery(queryName);
            if (query && query.cache) {
                cache = query.cache;
            }
            return cache;
        };

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
         <pre>
         projectModel.executeQuery('MyCustomQuery').then(function(entities) {
              //We now have a reference to array of entities stored in the local cache
              //These inherit from the ListItem prototype as well as the Project prototype on the model
              $scope.subsetOfProjects = entities;
          });
         </pre>
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
         * @name Model.isInitialised
         * @module Model
         * @description
         * Methods which allows us to easily determine if we've successfully made any queries this session.
         * @returns {boolean} Returns evaluation.
         */
        Model.prototype.isInitialised = function () {
            return _.isDate(this.lastServerUpdate);
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
            var rawObject = _.extend({}, newItem, overrides);
            return new model.factory(rawObject);
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
            var mockData = [],
                model = this;

            var defaults = {
                quantity: 10,
                staticValue: false,
                permissionLevel: 'FullMask'
            };

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            _.times(opts.quantity, function () {
                var mock = {};
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
        Model.prototype.validateEntity = function (entity, options) {
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
                if (fieldDefinition.required && valid) {
                    switch (fieldDefinition.objectType) {
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
                        var fieldName = fieldDefinition.label || fieldDefinition.internalName;
                        toastr.error(fieldName + ' does not appear to be a valid ' + fieldDescriptor);
                    }
                }
                if (!valid) {
                    return false;
                }
            });
            return valid;
        };

        /**
         * @ngdoc function
         * @name ListItem
         * @module ListItem
         * @description
         * Base prototype which all list items inherit CRUD functionality that can be called directly from obj.
         * @constructor
         */
        function ListItem() {
        }

        /**
         * @ngdoc function
         * @name ListItem.getDataService
         * @module ListItem
         * @description
         * Allows us to reference when out of scope
         * @returns {object} Reference to the dataService in the event that it's out of scope.
         */
        ListItem.prototype.getDataService = function () {
            return apDataService;
        };

        /**
         * @ngdoc function
         * @name ListItem.saveChanges
         * @module ListItem
         * @description
         * Updates record directly from the object
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure entity is
         * updated everywhere.  This is more process intensive so by default we only update the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which resolved with the updated list item from the server.
         */
        ListItem.prototype.saveChanges = function (options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();

            apDataService.addUpdateItemModel(model, listItem, options).then(function (response) {
                deferred.resolve(response);
                /** Optionally broadcast change event */
                registerChange(model);
            });

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name ListItem.saveFields
         * @module ListItem
         * @description
         * Saves a named subset of fields back to SharePoint
         * Alternative to saving all fields
         * @param {array} fieldArray Array of internal field names that should be saved to SharePoint.
         <pre>
         //Create an array to store all promises.
         var queue = [],
         progressCounter = 0;

         //We're only updating a single field on each entity so it's much faster to use ListItem.saveFields() so we
         //don't need to push the entire object back to the server.
         _.each(selectedItems, function (entity) {
            entity.title = title + ': Now Updated!';
            var request = entity.saveFields('title').then(function() {
                progressCounter++;
            }
            queue.push(request);
          });

         $q.all(queue).then(function() {
             //All items have now been processed so we can do something...but the view is automatically updated so we
             //don't need to bother if there's no other required business logic.
         }

         </pre>
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure entity is
         * updated everywhere.  This is more process intensive so by default we only update the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which resolves with the updated list item from the server.
         */
        ListItem.prototype.saveFields = function (fieldArray, options) {

            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();
            var definitions = [];
            /** Find the field definition for each of the requested fields */
            _.each(fieldArray, function (field) {
                var match = _.findWhere(model.list.customFields, {mappedName: field});
                if (match) {
                    definitions.push(match);
                }
            });

            /** Generate value pairs for specified fields */
            var valuePairs = apDataService.generateValuePairs(definitions, listItem);

            var defaults = {buildValuePairs: false, valuePairs: valuePairs};

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            apDataService.addUpdateItemModel(model, listItem, opts)
                .then(function (response) {
                    deferred.resolve(response);
                    /** Optionally broadcast change event */
                    registerChange(model);
                });

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name ListItem.deleteItem
         * @module ListItem
         * @description
         * Deletes record directly from the object and removes record from user cache.
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.updateAllCaches=false] Iterate over each of the query cache's and ensure the entity is
         * removed everywhere.  This is more process intensive so by default we only remove the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which really only lets us know the request is complete.
         */
        ListItem.prototype.deleteItem = function (options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();

            apDataService.deleteItemModel(model, listItem, options).then(function (response) {
                deferred.resolve(response);
                /** Optionally broadcast change event */
                registerChange(model);
            });

            return deferred.promise;
        };


        /**
         * @ngdoc function
         * @name ListItem.getLookupReference
         * @module ListItem
         * @description
         * Allows us to retrieve the entity being referenced in a given lookup field.
         * @param {string} fieldName Name of the lookup property on the list item that references an entity.
         * @param {number} [lookupId=listItem.fieldName.lookupId] The listItem.lookupId of the lookup object.  This allows us to also use this logic
         * on a multi-select by iterating over each of the lookups.
         * @example
         <pre>
         var project = {
            title: 'Project 1',
            location: {
                lookupId: 5,
                lookupValue: 'Some Building'
            }
         };

         //To get the location entity
         project.getLookupReference('location')
             .then(function(entity) {
                //Do something with the location entity

             });
         </pre>

         <pre>
         var project = {
            title: 'Project 1',
            location: [
                { lookupId: 5, lookupValue: 'Some Building' },
                { lookupId: 6, lookupValue: 'Some Other Building' },
            ]
         };

         //To get the location entity
         project.getLookupReference('location', project.location[0].lookupId)
             .then(function(entity) {
                //Do something with the location entity

             });
         </pre>
         * @returns {promise} Resolves with the entity the lookup is referencing.
         */
        ListItem.prototype.getLookupReference = function (fieldName, lookupId) {
            var listItem = this;
            var deferred = $q.defer();
            var targetId = lookupId || listItem[fieldName].lookupId;


            if (fieldName) {
                var model = listItem.getModel();
                var fieldDefinition = model.getFieldDefinition(fieldName);
                /** Ensure the field definition has the List attribute which contains the GUID of the list
                 *  that a lookup is referencing.
                 */
                if (fieldDefinition && fieldDefinition.List) {
                    apCacheService.getEntity(fieldDefinition.List, targetId).then(function (entity) {
                        deferred.resolve(entity);
                    });
                } else {
                    deferred.fail('Need a List GUID before we can find this in cache.');
                }
            } else {
                deferred.fail('Need both fieldName && lookupId params');
            }
            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name ListItem.validateEntity
         * @module ListItem
         * @description
         * Helper function that passes the current item to Model.validateEntity
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.toast=true] Set to false to prevent toastr messages from being displayed.
         * @returns {boolean} Evaluation of validity.
         */
        ListItem.prototype.validateEntity = function (options) {
            var listItem = this,
                model = listItem.getModel();
            return model.validateEntity(listItem, options);
        };

        /**
         * @ngdoc function
         * @name ListItem.getAttachmentCollection
         * @module ListItem
         * @description
         * Requests all attachments for a given list item.
         * @returns {object} Promise which resolves with all attachments for a list item.
         */
        ListItem.prototype.getAttachmentCollection = function () {
            return apDataService.getCollection({
                operation: 'GetAttachmentCollection',
                listName: this.getModel().list.guid,
                webURL: this.getModel().list.webURL,
                ID: this.id,
                filterNode: 'Attachment'
            });
        };

        /**
         * @ngdoc function
         * @name ListItem.deleteAttachment
         * @module ListItem
         * @description
         * Delete an attachment from a list item.
         * @param {string} url Requires the URL for the attachment we want to delete.
         * @returns {object} Promise which resolves with the updated attachment collection.
         */
        ListItem.prototype.deleteAttachment = function (url) {
            var listItem = this;
            return apDataService.deleteAttachment({
                listItemId: listItem.id,
                url: url,
                listName: listItem.getModel().list.guid
            });
        };

        /**
         * @ngdoc function
         * @name ListItem.resolvePermissions
         * @module ListItem
         * @description
         * See modelFactory.resolvePermissions for details on what we expect to have returned.
         * @returns {Object} Contains properties for each permission level evaluated for current user.
         * @example
         <pre>
         var permissionObject = myGenericListItem.resolvePermissions();
         </pre>
         */
        ListItem.prototype.resolvePermissions = function () {
            return resolvePermissions(this.permMask);
        };


        ListItem.prototype.getEntityReferenceCache = function () {
            return apCacheService.listItem.get(this.uniqueId);
        };


        /**
         * @ngdoc function
         * @name ListItem.addEntityReference
         * @module ListItem
         * @description
         * Allows us to pass in another entity to associate superficially, only persists for the current session and
         * no data is saved but it allows us to iterate over all of the references much faster than doing a lookup each
         * on each digest.  Creates a item._apCache property on the list item object.  It then creates an object for each
         * type of list item passed in using the list name in the list item model.
         * @param {object} entity List item to associate.
         * @returns {Object} The cache for the list of the item passed in.
         * @example
         <pre>
         //Function to save references between a fictitious project and corresponding associated tasks
         function associateProjectTasks(project) {
            //Assuming project.tasks is a multi-lookup
            _.each(project.tasks, function(taskLookup) {
                var task = tasksModel.searchLocalCache(taskLookup.lookupId);
                if(task) {
                    task.addEntityReference(project);
                    project.addEntityReference(task);
                }
            });
        }
         </pre>
         <pre>
         //Structure of cache
         listItem._apCache = {
            Projects: {
                14: {id: 14, title: 'Some Project'},
                15: {id: 15, title: 'Another Project'}
            },
            Tasks: {
                300: {id: 300, title: 'Task 300'},
                412: {id: 412, title: 'Some Important Tasks'}
            }
        }
         </pre>
         */
        ListItem.prototype.addEntityReference = function (entity) {
            var self = this;
            /** Verify that a valid entity is being provided */
            if (entity && entity.constructor.name === 'ListItem') {
                var uniqueId = self.uniqueId;
                var constructorName = entity.getModel().list.title;
                return apCacheService.listItem.add(uniqueId, constructorName, entity);
            } else {
                $log.warn('Please verify that a valid entity is being used: ', self, entity);
            }
        }

        ListItem.prototype.getEntityReferences = function (constructorName) {
            var self = this;
            var cache = self.getEntityReferenceCache();
//          var cache = self._apCache.entityReference;
            if (constructorName && !cache[constructorName]) {
                return {};
            } else if (constructorName && cache[constructorName]) {
                return cache[constructorName];
            } else {
                return cache;
            }
        };

        ListItem.prototype.removeEntityReference = function (entity) {
            var uniqueId = this.uniqueId;
            var constructorName = entity.getModel().list.title;
            return apCacheService.listItem.remove(uniqueId, constructorName, entity);

            var pType = entity.getModel().list.title;
            var cache = self.getEntityReferenceCache();
            if (entity.id && cache[pType] && cache[pType][entity.id]) {
                delete cache[pType][entity.id];
            }
        }


        /**
         * @ngdoc function
         * @name ListItem.getFieldVersionHistory
         * @module ListItem
         * @description
         * Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each
         * version.  If no fields are provided, we look at the field definitions in the model and pull all non-readonly
         * fields.  The only way to do this that I've been able to get working is to get the version history for each
         * field independently and then build the history by combining the server responses for each requests into a
         * snapshot of the object.
         * @param {string[]} [fieldNames] An array of field names that we're interested in.
         <pre>
         myGenericListItem.getFieldVersionHistory(['title', 'project'])
         .then(function(versionHistory) {
                //We now have an array of versions of the list item
            };
         </pre>
         * @returns {object} promise - containing array of changes
         */
        ListItem.prototype.getFieldVersionHistory = function (fieldNames) {
            var deferred = $q.defer();
            var promiseArray = [];
            var listItem = this;
            var model = listItem.getModel();

            /** Constructor that creates a promise for each field */
            var createPromise = function (fieldName) {

                var fieldDefinition = _.findWhere(model.list.fields, {mappedName: fieldName});

                var payload = {
                    operation: 'GetVersionCollection',
                    strlistID: model.list.guid,
                    strlistItemID: listItem.id,
                    strFieldName: fieldDefinition.internalName
                };

                /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
                if (apConfig.defaultUrl) {
                    payload.webURL = apConfig.defaultUrl;
                }

                promiseArray.push(apDataService.getFieldVersionHistory(payload, fieldDefinition));
            };

            if (!fieldNames) {
                /** If fields aren't provided, pull the version history for all NON-readonly fields */
                var targetFields = _.where(model.list.fields, {readOnly: false});
                fieldNames = [];
                _.each(targetFields, function (field) {
                    fieldNames.push(field.mappedName);
                });
            } else if (_.isString(fieldNames)) {
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
                        if (!versionHistory[fieldVersion.modified.toJSON()]) {
                            versionHistory[fieldVersion.modified.toJSON()] = {};
                        }
                        /** Add field to the version history for this version */
                        _.extend(versionHistory[fieldVersion.modified.toJSON()], fieldVersion);
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
         * @name List
         * @description
         * List Object Constructor.  This is handled automatically when creating a new model so there shouldn't be
         * any reason to manually call.
         * @param {object} obj Initialization parameters.
         * @param {string} obj.guid Unique SharePoint GUID for the list we'll be basing the model on
         * ex:'{4D74831A-42B2-4558-A67F-B0B5ADBC0EAC}'
         * @param {string} obj.title Maps to the offline XML file in dev folder (no spaces)
         * ex: 'ProjectsList' so the offline XML file would be located at dev/ProjectsList.xml
         * @param {object[]} [obj.customFields] Mapping of SharePoint field names to the internal names we'll be using
         * in our application.  Also contains field type, readonly attribute, and any other non-standard settings.
         <pre>
         [
         { internalName: "Title", objectType: "Text", mappedName: "lastName", readOnly:false },
         { internalName: "FirstName", objectType: "Text", mappedName: "firstName", readOnly:false },
         { internalName: "Organization", objectType: "Lookup", mappedName: "organization", readOnly:false },
         { internalName: "Account", objectType: "User", mappedName: "account", readOnly:false },
         { internalName: "Details", objectType: "Text", mappedName: "details", readOnly:false }
         ]
         </pre>
         * @constructor
         */
        function List(obj) {
            var defaults = {
                viewFields: '',
                customFields: [],
                isReady: false,
                fields: [],
                guid: '',
                mapping: {},
                title: ''
            };

            /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
            if (apConfig.defaultUrl) {
                defaults.webURL = apConfig.defaultUrl;
            }


            var list = _.extend({}, defaults, obj);

            apFieldService.extendFieldDefinitions(list);

            return list;
        }

        /**
         * @ngdoc function
         * @name Query
         * @description
         * Primary constructor that all queries inherit from.
         * @param {object} queryOptions Initialization parameters.
         * @param {string} [queryOptions.operation=GetListItemChangesSinceToken] Optionally use 'GetListItems' to
         * receive a more efficient response, just don't have the ability to check for changes since the last time
         * the query was called.
         * @param {boolean} [queryOptions.cacheXML=true] Set to false if you want a fresh request.
         * @param {string} [queryOptions.query=Ordered ascending by ID] CAML query passed to SharePoint to control
         * the data SharePoint returns.
         * @param {string} [queryOptions.queryOptions] SharePoint options.
         <pre>
         //Default
         queryOptions: '' +
         '<QueryOptions>' +
         '   <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>' +
         '   <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>' +
         '   <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>' +
         '   <ExpandUserField>FALSE</ExpandUserField>' +
         '</QueryOptions>',
         </pre>
         * @param {object} model Reference to the parent model for the query.  Allows us to reference when out of
         * scope.
         * @constructor
         *
         * @example
         <pre>
         // Query to retrieve the most recent 25 modifications
         model.registerQuery({
            name: 'recentChanges',
            CAMLRowLimit: 25,
            query: '' +
                '<Query>' +
                '   <OrderBy>' +
                '       <FieldRef Name="Modified" Ascending="FALSE"/>' +
                '   </OrderBy>' +
                    // Prevents any records from being returned if user
                    // doesn't have permissions on project
                '   <Where>' +
                '       <IsNotNull>' +
                '           <FieldRef Name="Project"/>' +
                '       </IsNotNull>' +
                '   </Where>' +
                '</Query>'
        });
         </pre>
         */
        function Query(queryOptions, model) {
            var query = this;
            var defaults = {
                /** Container to hold returned entities */
                cache: [],
                /** Promise resolved after first time query is executed */
                initialized: $q.defer(),
                /** Date/Time last run */
                lastRun: null,
                listName: model.list.guid,
                /** Flag to prevent us from makeing concurrent requests */
                negotiatingWithServer: false,
                /** Every time we run we want to check to update our cached data with
                 * any changes made on the server */
                operation: 'GetListItemChangesSinceToken',
                /** Very memory intensive to enable cacheXML which is enabled by default*/
                cacheXML: false,
                /** Default query returns list items in ascending ID order */
                query: '' +
                    '<Query>' +
                    '   <OrderBy>' +
                    '       <FieldRef Name="ID" Ascending="TRUE"/>' +
                    '   </OrderBy>' +
                    '</Query>',
                queryOptions: '' +
                    '<QueryOptions>' +
                    '   <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>' +
                    '   <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>' +
                    '   <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>' +
                    '   <ExpandUserField>FALSE</ExpandUserField>' +
                    '</QueryOptions>',
                viewFields: model.list.viewFields
            };

            /** Set the default url if the config param is defined, otherwise let SPServices handle it */
            if (apConfig.defaultUrl) {
                defaults.webURL = apConfig.defaultUrl;
            }

            _.extend(query, defaults, queryOptions);


            /** Key/Value mapping of SharePoint properties to SPServices properties */
            var mapping = [
                ['query', 'CAMLQuery'],
                ['viewFields', 'CAMLViewFields'],
                ['rowLimit', 'CAMLRowLimit'],
                ['queryOptions', 'CAMLQueryOptions'],
                ['listItemID', 'ID']
            ];

            _.each(mapping, function (map) {
                if (query[map[0]] && !query[map[1]]) {
                    /** Ensure SPServices properties are added in the event the true property name is used */
                    query[map[1]] = query[map[0]];
                }
            });

            /** Allow the model to be referenced at a later time */
            query.getModel = function () {
                return model;
            };
        }

        /**
         * @ngdoc function
         * @name Query.execute
         * @module Query
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

            /** Return existing promise if request is already underway */
            if (query.negotiatingWithServer) {
                return query.promise;
            } else {
                /** Set flag to prevent another call while this query is active */
                query.negotiatingWithServer = true;

                /** Set flag if this if the first time this query has been run */
                var firstRunQuery = _.isNull(query.lastRun);

                var defaults = {
                    /** Designate the central cache for this query if not already set */
                    target: query.cache
                };

                /** Extend defaults with any options */
                var queryOptions = _.extend({}, defaults, options);

                apDataService.executeQuery(model, query, queryOptions).then(function (results) {
                    if (firstRunQuery) {
                        /** Promise resolved the first time query is completed */
                        query.initialized.resolve(queryOptions.target);

                        /** Remove lock to allow for future requests */
                        query.negotiatingWithServer = false;
                    }

                    /** Store query completion date/time on model to allow us to identify age of data */
                    model.lastServerUpdate = new Date();

                    deferred.resolve(queryOptions.target);
                });

                /** Save reference on the query **/
                query.promise = deferred.promise;
                return deferred.promise;
            }
        };

        /**
         * @ngdoc function
         * @name Query.searchLocalCache
         * @module Query
         * @description
         * Simple wrapper that by default sets the search location to the local query cache.
         * @param {*} value Value to evaluate against.
         * @param {object} [options] Options to pass to Model.prototype.searchLocalCache.
         * @returns {object|object[]} Either the object(s) that you're searching for or undefined if not found.
         */
        Query.prototype.searchLocalCache = function (value, options) {
            var query = this;
            var model = query.getModel();
            var defaults = {
                cacheName: query.name,
                localCache: query.cache
            };
            var opts = _.extend({}, defaults, options);
            return model.searchLocalCache(value, opts);
        };


        /**
         * @ngdoc function
         * @name modelFactory.registerChange
         * @description
         * If online and sync is being used, notify all online users that a change has been made.
         * //Todo Break this functionality into FireBase module that can be used if desired.
         * @param {object} model event
         */
        function registerChange(model) {
            if (!apConfig.offline && model.sync && _.isFunction(model.sync.registerChange)) {
                /** Register change after successful update */
                model.sync.registerChange();
            }
        }

        /**
         * @ngdoc function
         * @name modelFactory.resolvePermissions
         * @description
         * Converts permMask into something usable to determine permission level for current user.  Typically used
         * directly from a list item.  See ListItem.resolvePermissions.
         <pre>
         someListItem.resolvePermissions('0x0000000000000010');
         </pre>
         * @param {string} permissionsMask The WSS Rights Mask is an 8-byte, unsigned integer that specifies
         * the rights that can be assigned to a user or site group. This bit mask can have zero or more flags set.
         * @example
         <pre>
         modelFactory.resolvePermissions('0x0000000000000010');
         </pre>
         * @returns {object} property for each permission level identifying if current user has rights (true || false)
         * @link: http://sympmarc.com/2009/02/03/permmask-in-sharepoint-dvwps/
         * @link: http://spservices.codeplex.com/discussions/208708
         */
        function resolvePermissions(permissionsMask) {
            var permissionSet = {};
            permissionSet.ViewListItems = (1 & permissionsMask) > 0;
            permissionSet.AddListItems = (2 & permissionsMask) > 0;
            permissionSet.EditListItems = (4 & permissionsMask) > 0;
            permissionSet.DeleteListItems = (8 & permissionsMask) > 0;
            permissionSet.ApproveItems = (16 & permissionsMask) > 0;
            permissionSet.OpenItems = (32 & permissionsMask) > 0;
            permissionSet.ViewVersions = (64 & permissionsMask) > 0;
            permissionSet.DeleteVersions = (128 & permissionsMask) > 0;
            permissionSet.CancelCheckout = (256 & permissionsMask) > 0;
            permissionSet.PersonalViews = (512 & permissionsMask) > 0;

            permissionSet.ManageLists = (2048 & permissionsMask) > 0;
            permissionSet.ViewFormPages = (4096 & permissionsMask) > 0;

            permissionSet.Open = (permissionsMask & 65536) > 0;
            permissionSet.ViewPages = (permissionsMask & 131072) > 0;
            permissionSet.AddAndCustomizePages = (permissionsMask & 262144) > 0;
            permissionSet.ApplyThemeAndBorder = (permissionsMask & 524288) > 0;
            permissionSet.ApplyStyleSheets = (1048576 & permissionsMask) > 0;
            permissionSet.ViewUsageData = (permissionsMask & 2097152) > 0;
            permissionSet.CreateSSCSite = (permissionsMask & 4194314) > 0;
            permissionSet.ManageSubwebs = (permissionsMask & 8388608) > 0;
            permissionSet.CreateGroups = (permissionsMask & 16777216) > 0;
            permissionSet.ManagePermissions = (permissionsMask & 33554432) > 0;
            permissionSet.BrowseDirectories = (permissionsMask & 67108864) > 0;
            permissionSet.BrowseUserInfo = (permissionsMask & 134217728) > 0;
            permissionSet.AddDelPrivateWebParts = (permissionsMask & 268435456) > 0;
            permissionSet.UpdatePersonalWebParts = (permissionsMask & 536870912) > 0;
            permissionSet.ManageWeb = (permissionsMask & 1073741824) > 0;
            permissionSet.UseRemoteAPIs = (permissionsMask & 137438953472) > 0;
            permissionSet.ManageAlerts = (permissionsMask & 274877906944) > 0;
            permissionSet.CreateAlerts = (permissionsMask & 549755813888) > 0;
            permissionSet.EditMyUserInfo = (permissionsMask & 1099511627776) > 0;
            permissionSet.EnumeratePermissions = (permissionsMask & 4611686018427387904) > 0;
            permissionSet.FullMask = (permissionsMask == 9223372036854775807);

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
        }

        return {
            ListItem: ListItem,
            Model: Model,
            Query: Query,
            resolvePermissions: resolvePermissions
        };
    });