/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    interface ICacheService {
        deleteEntity(listId: string, entityId: number): void;
        getCachedEntities<T extends ListItem<any>>(listId: string): IndexedCache<T>;
        getCachedEntity<T extends ListItem<any>>(listId: string, entityId: number): T;
        getEntity<T extends ListItem<any>>(listId: string, entityId: number): ng.IPromise<T>;
        getListId(keyString: string): string;
        getListIdFromListName(name: string): string;
        getModel(listId: string): Model;
        getModelCache(listId: string): ModelCache;
        registerEntity<T extends ListItem<any>>(entity: T, targetCache?: IndexedCache<T>): T;
        registerModel(model: Model): void;
        removeEntity(listId: string, entityId: number): void;
    }

    var service: CacheService, $q: ng.IQService, $log: ng.ILogService, apIndexedCacheFactory: IndexedCacheFactory;

    /**
     * @description Stores list names when a new model is registered along with the GUID to allow us to
     *     retrieve the GUID in future
     * @example
     * <pre>
     *     listNameToIdMap = {
         *          list1Name: {
         *              model: list1Model,
         *              listId: list1GUID
         *          },
         *          list2Name: {
         *              model: list2Model,
         *              listId: list2GUID
         *          }
         *          ...
         *     }
     * </pre>
     */
    var listNameToIdMap = {},

        /**
         * @description Stores list GUID when a new model is registered with a reference to the model for
         *     future reference.
         * @example
         * <pre>
         *     listsMappedByListId = {
         *          list1GUID: {
         *              model: list1Model
         *          },
         *          list2GUID: {
         *              model: list2Model
         *          }
         *          ...
         *     }
         * </pre>
         */
        listsMappedByListId = {},
        /**
         * @description The Main cache object which stores ModelCache objects.  Keys being the model GUID and
         *     value being an a ModelCache object
         * @example
         * <pre>
         *     entityCache = {
         *          list1GUID: {
         *              item1ID: { //EnityCache for entity 1
         *                  associationQueue: [],
         *                  updateCount: 3,
         *                  listId: list1GUID,
         *                  entityId: item1ID,
         *                  entityLocations: [],
         *                  entity: {} //This is where the actual entity is referenced
         *              }
         *              item2ID: { //EnityCache for entity 2
         *                  ...
         *              }
         *          },
         *          list2GUID: {
         *              item1ID: ...
         *          }
         *          ...
         *     }
         * </pre>
         */
        entityCache = {};


    /**
     * @name EntityCache
     * @description
     * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
     * the cache has been updated, timestamp of last update, and add/update/remove functionality.
     * @constructor apCacheService
     * @param {string} listId GUID for list the list item belongs to.
     * @param {number} entityId The entity.id.
     */
    class EntityContainer {
        associationQueue = [];
        entity;
        entityLocations = [];
        listId;
        updateCount = 0;

        constructor(listId: string, private entityId: number) {
            this.listId = service.getListId(listId);
        }

        /**
         * @name EntityContainer.getEntity
         * @description
         * Promise which returns the requested entity once it has been registered in the cache.
         */
        getEntity() {
            var entityContainer = this;
            var deferred = $q.defer();
            if (entityContainer.entity) {
                /** Entity already exists so resolve immediately */
                deferred.resolve(entityContainer.entity);
            } else {
                entityContainer.associationQueue.push(deferred);
            }
            return deferred.promise;
        }


        removeEntity() {
            var entityContainer = this;
            service.removeEntity(entityContainer.listId, entityContainer.entityId);
        }

    }

    /**
     * @name ModelCache
     * @description
     * Cache of Entity Containers for each registered entity retrieved by the model.
     * @constructor
     */
    class ModelCache extends IndexedCache<any> {

    }

    export class CacheService implements ICacheService {
        entityCache = entityCache;
        static $inject = ['$q', '$log', 'apIndexedCacheFactory'];

        constructor(_$q_, _$log_, _apIndexedCacheFactory_) {

            $q = _$q_;
            $log = _$log_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;

            service = this;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:deleteEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Deletes all references to an entity.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        deleteEntity(listId: string, entityId: number): void {
            var entityTypeKey = this.getListId(listId);
            this.removeEntity(entityTypeKey, entityId);
            var model = this.getModel(entityTypeKey);
            _.each(model.queries, (query: Query<any>) => {
                var cache = query.getCache();
                cache.removeEntity(entityId);
            });
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getCachedEntities
         * @methodOf angularPoint.apCacheService
         * @description
         * Returns all entities for a given model as an indexed cache with keys being the entity id's.
         * @param {string} listId GUID for list the list item belongs to.
         * @returns {object} Indexed cache containing all entities for a model.
         */
        getCachedEntities<T extends ListItem<any>>(listId: string): IndexedCache<T> {
            var modelCache = this.getModelCache(listId),
                allEntities = apIndexedCacheFactory.create<T>();
            _.each(modelCache, (entityContainer: EntityContainer) => {
                if (entityContainer.entity && entityContainer.entity.id) {
                    allEntities.addEntity(entityContainer.entity);
                }
            });
            return allEntities;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getCachedEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Synchronise call to return a cached entity;
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {object} entity || undefined
         */
        getCachedEntity<T extends ListItem<any>>(listId: string, entityId: number): T {
            return this.getEntityContainer(listId, entityId).entity;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Returns a deferred object that resolves with the requested entity immediately if already present or at
         *     some point in the future assuming the entity is eventually registered.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {promise} entity
         */
        getEntity<T extends ListItem<any>>(listId: string, entityId: number): ng.IPromise<T> {
            var entityContainer = this.getEntityContainer(listId, entityId);
            return entityContainer.getEntity();
        }

        private getEntityContainer(listId: string, entityId: number): EntityContainer {
            var entityTypeKey = this.getListId(listId);
            var modelCache = this.getModelCache(entityTypeKey);
            /** Create the object structure if it doesn't already exist */
            modelCache[entityId] = modelCache[entityId] || new EntityContainer(entityTypeKey, entityId);
            return modelCache[entityId];
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getListId
         * @methodOf angularPoint.apCacheService
         * @description
         * Allows us to use either the List Name or the list GUID and returns the lowercase GUID
         * @param {string} keyString List GUID or name.
         * @returns {string} Lowercase list GUID.
         */
        getListId(keyString: string): string {
            if (_.isGuid(keyString)) {
                /** GUID */
                return keyString.toLowerCase();
            } else {
                /** List Title */
                return this.getListIdFromListName(keyString);
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getListIdFromListName
         * @methodOf angularPoint.apCacheService
         * @description
         * Allows us to lookup an entity cache using the name of the list instead of the GUID.
         * @param {string} name The name of the list.
         * @returns {string} GUID for the list.
         */
        getListIdFromListName(name: string): string {
            var guid;
            if (listNameToIdMap[name] && listNameToIdMap[name].listId) {
                guid = listNameToIdMap[name].listId;
            }
            return guid;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getModel
         * @methodOf angularPoint.apCacheService
         * @description
         * Allows us to retrieve a reference to a given model by either the list title or list GUID.
         * @param {string} listId List title or list GUID.
         * @returns {object} A reference to the requested model.
         */
        getModel(listId: string): Model {
            var model,
                entityTypeKey = this.getListId(listId);

            if (listsMappedByListId[entityTypeKey]) {
                model = listsMappedByListId[entityTypeKey].model;
            }
            return model;
        }

        /** Locates the stored cache for a model */
        getModelCache(listId: string): ModelCache {
            var entityTypeKey = this.getListId(listId);
            entityCache[entityTypeKey] = entityCache[entityTypeKey] || new ModelCache();
            return entityCache[entityTypeKey];
        }


        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Registers an entity in the cache and fulfills any pending deferred requests for the entity. If the
         * entity already exists in the cache, we extend the existing object with the updated entity and return a
         * reference to this updated object so the there is only a single instance of this entity withing the cache.
         * @param {object} entity Pass in a newly created entity to add to the cache.
         * @param {object} [targetCache] Optionally pass in a secondary cache to add a reference to this entity.
         */
        registerEntity<T extends ListItem<any>>(entity: T, targetCache?: IndexedCache<T>): T {
            var model = entity.getModel();
            var entityContainer = this.getEntityContainer(model.getListId(), entity.id);
            /** Maintain a single object in cache for this entity */
            if (!_.isObject(entityContainer.entity)) {
                /** Entity isn't currently in the cache */
                entityContainer.entity = entity;
            } else {
                /** Already exists so update to maintain any other references being used for this entity. */
                    //TODO Look at performance hit from extending and see if it would be acceptable just to replace
                _.assign(entityContainer.entity, entity);
            }

            /** Counter to keep track of the number of updates for this entity */
            entityContainer.updateCount++;

            if (_.isObject(targetCache) && !_.isArray(targetCache) && !targetCache[entity.id]) {
                /** Entity hasn't been added to the target cache yet */
                targetCache[entity.id] = entityContainer.entity;
            }

            /** Resolve any requests for this entity */
            _.each(entityContainer.associationQueue, (deferredRequest) => {
                deferredRequest.resolve(entityContainer.entity);
                /** Remove request from queue */
                entityContainer.associationQueue.shift();
            });

            return entityContainer.entity;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerModel
         * @methodOf angularPoint.apCacheService
         * @description
         * Creates a new ModelCache for the provide model where all list items will be stored with the key equaling
         * the entity id's and value being a EntityContainer.  The entity is stored at EntityContainer.entity.
         * @param {object} model Model to create the cache for.
         */
        registerModel(model: Model): void {
            if (model.list && model.getListId() && model.list.title) {
                var listId = model.getListId().toLowerCase();
                /** Store a reference to the model by list title */
                listNameToIdMap[model.list.title] = {
                    model: model,
                    listId: listId
                };

                /** Store a reference to the model by list guid */
                listsMappedByListId[listId] = {
                    model: model
                };
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:removeEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Removes the entity from the local entity cache.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        removeEntity(listId: string, entityId: number): void {
            var modelCache = this.getModelCache(listId);
            if (modelCache[entityId]) {
                delete modelCache[entityId];
            }
        }


    }

    /**
     * @ngdoc service
     * @name angularPoint.apCacheService
     * @description
     * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises
     *     that resolve once a requested list item is registered in the future.
     */
    angular.module('angularPoint')
        .service('apCacheService', CacheService);

}
